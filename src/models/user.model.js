const mysql = require('../database/mysql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
}

async function createUser(email, passwordHash, firstName, lastName, cpf, phone) {
    await mysql.pool.execute('INSERT INTO users (email, password_hash, first_name, last_name, cpf, phone) VALUES (?, ?, ?, ?, ?, ?)', [email, passwordHash, firstName, lastName, cpf, phone]);
}

module.exports = {
    emailExists,
    cpfExists,
    createUser
}