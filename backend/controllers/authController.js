const bcrypt = require("bcrypt");
const db = require("../db");

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Utilisateur non trouvé" });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    // Pour l'instant simple : on retourne l'ID (pas de token encore)
    res.json({
      message: "Connexion réussie",
      userId: user.id,
      role: user.role, // ✅ très important pour rediriger correctement
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
