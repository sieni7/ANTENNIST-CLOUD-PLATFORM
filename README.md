# 📡 ANTENNIST Cloud Platform

**Réseau national des antennistes certifiés FITA — Côte d'Ivoire**

[![Netlify Status](https://api.netlify.com/api/v1/badges/antennist-cloud-platform/deploy-status)](https://antennist-cloud-platform.netlify.app)
![Version](https://img.shields.io/badge/version-0.0.1-blue)
![Sprint](https://img.shields.io/badge/sprint-0%20(fondations)-orange)

---

## 🌐 Liens

- **Production** : https://antennist-cloud-platform.netlify.app
- **API Test** : https://antennist-cloud-platform.netlify.app/api/hello
- **GitHub** : https://github.com/sieni7/ANTENNIST-CLOUD-PLATFORM

---

## 🚀 Démarrage Rapide

```bash
# Cloner le projet
git clone https://github.com/sieni7/ANTENNIST-CLOUD-PLATFORM.git
cd ANTENNIST-CLOUD-PLATFORM

# Installer les dépendances
npm install

# Initialiser les données
npm run init-data
```

---

## 📁 Structure

```
├── public/              → Frontend statique
├── netlify/functions/   → API serverless
├── data/                → Données JSON
├── scripts/             → Utilitaires
├── docs/                → Documentation
└── uploads/             → Fichiers utilisateurs
```

→ Voir [docs/architecture.md](docs/architecture.md) pour le détail complet.

---

## 📋 Sprints

| Sprint | Statut | Description |
|--------|--------|-------------|
| Sprint 0 | ✅ Terminé | Fondations techniques |
| Sprint 1 | 🔜 Prochain | API CRUD + Data Layer |
| Sprint 2 | ⏳ Planifié | Annuaire + Formulaire |
| Sprint 3 | ⏳ Planifié | QR Code + Carte |
| Sprint 4 | ⏳ Planifié | Admin Dashboard |

---

## 🛠️ Stack Technique

- **Frontend** : HTML / CSS / JavaScript (Vanilla)
- **Backend** : Netlify Functions (Node.js 18)
- **Données** : Fichiers JSON (JSON-first architecture)
- **CI/CD** : Netlify (déploiement automatique)
- **Hébergement** : Netlify CDN

---

*© 2026 FITA — Fédération des Installateurs Télécoms d'Afrique*
