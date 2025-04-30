// recipes.js
const express = require("express");
const pool = require("./db");
const verifyToken = require("./authmiddleware");

const router = express.Router();

// Récupérer les recettes avec option de recherche
router.get("/", (req, res) => {
  let query = "SELECT * FROM recipes";
  const params = [];
  if (req.query.search) {
    query += " WHERE title LIKE ?";
    params.push(`%${req.query.search}%`);
  }
  pool.query(query, params, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Erreur lors de la récupération" });
    res.json(results);
  });
});

module.exports = router;