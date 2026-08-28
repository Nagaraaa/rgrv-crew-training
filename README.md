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
