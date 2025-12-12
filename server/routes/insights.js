const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// 1️⃣ Project Health Summary
router.get("/project-health", auth, async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM projects");

    const total = projects.length;
    const healthy = projects.filter(p => p.progress >= 70).length;
    const atRisk = projects.filter(p => p.progress >= 40 && p.progress < 70).length;
    const critical = projects.filter(p => p.progress < 40).length;

    res.json({
      totalProjects: total,
      healthy,
      atRisk,
      critical,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2️⃣ Project Risk Scores
router.get("/project-risks", auth, async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM projects");

    const risks = projects.map(p => {
      const budgetUsage = p.budget ? Math.round((p.spent / p.budget) * 100) : 0;

      let level = "Low";
      if (budgetUsage > 90) level = "Critical";
      else if (budgetUsage > 70) level = "High";
      else if (budgetUsage > 50) level = "Medium";

      return {
        id: p.id,
        name: p.name,
        progress: p.progress,
        budgetUsage,
        riskLevel: level,
      };
    });

    res.json(risks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3️⃣ Cashflow Forecast (Static Demo)
router.get("/cashflow", auth, async (req, res) => {
  res.json([
    { month: "Jan", value: 54000 },
    { month: "Feb", value: 62000 },
    { month: "Mar", value: 58000 },
    { month: "Apr", value: 70000 }
  ]);
});

module.exports = router;
