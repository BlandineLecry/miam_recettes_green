<template>
    <section class="ecologie-section">
      <div class="container">
        <h1>Notre Engagement Écologique</h1>
  
        <p>
          Chez <strong>MIAM RECETTES</strong>, nous nous engageons à réduire l'impact environnemental de notre plateforme à travers des choix techniques responsables.
        </p>
  
        <h2>Optimisations techniques au service de l'écologie</h2>
  
        <p>
          Notre site a été conçu pour limiter son impact environnemental grâce à plusieurs optimisations concrètes :
        </p>
  
        <ul>
          <li>
            <strong>Compression des fichiers</strong> : Nous utilisons des formats d’image comme WebP et optimisons nos fichiers CSS/JavaScript afin de réduire de plus de 40 % le volume de données échangées. Moins de données signifie moins d’énergie consommée par les serveurs et les terminaux.
            <br>
            Selon l’ADEME (2022), économiser 1 Mo de données permet d’éviter environ 5 g de CO₂ par millier de visites.
          </li>
  
          <li>
            <strong>Technologies sobres</strong> : Nous utilisons des frameworks légers et performants, ce qui diminue les temps de chargement jusqu’à 30 %. Des langages comme Rust ou Go permettent également de réduire la consommation énergétique des serveurs.
          </li>
  
          <li>
            <strong>Simplicité graphique</strong> : En évitant les animations complexes et les effets lourds, nous réduisons la consommation d’énergie liée à l’affichage de 20 à 30 %, notamment sur les appareils mobiles.
          </li>
        </ul>
  
        <h2>Impact global</h2>
  
        <p>
          Une page web éco-conçue consomme en moyenne quatre fois moins d’énergie qu’une page standard (source : The Shift Project, 2019).
          <br>
          Le secteur numérique représente aujourd’hui 4 % des émissions mondiales de gaz à effet de serre, un chiffre qui pourrait doubler d’ici 2025 sans transition.
        </p>
  
        <h2>Nos objectifs futurs</h2>
  
        <ul>
          <li>Poursuivre la réduction de notre empreinte numérique</li>
          <li>Renforcer nos pratiques écoresponsables</li>
        </ul>
  
        <p class="conclusion">
          Ensemble, faisons de la sobriété numérique une priorité.
        </p>
  
        <router-link to="/login">
          <button class="btn-retour">Retour à la connexion</button>
        </router-link>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'BeneficeEcologique'
  }
  </script>
  
  <style scoped>
  .ecologie-section {
    padding: 40px;
    background-color: #f5f7fa;
    min-height: 100vh;
  }
  
  .container {
    max-width: 900px;
    margin: auto;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #2c7a7b;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-top: 30px;
    color: #4a5568;
  }
  
  p, ul {
    font-size: 1.2rem;
    margin-top: 15px;
    color: #555;
    line-height: 1.6;
  }
  
  ul {
    list-style: disc;
    padding-left: 20px;
    text-align: left;
  }
  
  .conclusion {
    margin-top: 40px;
    font-weight: bold;
    font-size: 1.4rem;
    color: #2f855a;
  }
  
  .btn-retour {
    margin-top: 30px;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #2c7a7b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-retour:hover {
    background-color: #225e60;
  }
  </style>
  