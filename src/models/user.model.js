const mysql = require('../database/mysql');
const { sqlBuilder } = require('../utils/sql');

async function emailExists(email) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);

    return rows.length > 0;
}

async function cpfExists(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT 1 FROM users WHERE cpf = ?', [cpf]);

    return rows.length > 0;
}

async function create(sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, createdAt) {
    const [rows, fields] = await mysql.pool.execute('INSERT INTO users (sponsor_id, invite_code, email, password_hash, first_name, last_name, cpf, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [sponsorId, inviteCode, email, passwordHash, firstName, lastName, cpf, createdAt]);

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

async function getByCpf(cpf) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE cpf = ?', [cpf]);

    return rows[0];
}

async function getByFirstName(firstName) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE first_name = ?', [firstName]);

    return rows[0];
}

async function getByLastName(lastName) {
    const [rows, fields] = await mysql.pool.execute('SELECT * FROM users WHERE last_name = ?', [lastName]);

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
    const [rows, fields] = await mysql.pool.execute('SELECT id, first_name, last_name FROM users WHERE sponsor_id = ?', [id]);
    return rows;
}

async function getAllWithActiveOrCompletedContract() {
    const [rows, fields] = await mysql.pool.execute(`
    SELECT users.id
    FROM users
    JOIN contracts ON contracts.user_id = users.id
    WHERE contracts.status = 'approved'
    OR contracts.status = 'completed'`);

    return rows;
}

async function getMultilevelByLevel(userId, level) {
    const [rows, fields] = await mysql.pool.execute(`
    WITH RECURSIVE multilevel AS (
    SELECT id, sponsor_id, 0 level FROM users WHERE id = ?
    UNION
    SELECT u.id, u.sponsor_id, m.level + 1 FROM users u
        INNER JOIN multilevel m ON u.sponsor_id = m.id
    )
    
    SELECT u.id, u.first_name, u.last_name, u.phone, u.career_plan, u.country, level FROM multilevel m
    INNER JOIN users u ON u.id = m.id
    WHERE u.id <> ? AND m.level = ?`, [userId, userId, level]);

    return rows;
}

async function getTotalBalances() {
    const [rows, fields] = await mysql.pool.execute('SELECT SUM(available_balance) AS available_balance, SUM(pending_balance) AS pending_balance, SUM(total_balance_received) AS total_balance_received FROM users');

    return rows;
}

async function setEmailVerified(id) {
    await mysql.pool.execute('UPDATE users SET email_verified = 1 WHERE id = ?', [id]);
}

async function setKycVerified(id) {
    await mysql.pool.execute('UPDATE users SET kyc_verified = 1 WHERE id = ?', [id]);
}

async function updatePasswordHash(id, passwordHash) {
    await mysql.pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function updateCareerPlan(id, careerPlan, careerPlanTotal) {
    await mysql.pool.execute('UPDATE users SET career_plan = ?, career_plan_total = ? WHERE id = ?', [careerPlan, careerPlanTotal, id]);
}

async function update(id, fields) {
    const builder = sqlBuilder('users', fields, 'id', id);

    await mysql.pool.execute(builder.sql, builder.values);
}

async function addPendingBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET pending_balance = pending_balance + ?, total_balance_received = total_balance_received + ? WHERE id = ?', [value, value, id]);
}

async function subtractPendingBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET pending_balance = pending_balance - ? WHERE id = ?', [value, id]);
}

async function addAvailableBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET available_balance = available_balance + ?, total_balance_received = total_balance_received + ? WHERE id = ?', [value, value, id]);
}

async function subtractAvailableBalance(id, value) {
    await mysql.pool.execute('UPDATE users SET available_balance = available_balance - ? WHERE id = ?', [value, id]);
}

module.exports = {
    emailExists,
    cpfExists,
    create,
    getById,
    getByEmail,
    getByCpf,
    getByFirstName,
    getByLastName,
    getByInviteCode,
    getSponsorUnilevel,
    getAllDirectsById,
    getAllWithActiveOrCompletedContract,
    getMultilevelByLevel,
    getTotalBalances,
    setEmailVerified,
    setKycVerified,
    updatePasswordHash,
    updateCareerPlan,
    update,
    addPendingBalance,
    subtractPendingBalance,
    addAvailableBalance,
    subtractAvailableBalance
}