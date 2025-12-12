const db = require("../config/db");

exports.getRates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM exchange_rates ORDER BY effectiveDate DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addRate = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, rate, effectiveDate } = req.body;

    const [result] = await db.query(
      `INSERT INTO exchange_rates (fromCurrency, toCurrency, rate, effectiveDate)
       VALUES (?, ?, ?, ?)`,
      [fromCurrency, toCurrency, rate, effectiveDate]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
