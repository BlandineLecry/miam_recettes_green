const db = require("../db");


exports.getAllRecipes = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const search = req.query.search ? `%${req.query.search.trim()}%` : "%%";
  const offset = (page - 1) * limit;

  try {
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM recipes WHERE title LIKE ?",
      [search]
    );

    const [recipes] = await db.query(
      `SELECT * FROM recipes
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




