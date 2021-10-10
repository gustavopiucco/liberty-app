const mysql = require('../database/mysql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
}

async function emailConfirmationCodeExists(code) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email_confirmation_code = ?', [code]);
    return rows.length > 0;
}

async function create(sponsorId, inviteCode, emailConfirmationCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode) {
    await mysql.pool.execute('INSERT INTO users (sponsor_id, invite_code, email_confirmation_code, email, password_hash, first_name, last_name, cpf, phone, birth_date, country, city, state, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [sponsorId, inviteCode, emailConfirmationCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode]);
}

async function getById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function getByEmail(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function getByInviteCode(inviteCode) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE invite_code = ?', [inviteCode]);
    return rows[0];
}

async function updatePasswordHash(id, passwordHash) {
    await mysql.pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function updateEmailConfirmation(code) {
    await mysql.pool.execute('UPDATE users SET email_confirmation = 1, email_confirmation_code = NULL WHERE email_confirmation_code = ?', [code]);
}

module.exports = {
    emailExists,
    cpfExists,
    emailConfirmationCodeExists,
    create,
    getById,
    getByEmail,
    getByInviteCode,
    updatePasswordHash,
    updateEmailConfirmation
}