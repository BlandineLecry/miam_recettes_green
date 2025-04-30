<template>
  <div class="admin-container">
    <!-- Barre de navigation -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">MIAM</div>
        <button class="hamburger" @click="menuOpen = !menuOpen">☰</button>
        <ul :class="{ open: menuOpen }">
          <li><a href="#" @click.prevent="logout">Déconnexion</a></li>
        </ul>
      </div>
    </nav>

    <div class="recette-container">
      <h1 class="text-3xl font-bold mb-6">Toutes les Recettes</h1>

      <!-- Barre de recherche -->
<input
  v-model="search"
  @input="onSearch"
  placeholder="Rechercher une recette..."
  class="search-input"
/>

      <button @click="toggleForm" class="btn-toggle">
        {{ isEditing ? 'Annuler' : 'Ajouter une recette' }}
      </button>

      <!-- Formulaire -->
      <div v-if="showForm" class="form-container">
        <input v-model="form.title" type="text" placeholder="Titre" />
        <input v-model="form.ingredients" type="text" placeholder="Ingrédients (séparés par virgules)" />
        <input v-model="form.image_name" type="text" placeholder="Nom de l’image" />
        <textarea v-model="form.instructions" placeholder="Instructions complètes"></textarea>
        <button @click="submitRecette" class="btn-blue">
          {{ isEditing ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>

      <!-- Liste des recettes -->
      <div v-if="recettes.length > 0">
        <div v-for="recette in recettes" :key="recette.id" class="recette-card">
          <img :src="`/img/${recette.image_name}`" :alt="recette.title" loading="lazy" />
          <div class="recette-content">
            <h2>{{ recette.title }}</h2>
            <p>{{ recette.cleaned_ingredients }}</p>
          </div>
          <div class="recette-actions">
            <button @click="editRecette(recette)" class="btn-yellow">Modifier</button>
            <button @click="deleteRecette(recette.id)" class="btn-red">Supprimer</button>
          </div>
        </div>
      </div>

      <p v-else class="empty-message">Aucune recette pour le moment.</p>

          <!-- Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="page <= 1">‹ Précédent</button>
          <span>Page {{ page }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="page >= totalPages">Suivant ›</button>
        </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recettes: [],
      showForm: false,
      isEditing: false,
      editingId: null,
      form: {
        title: "",
        ingredients: "",
        image_name: "",
        instructions: "",
      },
      menuOpen: false,

      // Ajouts pour recherche/pagination/modal
      search: "",
      searchTimeout: null,
      page: 1,
      limit: 12,
      total: 0,
      selectedRecipe: null,
    };
  },
  computed: {
    totalPages() {
      const t = Number(this.total) || 0;
      return t > 0 ? Math.ceil(t / this.limit) : 1;
    },
  },
  created() {
    this.loadRecettes();
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },

    async loadRecettes() {
      try {
        const res = await axios.get("http://localhost:3000/reci/all", {
          params: {
            search: this.search,
            page: this.page,
            limit: this.limit,
          },
        });
        this.recettes = res.data.recipes;
        this.total = res.data.total;
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
        title: "",
        ingredients: "",
        image_name: "",
        instructions: "",
      };
      this.isEditing = false;
      this.editingId = null;
    },

    async submitRecette() {
      const recettePayload = {
        ...this.form,
        cleaned_ingredients: this.form.ingredients
          .split(",")
          .map((ingredient) => ingredient.trim())
          .join(", "),
      };

      try {
        if (this.isEditing) {
          await fetch(`http://localhost:3000/reci/${this.editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recettePayload),
          });
        } else {
          await fetch("http://localhost:3000/reci", {
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
        title: recette.title,
        ingredients: recette.ingredients,
        image_name: recette.image_name,
        instructions: recette.instructions,
      };
      this.editingId = recette.id;
      this.isEditing = true;
      this.showForm = true;
    },

    async deleteRecette(id) {
      try {
        await fetch(`http://localhost:3000/reci/${id}`, {
          method: "DELETE",
        });
        this.loadRecettes();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    },

    // Recherche
    onSearch() {
      this.page = 1;
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadRecettes();
      }, 300);
    },

    // Pagination
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.loadRecettes();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.loadRecettes();
      }
    },

    // Modal
    openModal(recipe) {
      this.selectedRecipe = recipe;
    },
    closeModal() {
      this.selectedRecipe = null;
    },
  },
};
</script>

<style scoped>
/* ===== NAVBAR ===== */
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

/* ===== GLOBAL ===== */
body, .page {
  background-color: #f3f4f6;
  font-family: Arial, sans-serif;
  color: #1f2937;
  text-align: center;
  padding: 20px;
  margin-top: 30px;
}

/* ===== CONTAINERS ===== */
.admin-container .recette-container {
  width: 800px;
  margin: 0 auto;
  text-align: center;
}

.admin-container .form-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

/* ===== FORM FIELDS ===== */
.admin-container input,
.admin-container textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.2s ease;
}

.admin-container input:focus,
.admin-container textarea:focus {
  outline: none;
  border-color: #60a5fa;
}

/* ===== BUTTONS ===== */
.admin-container button {
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.admin-container .btn-toggle {
  background-color: #16a34a;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  margin-bottom: 20px;
}

.admin-container .btn-toggle:hover {
  background-color: #15803d;
}

.admin-container .btn-blue {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  margin-top: 10px;
}

.admin-container .btn-blue:hover {
  background-color: #1d4ed8;
}

.admin-container .btn-yellow {
  background-color: #facc15;
  color: #111827;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
}

.admin-container .btn-yellow:hover {
  background-color: #eab308;
}

.admin-container .btn-red {
  background-color: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
}

.admin-container .btn-red:hover {
  background-color: #b91c1c;
}

/* ===== LISTES DE RECETTES ===== */
.admin-container .recette-card {
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

.admin-container .recette-card:hover {
  transform: scale(1.01);
}

.admin-container .recette-card img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.admin-container .recette-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.admin-container .recette-content p {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  font-style: italic;
}

.admin-container .recette-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ===== EMPTY STATE ===== */
.admin-container .empty-message {
  font-size: 16px;
  color: #6b7280;
  margin-top: 40px;
}

/* ===== SEARCH BAR ===== */
.admin-container .search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  margin: 30px auto 20px;
  display: block;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.admin-container .search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

/* ===== PAGINATION ===== */
.admin-container .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.admin-container .pagination button {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.admin-container .pagination button:hover:not(:disabled) {
  background-color: #2563eb;
}

.admin-container .pagination button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.admin-container .pagination span {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}
</style>
