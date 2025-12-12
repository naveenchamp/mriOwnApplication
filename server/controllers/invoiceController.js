const db = require("../config/db");

exports.getInvoices = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM invoices ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM invoices WHERE id=?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { projectId, amount, status } = req.body;

    const [result] = await db.query(
      `INSERT INTO invoices (projectId, amount, status)
       VALUES (?, ?, ?)`,
      [projectId, amount, status || "Pending"]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { amount, status } = req.body;

    await db.query(
      `UPDATE invoices SET amount=?, status=? WHERE id=?`,
      [amount, status, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await db.query("DELETE FROM invoices WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
