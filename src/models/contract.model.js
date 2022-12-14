const mysql = require('../database/mysql');

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, plans.price AS plan_price FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.id = ?`, [id]);
    return rows[0];
}

async function getAll() {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, users.first_name, users.last_name, users.email FROM contracts
    JOIN users ON users.id = contracts.user_id
    ORDER BY contracts.created_at DESC`);

    return rows;
}

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
}

async function getAllByUserIdWithPlan(userId) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.id, contracts.plan_id, plans.price AS plan_price, plans.name AS plan_name, contracts.status, contracts.payment_type, contracts.total_received, contracts.created_at FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.user_id = ?`, [userId]);

    return rows;
}

async function getAllByUserIdApprovedOrCompleted(userId) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.id, contracts.plan_id, plans.price AS plan_price, plans.name AS plan_name, contracts.status, contracts.payment_type, contracts.total_received, contracts.created_at FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.user_id = ?
    AND contracts.status IN ('approved', 'completed')`, [userId]);

    return rows;
}

async function getByUserIdAndApproved(userId) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, plans.price AS plan_price FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.user_id = ?
    AND contracts.status = 'approved'`, [userId]);

    return rows[0];
}

async function getAllByUserIdAndApproved(userId) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, plans.price AS plan_price FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.user_id = ?
    AND contracts.status = 'approved'`, [userId]);

    return rows;
}

async function getAllApproved() {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, plans.id AS plan_id, plans.price AS plan_price FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.status = 'approved'`);

    return rows;
}

async function getAllBetweenDates(fromDate, toDate) {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT contracts.*, plans.id AS plan_id, plans.price AS plan_price FROM contracts
    JOIN plans ON plans.id = contracts.plan_id
    WHERE contracts.created_at BETWEEN ? AND ?`, [fromDate, toDate]);

    return rows;
}

async function create(userId, planId, status, paymentType, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO contracts (user_id, plan_id, status, payment_type, created_at) VALUES (?, ?, ?, ?, ?)', [userId, planId, status, paymentType, createdAt]);

    return rows.insertId;
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
    getAllByUserIdWithPlan,
    getAllByUserIdApprovedOrCompleted,
    getByUserIdAndApproved,
    getAllByUserIdAndApproved,
    getAllApproved,
    getAllBetweenDates,
    create,
    updateStatus,
    addTotalReceived,
    deleteById
}