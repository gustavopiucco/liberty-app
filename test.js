require('dotenv/config');
const mysql = require('./src/database/mysql');
const userModel = require('./src/models/user.model');
const userService = require('./src/services/user.service');

mysql.testConnection().then(() => {
    console.info('Connected to MySQL');
});

async function test() {
    const directs = await userService.getAllDirectsById(1);

    console.log(directs)
}

test();