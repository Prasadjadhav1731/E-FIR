const user = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateUniqueUserId = async () => {
  const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  const randomCapital = capitals.charAt(Math.floor(Math.random() * capitals.length));
  let randomDigits = "";
  for (let i = 0; i < 4; i++) {
    randomDigits += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  const newUniqueUserId = randomCapital + randomDigits;
  const existingUser = await user.findOne({ uniqueUserId: newUniqueUserId });
  if (existingUser) {
    return generateUniqueUserId();
  }
  return newUniqueUserId;
};

exports.signIn = async (req, res) => {
  try {
    const { name, email, mobile, password, District, SubDistrict } = req.body;

    if (!name || !password || !mobile || !District || !SubDistrict || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required registration details",
      });
    }

    const existingMobile = await user.findOne({ mobile: mobile.toString().trim() });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is already registered",
      });
    }

    const existingEmail = await user.findOne({ email: email.toString().toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email address is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueUserId = await generateUniqueUserId();

    const newUser = await user.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      mobile: mobile.toString().trim(),
      uniqueUserId,
      District: District.trim(),
      SubDistrict: SubDistrict.trim(),
      role: "user",
    });

    const payload = {
      _id: newUser._id,
      mobile: newUser.mobile,
      email: newUser.email,
      role: newUser.role,
      uniqueUserId: newUser.uniqueUserId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "shubham", {
      expiresIn: "7d",
    });

    const userData = newUser.toObject();
    delete userData.password;
    userData.token = token;

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      httpOnly: true,
      sameSite: "lax",
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Error registering user",
    });
  }
};

exports.logIn = async (req, res) => {
  try {
    let { mobile, password, email } = req.body;

    if (!email && req.query && req.query.email) {
      email = req.query.email;
    }

    if (mobile && typeof mobile === "string" && mobile.includes("@") && !email) {
      email = mobile;
      mobile = undefined;
    }

    if (!mobile && !email) {
      return res.status(400).json({
        success: false,
        message: "Mobile number or Email is required",
      });
    }

    if (!password && !req.user) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    let existingUser = null;
    if (email) {
      existingUser = await user.findOne({ email: email.toLowerCase().trim() });
    }
    if (!existingUser && mobile) {
      existingUser = await user.findOne({ mobile: mobile.toString().trim() });
    }

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (password) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    }

    const payload = {
      _id: existingUser._id,
      mobile: existingUser.mobile,
      email: existingUser.email,
      role: existingUser.role,
      uniqueUserId: existingUser.uniqueUserId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "shubham", {
      expiresIn: "7d",
    });

    const userData = existingUser.toObject();
    delete userData.password;
    userData.token = token;

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      httpOnly: true,
      sameSite: "lax",
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Error logging in",
    });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const attachedUser = req.user;
    if (!attachedUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let existingUser = null;
    if (attachedUser._id) {
      existingUser = await user.findById(attachedUser._id).select("-password");
    }
    if (!existingUser && attachedUser.email) {
      existingUser = await user.findOne({ email: attachedUser.email }).select("-password");
    }
    if (!existingUser && attachedUser.mobile) {
      existingUser = await user.findOne({ mobile: attachedUser.mobile }).select("-password");
    }

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User session expired or not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auto-login successful",
      data: existingUser,
    });
  } catch (err) {
    console.error("Auto-login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Auto-login failed",
    });
  }
};
