const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uniqueUserId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "super"],
      default: "user",
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    District: {
      type: String,
      trim: true,
    },
    SubDistrict: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
    },
    filedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "complaint",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", schema);
