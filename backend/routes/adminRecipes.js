const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion DB
const recipeController = require("../controllers/recipesController");

router.get("/all", recipeController.getAllRecipes);


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

// POST ajouter une recette (admin)
router.post("/", async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    image_name,
    cleaned_ingredients,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO recipes (title, ingredients, instructions, image_name, cleaned_ingredients) VALUES (?, ?, ?, ?, ?)",
      [title, ingredients, instructions, image_name, cleaned_ingredients]
    );
    res.status(201).json({ id: result.insertId, message: "Recette ajoutée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT modifier une recette
router.put("/:id", async (req, res) => {
  const { title, ingredients, instructions, image_name, cleaned_ingredients } = req.body;
  const recetteId = req.params.id;

  try {
    await db.query(
      "UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, image_name = ?, cleaned_ingredients = ? WHERE id = ?",
      [title, ingredients, instructions, image_name, cleaned_ingredients, recetteId]
    );
    res.json({ message: "Recette mise à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE supprimer une recette
router.delete("/:id", async (req, res) => {
  const recetteId = req.params.id;

  try {
    await db.query("DELETE FROM recipes WHERE id = ?", [recetteId]);
    res.json({ message: "Recette supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
