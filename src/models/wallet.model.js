const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM wallets WHERE id = ?', [id]);

    return rows[0];
}

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM wallets WHERE user_id = ?', [userId]);

    return rows;
}

async function create(userId, type, value, createdAt) {
    await mysql.pool.execute('INSERT INTO wallets (user_id, type, value, created_at) VALUES (?, ?, ?, ?)', [userId, type, value, createdAt]);
}

async function deleteById(id) {
    await mysql.pool.execute('DELETE FROM wallets WHERE id = ?', [id]);
}

module.exports = {
    getById,
    getAllByUserId,
    create,
    deleteById
}