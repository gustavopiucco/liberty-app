const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE id = ?', [id]);
    return rows[0];
}

async function getByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE user_id = ?', [userId]);
    return rows[0];
}

async function create(userId, planId, paymentType, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (user_id, plan_id, payment_type, created_at) VALUES (?, ?, ?, ?)', [userId, planId, paymentType, createdAt]);
    return rows;
}

async function deleteById(id) {
    await mysql.pool.execute('DELETE FROM contracts WHERE id = ?', [id]);
}

module.exports = {
    getById,
    getByUserId,
    create,
    deleteById
}