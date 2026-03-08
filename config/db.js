const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME
            });
        }
        return Database.instance;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;