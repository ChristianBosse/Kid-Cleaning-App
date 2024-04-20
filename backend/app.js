// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tasksReset = require("./cron/DailyTasks");
const GlobalReset = require("./cron/GlobalTask");
const cors = require("cors");

// Set timezone to Atlantic/Halifax
process.env.TZ = "Atlantic/Halifax";

const app = express();
app.use(cors());
// Middlewares
app.use(bodyParser.json());

// Start Cron
tasksReset();
GlobalReset();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
