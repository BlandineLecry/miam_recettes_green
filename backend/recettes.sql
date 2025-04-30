CREATE DATABASE recettes;
use recettes;

CREATE TABLE IF NOT EXISTS recettes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     ingredients TEXT,
     instructions TEXT,
     image_name VARCHAR(255),
     cleaned_ingredients TEXT
 );

select * from users;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);



LOAD DATA LOCAL INFILE '/chemin/vers/ton/fichier.csv'
INTO TABLE recettes
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(title, ingredients, instructions, image_name, cleaned_ingredients);

INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$XkcItJyukDsweSAjqCs0r.V8z0sOMEEjdgkFR4s8kwK3BIY30D/Fu', 'admin');

ALTER TABLE recettes ADD COLUMN user_id INT;

ALTER TABLE recettes
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;


CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_name VARCHAR(255),
  cleaned_ingredients TEXT
);

select * from recipes;




INSERT INTO recettes (title, ingredients, instructions, image_name, cleaned_ingredients, user_id) 
VALUES ('Tiramisu', 'Mascarpone, café, sucre, œufs', 'Mélanger, assembler, réfrigérer', 'tiramisu.jpg', 'Mascarpone, café, sucre, œufs', 1);

