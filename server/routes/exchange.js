const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET RATES
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, fromCurrency, toCurrency, rate, effectiveDate FROM exchange_rates ORDER BY effectiveDate DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load exchange rates" });
  }
});

// ADD RATE
router.post("/", auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, rate, effectiveDate } = req.body;

    const [result] = await db.query(
      "INSERT INTO exchange_rates (fromCurrency, toCurrency, rate, effectiveDate) VALUES (?, ?, ?, ?)",
      [fromCurrency, toCurrency, rate, effectiveDate]
    );

    res.status(201).json({
      id: result.insertId,
      fromCurrency,
      toCurrency,
      rate,
      effectiveDate
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add rate" });
  }
});

module.exports = router;
