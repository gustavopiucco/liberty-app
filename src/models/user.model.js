const mysql = require('../database/mysql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
}

async function create(sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode) {
    await mysql.pool.execute('INSERT INTO users (sponsor_id, invite_code, email, password_hash, first_name, last_name, cpf, phone, birth_date, country, city, state, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode]);
}

async function getByEmail(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function getMultilevel(id, level) {
    const [rows, fields] = await mysql.pool.execute(`
    WITH RECURSIVE multilevel AS (
		SELECT id, sponsor_id, 0 level FROM users WHERE id = ?
    UNION
		SELECT u.id, u.sponsor_id, m.level + 1 FROM users u
        INNER JOIN multilevel m ON u.sponsor_id = m.id
    )
    SELECT u.id, level AS level FROM multilevel m
    INNER JOIN users u ON u.id = m.id
    WHERE u.id <> ? AND m.level = ?`, [id, id, level]);

    return rows[0];
}

module.exports = {
    emailExists,
    cpfExists,
    create,
    getByEmail,
    getMultilevel
}