const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Force Node.js DNS resolver to use Google DNS to fix Windows/ISP DNS querySrv ETIMEOUT errors
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  // Fall back to system DNS if setServers fails
}

exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("MongoDb Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

