// models/Cleaning.js
const connection = require("../config/db");

class Cleaning {
    static GLOBAL_CLEANING = "global";
    static PERSONAL_CLEANING = "personal";

    // Create a new cleaning task
    static create(cleaningData, callback) {
        const sql =
            "INSERT INTO cleanings (user_id, type, description, repeat_count, status, credit, username) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.query(
            sql,
            [
                cleaningData.user_id,
                cleaningData.type,
                cleaningData.description,
                cleaningData.repeat_count,
                "pending",
                cleaningData.credit,
                cleaningData.username,
            ],
            callback
        );
    }

    static findAllTasks(callback) {
        const sql = "SELECT * FROM cleanings WHERE status = 'pending'";
        connection.query(sql, callback);
    }

    static findPendingTasks(callback) {
        const sql = "SELECT * FROM cleanings WHERE status = 'waiting'";
        connection.query(sql, callback);
    }

    // Find a cleaning task by ID
    static findById(cleaningId, callback) {
        const sql = "SELECT * FROM cleanings WHERE id = ?";
        connection.query(sql, [cleaningId], callback);
    }

    // Find all cleaning tasks for a user
    static findAllByUserId(userId, callback) {
        const sql = "SELECT * FROM cleanings WHERE user_id = ?";
        connection.query(sql, [userId], callback);
    }

    static findAllUser(callback) {
        const sql = "SELECT * FROM users";
        connection.query(sql, callback);
    }

    // Update the status of a cleaning task
    static updateStatus(cleaningId, status, callback) {
        const sql = "UPDATE cleanings SET status = ? WHERE id = ?";
        connection.query(sql, [status, cleaningId], callback);
    }

    // Delete a cleaning task
    static delete(cleaningId, callback) {
        const sql = "DELETE FROM cleanings WHERE id = ?";
        connection.query(sql, [cleaningId], callback);
    }

    static updateCredit(userId, credit, callback) {
        //fetch the user's current credit
        const sql = "SELECT * FROM users WHERE id = ?";
        connection.query(sql, [userId], (err, results) => {
            if (err) {
                return callback(err);
            }

            const currentCredit = results[0].credit;

            //check if credit is a string
            if (typeof credit === "string") {
                credit = parseInt(credit);
            }

            //update the user's credit
            const newCredit = currentCredit + credit;
            this.updateUserCredit(userId, newCredit, callback);
        });
    }

    static updateUserCredit(userId, credit, callback) {
        const sql = "UPDATE users SET credit = ? WHERE id = ?";
        connection.query(sql, [credit, userId], callback);
    }
}

module.exports = Cleaning;
