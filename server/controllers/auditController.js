const db = require("../config/db");

exports.getAuditLogs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM audit_logs ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
