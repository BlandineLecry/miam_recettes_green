const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // add mdp
  database: "recettes",
});

module.exports = db;
