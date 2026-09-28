const mysql = require("mysql2/promise");

// Tạo pool kết nối đến MySQL
const ketNoi = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    charset: "utf8mb4"
});

module.exports = ketNoi;