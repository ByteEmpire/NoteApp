import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaTrash, FaShare, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user] = useState({
    name: localStorage.getItem("name") || "User",
    email: localStorage.getItem("email") || "unknown@example.com"
  });

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [shareIndex, setShareIndex] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  const token = localStorage.getItem("token");

  // Fetch notes from MongoDB when page loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setNotes(data.notes);
        } else {
          alert(data.message || "Failed to fetch notes");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [token]);

  // Save note to MongoDB
  const saveNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNote })
      });

      const data = await res.json();
      if (data.success) {
        setNotes([data.note, ...notes]);
        setNewNote("");
        setIsCreating(false);
      } else {
        alert(data.message || "Failed to save note");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete note from MongoDB
  const deleteNote = async (noteId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotes(notes.filter((note) => note._id !== noteId));
      } else {
        alert(data.message || "Failed to delete note");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sign out
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Share note via email (FormSubmit)
  const sendNote = (note) => {
    if (!shareEmail.trim()) {
      alert("Please enter recipient's email");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://formsubmit.co/" + shareEmail;

    const subjectField = document.createElement("input");
    subjectField.type = "hidden";
    subjectField.name = "_subject";
    subjectField.value = `Shared Note from ${user.name}`;
    form.appendChild(subjectField);

    const messageField = document.createElement("input");
    messageField.type = "hidden";
    messageField.name = "message";
    messageField.value = note;
    form.appendChild(messageField);

    const redirectField = document.createElement("input");
    redirectField.type = "hidden";
    redirectField.name = "_next";
    redirectField.value = window.location.href;
    form.appendChild(redirectField);

    document.body.appendChild(form);
    form.submit();

    setShareIndex(null);
    setShareEmail("");
  };

  // Download note as PDF
  const downloadPDF = (note, index) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Note ${index + 1}`, 10, 10);
    doc.setFontSize(12);
    doc.text(note, 10, 20);
    doc.save(`note-${index + 1}.pdf`);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h3>Dashboard</h3>
        <button onClick={handleSignOut} className="signout-link">
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="welcome-card">
        <h4>Welcome, {user.name}!</h4>
        <p>Email: {user.email}</p>
      </div>

      {/* Create Note */}
      {!isCreating ? (
        <button className="create-note-btn" onClick={() => setIsCreating(true)}>
          Create Note
        </button>
      ) : (
        <div className="note-editor">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
          ></textarea>
          <div className="note-editor-actions">
            <button onClick={saveNote} className="save-note-btn">
              Save
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="cancel-note-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Notes</h4>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-notes">No notes yet. Create one!</p>
        ) : (
          notes.map((note, index) => (
            <div key={note._id} className="note-item">
              <span>{note.content}</span>
              <div className="note-actions">
                <FaDownload
                  onClick={() => downloadPDF(note.content, index)}
                  style={{
                    cursor: "pointer",
                    color: "green",
                    marginRight: "10px"
                  }}
                  title="Download as PDF"
                />
                <FaShare
                  onClick={() => setShareIndex(index)}
                  style={{ cursor: "pointer", color: "blue" }}
                  title="Share Note"
                />
                <FaTrash
                  onClick={() => deleteNote(note._id)}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    marginLeft: "10px"
                  }}
                  title="Delete Note"
                />
              </div>

              {/* Share Email Input */}
              {shareIndex === index && (
                <div className="share-box">
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <button onClick={() => sendNote(note.content)}>Send</button>
                  <button onClick={() => setShareIndex(null)}>Cancel</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
