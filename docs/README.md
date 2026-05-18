# 📚 Gestion de Bibliothèque

Application web de gestion de bibliothèque développée en JavaScript Vanilla dans le cadre du cours **JavaScript Avancé** à l'Université Numérique Cheikh Hamidou Kane (UNCHK).

---

## 👨‍🏫 Tuteur

**Mouhamed Moustapha Diouf** — Tuteur JavaScript Avancé

---

## 👥 Groupe 5

| Prénom | Nom |
|---|---|
| Khadim | DIOP |
| Azubuike Daniel | EZEADIM |
| Abdallah | NDIAYE |
| Yero Gallo | SENE |
| Mouhamadou Lamine Bamba | THIAM |
| Saïkou Oumar | THIOUNE |

---

## 📸 Aperçu

L'application affiche la liste des livres sous forme de tableau avec les colonnes **Titre**, **Auteur**, **Année**, **Prix** et **Actions** (Voir / Modifier / Supprimer).

---

## ✨ Fonctionnalités

- **Chargement XML** — les données initiales sont lues depuis `books.xml` via `XMLHttpRequest`
- **Affichage** — liste des livres dans un tableau dynamique
- **Voir** — modal affichant la couverture et les informations complètes du livre
- **Ajouter** — formulaire d'ajout sans rechargement de page
- **Modifier** — pré-remplissage du formulaire avec les données existantes
- **Supprimer** — suppression instantanée avec confirmation
- **Recherche** — filtrage en temps réel par titre (`keyup`)

---

## ⚙️ Technologies

- HTML5
- CSS3
- JavaScript Vanilla (ES6)
- XML + XMLHttpRequest
- DOM Manipulation

---

## 📁 Structure du projet

```
├── index.html        # Structure de la page
├── style.css         # Mise en page et design
├── script.js         # Logique CRUD et manipulation du DOM
├── books.xml         # Données initiales des livres
├── images/           # Couvertures des livres
└── README.md
```

## 🧠 Concepts pédagogiques évalués

- Manipulation avancée du DOM
- Gestion des événements JavaScript
- Création et modification dynamique d'éléments HTML
- Chargement et parsing de données XML
- Logique CRUD (Create, Read, Update, Delete)
- Gestion d'état côté client
