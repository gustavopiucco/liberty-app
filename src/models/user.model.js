const mysql = require('../database/mysql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
}

async function create(sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO users (sponsor_id, invite_code, email, password_hash, first_name, last_name, cpf, phone, birth_date, country, city, state, postal_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, phone, birthDate, country, city, state, postalCode, createdAt]);
    return rows;
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

async function getSponsorUnilevel(id) {
    const [rows, fields] = await mysql.pool.execute(`
    WITH RECURSIVE 
	    parents AS (SELECT * FROM users WHERE id = ? UNION ALL SELECT users.* FROM users JOIN parents ON parents.sponsor_id = users.id) 
    SELECT id FROM parents WHERE id != ? ORDER BY id DESC`, [id, id]);

    return rows;
}

async function getAllDirectsById(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE sponsor_id = ?', [id]);
    return rows;
}

async function setEmailVerified(id) {
    await mysql.pool.execute('UPDATE users SET email_verified = 1 WHERE id = ?', [id]);
}

async function updatePasswordHash(id, passwordHash) {
    await mysql.pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function addPendingBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET pending_balance = pending_balance + ? WHERE id = ?', [value, id]);
}

async function subtractPendingBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET pending_balance = pending_balance - ? WHERE id = ?', [value, id]);
}

async function addAvailableBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET available_balance = available_balance + ? WHERE id = ?', [value, id]);
}

async function subtractAvailableBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET available_balance = available_balance - ? WHERE id = ?', [value, id]);
}

async function addTotalBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET total_balance = total_balance + ? WHERE id = ?', [value, id]);
}

async function getCycle(id) {
    const [rows, fields] = await mysql.pool.execute('SELECT cycle FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function addCycle(id, value) {
    await mysql.pool.execute('UPDATE users SET cycle = cycle + ? WHERE id = ?', [value, id]);
}

async function setCycle(id, value) {
    await mysql.pool.execute('UPDATE users SET cycle = ? WHERE id = ?', [value, id]);
}

module.exports = {
    emailExists,
    cpfExists,
    create,
    getById,
    getByEmail,
    getByInviteCode,
    getSponsorUnilevel,
    getAllDirectsById,
    setEmailVerified,
    updatePasswordHash,
    addPendingBalance,
    subtractPendingBalance,
    addAvailableBalance,
    subtractAvailableBalance,
    addTotalBalance,
    getCycle,
    addCycle,
    setCycle
}