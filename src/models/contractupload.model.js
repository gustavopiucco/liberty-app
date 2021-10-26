const mysql = require('../database/mysql');

async function getAllByContractId(contractId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM contracts_uploads WHERE contract_id = ?', [contractId]);
    return rows;
}

async function create(contractId, fileName, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT contracts_uploads (contract_id, filename, created_at) VALUES (?, ?, ?)', [contractId, fileName, createdAt]);
    return rows;
}

module.exports = {
    getAllByContractId,
    create
}