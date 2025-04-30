import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Recettes from '../views/Recettes.vue'
import MesRecettes from '../views/MesRecettes.vue'
import AdminPage from '../views/AdminPage.vue'
import BeneficeEcologique from '@/views/BeneficeEcologique.vue' 

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/login', name: 'LoginRedirect', component: Login },
  { path: '/recettes', name: 'Recettes', component: Recettes },
  { path: '/mes-recettes', name: 'MesRecettes', component: MesRecettes },
  { path: '/admin', name: 'AdminPage', component: AdminPage },
  { path: '/benefice-ecologique', name: 'benefice-ecologique', component: BeneficeEcologique }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  console.log("Récupération du rôle:", role); // Vérifie le rôle dans localStorage

  if (to.name === "AdminPage" && role !== "admin") {
    alert("Accès refusé. Réservé à l'admin.");
    next({ name: "Login" });
  } else {
    next();
  }
});




export default router
