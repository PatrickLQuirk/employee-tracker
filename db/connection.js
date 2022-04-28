const mysql = require('mysql2');

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: process.env.DB_NAME,
        // Your MySQL password
        password: process.env.DB_USER,
        database: process.env.DB_PW
    },
    console.log('Connected to the employees database.')
);

module.exports = db;