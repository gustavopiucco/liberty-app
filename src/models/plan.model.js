const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM plans WHERE id = ?', [id]);
    return rows[0];
}

async function getAll() {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM plans');
    return rows;
}

module.exports = {
    getById,
    getAll
}