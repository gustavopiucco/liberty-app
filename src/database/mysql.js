const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'liberty'
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