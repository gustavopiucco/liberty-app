const mysql = require('../database/mysql');

async function create() {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (plan) VALUES (?)', [plan]);
    return rows;
}

module.exports = {
    create
}