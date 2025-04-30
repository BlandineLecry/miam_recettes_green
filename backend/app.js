const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipese", adminRecipes);

print("Backend JS lancé !");
const PORT = 5173;
app.listen(PORT, () =>
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
);
