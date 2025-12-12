const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

/* ---------------------------- LOGIN ---------------------------- */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ---------------------------- REGISTER ---------------------------- */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, hash, role || "user"]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------------------------- LOGOUT ---------------------------- */
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};
