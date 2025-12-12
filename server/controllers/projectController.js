const db = require("../config/db");

/* CREATE */
exports.createProject = async (req, res) => {
  try {
    const { name, budget, spent, progress } = req.body;

    const [result] = await db.query(
      `INSERT INTO projects (name, budget, spent, progress)
       VALUES (?, ?, ?, ?)`,
      [name, budget || 0, spent || 0, progress || 0]
    );

    res.status(201).json({ id: result.insertId, name, budget, spent, progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LIST */
exports.getProjects = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* SINGLE */
exports.getProject = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM projects WHERE id=?", [
      req.params.id,
    ]);

    if (!rows.length) return res.status(404).json({ message: "Not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
exports.updateProject = async (req, res) => {
  try {
    const { name, budget, spent, progress } = req.body;

    await db.query(
      `UPDATE projects SET name=?, budget=?, spent=?, progress=? WHERE id=?`,
      [name, budget, spent, progress, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
exports.deleteProject = async (req, res) => {
  try {
    await db.query("DELETE FROM projects WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
