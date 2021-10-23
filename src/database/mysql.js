const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    decimalNumbers: true, //return mysql decimal type as JavaScript float type
    dateStrings: true //return mysql dates to javascript as they are in mysql
});

async function testConnection() {

    try {
        await pool.query('SELECT 1 AS test');
    }
    catch (err) {
        throw new Error('MySQL connection failed\n' + err);
    }
}

module.exports = {
    testConnection,
    pool
}