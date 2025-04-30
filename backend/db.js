const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Non*ho*i*capelli*biondi*04",
  database: "recettes",
});

module.exports = db;
