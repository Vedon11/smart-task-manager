/*const Task = require("../models/Task");

// CREATE TASK
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, priority, dueDate } = req.body;

//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       dueDate,
//       user: req.user._id,
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error creating task" });
//   }
// };
// CREATE TASK
// CREATE TASK
// CREATE TASK
catch (error) {
  if (error.code === 11000) {
    return res.status(400).json({ message: "Task already exists" });
  }

  res.status(500).json({ message: "Error creating task" });
}
// GET ALL TASKS (ONLY LOGGED-IN USER TASKS)
exports.getTasks = async (req, res) => {
  try {
    const { completed, priority, overdue } = req.query;

    const filter = { user: req.user._id };

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (priority) {
      filter.priority = priority;
    }

    if (overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.completed = false;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};
//TASK STATS
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({
      user: userId,
      completed: true,
    });
    const pending = await Task.countDocuments({
      user: userId,
      completed: false,
    });

    const completionRate =
      total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    res.json({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      completionRate: `${completionRate}%`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
*/
const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }

    res.status(500).json({ message: "Error creating task" });
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined)
      task.description = req.body.description;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    if (req.body.status !== undefined) task.status = req.body.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

// TASK STATS
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const pending = await Task.countDocuments({
      user: userId,
      status: "pending",
    });

    const completionRate =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      completionRate: `${completionRate}%`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
