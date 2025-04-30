<template>
  <section class="header">
    <div class="text-box">
      <h1>MIAM RECETTES</h1>
      <p>Blandine, Zainab, Yrvane, Ilyesse, Sidy</p>
      <button @click="showLoginPopup = true" class="hero-btn">Connexion</button>
      <button @click="showSignUpPopup = true" class="hero-btn">
        S'inscrire
      </button>
      <br><br>
<button @click="$router.push({ name: 'benefice-ecologique' })" class="hero-btn">Découvrir les bénéfices écologiques</button>
    </div>

    <!-- Login Popup -->
    <div v-if="showLoginPopup" class="Pupop">
      <div class="pupop-container">
        <span @click="showLoginPopup = false" class="close">&times;</span>
        <form @submit.prevent="validation">
          <label for="username">Pseudo</label>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            v-model="loginUsername"
            required
          />

          <label for="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            v-model="loginPassword"
            required
          />

          <button id="submit" type="submit">Connexion</button>
          <button type="button" @click="showLoginPopup = false" id="close">
            Fermer
          </button>
        </form>
        <p v-if="loginError" style="color: red">Identifiants invalides.</p>
      </div>
    </div>

    <!-- Sign Up Popup -->
    <div v-if="showSignUpPopup" class="Pupop">
      <div class="pupop-container">
        <span @click="showSignUpPopup = false" class="close">&times;</span>
        <form @submit.prevent="validateSignUp">
          <label for="username">Pseudo</label>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            v-model="signupUsername"
            required
          />

          <label for="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            v-model="signupPassword"
            required
          />

          <button id="submit" type="submit">S'inscrire</button>
          <button type="button" @click="showSignUpPopup = false" id="close">
            Fermer
          </button>
        </form>
        <p v-if="signupError" style="color: red">Inscription échouée.</p>
        <p v-if="signupSuccess" style="color: green">Inscription réussie !</p>
      </div>
    </div>
  </section>

  <footer>
    <p>©2024 - Tous droits réservés.</p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      loginUsername: "",
      loginPassword: "",
      signupUsername: "",
      signupPassword: "",
      loginError: false,
      signupError: false,
      signupSuccess: false,
      showLoginPopup: false,
      showSignUpPopup: false,
    };
  },
  methods: {
    async validation() {
      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.loginUsername,
            password: this.loginPassword,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          this.loginError = false;
          this.showLoginPopup = false;

          // Stockage dans localStorage de l'ID, du nom d'utilisateur et du rôle
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", this.loginUsername);
          localStorage.setItem("role", data.role); // Ajout du rôle

          // Redirection en fonction du rôle
          if (data.role === "admin") {
            this.$router.push({ name: "AdminPage" });
          } else {
            this.$router.push({ name: "MesRecettes" });
          }
        } else {
          this.loginError = true;
        }

        console.log("Données reçues du serveur : ", data);
      } catch (e) {
        this.loginError = true;
        console.error("Erreur login :", e);
      }
    },

    async validateSignUp() {
      try {
        const res = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.signupUsername,
            password: this.signupPassword,
            role: "user"
          }),
        });

        if (res.ok) {
          this.signupSuccess = true;
          this.signupError = false;
          this.signupUsername = "";
          this.signupPassword = "";
          this.showSignUpPopup = false;
        } else {
          this.signupError = true;
        }
      } catch (e) {
        this.signupError = true;
        console.error("Erreur signup :", e);
      }
    },
  },
};
</script>


<style scoped>
/* Fond global */
.header {
  min-height: 100vh;
  width: 100%;
  background-image: linear-gradient(rgba(4, 9, 30, 0.7), rgba(4, 9, 30, 0.7)),
    url(../img/fond.jpeg);
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
}

/* Titre + bouton au centre */
.text-box {
  width: 90%;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.text-box h1 {
  font-size: 62px;
  margin-bottom: 10px;
}

.text-box p {
  font-size: 24px;
  margin-bottom: 30px;
}

/* Boutons d'action */
.hero-btn {
  display: inline-block;
  color: white;
  border: 2px solid white;
  padding: 10px 30px;
  font-size: 18px;
  background: transparent;
  border-radius: 50px;
  margin: 10px;
  transition: 0.3s ease;
}

.hero-btn:hover {
  background-color: #333399;
  border-color: #333399;
}

/* Popup fond */
.Pupop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

/* Contenu du popup */
.pupop-container {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 12px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Bouton de fermeture */
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

/* Formulaires */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 16px;
  text-align: left;
}

input {
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
}

#submit {
  padding: 12px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

#submit:hover {
  background-color: #333399;
}

#close {
  background-color: gray;
  padding: 12px;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

#close:hover {
  background-color: #999;
}

/* Footer simple */
footer {
  text-align: center;
  padding: 20px;
  color: white;
  font-size: 14px;
}
</style>
