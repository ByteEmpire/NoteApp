import express from "express";

const router = express.Router();

// Temporary route just to test server
router.get("/", (req, res) => {
  res.send("Auth routes working");
});

export default router;
