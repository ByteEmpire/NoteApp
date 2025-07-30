import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import User from "../models/User.js";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// ==================== SEND OTP ====================
router.post("/send-otp", async (req, res) => {
  const { name, dob, email } = req.body;

  // Basic validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide a valid email address" 
    });
  }

  try {
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, dob, email });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Hash and save OTP
    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    const { data, error } = await resend.emails.send({
      from: "OTP Service <onboarding@resend.dev>",
      to: email,
      subject: "Your One-Time Password (OTP)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Verification Code</h2>
          <p>Please use the following OTP to verify your account:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2563eb;">${otp}</span>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email",
        error: error.message 
      });
    }

    console.log("OTP email sent to:", email);
    return res.json({ 
      success: true, 
      message: "OTP sent successfully",
      email: email,
      expiry: new Date(otpExpiry).toISOString()
    });

  } catch (error) {
    console.error("OTP Send Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
});

// ==================== VERIFY OTP ====================
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Basic validation
  if (!email || !otp || otp.length !== 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide valid email and 6-digit OTP" 
    });
  }

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if OTP exists and isn't expired
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: "No OTP requested or OTP expired" 
      });
    }

    // Verify OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const isOtpValid = user.otp === hashedOtp;
    const isOtpExpired = user.otpExpiry < Date.now();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ 
        success: false, 
        message: isOtpExpired ? "OTP has expired" : "Invalid OTP" 
      });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ 
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
});

export default router;
