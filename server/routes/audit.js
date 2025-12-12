const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, userId, action, entityType, entityId, newValues, ipAddress, createdAt
      FROM audit_logs ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load audit logs" });
  }
});

module.exports = router;
