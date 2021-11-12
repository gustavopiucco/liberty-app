const jwt = require('jsonwebtoken');

function generateAccessToken(id, email, role) {
    const payload = {
        id,
        email,
        role
    }

    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "30d" });
}

module.exports = {
    generateAccessToken
}