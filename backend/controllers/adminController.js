const Cleaning = require("../models/Cleaning");
const User = require("../models/User");

const getAllTasks = (req, res) => {
    //find all tasks and return username
    Cleaning.findAllTasks((err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({ tasks: tasks });
    });
};

const getPendingTasks = async (_, res) => {
    //find all pending tasks and return username
    Cleaning.findPendingTasks((err, tasks) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({ tasks: tasks });
    });
};

const getAllUsers = async (_, res) => {
    //find all users
    Cleaning.findAllUser((err, users) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({ users: users });
    });
};

const addTask = async (req, res) => {
    //add a new task
    const taskData = req.body;
    Cleaning.create(taskData, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({
            message: "Task added successfully",
            task: result,
        });
    });
};

const updateTaskStatus = async (req, res) => {
    //update the status of a task
    const { taskId, status } = req.body;
    Cleaning.updateStatus(taskId, status, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({
            message: "Task updated successfully",
            task: result,
        });
    });
};

const deleteTask = async (req, res) => {
    //delete a task
    const taskId = req.params.id;
    Cleaning.delete(taskId, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result,
        });
    });
};

const updateUserCredit = async (req, res) => {
    //update the credit of a user
    const { user_id, credit, taskId, status } = req.body;

    Cleaning.updateCredit(user_id, credit, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }

        Cleaning.updateStatus(taskId, status, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                });
            }
        });

        res.json({
            message: "User credit updated successfully",
            user: result,
        });
    });
};

module.exports = {
    getAllTasks,
    getPendingTasks,
    getAllUsers,
    addTask,
    updateTaskStatus,
    deleteTask,
    updateUserCredit,
};
