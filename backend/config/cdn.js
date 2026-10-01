const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cdnConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("cdn Connected");
  } catch (err) {
    console.error("Cloudinary Configuration Error:", err);
  }
};
