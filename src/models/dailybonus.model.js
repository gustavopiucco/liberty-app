const mysql = require('../database/mysql');

async function getByDate(date) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM daily_bonus WHERE date = ?', [date]);
    return rows[0];
}

async function getAll() {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM daily_bonus ORDER BY date DESC');
    return rows;
}

async function create(percentage, date) {
    await mysql.pool.execute('INSERT INTO daily_bonus (percentage, date) VALUES (?, ?) ON DUPLICATE KEY UPDATE percentage = ?, date = ?', [percentage, date, percentage, date]);
}

module.exports = {
    getByDate,
    getAll,
    create
}