// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/cleaning/global", userController.createGlobalCleaning);
router.post("/cleaning/personal", userController.createPersonalCleaning);
router.get("/credit", userController.getUserCreditInMoney);
router.get("/data/:id", userController.getUserData);
router.post("/complete", userController.updateTaskStatus);
router.get("/waiting/:id", userController.getUserWaitingTasks);
router.get("/completed/:id", userController.getUserCompletedTasks);
router.get("/global", userController.getGlobalTasks);
router.post("/complete/global", userController.updateGlobalTaskStatus);

// Add routes for managing personal cleaning tasks here

module.exports = router;
