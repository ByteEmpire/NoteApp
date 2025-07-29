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
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, dob, email });
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save();

    // Send OTP via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: email, // This will work for any domain your Resend account is authorized for
        subject: "Your OTP Code",
        html: `<p>Your OTP is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 5 minutes.</p>`
      });

      if (error) {
        console.error("Resend API Error:", error);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send OTP",
          error: error.message 
        });
      }

      console.log("Email sent successfully:", data?.id);
      return res.json({ success: true, message: "OTP sent successfully" });

    } catch (sendError) {
      console.error("Email Send Error:", sendError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP",
        error: sendError.message 
      });
    }

  } catch (error) {
    console.error("OTP Processing Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to process OTP request",
      error: error.message 
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Basic validation
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const isOtpValid = user.otp === hashedOtp && user.otpExpiry > Date.now();

    if (!isOtpValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "7d" 
    });

    return res.json({ 
      success: true, 
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Don't send sensitive data like dob unless needed
      }
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "OTP verification failed",
      error: error.message 
    });
  }
});

export default router;
