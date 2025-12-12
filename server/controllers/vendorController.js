const db = require("../config/db");

exports.getVendors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vendors");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
