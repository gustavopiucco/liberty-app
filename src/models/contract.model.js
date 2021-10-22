const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE id = ?', [id]);
    return rows[0];
}

async function getAll(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts ORDER BY created_at DESC');
    return rows;
}

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE user_id = ?', [userId]);
    return rows;
}

async function getByUserIdAndPaymentConfirmed(userId) {
    const [rows, fields] = await mysql.pool.execute(`SELECT * FROM contracts WHERE user_id = ? AND status = 'payment_confirmed'`, [userId]);
    return rows[0];
}

async function create(userId, planId, paymentType, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (user_id, plan_id, payment_type, created_at) VALUES (?, ?, ?, ?)', [userId, planId, paymentType, createdAt]);
    return rows;
}

async function updateStatus(id, status) {
    await mysql.pool.execute('UPDATE contracts SET status = ? WHERE id = ?', [status, id]);
}

async function addTotalReceived(id, value) {
    await mysql.pool.execute(`UPDATE contracts SET total_received = total_received + ? WHERE id = ?`, [value, id]);
}

async function deleteById(id) {
    await mysql.pool.execute('DELETE FROM contracts WHERE id = ?', [id]);
}

module.exports = {
    getById,
    getAll,
    getAllByUserId,
    getByUserIdAndPaymentConfirmed,
    create,
    updateStatus,
    addTotalReceived,
    deleteById
}