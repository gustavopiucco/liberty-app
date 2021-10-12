const mysql = require('../database/mysql');

async function codeExists(code) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM email_validations WHERE code = ?', [code]);

    return rows.length > 0;
}

async function getByCode(code) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM email_validations WHERE code = ?', [code]);

    return rows[0];
}

async function create(userId, code) {
    await mysql.pool.execute('INSERT INTO email_validations (user_id, code) VALUES (?, ?)', [userId, code]);
}

async function setUsed(id) {
    await mysql.pool.execute('UPDATE email_validations SET used = 1 WHERE id = ?', [id])
}

module.exports = {
    codeExists,
    getByCode,
    create,
    setUsed
}