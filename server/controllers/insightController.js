const db = require("../config/db");

exports.getRisk = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await db.query("SELECT * FROM projects WHERE id=?", [
      projectId,
    ]);

    if (!rows.length) return res.status(404).json({ message: "Project not found" });

    const p = rows[0];

    const usage = p.budget ? (p.spent / p.budget) * 100 : 0;
    let risk = "Low";

    if (usage > 120) risk = "Critical";
    else if (usage > 100) risk = "High";
    else if (usage > 80) risk = "Medium";

    res.json({
      project: p.name,
      budget: p.budget,
      spent: p.spent,
      budgetUsedPercent: usage.toFixed(2),
      risk,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
