const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool({
  host: config.env.mysql.host,
  port: config.env.mysql.port,
  user: config.env.mysql.user,
  password: config.env.mysql.password,
  database: config.env.mysql.database,
});
console.log("DB Password:", config.env.mysql.password);
console.log("Database:", config.env.mysql.database);

module.exports = pool;