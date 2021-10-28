const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM withdraws WHERE id = ?', [id]);

    return rows[0];
}

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM withdraws WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    return rows;
}

async function getAll() {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM withdraws ORDER BY created_at DESC');

    return rows;
}

async function setPaid(id) {
    await mysql.pool.execute(`UPDATE withdraws SET status = 'paid' WHERE id = ?`, [id]);
}

async function create(userId, status, value, createdAt) {
    await mysql.pool.execute('INSERT INTO withdraws (user_id, status, value, created_at) VALUES (?, ?, ?, ?)', [userId, status, value, createdAt]);
}

module.exports = {
    getById,
    getAllByUserId,
    getAll,
    setPaid,
    create
}