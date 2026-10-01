const User = require("../../model/user");
const Complaint = require("../../model/complainant");
const mongoose = require("mongoose");

exports.handler = async (req, res) => {
  try {
    const userId = req.body.userId || (req.user && req.user._id);
    const complaintId = req.body.complaintId;
    const remark = req.body.remark;
    const state = req.query.state || req.body.status;

    if (!complaintId || !userId || !state) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID, User ID, and Status/State are required",
      });
    }

    const connectedUser = await User.findById(userId);
    let reqComplaint = await Complaint.findById(complaintId);

    if (!connectedUser || !reqComplaint) {
      return res.status(404).json({
        success: false,
        message: "User or Complaint record not found",
      });
    }

    if (connectedUser.role !== "super") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Super User access required",
      });
    }

    let targetStatus = "Pending";
    if (state === "true" || state === "Completed") {
      targetStatus = "Completed";
    } else if (state === "false" || state === "Park") {
      targetStatus = "Park";
    } else if (state === "Pending") {
      targetStatus = "Pending";
    }

    reqComplaint.complaintStatus = {
      date: new Date(),
      uniqueUserId: connectedUser.uniqueUserId,
      user: connectedUser._id,
      status: targetStatus,
      remark: remark || "No remark provided",
    };
    reqComplaint.LastEdited = new Date();

    await reqComplaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      updatedComplaint: reqComplaint,
    });
  } catch (err) {
    console.error("Error updating complaint status:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
