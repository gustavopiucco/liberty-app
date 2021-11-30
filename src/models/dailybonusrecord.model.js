const mysql = require('../database/mysql');

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute(`
        SELECT dbr.id, dbr.from_contract_id, dbr.value, dbr.created_at
        FROM daily_bonus_records dbr
        WHERE dbr.user_id = ? ORDER BY dbr.created_at DESC
        `, [userId]);

    return rows;
}

async function getAllBeetwenDate(fromDate, toDate) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM daily_bonus_records WHERE created_at BETWEEN ? AND ?', [fromDate, toDate]);

    return rows;
}

async function create(userId, fromContractId, value, createdAt) {
    await mysql.pool.execute('INSERT daily_bonus_records (user_id, from_contract_id, value, created_at) VALUES (?, ?, ?, ?)', [userId, fromContractId, value, createdAt]);
}

module.exports = {
    getAllByUserId,
    getAllBeetwenDate,
    create
}