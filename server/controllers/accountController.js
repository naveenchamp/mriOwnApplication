const db = require("../config/db");

exports.getAccounts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM accounts ORDER BY code ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { code, name, type, currency } = req.body;

    const [result] = await db.query(
      `INSERT INTO accounts (code, name, type, currency, balance, isActive)
       VALUES (?, ?, ?, ?, 0, 1)`,
      [code, name, type, currency]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
