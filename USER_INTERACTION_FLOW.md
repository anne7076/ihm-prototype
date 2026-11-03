# Spécification du Flux d'Interaction Utilisateur Complet (Full User Interaction Flow)
Application : **Agenda & Carte Musique Live - Rennes**

Ce document formalise l'ensemble des scénarios d'interaction et sert de cahier de tests pour inspecter et valider l'application dans le navigateur.

---

## 1. Flux Temporel & Navigation de Date (Calendar & Map Alignment)
*L'état de la date sélectionnée doit être partagé de façon cohérente entre le calendrier et la carte.*

- **1.1. Navigation Semaine (Calendrier)** :
  - Cliquer sur le chevron gauche `<` (Semaine précédente) recule la période affichée d'une semaine.
  - Cliquer sur le chevron droit `>` (Semaine suivante) avance la période d'une semaine.
  - Les numéros de jours (ex: 12 au 18 octobre) et les événements affichés se mettent à jour dynamiquement selon la semaine active.
- **1.2. Navigation Jour (Carte)** :
  - La carte dispose d'un sélecteur de jour (ex: "Vendredi 16 octobre").
  - Cliquer sur `<` (Jour précédent) ou `>` (Jour suivant) change le jour sélectionné.
  - **Alignement Carte ↔ Calendrier** : La carte ne doit afficher que les événements correspondant au jour sélectionné (ou mettre en exergue ceux du jour), avec leurs marqueurs géographiques réels.
- **1.3. Synchronisation entre Vues** :
  - Cliquer sur un jour ou un événement dans le calendrier et basculer sur "Carte" positionne la carte sur ce jour précis.
  - Inversement, cliquer sur "Voir en calendrier" depuis la carte conserve le jour/la semaine visualisé(e).

---

## 2. Découverte & Filtrage des Événements
- **2.1. Recherche Texte** :
  - Saisir un texte dans la barre de recherche (ex: "Velvet", "Ubu", "Jazz").
  - Le calendrier et la carte filtrent en temps réel les événements correspondants (mise en évidence / opacité réduite).
- **2.2. Filtres par Genre (#tags)** :
  - Cliquer sur un tag (ex: `#rock`, `#electro`, `#jazz`, `#pop`, `#reggae`).
  - Le tag passe à l'état actif (fond coloré avec pastille blanche et croix de désactivation).
  - Les événements sur la grille du calendrier et sur la carte se filtrent instantanément.
  - Cliquer sur "Tout effacer" réinitialise tous les filtres et le champ de recherche.

---

## 3. Gestion des Créateurs & Lieux (Sidebar)
- **3.1. Liste des Abonnements** :
  - La section "Mes abonnements" liste les artistes, bars et salles suivis avec leurs initiales.
  - Cliquer sur l'icône de suppression `✕` retire le créateur des abonnements et le bascule dans la section "Découvrir".
- **3.2. Suggestions ("Découvrir")** :
  - Les créateurs non encore suivis affichent le nombre d'abonnés communs ("suivi par X de vos abonnements").
  - Cliquer sur "Suivre" l'ajoute immédiatement à "Mes abonnements" et persiste la modification dans SQLite.

---

## 4. Exploration & Détails d'un Événement (Modales)
- **4.1. Consultation Simple (Calendrier ou Carte)** :
  - Cliquer sur un événement unitaire ouvre la modale détaillée (`EventDetailModal`).
  - La modale affiche l'image locale instantanée, le titre, le genre, la date/heure, le lieu avec adresse, la description, et les liens (Site officiel, Billetterie).
- **4.2. Action Favori** :
  - Cliquer sur le bouton cœur ❤️ bascule l'état favori (persistance SQLite immédiate).
- **4.3. Action "Voir sur la carte" depuis la modale** :
  - Cliquer sur "Voir sur la carte" ferme la modale et bascule automatiquement sur la vue Carte centrée sur le lieu de l'événement avec son popup ouvert.
- **4.4. Gestion des Créneaux Multiples (Journée chargée)** :
  - Cliquer sur un créneau multi-événements (ex: Vendredi soir) ouvre la modale de sélection de la journée (`DayEventsModal`).
  - L'utilisateur peut parcourir les différentes cartes d'événements et cliquer sur l'un d'eux pour accéder à sa fiche détaillée.

---

## 5. Création Participative d'un Événement
- **5.1. Ouverture du formulaire** :
  - Cliquer sur le bouton principal `+ Ajouter un événement` dans l'en-tête ouvre `EventFormModal`.
- **5.2. Saisie et Validation** :
  - Saisie du titre, sélection du genre principal (boutons radio stylisés), tags secondaires, jour de la semaine, plage horaire, lieu rennais connu (Ubu, L'Étage, etc.).
- **5.3. Enregistrement SQLite & Réactivité** :
  - Cliquer sur "Ajouter à l'agenda".
  - L'événement est enregistré dans la table `events` SQLite.
  - La modale se ferme et le nouvel événement apparaît immédiatement dans la grille du calendrier et sur la carte avec son marqueur.
