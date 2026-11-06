# Agenda Musique Rennes — Application IHM

Application web interactive d'exploration et de gestion d'événements musicaux, concerts et festivals à Rennes (Ille-et-Vilaine). Conçue selon les standards modernes de l'ingénierie IHM avec React 19, Vite, Leaflet et SQLite en WebAssembly.

---

## 📌 Fonctionnalités Clés

- **📅 Calendrier Hebdomadaire Temporellement Cohérent** :
  - Calendrier dynamique synchronisé par dates ISO réelles (`YYYY-MM-DD`).
  - Navigation multi-semaines et pagination temporelle sans répétition artificielle d'événements.
  - Filtres par genres musicaux (Rock, Electro, Jazz, Pop, Reggae) et recherche textuelle multi-critères (titre, artiste, lieu, tag).

- **🗺️ Carte Interactive & Regroupement par Lieux (Clustering)** :
  - Fond cartographique épuré haute lisibilité (Esri World Street Map, style Google Maps sans bruit visuel).
  - Vue **"Toute la semaine"** affichant l'ensemble de la scène musicale rennaise, avec filtrage rapide par jour.
  - Regroupement automatique par salle de concert / bar pour éliminer tout chevauchement de marqueurs.
  - Popups riches multi-événements avec navigation directe vers les fiches détaillées.

- **📍 Géocodage Officiel & Saisie d'Adresse Vérifiée** :
  - Module d'ajout d'événement connecté à l'API Adresse Nationale (`api-adresse.data.gouv.fr`).
  - Autocomplétion en temps réel sur les adresses rennaises (`citycode=35238`) avec extraction des coordonnées GPS certifiées.
  - Sélection en un clic des salles emblématiques de Rennes (*L'Ubu, L'Étage, L'Antipode, Chez Gilbert, Le Bar'Hic, Le Liberté, Parc du Thabor, Le Jardin Moderne*).

- **💾 Persistance des Données avec SQLite (WASM)** :
  - Base de données locale relationnelle SQLite exécutée dans le navigateur via `sql.js` (WebAssembly).
  - Gestion des abonnements aux créateurs/salles et des concerts favoris avec persistance automatique.

---

## 🛠️ Stack Technique

- **Frontend** : [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build & Dev Server** : [Vite 8](https://vite.dev/)
- **Cartographie** : [Leaflet 1.9](https://leafletjs.com/) + [React-Leaflet 5](https://react-leaflet.js.org/) (Tuiles Esri World Street)
- **Base de Données** : [SQLite](https://sqlite.org/) via `sql.js` (WASM)
- **Styles** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Géocodage** : Base Adresse Nationale (BAN) via l'API Adresse officielle française

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement (http://localhost:8443)
pnpm run dev

# Construction de la version de production
pnpm run build
```
