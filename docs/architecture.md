# Antennist Cloud Platform - Architecture V0

> **Auteur** : SOLUTION_ARCHITECT — Sprint Zero  
> **Version** : 0.0.1 — 2026-07-04

---

## Principes Fondamentaux

| Principe | Description |
|----------|-------------|
| **JSON First** | Données stockées en fichiers JSON (pas de BDD externe en V0) |
| **Serverless** | Netlify Functions pour toute la logique API |
| **Static Frontend** | HTML / CSS / JS pur, zéro framework frontend |
| **Mobile-first** | Interface optimisée pour smartphones |
| **Anti-dette** | Code propre, documenté, modulaire dès le départ |

---

## Structure du Projet

```
ANTENNIST-CLOUD-PLATFORM/
├── public/             → Frontend statique (servi par Netlify CDN)
│   ├── index.html      → Page d'accueil
│   ├── annuaire.html   → Annuaire public (Sprint 1)
│   ├── referencement.html → Formulaire inscription (Sprint 1)
│   ├── css/            → Feuilles de style
│   ├── js/             → Scripts frontend
│   └── assets/         → Images, icônes, fonts
├── netlify/
│   └── functions/      → API serverless
│       ├── _utils/     → Helpers partagés (db, auth, validate)
│       └── hello.js    → Endpoint de test
├── data/               → Persistance JSON
│   ├── members.json    → Liste des membres
│   ├── sequence.json   → Compteur numéros FITA
│   ├── regions.json    → Référentiel régions CI
│   ├── specialties.json→ Référentiel spécialités
│   └── Model/
│       └── Member.js   → Schéma de données Member
├── scripts/
│   └── init-data.js    → Initialisation des données
├── docs/
│   └── architecture.md → Ce fichier
├── uploads/            → Fichiers uploadés (photos membres)
├── .eslintrc.js        → Config linter
├── .gitignore          → Fichiers ignorés par Git
├── netlify.toml        → Configuration Netlify
├── package.json        → Dépendances Node.js
└── README.md           → Documentation projet
```

---

## Modèle de Données — Member

```javascript
Member = {
  _id:          string,           // 'ant_<timestamp>'
  fita_number:  string,           // 'ANT-2026-00001'

  identity: {
    first_name: string,
    last_name:  string,
    phone:      string,           // '+225XXXXXXXXXX'
    whatsapp:   string,
    email:      string
  },

  location: {
    city:    string,
    region:  string,              // ID depuis regions.json
    lat:     number,
    lng:     number,
    address: string
  },

  professional: {
    specialties:      string[],   // IDs depuis specialties.json
    experience_years: number,
    description:      string,
    equipment:        string[]
  },

  media: {
    photo:   string,              // '/uploads/members/<id>.jpg'
    qr_code: string               // '/qr/<fita_number>.png'
  },

  status: {
    state:      'referenced' | 'verified' | 'certified',
    certified:   boolean,
    visible:     boolean,
    created_at:  string,          // ISO 8601
    updated_at:  string
  },

  stats: {
    views:         number,
    contacts:      number,
    interventions: number,
    rating:        number         // 0-5
  }
}
```

---

## API Endpoints (Sprint 1)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/hello` | Test de santé | Non |
| GET | `/api/members` | Liste des membres | Non |
| GET | `/api/members/:id` | Profil complet | Non |
| POST | `/api/members` | Créer un membre | Oui |
| PATCH | `/api/members/:id` | Mettre à jour | Oui |
| DELETE | `/api/members/:id` | Désactiver | Oui |
| GET | `/api/stats` | Statistiques globales | Non |
| GET | `/api/health` | Santé de l'API | Non |

---

## Sécurité

- ✅ Headers HTTP de sécurité (XSS, X-Frame, HSTS)
- ✅ CORS configuré (`Access-Control-Allow-Origin`)
- ✅ `.env.local` exclu de Git
- 🔜 Rate limiting (Sprint 2)
- 🔜 Validation des entrées (Sprint 1)
- 🔜 Authentification admin (Sprint 2)

---

## Déploiement

```
Git push → GitHub → Netlify CI/CD → Production
```

- **Branche** : `master` = production automatique
- **Build time** : ~2 minutes
- **URL** : https://antennist-cloud-platform.netlify.app
- **NODE_VERSION** : 18

---

## Roadmap Sprints

| Sprint | Focus | Durée |
|--------|-------|-------|
| **Sprint 0** ✅ | Fondations techniques | 3 jours |
| **Sprint 1** | API CRUD + Data Layer | 5 jours |
| **Sprint 2** | Annuaire public + Formulaire | 5 jours |
| **Sprint 3** | QR Code + Carte | 5 jours |
| **Sprint 4** | Admin Dashboard | 5 jours |
