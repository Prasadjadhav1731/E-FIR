const mongoose = require("mongoose");


const otpModel = new mongoose.Schema({
  OTP: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes auto-expiration TTL index
  },
});

module.exports = mongoose.model("otpModel", otpModel);