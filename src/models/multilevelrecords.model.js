const mysql = require('../database/mysql');

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute(`
        SELECT mr.id, users.first_name AS from_user_first_name, users.last_name AS from_user_last_name, mr.type, mr.level, mr.value, mr.created_at
        FROM multilevel_records mr
        JOIN users ON users.id = mr.user_id
        WHERE mr.user_id = ? ORDER BY mr.created_at DESC
        `, [userId]);

    return rows;
}

async function getAllByUserIdAndCreatedAt(userId, createdAt) {
    const [rows, fields] = await mysql.pool.execute(`SELECT * FROM multilevel_records WHERE user_id = ? AND DATE(created_at) = ?`, [userId, createdAt]);

    return rows;
}

async function getAllBeetwenDate(fromDate, toDate) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM multilevel_records WHERE created_at BETWEEN ? AND ?', [fromDate, toDate]);

    return rows;
}

async function create(userId, fromUserId, fromContractId, type, level, value, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT multilevel_records (user_id, from_user_id, from_contract_id, type, level, value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, fromUserId, fromContractId, type, level, value, createdAt]);
    return rows;
}

module.exports = {
    getAllByUserId,
    getAllByUserIdAndCreatedAt,
    getAllBeetwenDate,
    create
}