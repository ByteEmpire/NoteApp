import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import User from "../models/User.js";

const router = express.Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { name, dob, email } = req.body;

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, dob, email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const sendResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email, // works for any domain if API key allows
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    });

    console.log("Resend API Response:", sendResult);

    if (sendResult.error) {
      console.error("Resend Error:", sendResult.error);
      return res.status(500).json({ success: false, message: sendResult.error.message || "Failed to send OTP" });
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (user.otp !== hashedOtp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
});

export default router;
