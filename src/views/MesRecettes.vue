<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">MIAM</div>
      <button class="hamburger" @click="menuOpen = !menuOpen">
        ☰
      </button>
      <ul :class="{ open: menuOpen }">
        <li><router-link to="/mes-recettes">Mes Recettes</router-link></li>
        <li><router-link to="/recettes">Toutes les Recettes</router-link></li>
        <li><a href="#" @click.prevent="logout">Déconnexion</a></li>
      </ul>
    </div>
  </nav>

  <div class="recette-container">
    <h1 class="text-3xl font-bold mb-6">Mes Recettes</h1>

    <button @click="toggleForm" class="btn-toggle">
      {{ isEditing ? 'Annuler' : 'Ajouter une recette' }}
    </button>

    <!-- Formulaire -->
    <div v-if="showForm" class="form-container">
      <input v-model="form.titre" type="text" placeholder="Titre" />
      <input v-model="form.resume" type="text" placeholder="Résumé" />
      <input v-model="form.image" type="text" placeholder="Nom de l’image" />
      <textarea v-model="form.description" placeholder="Description complète"></textarea>
      <button @click="submitRecette" class="btn-blue">
        {{ isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
    </div>

    <!-- Liste des recettes -->
    <div v-if="mesRecettes.length > 0">
      <div v-for="recette in mesRecettes" :key="recette.id" class="recette-card">
        <img :src="`/img/${recette.image_name}`" :alt="recette.titre" loading="lazy" />
        <div class="recette-content">
          <h2>{{ recette.title }}</h2>
          <p>{{ recette.resume }}</p>
        </div>
        <div class="recette-actions">
          <button @click="editRecette(recette)" class="btn-yellow">Modifier</button>
          <button @click="deleteRecette(recette.id)" class="btn-red">Supprimer</button>
        </div>
      </div>
    </div>

    <p v-else class="empty-message">Aucune recette pour le moment.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recettes: [], // Liste des recettes
      userId: localStorage.getItem("userId"),
      showForm: false,
      isEditing: false,
      editingId: null,
      form: {
        titre: "",
        resume: "",
        image: "",
        description: "",
      },
      role: localStorage.getItem("role"),
      menuOpen: false,
    };
  },
  created() {
    this.loadRecettes();
  },
  computed: {
    // Calculer les recettes de l'utilisateur connecté (mesRecettes)
    mesRecettes() {
      return this.recettes.filter((recette) => recette.user_id === parseInt(this.userId));
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },

    async loadRecettes() {
      try {
        const response = await fetch(`http://localhost:3000/recipes/${this.userId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          this.recettes = data;
        } else {
          console.error("Les données reçues ne sont pas un tableau : ", data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des recettes :", error);
      }
    },

    toggleForm() {
      this.showForm = !this.showForm;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        titre: "",
        resume: "",
        image: "",
        description: "",
      };
      this.isEditing = false;
      this.editingId = null;
    },

    async submitRecette() {
      const recettePayload = {
        title: this.form.titre,
        ingredients: this.form.resume,
        instructions: this.form.description,
        image_name: this.form.image,
        user_id: this.userId,
      };

      try {
        if (this.isEditing) {
          await fetch(`http://localhost:3000/recipes/${this.editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recettePayload),
          });
        } else {
          await fetch("http://localhost:3000/recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recettePayload),
          });
        }

        this.loadRecettes();
        this.resetForm();
        this.showForm = false;
      } catch (error) {
        console.error("Erreur lors de l'envoi de la recette :", error);
      }
    },

    editRecette(recette) {
      this.form = {
        titre: recette.title,
        resume: recette.ingredients,
        image: recette.image_name,
        description: recette.instructions,
      };
      this.editingId = recette.id;
      this.isEditing = true;
      this.showForm = true;
    },

    async deleteRecette(id) {
      try {
        await fetch(`http://localhost:3000/recipes/${id}`, {
          method: "DELETE",
        });
        this.loadRecettes();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    },
  },
};
</script>



<style scoped>
.navbar {
  background-color: #333;
  color: white;
  padding: 1rem;
}

.navbar-container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.hamburger {
  display: none;
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

ul li a {
  color: white;
  text-decoration: none;
}

ul li a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  ul {
    display: none;
    flex-direction: column;
    background-color: #444;
    position: absolute;
    top: 70px;
    right: 0;
    width: 200px;
    padding: 1rem;
  }

  ul.open {
    display: flex;
  }
}
/* ========= GLOBAL ========= */
body, .page {
  background-color: #f3f4f6;
  font-family: Arial, sans-serif;
  color: #1f2937;
  text-align: center;
  padding: 20px;
  margin-top: 30px;
}

/* ========= CONTAINERS ========= */
.recette-container {
  width: 800px;
  margin: 0 auto;
  text-align: center;
}

.form-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

/* ========= FORM FIELDS ========= */
input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #60a5fa;
}

/* ========= BUTTONS ========= */
button {
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-toggle {
  background-color: #16a34a;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  margin-bottom: 20px;
}

.btn-toggle:hover {
  background-color: #15803d;
}

.btn-blue {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  margin-top: 10px;
}

.btn-blue:hover {
  background-color: #1d4ed8;
}

.btn-yellow {
  background-color: #facc15;
  color: #111827;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
}

.btn-yellow:hover {
  background-color: #eab308;
}

.btn-red {
  background-color: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
}

.btn-red:hover {
  background-color: #b91c1c;
}

/* ========= LISTES DE RECETTES ========= */
.recette-card {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 20px;
  align-items: center;
  background-color: white;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  text-align: left;
}

.recette-card:hover {
  transform: scale(1.01);
}

.recette-card img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.recette-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.recette-content p {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  font-style: italic;
}

.recette-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ========= EMPTY STATE ========= */
.empty-message {
  font-size: 16px;
  color: #6b7280;
  margin-top: 40px;
}
</style>
