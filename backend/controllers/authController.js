const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Utility: Send OTP Email (Brevo)
const sendOtpEmail = async (to, otp) => {
  const smtpUser = process.env.BREVO_SMTP_USER || "apikey";

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      // Brevo SMTP uses literal username "apikey" and the SMTP key as password
      user: smtpUser,
      pass: process.env.BREVO_API_KEY
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log('SMTP config', {
    host: transporter.options.host,
    port: transporter.options.port,
    secure: transporter.options.secure,
    user: transporter.options.auth.user,
    sender: process.env.EMAIL_USER,
    brevoKeySet: !!process.env.BREVO_API_KEY
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,       // verified sender in Brevo
    to,
    subject: "Verify your email - Expense Tracker",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
        <p>It expires in 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
      host: error.host,
      port: error.port
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Register Controller
const register = async (req, res) => {
  try {
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

    let user;
    try {
      user = await User.create({
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
    } catch (emailError) {
      if (user) {
        await User.deleteOne({ _id: user._id });
        console.error(`Deleted user ${user.email} because OTP email failed`);
      }
      throw emailError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

// Verify OTP Controller
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    
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
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ 
      message: "OTP verification failed", 
      error: error.message 
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
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
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ 
      message: "Logout failed", 
      error: error.message 
    });
  }
};

// JWT Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

module.exports = { register, verifyOtp, login, logout, generateToken };
