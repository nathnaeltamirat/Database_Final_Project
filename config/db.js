// db.js
const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool({
  host: config.env.mysql.host,
  user: config.env.mysql.user,
  password: config.env.mysql.password,
  database: config.env.mysql.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
