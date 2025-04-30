<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">MIAM</div>
      <button class="hamburger" @click="menuOpen = !menuOpen">☰</button>
      <ul :class="{ open: menuOpen }">
        <li><router-link to="/mes-recettes">Mes Recettes</router-link></li>
        <li><router-link to="/recettes">Toutes les Recettes</router-link></li>
        <li><a href="#" @click.prevent="logout">Déconnexion</a></li>
      </ul>
    </div>
  </nav>

  <div>
    <!-- barre de recherche -->
    <input
      v-model="search"
      @input="onSearch"
      placeholder="Rechercher une recette…"
      class="search-input"
    />

    <!-- liste des recettes -->
    <div class="grid">
      <div v-for="r in recipes" :key="r.id" class="card">
        <img :src="`/uploads/${r.image_name}`" alt="" />
        <h3 class="clickable" @click="openModal(r)">{{ r.title }}</h3>
      </div>
    </div>

    <!-- pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="page <= 1">‹ Précédent</button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page >= totalPages">Suivant ›</button>
    </div>

    <!-- MODAL POP-UP -->
    <div v-if="selectedRecipe" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ selectedRecipe.title }}</h2>
        <section>
          <h3>Ingrédients</h3>
          <p>{{ selectedRecipe.ingredients }}</p>
        </section>
        <section>
          <h3>Instructions</h3>
          <p>{{ selectedRecipe.instructions }}</p>
        </section>
        <button class="close-button" @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      recipes: [],
      total: 0,
      page: 1,
      limit: 30, // change ici si tu veux 50 par page
      search: "",
      searchTimeout: null,
      menuOpen: false,
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
    this.fetchRecipes();
  },
  methods: {
    async fetchRecipes() {
      try {
        const res = await axios.get("http://localhost:3000/reci/all", {
          params: {
            search: this.search,
            page: this.page,
            limit: this.limit,
          },
        });
        this.recipes = res.data.recipes;
        this.total = res.data.total;
      } catch (err) {
        console.error("fetchRecipes error:", err.response || err);
      }
    },
    onSearch() {
      this.page = 1;
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchRecipes();
      }, 300);
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchRecipes();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchRecipes();
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },
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
/* ========= NAVBAR ========= */
.navbar {
  background-color: #111827;
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
    background-color: #1f2937;
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

/* ========= GRILLE DE RECETTES ========= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin: 40px auto;
  max-width: 1000px;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;
  padding-bottom: 10px;
}

.card:hover {
  transform: scale(1.02);
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #f3f4f6;
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  padding: 10px 16px;
  color: #1f2937;
  text-align: left;
}

.clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable:hover {
  color: #2563eb;
}

/* ========= MODAL ========= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 41, 55, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;        
  overflow-y: auto;        
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  text-align: left;
  animation: fadeIn 0.2s ease;
}


.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.modal-content section {
  margin-bottom: 20px;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.modal-content p {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
}

.close-button {
  background-color: #ef4444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #dc2626;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
/* ========= BARRE DE RECHERCHE ========= */
.search-input {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

/* ========= PAGINATION ========= */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 40px auto;
  flex-wrap: wrap;
}

.pagination button {
  background-color: #2563eb;
  color: white;
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.pagination button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

</style>