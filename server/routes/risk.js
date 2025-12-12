const express = require("express");
const router = express.Router();
const { getRisk } = require("../controllers/insightController");

router.get("/:projectId", getRisk);

module.exports = router;
