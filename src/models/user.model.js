const mysql = require('../database/mysql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
}

async function create(email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode) {
    await mysql.pool.execute('INSERT INTO users (email, password_hash, first_name, last_name, cpf, phone, birth_date, country, city, state, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode]);
}

async function getByEmail(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}


module.exports = {
    emailExists,
    cpfExists,
    create,
    getByEmail
}