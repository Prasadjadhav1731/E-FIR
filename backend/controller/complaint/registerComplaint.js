const user = require("../../model/user");
const Complaint = require("../../model/complainant");
const personSchema = require("../../model/person");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const categories = [
  "Cognizable Offenses",
  "Non-Cognizable Offenses",
  "Bailable Offenses",
  "Non-Bailable Offenses",
  "Compoundable Offenses",
  "Non-Compoundable Offenses",
  "Offenses against Women",
  "Offenses against Children",
  "Economic Offenses",
  "Cyber Crimes",
  "Drug Offenses",
  "Environmental Offenses",
  "Traffic Offenses",
  "Property Offenses",
  "Terrorism-related Offenses",
  "White-collar Crimes",
  "Corruption Offenses",
  "Fraudulent Practices",
  "Domestic Violence Offenses",
  "Sexual Harassment Offenses",
  "Human Trafficking Offenses",
  "Intellectual Property Crimes",
  "Hate Crimes",
  "Juvenile Offenses",
  "Organized Crime",
  "Money Laundering Offenses",
  "Forgery and Counterfeiting Offenses",
  "Alcohol-related Offenses",
  "Public Order Offenses",
  "Violation of Intellectual Property Rights",
  "Cyberbullying Offenses",
  "Religious Offenses",
  "Wildlife Crimes",
  "Labour Law Violations",
  "Immigration Offenses",
  "Not Identified",
];

const saveLocalFile = (file) => {
  try {
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(file.name || "") || ".png";
    const filename = `evidence-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
    const targetPath = path.join(uploadsDir, filename);
    fs.copyFileSync(file.tempFilePath, targetPath);
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
    return `${serverUrl}/uploads/${filename}`;
  } catch (e) {
    console.error("Local file save error:", e);
    return "";
  }
};

const generateSummary = async (data) => {
  try {
    const apiKey = process.env.API_KEY_GEN_AI;
    if (!apiKey) return "Complaint submitted successfully";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `${JSON.stringify(data)} Generate a concise summary for this FIR complaint.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || "Complaint submitted successfully";
  } catch (err) {
    console.error("Error generating AI summary:", err.message || err);
    return "Complaint submitted successfully";
  }
};

const getCategories = async (data) => {
  try {
    const apiKey = process.env.API_KEY_GEN_AI;
    if (!apiKey) return ["Not Identified"];
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `${JSON.stringify(data)}\nCategories List: ${JSON.stringify(categories)}\nFrom the list above, select fitting categories for this complaint. Return matched names.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const arrayString = response.text();

    if (arrayString) {
      const matched = categories.filter((ele) => arrayString.includes(ele));
      return matched.length > 0 ? matched : ["Not Identified"];
    }
    return ["Not Identified"];
  } catch (err) {
    console.error("Error identifying AI categories:", err.message || err);
    return ["Not Identified"];
  }
};

exports.register = async (req, res) => {
  try {
    const { VictimArray, AccusedArray, WitnessArray, IncidentDetails } = req.body;
    const userId = req.body.userId || (req.user && req.user._id);

    const parseIfNeeded = (val, fallback = []) => {
      if (!val) return fallback;
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        return fallback;
      }
    };

    const parsedVictimArray = parseIfNeeded(VictimArray, []);
    const parsedAccusedArray = parseIfNeeded(AccusedArray, []);
    const parsedWitnessArray = parseIfNeeded(WitnessArray, []);
    let parsedIncidentDetails = parseIfNeeded(IncidentDetails, {});

    if (parsedIncidentDetails.TimeDateofIncident) {
      parsedIncidentDetails = {
        ...parsedIncidentDetails,
        TimeDateofIncident: new Date(parsedIncidentDetails.TimeDateofIncident),
      };
    }

    let Summary = "Complaint submitted";
    let Categories = ["Not Identified"];

    try {
      Summary = await generateSummary({
        VictimArray: parsedVictimArray,
        AccusedArray: parsedAccusedArray,
        WitnessArray: parsedWitnessArray,
        IncidentDetails: parsedIncidentDetails,
      });
    } catch (summaryErr) {
      console.error("Summary gen error:", summaryErr);
    }

    try {
      Categories = await getCategories({
        VictimArray: parsedVictimArray,
        AccusedArray: parsedAccusedArray,
        WitnessArray: parsedWitnessArray,
        IncidentDetails: parsedIncidentDetails,
      });
    } catch (categoriesErr) {
      console.error("Categories gen error:", categoriesErr);
    }

    const evidences = req.files
      ? Object.values(req.files).flatMap((file) => (Array.isArray(file) ? file : [file]))
      : [];

    const createPersonArray = async (personArray) => {
      const personIds = [];
      if (!Array.isArray(personArray)) return personIds;
      for (let personData of personArray) {
        if (!personData || typeof personData !== "object") continue;
        const nameStr = personData.name ? String(personData.name).trim() : "Not Mentioned";

        const personObj = {
          name: nameStr,
          address: personData.address ? String(personData.address).trim() : undefined,
          occupation: personData.occupation ? String(personData.occupation).trim() : undefined,
          age: personData.age ? parseInt(personData.age) : undefined,
          aadhar: personData.aadhar ? String(personData.aadhar).trim() : undefined,
          contact: personData.contact ? parseInt(personData.contact) : undefined,
        };

        const filteredPersonData = Object.fromEntries(
          Object.entries(personObj).filter(([key, value]) => value !== undefined && value !== "")
        );

        const newPerson = new personSchema(filteredPersonData);
        await newPerson.save();
        personIds.push(newPerson._id);
      }
      return personIds;
    };

    const VictimIds = await createPersonArray(parsedVictimArray);
    const AccusedIds = await createPersonArray(parsedAccusedArray);
    const WitnessIds = await createPersonArray(parsedWitnessArray);

    const uploadedUrls = await Promise.all(
      evidences.map((file) => {
        return new Promise((resolve) => {
          if (!file || !file.tempFilePath) return resolve("");
          cloudinary.uploader.upload(
            file.tempFilePath,
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                console.warn("Cloudinary error, using local file storage fallback:", error.message || error);
                const localUrl = saveLocalFile(file);
                resolve(localUrl);
              } else {
                resolve(result.secure_url);
              }
            }
          );
        });
      })
    );

    const validEvidenceUrls = uploadedUrls.filter((url) => Boolean(url));

    let filedBy = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filedBy = new mongoose.Types.ObjectId(userId);
    }

    let firId;
    let isUnique = false;
    const year = new Date().getFullYear();

    while (!isUnique) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      firId = `EFIR-${year}-${randomNum}`;
      const existingRecord = await Complaint.findOne({ firId });

      if (!existingRecord) {
        isUnique = true;
      }
    }

    const newComplaint = await Complaint.create({
      VictimIds: VictimIds.map((id) => new mongoose.Types.ObjectId(id)),
      AccusedIds: AccusedIds.map((id) => new mongoose.Types.ObjectId(id)),
      WitnessIds: WitnessIds.map((id) => new mongoose.Types.ObjectId(id)),
      IncidentDetail: parsedIncidentDetails,
      filedBy,
      Evidence: validEvidenceUrls,
      firId,
      Summary: Summary || "Complaint submitted",
      Categories: Categories && Categories.length > 0 ? Categories : ["Not Identified"],
    });

    if (filedBy) {
      await user.updateOne(
        { _id: filedBy },
        {
          $addToSet: {
            filedComplaints: new mongoose.Types.ObjectId(newComplaint._id),
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Complaint Filed Successfully",
      complaintId: newComplaint.firId,
      data: newComplaint,
    });
  } catch (err) {
    console.error("Error registering complaint:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
