require("dotenv").config();

// config/secret.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
};
