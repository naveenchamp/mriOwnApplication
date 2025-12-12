const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { login, register, logout } = require("../controllers/authController");

// LOGIN
router.post("/login", login);

// REGISTER
router.post("/register", register);

// LOGOUT
router.post("/logout", logout);

// AUTO LOGIN FROM COOKIE
router.get("/me", auth, (req, res) => {
  res.json({
    user: {
      id: req.user.userId,
      role: req.user.role
    }
  });
});

module.exports = router;
