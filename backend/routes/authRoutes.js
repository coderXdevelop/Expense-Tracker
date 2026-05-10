const express = require("express");
const router = express.Router();
const { register, verifyOtp, login, logout } = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOtp); // new route for OTP verification
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
