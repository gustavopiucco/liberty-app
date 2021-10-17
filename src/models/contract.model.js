const mysql = require('../database/mysql');

async function create(userId, planId, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (user_id, plan_id, created_at) VALUES (?, ?, ?)', [userId, planId, createdAt]);
    return rows;
}

module.exports = {
    create
}