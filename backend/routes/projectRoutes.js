const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id
  });
  res.json(project);
});

router.get("/", auth, async (req, res) => {
  const projects = await Project.find()
    .populate("members", "name email");
  res.json(projects);
});

module.exports = router;
