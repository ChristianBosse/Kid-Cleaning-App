// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = require("../config/secret");
const Cleaning = require("../models/Cleaning");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0);
            });
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await new Promise((resolve, reject) => {
            User.create(
                { name, email, password: hashedPassword },
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid email or password - bcrypt" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, secret.jwtSecret, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.is_admin,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err });
    }
};

const createGlobalCleaning = (req, res) => {
    const { description, maxCompletesPerDay } = req.body;

    // Create a global cleaning task
    Cleaning.create(
        {
            user_id: req.user.id, // the admin or user who created the task
            type: Cleaning.GLOBAL_CLEANING,
            description,
            maxCompletesPerDay,
            status: "pending",
        },
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creating global cleaning task",
                    error: err,
                });
            }
            res.status(201).json({
                message: "Global cleaning task created successfully",
            });
        }
    );
};

const createPersonalCleaning = (req, res) => {
    const { description } = req.body;

    // Create a personal cleaning task
    Cleaning.create(
        {
            user_id: req.user.id,
            type: Cleaning.PERSONAL_CLEANING,
            description,
            status: "pending",
        },
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creating personal cleaning task",
                    error: err,
                });
            }
            res.status(201).json({
                message: "Personal cleaning task created successfully",
            });
        }
    );
};

const getUserCreditInMoney = (req, res) => {
    const userId = req.user.id; // Assuming user ID is obtained from authentication middleware

    User.getMonetaryCredit(userId, (err, moneyValue) => {
        if (err) {
            return res.status(500).json({
                message: "Error calculating monetary credit",
                error: err,
            });
        }

        res.status(200).json({ creditInMoney: moneyValue });
    });
};

const getUserData = (req, res) => {
    //get user id from the request
    const userId = req.params.id;

    //Get users task and credit

    User.getTasks(userId, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching user tasks",
                error: err,
            });
        }

        User.getCreditInMoney(userId, (err, moneyValue) => {
            if (err) {
                return res.status(500).json({
                    message: "Error calculating monetary credit",
                    error: err,
                });
            }

            res.status(200).json({ tasks, credit: moneyValue });
        });
    });
};

const getUserWaitingTasks = (req, res) => {
    const userId = req.params.id;

    User.getWaitingTasks(userId, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching user tasks",
                error: err,
            });
        }

        res.status(200).json({ tasks });
    });
};

const getUserCompletedTasks = (req, res) => {
    const userId = req.params.id;

    User.getCompletedTasks(userId, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching user tasks",
                error: err,
            });
        }

        res.status(200).json({ tasks });
    });
};

const updateTaskStatus = (req, res) => {
    const { taskId, status } = req.body;

    Cleaning.updateStatus(taskId, status, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error completing task",
                error: err,
            });
        }

        res.status(200).json({ message: "Task completed successfully" });
    });
};

const getGlobalTasks = (req, res) => {
    User.getGlobalTasks((err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching global tasks",
                error: err,
            });
        }

        res.status(200).json({ tasks });
    });
};

const updateGlobalTaskStatus = (req, res) => {
    const { taskId, status, userId, username } = req.body;

    User.updateGlobalTaskStatus(
        taskId,
        status,
        userId,
        username,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error updating global task status",
                    error: err,
                });
            }

            res.status(200).json({
                message: "Global task status updated successfully",
            });
        }
    );
};

module.exports = {
    register,
    login,
    createGlobalCleaning,
    createPersonalCleaning,
    getUserCreditInMoney,
    getUserData,
    updateTaskStatus,
    getUserWaitingTasks,
    getUserCompletedTasks,
    getGlobalTasks,
    updateGlobalTaskStatus,
};
