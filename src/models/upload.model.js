const mysql = require('../database/mysql');

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM uploads WHERE user_id = ?', [userId]);
    return rows;
}

async function create(userId, type, filename, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO uploads (user_id, type, filename, created_at) VALUES (?, ?, ?, ?)', [userId, type, filename, createdAt]);
    return rows;
}

module.exports = {
    getAllByUserId,
    create
}