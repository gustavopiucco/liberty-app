const mysql = require('../database/mysql');

async function codeExists(type, code) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM auth_validations WHERE type = ? AND code = ?', [type, code]);

    return rows.length > 0;
}

async function getByCode(type, code) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM auth_validations WHERE type = ? AND code = ?', [type, code]);

    return rows[0];
}

async function create(userId, type, code) {
    await mysql.pool.execute('INSERT INTO auth_validations (user_id, type, code) VALUES (?, ?, ?)', [userId, type, code]);
}

async function deleteById(id) {
    await mysql.pool.execute('DELETE FROM auth_validations WHERE id = ?', [id])
}

module.exports = {
    codeExists,
    getByCode,
    create,
    deleteById
}