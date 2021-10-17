const mysql = require('../database/mysql');

async function getByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE user_id = ?', [userId]);
    return rows[0];
}

async function create(userId, planId, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (user_id, plan_id, created_at) VALUES (?, ?, ?)', [userId, planId, createdAt]);
    return rows;
}

module.exports = {
    getByUserId,
    create
}