const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM journal_entries ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
