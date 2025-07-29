// Get base URL from environment variable, fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Send OTP
export const sendOtp = async (name, dob, email) => {
  const res = await fetch(`${API_BASE}/otp/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, dob, email })
  });
  return res.json();
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  const res = await fetch(`${API_BASE}/otp/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });
  return res.json();
};

// Get Notes
export const getNotes = async (token) => {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

// Add Note
export const addNote = async (token, content) => {
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });
  return res.json();
};

// Delete Note
export const deleteNote = async (token, id) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
