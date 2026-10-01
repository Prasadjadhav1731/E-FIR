const User = require("../../model/user");
const Complaint = require("../../model/complainant");
const personSchema = require("../../model/person");
const mongoose = require("mongoose");

exports.fetchComplaint = async (req, res) => {
  try {
    const firId = req.params.firId;

    if (firId) {
      const fir = await Complaint.findOne({ firId }).populate({
        path: "VictimIds AccusedIds WitnessIds filedBy complaintStatus.user",
      });

      if (!fir) {
        return res.status(444 || 404).json({ success: false, message: "FIR not found" });
      }

      return res.status(200).json({ success: true, fir: [fir] });
    }

    const userId = req.body.userId || (req.user && req.user._id);

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const userReq = await User.findById(userId).populate({
      path: "filedComplaints",
      populate: {
        path: "VictimIds AccusedIds WitnessIds filedBy complaintStatus.user",
      },
    });

    if (!userReq) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, fir: userReq.filedComplaints || [] });
  } catch (err) {
    console.error("Error fetching complaint:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.fetchComplaintSuper = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    const userId = req.params.userId || (req.user && req.user._id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser || currentUser.role !== "super") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Super User access required",
      });
    }

    if (req.query.fromDateIncident && req.query.toDateIncident) {
      filter["IncidentDetail.TimeDateofIncident"] = {
        $gte: new Date(req.query.fromDateIncident),
        $lte: new Date(req.query.toDateIncident),
      };
    }

    if (req.query.fromDateLastEdited || req.query.toDateLastEdited) {
      filter["LastEdited"] = {};
      if (req.query.fromDateLastEdited) {
        filter["LastEdited"]["$gte"] = new Date(req.query.fromDateLastEdited);
      }
      if (req.query.toDateLastEdited) {
        filter["LastEdited"]["$lte"] = new Date(req.query.toDateLastEdited);
      }
    }

    if (req.query.district) {
      filter["IncidentDetail.District"] = req.query.district;
    }

    if (req.query.subDistrict) {
      filter["IncidentDetail.SubDistrict"] = req.query.subDistrict;
    }

    if (req.query.Categories) {
      const catArray = Array.isArray(req.query.Categories)
        ? req.query.Categories
        : [req.query.Categories];
      filter["Categories"] = {
        $in: catArray,
      };
    }

    if (req.query.aadhar) {
      const person = await personSchema.findOne({ aadhar: req.query.aadhar });

      if (person) {
        filter["$or"] = [
          { VictimIds: { $elemMatch: { $eq: person._id } } },
          { AccusedIds: { $elemMatch: { $eq: person._id } } },
          { WitnessIds: { $elemMatch: { $eq: person._id } } },
        ];
      }
    }

    if (req.query.status) {
      filter["complaintStatus.status"] = req.query.status;
    }

    if (req.query.uniqueUserId) {
      filter["complaintStatus.uniqueUserId"] = {
        $regex: `^${req.query.uniqueUserId}`,
        $options: "i",
      };
    }

    const complaints = await Complaint.find(filter)
      .sort({ LastEdited: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "VictimIds AccusedIds WitnessIds filedBy complaintStatus.user",
      });

    const totalComplaints = await Complaint.countDocuments(filter);

    return res.status(200).json({
      success: true,
      complaints,
      currentPage: page,
      totalPages: Math.ceil(totalComplaints / limit) || 1,
    });
  } catch (err) {
    console.error("Error fetching super complaints:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
