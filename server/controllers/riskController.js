const db = require("../config/db");

exports.getRisk = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM projects WHERE id=?",
      [projectId]
    );

    if (rows.length === 0)
      return res.json({ message: "Project not found" });

    const project = rows[0];

    const budgetUsed = (project.spent / project.budget) * 100;

    let risk = "Low";

    if (budgetUsed > 120) risk = "Critical"; // spent way more
    else if (budgetUsed > 100) risk = "High"; // spent over budget
    else if (budgetUsed > 80) risk = "Medium"; // getting risky

    res.json({
      project: project.name,
      budget: project.budget,
      spent: project.spent,
      budgetUsedPercent: budgetUsed.toFixed(2),
      risk,
    });

  } catch (err) {
    res.status(500).json(err);
  }
};
 