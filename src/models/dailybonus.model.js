const mysql = require('../database/mysql');

async function getAllByDate(date) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM daily_bonus WHERE date = ?', [date]);
    return rows;
}

async function getAll() {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM daily_bonus ORDER BY date DESC');
    return rows;
}

async function create(planId, percentage, date) {
    await mysql.pool.execute('INSERT INTO daily_bonus (plan_id, percentage, date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE percentage = ?, date = ?', [planId, percentage, date, percentage, date]);
}

module.exports = {
    getAllByDate,
    getAll,
    create
}