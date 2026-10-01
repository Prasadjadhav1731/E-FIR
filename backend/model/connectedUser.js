const mongoose = require("mongoose");

const connectedUser = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    socketIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("connectedUsers", connectedUser);