// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
// Import the admin controller here
const adminController = require("../controllers/adminController");

// Add routes for managing admin operations here
router.get("/tasks", adminController.getAllTasks);
router.get("/pending-tasks", adminController.getPendingTasks);
router.get("/users", adminController.getAllUsers);
router.post("/add-task", adminController.addTask);
router.post("/update-task", adminController.updateTaskStatus);
router.delete("/delete-task/:id", adminController.deleteTask);
router.put("/update-credit", adminController.updateUserCredit);

module.exports = router;
