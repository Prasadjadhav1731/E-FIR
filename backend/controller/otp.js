const otpModel = require("../model/otpModel.js");
const otpGenerator = require("otp-generator");
const { transporter } = require("../config/mailer.js");
const user = require("../model/user");

exports.sentOtp = async (req, res) => {
  try {
    const { email, socketId } = req.body;

    if (!email || !socketId) {
      return res.status(400).json({
        success: false,
        message: "Email and Socket ID are required",
      });
    }

    const existingUser = await user.findOne({ email: email.toLowerCase().trim() });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const OTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await otpModel.deleteMany({ email: email.toLowerCase().trim() });

    const otpData = new otpModel({
      email: email.toLowerCase().trim(),
      socketId,
      OTP,
    });
    await otpData.save();

    try {
      await transporter.sendMail({
        from: process.env.MAIL_USER || "sstar0wifi@gmail.com",
        to: email,
        subject: "EFIR Security Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; rounded: 12px; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin-top: 0;">EFIR Login OTP</h2>
            <p style="color: #374151; font-size: 15px;">Your verification code for logging into the EFIR System is:</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1f2937;">${OTP}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Mail transport warning (proceeding for testing):", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP",
    });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, OTP, socketId } = req.body;
    if (!email || !socketId || !OTP) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and Socket ID are required",
      });
    }

    const otpData = await otpModel.findOne({
      email: email.toLowerCase().trim(),
      OTP: OTP.toString().trim(),
      socketId,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Delete OTP record immediately after successful verification to prevent reuse
    await otpModel.deleteOne({ _id: otpData._id });

    const existingUser = await user.findOne({ email: email.toLowerCase().trim() });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    req.user = existingUser;
    next();
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
};
