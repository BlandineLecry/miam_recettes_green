const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Non*ho*i*capelli*biondi*04",
  database: "recettes",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Route GET /recettes (corrigée avec async/await)
app.get("/recettes", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM recettes LIMIT 50");
    res.json(results);
  } catch (err) {
    console.error("Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Route GET /recettes (corrigée avec async/await)
app.get("/reci", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM recipes LIMIT 50");
    res.json(results);
  } catch (err) {
    console.error("Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Routes d’authentification
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

// Routes recettes
const recipeRoutes = require("./routes/recipeRoutes");
app.use("/recipes", recipeRoutes);

// Routes recettes
const adminRecipes = require("./routes/adminRecipes");
app.use("/reci", adminRecipes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur API lancé sur http://localhost:${PORT}`);
});


