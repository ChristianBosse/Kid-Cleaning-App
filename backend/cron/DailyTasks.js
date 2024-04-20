const cron = require("node-cron");
const connection = require("../config/db");

// Schedule tasks to reset all Daily task statuses to 'pending' where repeat_count is 2 every day at 00:00

const tasksReset = () => {
    cron.schedule("*/1 * * * *", async () => {
        const date = new Date();
        const hours = date.getHours();
        if (hours === 23) {
            const sql =
                "UPDATE cleanings SET status = 'pending' WHERE repeat_count = 2 AND status != 'waiting'";
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                }
            });
            console.log("Daily tasks reset to 'pending' status");
        }
        console.log("Cron job running every minute");
    });
};

module.exports = tasksReset;
