// config/db.js
require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect(err => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

module.exports = connection;
