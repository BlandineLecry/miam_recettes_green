const db = require("../db");

exports.getAllRecipes = async (req, res) => {
  // page, limit et terme de recherche en query params
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const search = req.query.search ? `%${req.query.search.trim()}%` : "%%";
  const offset = (page - 1) * limit;

  try {
    // 1) total de recettes correspondant au filtre
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM recettes WHERE title LIKE ?",
      [search]
    );

    // 2) récupère la page courante
    const [recipes] = await db.query(
      `SELECT * FROM recettes
         WHERE title LIKE ?
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
      [search, limit, offset]
    );

    res.json({ recipes, total });
  } catch (err) {
    console.error("getAllRecipes error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Ajouter une recette
exports.addRecipe = async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    image_name,
    cleaned_ingredients,
    userId,
  } = req.body;
  try {
    await db.query(
      "INSERT INTO recettes (title, ingredients, instructions, image_name, cleaned_ingredients, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title,
        ingredients,
        instructions,
        image_name,
        cleaned_ingredients,
        userId,
      ]
    );
    res.status(201).json({ message: "Recette ajoutée !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une recette
exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    ingredients,
    instructions,
    image_name,
    cleaned_ingredients,
    userId,
  } = req.body;
  try {
    const [recettes] = await db.query(
      "SELECT * FROM recettes WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (recettes.length === 0) {
      return res.status(403).json({ error: "Pas autorisé" });
    }

    await db.query(
      "UPDATE recettes SET title = ?, ingredients = ?, instructions = ?, image_name = ?, cleaned_ingredients = ? WHERE id = ?",
      [title, ingredients, instructions, image_name, cleaned_ingredients, id]
    );
    res.json({ message: "Recette mise à jour !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les recettes de l'utilisateur connecté
exports.getUserRecipes = async (req, res) => {
  const { userId } = req.body;
  try {
    const [recettes] = await db.query(
      "SELECT * FROM recettes WHERE user_id = ?",
      [userId]
    );
    res.json(recettes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
