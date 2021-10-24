const mysql = require('../database/mysql');

async function create(userId, fromContractId, value, createdAt) {
    await mysql.pool.execute('INSERT daily_bonus_records (user_id, from_contract_id, value, created_at) VALUES (?, ?, ?, ?)', [userId, fromContractId, value, createdAt]);
}

module.exports = {
    create
}