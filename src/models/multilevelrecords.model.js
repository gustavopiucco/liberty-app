const mysql = require('../database/mysql');

async function create(userId, fromUserId, type, level, value, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT multilevel_records (user_id, from_user_id, type, level, value, created_at) VALUES (?, ?, ?, ?, ?, ?)', [userId, fromUserId, type, level, value, createdAt]);
    return rows;
}

module.exports = {
    create
}