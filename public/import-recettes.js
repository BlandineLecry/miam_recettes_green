const fs = require('fs');
const mysql = require('mysql2');

// Crée une connexion MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Non*ho*i*capelli*biondi*04',
  database: 'recettes'
});

// Lire le fichier JSON
const recettes = JSON.parse(fs.readFileSync('./recettes.json', 'utf8'));

// Pour chaque recette, insérer dans la base
recettes.forEach((recette) => {
  const sql = `INSERT INTO recipes (title, ingredients, instructions, image_name, cleaned_ingredients)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [
    recette.title,
    recette.ingredients,
    recette.instructions,
    recette.image_name,
    recette.cleaned_ingredients || null
  ];

  connection.query(sql, values, (err) => {
    if (err) console.error('Erreur d\'insertion :', err);
    else console.log(`✅ Recette ajoutée : ${recette.title}`);
  });
});

// Fermer la connexion après un court délai
setTimeout(() => {
  connection.end();
}, 1000);
