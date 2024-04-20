const cron = require("node-cron");
const connection = require("../config/db");

// Scheduly tasks to reset all Global usernames Global and user_id to 0 each 15 minutes

const GlobalReset = () => {
    cron.schedule("*/1 * * * *", async () => {
        const date = new Date();
        const minutes = date.getMinutes();
        if (minutes === 0) {
            const sql =
                "UPDATE cleanings SET username = 'Global', user_id = 0 WHERE type = 'global' AND status = 'pending'";
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                }
            });
            console.log("Global usernames reset to 0");
        }
        console.log("Cron job running every 15 minutes");
    });
};

module.exports = GlobalReset;
