const mysql = require('../database/mysql');

async function getByLevel(userId, level) {
    const [rows, fields] = await mysql.pool.execute(`
    WITH RECURSIVE multilevel AS (
		SELECT id, sponsor_id, 0 level FROM users WHERE id = ?
    UNION
		SELECT u.id, u.sponsor_id, m.level + 1 FROM users u
        INNER JOIN multilevel m ON u.sponsor_id = m.id
    )
    
    SELECT u.id, u.first_name, u.last_name, u.country, level FROM multilevel m
    INNER JOIN users u ON u.id = m.id
    WHERE u.id <> ? AND m.level = ?`, [userId, userId, level]);

    return rows;
}

module.exports = {
    getByLevel
}