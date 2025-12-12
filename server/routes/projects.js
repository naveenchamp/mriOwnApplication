const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.createProject);
router.get("/", auth, controller.getProjects);
router.get("/:id", auth, controller.getProject);
router.put("/:id", auth, controller.updateProject);
router.delete("/:id", auth, controller.deleteProject);

module.exports = router;
