const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, code, name, type, currency, balance, isActive
      FROM accounts ORDER BY code ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { code, name, type, currency } = req.body;

    const [result] = await db.query(
      "INSERT INTO accounts (code, name, type, currency, balance, isActive) VALUES (?, ?, ?, ?, 0, 1)",
      [code, name, type, currency]
    );

    res.status(201).json({
      id: result.insertId,
      code,
      name,
      type,
      currency,
      balance: 0,
      isActive: 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
