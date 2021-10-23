require('dotenv/config');
const mysql = require('./src/database/mysql');
const userModel = require('./src/models/user.model');
const multilevelModel = require('./src/models/multilevel.model');
const userService = require('./src/services/user.service');
const multilevelService = require('./src/services/multilevel.service');

mysql.testConnection().then(() => {
    console.info('Connected to MySQL');
});

async function test() {

}

test();