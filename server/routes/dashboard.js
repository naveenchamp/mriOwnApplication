const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/stats", auth, async (req, res) => {
  try {
    const [[{ count: projects }]] = await db.query(
      "SELECT COUNT(*) AS count FROM projects"
    );

    const [[{ sum: spent }]] = await db.query(
      "SELECT SUM(spent) AS sum FROM projects"
    );

    const [[{ count: pendingInvoices }]] = await db.query(
      "SELECT COUNT(*) AS count FROM invoices WHERE status='Pending'"
    );

    res.json({
      projects,
      spent: spent || 0,
      pendingInvoices
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
 