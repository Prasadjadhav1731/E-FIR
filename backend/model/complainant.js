const mongoose = require("mongoose");
const user = require("./user");

const complainantInfo = mongoose.Schema(
  {
    VictimIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
    firId: {
      type: String,
      required: true,
      unique: true,
    },
    AccusedIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
    WitnessIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
      },
    ],
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    complaintStatus: {
      type: {
        date: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        uniqueUserId: {
          type: String,
        },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Park"],
          default: "Pending",
        },
        remark: {
          type: String,
        },
      },
      default: () => ({
        status: "Pending",
        date: new Date(),
      }),
    },
    IncidentDetail: {
      TimeDateofIncident: {
        type: Date,
      },
      LandMark: {
        type: String,
      },
      District: {
        type: String,
      },
      SubDistrict: {
        type: String,
      },
      IncidentDescription: {
        type: String,
      },
    },
    Evidence: [
      {
        type: String,
      },
    ],
    LastEdited: {
      type: Date,
      default: Date.now,
    },
    Summary: {
      type: String,
    },
    Categories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("complaint", complainantInfo);
