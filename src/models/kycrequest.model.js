const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM kyc_requests WHERE id = ?', [id]);
    return rows[0];
}


async function getByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM kyc_requests WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
}

async function create(userId, status, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT kyc_requests (user_id, status, created_at) VALUES (?, ?, ?)', [userId, status, createdAt]);
    return rows.insertId;
}

async function updateStatus(id, status) {
    await mysql.pool.execute('UPDATE kyc_requests SET status = ? WHERE id = ?', [status, id]);
}

module.exports = {
    getById,
    getByUserId,
    create,
    updateStatus
}