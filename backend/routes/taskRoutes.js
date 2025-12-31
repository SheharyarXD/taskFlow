const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// GET tasks by project
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).maxTimeMS(5000);
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CREATE task (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can add tasks" });

    const task = await Task.create(req.body);
    res.json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE STATUS
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).maxTimeMS(5000);

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
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
