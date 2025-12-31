const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// GET tasks by project
router.get("/:projectId", auth, async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
});

// CREATE task (admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Only admin can add tasks" });

  const task = await Task.create(req.body);
  res.json(task);
});

// UPDATE STATUS
router.patch("/:id/status", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  // member can only update own task
  if (
    req.user.role === "member" &&
    task.assignedTo.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  task.status = req.body.status;
  await task.save();

  res.json(task);
});

module.exports = router;
