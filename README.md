# RGRV Crew Training

Application interne de formation RGRV, reconstruite avec React, TypeScript et Vite.

## Démarrer

```powershell
npm install
npm run dev
```

Copier `.env.example` vers `.env` si nécessaire. Les deux URLs configurées sont publiques : elles ne contiennent aucune clé secrète.

```powershell
npm run build
npm run lint
```

## Organisation

- `src/features/learning` : fiches, questions, quiz et logique du parcours.
- `src/lib/crewApi.ts` : unique frontière entre l’interface et les Edge Functions.
- `supabase/functions/crew-identity` : inscription et connexion par prénom, nom et PIN à 6 chiffres. Seuls des dérivés PBKDF2 du PIN sont stockés.
- `supabase/functions/crew-api` : progression, validation serveur, XP et classement. Le serveur est l’autorité qui calcule le score et enregistre les résultats.
- `supabase/migrations` : ajout des champs d’identité et de l’index de performance.

## Contrat de confidentialité

Le profil affiché dans le classement est toujours sous la forme « Prénom I. ». L’opt-in est désactivé par défaut. Les fonctions n’acceptent que l’origine locale de développement et les domaines Vercel RGRV.

## Vérification distante

`node scripts/verify-remote.mjs` crée un profil temporaire, vérifie l’identité, une fiche et un quiz, puis affiche le résultat. Supprimer ensuite ce profil de test dans Supabase (la procédure de livraison l’a déjà fait).

## Voir les comptes, localement

Un petit outil de lecture seule est disponible dans `tools/admin_accounts.py`. Il n'affiche que le profil, la date de création et les statistiques de progression ; les PIN et jetons ne sont jamais demandés ni affichés.

1. Copier `tools/.env.admin.example` vers `.env.admin.local`.
2. Dans Supabase, ouvrir **Settings > API Keys**, puis copier une **Secret key** (ou la clé `service_role` historique) dans `SUPABASE_SECRET_KEY`. Ne jamais mettre cette clé dans le projet web ou la partager.
3. Double-cliquer sur `tools/voir-comptes.cmd`, ou lancer `py tools/admin_accounts.py` depuis le dossier `app`.

Un raccourci bureau **RGRV - Voir les comptes** peut être utilisé pour ouvrir directement l'outil. Le lanceur configure automatiquement l'encodage UTF-8 afin que les accents restent lisibles dans la console Windows.

Le fichier `.env.admin.local` est ignoré par Git. Ajouter `--json` à la commande pour obtenir une sortie exploitable dans un autre outil.

## Aperçu local : Crew Hub

La navigation locale contient une première version de l'espace **Tâches** et de la gestion des rôles. Elle ne lit ni n'écrit encore de tâches, de catégories ou de rôles dans Supabase : c'est volontaire, afin de valider l'usage avant toute migration de la base.

- Le RGRV est maintenant regroupé dans un module annuel dédié.
- Les tâches utilisent une catégorie et une échéance avec date + heure sélectionnées.
- Les Managers peuvent créer des tâches et des catégories dans l'aperçu. Le Store Manager peut attribuer les rôles Crew, Manager et 1er Assistant ; le 1er Assistant peut uniquement promouvoir un Crew en Manager.
- En mode développement, le profil affiche un sélecteur **Aperçu local des droits**. Il ne modifie aucun compte réel.

La version connectée nécessitera une migration Supabase, des actions serveur protégées et un journal privé des changements de rôle et de création de catégories.
