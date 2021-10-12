const mysql = require('../database/mysql');

async function codeExists(code) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM reset_password_validations WHERE code = ?', [code]);

    return rows.length > 0;
}

async function getAllByUserId(userId) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM reset_password_validations WHERE user_id = ?', [userId]);

    return rows;
}

async function getByCode(code) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM reset_password_validations WHERE code = ?', [code]);

    return rows[0];
}

async function create(userId, code) {
    await mysql.pool.execute('INSERT INTO reset_password_validations (user_id, code) VALUES (?, ?)', [userId, code]);
}

async function setUsed(id) {
    await mysql.pool.execute('UPDATE reset_password_validations SET used = 1 WHERE id = ?', [id])
}

module.exports = {
    codeExists,
    getAllByUserId,
    getByCode,
    create,
    setUsed
}