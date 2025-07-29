import React, { useState } from "react";
import "./Signup.css"; // Reusing same styles
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Use .env value if available, else fallback to localhost for local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Verify OTP & Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("token", data.token);

        if (keepLoggedIn) {
          localStorage.setItem("keepLoggedIn", "true");
        }

        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error, please try again later");
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!validateEmail(email)) {
      setError("Enter a valid email before resending OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // If backend requires name/dob, include here
      });

      const data = await res.json();
      if (data.success) {
        alert("OTP resent successfully!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Server error, please try again later");
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      {/* Left Form Section */}
      <div className="form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Sign in</h1>
            <p className="form-subtitle">
              Please login to continue to your account.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="signup-form">
            {/* Email */}
            <div className="form-group floating-label">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
              />
            </div>

            {/* OTP with show/hide */}
            <div
              className="form-group floating-label"
              style={{ position: "relative" }}
            >
              <label>OTP</label>
              <input
                type={showOtp ? "text" : "password"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="email-input"
              />
              <span
                onClick={() => setShowOtp(!showOtp)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                {showOtp ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Resend OTP */}
            <p
              style={{
                color: "#2563eb",
                fontSize: "0.875rem",
                cursor: "pointer",
                marginTop: "-0.5rem",
              }}
              onClick={handleResendOtp}
            >
              Resend OTP
            </p>

            {/* Keep me logged in */}
            <label style={{ fontSize: "0.875rem", color: "#374151" }}>
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Keep me logged in
            </label>

            {error && <p className="error-message">{error}</p>}

            {/* Sign In Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          {/* Create account link */}
          <p className="signin-link">
            Need an account?{" "}
            <Link to="/signup" className="signin-anchor">
            Create one
           </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="image-section">
        <img
          src="https://i.pinimg.com/736x/c7/b3/0e/c7b30ecac5af58030011434d15d480b6.jpg"
          alt="Background"
          className="background-image"
        />
      </div>
    </div>
  );
};

export default SignIn;
