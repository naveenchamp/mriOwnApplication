const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET ALL USERS
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
