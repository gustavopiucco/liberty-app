const mysql = require('../database/mysql');

async function getAllByKycRequestId(kycRequestId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM kyc_requests_uploads WHERE kyc_request_id = ?', [kycRequestId]);
    return rows;
}

async function create(kycRequestId, fileName, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT kyc_requests_uploads (kyc_request_id, filename, created_at) VALUES (?, ?, ?)', [kycRequestId, fileName, createdAt]);
    return rows;
}

module.exports = {
    getAllByKycRequestId,
    create
}