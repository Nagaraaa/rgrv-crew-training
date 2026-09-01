# 🍟 Crew Hub — Waterloo Beta

> Une application interne, pensée d’abord pour mobile, pour rassembler l’équipe, les tâches du restaurant et le module annuel RGRV.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Production-000000?logo=vercel&logoColor=white)](https://rgrv-crew-training.vercel.app)

🔗 **Application en ligne :** [rgrv-crew-training.vercel.app](https://rgrv-crew-training.vercel.app)

---

## ✨ À quoi sert Crew Hub ?

| Espace | Utilité |
| --- | --- |
| ✅ **Tâches** | Créer, proposer, accepter, prendre en charge et clôturer les actions de l’équipe. |
| 👥 **Équipe** | Voir l’organisation du Store et les rôles de chacun, avec un historique des changements. |
| 📚 **RGRV** | Réviser les fiches, lancer les quiz, le test final et l’Entraînement+. |
| 🏆 **Classé** | Progresser dans un classement RGRV volontaire, séparé des tâches du restaurant. |
| 👤 **Profil** | Retrouver sa progression et ses informations personnelles. |

L’application ne remplace pas WhatsApp : WhatsApp reste parfait pour les échanges rapides et les photos. Crew Hub apporte une **vue structurée**, sans devoir remonter l’historique d’une conversation pour retrouver une tâche ou un responsable.

---

## 🧭 Rôles et accès

| Rôle | Ce qu’il peut faire |
| --- | --- |
| 🟢 **Crew** | Consulter l’équipe, prendre une tâche validée et proposer une nouvelle tâche à faire valider. |
| 🧑‍🏫 **Crew Trainer** | Même accès opérationnel que le Crew, avec une place claire dans la hiérarchie. |
| 🟡 **Manager** | Créer des tâches et catégories, puis accepter ou refuser les propositions. |
| 🟠 **1er Assistant** | Gérer les tâches et promouvoir un Crew en Manager. |
| 🔴 **Store Manager** | Gérer les tâches et l’ensemble des rôles administrables. |

Les autorisations sont vérifiées côté serveur : modifier l’interface ne donne pas de droits supplémentaires.

---

## 📱 Logique des tâches

- Pas d’échéance artificielle à saisir : la date et l’heure de **création** sont enregistrées automatiquement.
- Lorsqu’une tâche est clôturée, l’application conserve aussi la date et l’heure de **finalisation**.
- Un Crew propose une tâche ; un Manager, 1er Assistant ou Store Manager peut l’accepter ou la refuser.
- La prise en charge et la clôture sont atomiques : deux personnes ne peuvent pas s’attribuer la même tâche en même temps.
- Une petite confirmation remercie la personne qui vient de terminer une tâche. ✨

---

## 🛠️ Lancer le projet en local

### Prérequis

- Node.js récent (LTS recommandé)
- Un projet Supabase configuré pour les Edge Functions

### Installation

```powershell
npm install
npm run dev
```

Puis ouvrir l’adresse indiquée par Vite, généralement `http://localhost:5173`.

### Variables d’environnement front-end

Créer un fichier `.env` local (il est ignoré par Git) :

```dotenv
VITE_CREW_API_URL=https://<votre-projet>.supabase.co/functions/v1/crew-api
VITE_CREW_IDENTITY_URL=https://<votre-projet>.supabase.co/functions/v1/crew-identity
```

Ces URLs sont des points d’accès publics ; **aucune clé secrète Supabase ne doit être placée dans le front-end**.

### Vérifications

```powershell
npm run build
npm run lint
```

---

## 🗂️ Architecture

```text
src/
├── features/
│   ├── learning/       # Fiches, quiz et test final
│   ├── ranked/         # Mode classé RGRV
│   ├── training/       # Entraînement+
│   ├── operations/     # Tâches, équipe et rôles
│   └── rgrv/           # Hub annuel RGRV
├── lib/crewApi.ts      # Frontière unique avec les Edge Functions
└── App.tsx             # Navigation et session

supabase/
├── functions/
│   ├── crew-identity/  # Inscription et connexion par prénom, nom et PIN
│   ├── crew-api/       # Profil, XP, quiz et classement
│   └── crew-operations/# Tâches, catégories et rôles
└── migrations/         # Schéma et évolutions de la base
```

---

## 🔐 Sécurité et données

- Les PIN ne sont jamais stockés en clair : seuls des dérivés PBKDF2 sont conservés.
- Les sessions utilisent un jeton dont seul le condensat est enregistré côté serveur.
- Les scores RGRV sont calculés côté Edge Function, pas dans le navigateur.
- Les actions sensibles — tâches, validations et rôles — sont autorisées côté serveur.
- Les données de test et les clés d’administration restent hors de Git grâce à `.gitignore`.

### 👀 Voir les comptes localement

`tools/admin_accounts.py` est un outil de lecture seule : il affiche les profils et statistiques sans révéler les PIN ou les jetons.

1. Créer `.env.admin.local` à la racine du projet avec `SUPABASE_URL` et `SUPABASE_SECRET_KEY`.
2. Lancer `tools/voir-comptes.cmd`, ou `py tools/admin_accounts.py`.
3. Ajouter `--json` si une sortie exploitable est nécessaire.

> 🔒 La Secret key est réservée à l’administration locale. Ne pas la copier dans `.env`, dans le code front-end ou dans une discussion.

---

## 🚀 Déploiement

La production est hébergée sur Vercel et le backend sur Supabase.

```powershell
# Vérifier avant publication
npm run build
npm run lint

# Production Vercel (projet déjà relié)
npx vercel@59.9.1 --prod --yes
```

Les Edge Functions et migrations Supabase doivent être déployées avant une fonctionnalité qui dépend d’elles. Les anciens déploiements Vercel servent de point de retour si nécessaire.

---

## 🧪 Vérification distante

Le script suivant crée un compte temporaire, vérifie l’identité, une fiche, un quiz officiel et une partie classée :

```powershell
node scripts/verify-remote.mjs
```

Supprimer ensuite le profil de test dans Supabase. Ne pas exécuter ce script sur la base de production sans prévoir ce nettoyage.

---

<p align="center">
  Pensé et créé pour l’équipe Waterloo par <strong>Steve</strong> 🍟<br />
  <sub>Beta interne · amélioration continue</sub>
</p>
