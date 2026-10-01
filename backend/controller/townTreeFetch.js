const TownTree = require("../model/TownTree");

const defaultTownTreeData = {
  "Pune": [
    "Haveli",
    "Khed",
    "Ambegaon",
    "Junnar",
    "Shirur",
    "Baramati",
    "Indapur",
    "Daund",
    "Maval",
    "Mulshi",
    "Velhe",
    "Bhor",
    "Purandar"
  ],
  "Mumbai City": [
    "Colaba",
    "Nariman Point",
    "Fort",
    "Byculla",
    "Malabar Hill",
    "Dadar"
  ],
  "Mumbai Suburban": [
    "Andheri",
    "Bandra",
    "Borivali",
    "Kurla",
    "Malad",
    "Ghatkopar"
  ],
  "Thane": [
    "Thane",
    "Kalyan",
    "Bhiwandi",
    "Ulhasnagar",
    "Shahapur",
    "Murbad"
  ],
  "Nagpur": [
    "Nagpur Urban",
    "Nagpur Rural",
    "Kamptee",
    "Hingna",
    "Katol",
    "Savner"
  ],
  "Nashik": [
    "Nashik",
    "Malegaon",
    "Sinnar",
    "Igatpuri",
    "Niphad",
    "Yeola"
  ],
  "Chhatrapati Sambhajinagar": [
    "Chhatrapati Sambhajinagar",
    "Paithan",
    "Gangapur",
    "Vaijapur",
    "Kannad",
    "Sillod"
  ],
  "Solapur": [
    "North Solapur",
    "South Solapur",
    "Barshi",
    "Pandharpur",
    "Sangole",
    "Akkalkot"
  ],
  "Satara": [
    "Satara",
    "Karad",
    "Wai",
    "Mahabaleshwar",
    "Phaltan",
    "Koregaon"
  ],
  "Kolhapur": [
    "Karveer",
    "Kagal",
    "Hatkanangale",
    "Shirol",
    "Radhanagari",
    "Shahuwadi"
  ]
};

exports.fetchTownTree = async (req, res) => {
    try {
        let data = await TownTree.findOne();
        if (!data || typeof data.TownTree === "string" || !data.TownTree || Object.keys(data.TownTree).length === 0) {
            if (data) {
                await TownTree.deleteOne({ _id: data._id });
            }
            data = await TownTree.create({ TownTree: defaultTownTreeData });
        }

        if (data) {
            return res.status(200).json({
                data
            });
        }

        return res.status(400).json({
            message: "TownTree Not Fetched"
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message || "BAD-REQUEST"
        });
    }
};