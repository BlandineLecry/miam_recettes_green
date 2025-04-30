const express = require("express");
const router = express.Router();
const db = require("../db"); // ton pool mysql2
const recipeController = require("../controllers/recipesController");

router.get("/all", recipeController.getAllRecipes);

// Ajouter une recette
router.post("/", async (req, res) => {
  const { title, ingredients, instructions, image_name, user_id } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO recettes (title, ingredients, instructions, image_name, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, ingredients, instructions, image_name, user_id]
    );
    res.status(201).json({ id: result.insertId, message: "Recette ajoutée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const [recettes] = await db.query(
        "SELECT * FROM recettes WHERE user_id = ?",
        [userId]
      );
      res.json(recettes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  router.put("/:id", async (req, res) => {
    const { title, ingredients, instructions, image_name } = req.body;
    const recetteId = req.params.id;
  
    try {
      await db.query(
        "UPDATE recettes SET title = ?, ingredients = ?, instructions = ?, image_name = ? WHERE id = ?",
        [title, ingredients, instructions, image_name, recetteId]
      );
      res.json({ message: "Recette mise à jour" });
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  router.delete("/:id", async (req, res) => {
    const recetteId = req.params.id;
  
    try {
      await db.query("DELETE FROM recettes WHERE id = ?", [recetteId]);
      res.json({ message: "Recette supprimée" });
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
  
  module.exports = router;