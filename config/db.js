const path = require('path')

const database = require("better-sqlite3")

const dbPath = path.join(__dirname, "..", "ECOM.db");
const db = new database(dbPath);

module.exports = db;    

