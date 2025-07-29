import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setError("Please enter your name");
    if (!dob) return setError("Please select your date of birth");
    if (!validateEmail(email))
      return setError("Please enter a valid email address");

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, email }),
      });

      const data = await res.json();
      if (data.success) {
        setShowOtpBox(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server error, please try again later");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleSignIn = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid OTP");
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
            <h1 className="form-title">Sign up</h1>
            <p className="form-subtitle">Sign up to enjoy the features of HD</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name */}
            <div className="form-group floating-label">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="email-input"
              />
            </div>

            {/* DOB */}
            <div className="form-group floating-label">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="email-input"
              />
            </div>

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

            {error && <p className="error-message">{error}</p>}

            {!showOtpBox && (
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            )}
          </form>

          {/* OTP Input & Sign In Button */}
          {showOtpBox && (
            <div className="otp-section">
              <div className="form-group floating-label">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="email-input"
                />
              </div>
              <button
                type="button"
                className="submit-button signin-btn"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
            </div>
          )}

          {/* Already have account */}
          <p className="signin-link">
            Already have an account?{" "}
            <Link to="/signin" className="signin-anchor">
              Sign in
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

export default SignUp;
