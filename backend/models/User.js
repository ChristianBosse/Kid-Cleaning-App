// models/User.js
const connection = require("../config/db");
const convertCreditsToMoney = require("../utils/convertCreditsToMoney");

class User {
    // Create a new user
    static create(userData, callback) {
        // Since the password is already hashed in the register function, no need to hash it here
        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        connection.query(
            sql,
            [userData.name, userData.email, userData.password],
            callback
        );
    }

    // Find a user by ID
    static findById(userId, callback) {
        const sql = "SELECT * FROM users WHERE id = ?";
        connection.query(sql, [userId], callback);
    }

    // Find a user by email
    static findByEmail(email, callback) {
        const sql = "SELECT * FROM users WHERE email = ?";
        connection.query(sql, [email], callback);
    }

    // Update user credit
    static updateCredit(userId, creditAmount, callback) {
        const sql = "UPDATE users SET credit = credit + ? WHERE id = ?";
        connection.query(sql, [creditAmount, userId], callback);
    }

    // Calculate the monetary value of the user's credit
    static getCreditInMoney(userId, callback) {
        const sql = "SELECT credit FROM users WHERE id = ?";
        connection.query(sql, [userId], (err, result) => {
            if (err) return callback(err);

            const credit = result[0].credit;
            const money = convertCreditsToMoney(credit);

            callback(null, money);
        });
    }

    // Get user tasks
    static getTasks(userId, callback) {
        const sql =
            "SELECT * FROM cleanings WHERE user_id = ? AND status = 'pending'";
        connection.query(sql, [userId], callback);
    }

    static getWaitingTasks(userId, callback) {
        const sql =
            "SELECT * FROM cleanings WHERE user_id = ? AND status = 'waiting'";
        connection.query(sql, [userId], callback);
    }

    static getCompletedTasks(userId, callback) {
        const sql =
            "SELECT * FROM cleanings WHERE user_id = ? AND status = 'approved'";
        connection.query(sql, [userId], callback);
    }

    static getGlobalTasks(callback) {
        const sql =
            "SELECT * FROM cleanings WHERE type = 'global' AND status = 'pending'";
        connection.query(sql, callback);
    }

    static updateGlobalTaskStatus(taskId, status, userId, username, callback) {
        const sql =
            "UPDATE cleanings SET status = ?, user_id = ?, username = ? WHERE id = ?";
        connection.query(sql, [status, userId, username, taskId], callback);
    }
}

module.exports = User;
