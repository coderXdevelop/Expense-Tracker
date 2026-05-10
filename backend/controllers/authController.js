const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Utility: Send OTP Email
const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail app password
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`
  });
};

// Register Controller
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: expiry,
    isVerified: false
  });

  await sendOtpEmail(email, otp);

  return res.status(201).json({
    success: true,
    message: "OTP sent to email. Please verify.",
    isVerified: false,
    email: user.email
  });

};

// Verify OTP Controller
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });

  if (user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id)
  });
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isVerified) return res.status(403).json({ message: "Email not verified" });

  if (await bcrypt.compare(password, user.password)) {
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

// Logout Controller
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// JWT Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

module.exports = { register, verifyOtp, login, logout, generateToken };
