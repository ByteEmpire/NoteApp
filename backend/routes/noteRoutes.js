import express from "express";
import Note from "../models/Note.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// 📌 Create a note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Note content is required" });
    }

    const newNote = new Note({
      userId: req.userId,
      content
    });
    await newNote.save();

    res.json({ success: true, note: newNote });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to save note", error: err });
  }
});

// 📌 Get all notes for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({
      createdAt: -1
    });
    res.json({ success: true, notes });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notes", error: err });
  }
});

// 📌 Delete a note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete note", error: err });
  }
});

export default router;
