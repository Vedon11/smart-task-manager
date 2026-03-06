const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE + GET
router.route("/").post(protect, createTask).get(protect, getTasks);

// UPDATE + DELETE
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

// STATS
router.get("/stats", protect, getTaskStats);

module.exports = router;
