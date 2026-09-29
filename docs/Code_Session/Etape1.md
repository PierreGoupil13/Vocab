Récapitulatif de la Tâche 1 — Modèle de données Mot

Ce que j'ai fait :

Environnement de dev : pnpm install, démarrage de Postgres via docker-compose (dans WSL/Ubuntu, car Docker n'est pas dispo nativement sur Windows ici), et création d'un .env local (non commité, POSTGRES_* + DATABASE_URL) pointant sur localhost:5432.
Correction d'un bug de chemin pré-existant : le générateur Prisma sortait le client dans app/generated/prisma (racine) alors que le code applicatif vit dans src/app avec l'alias @/ → src/* — le client généré était donc injoignable. Corrigé vers src/generated/prisma dans schema.prisma (et .gitignore mis à jour en conséquence).
Ajout du champ manquant : tags String[] @default([]) sur le modèle Word dans schema.prisma — le reste du modèle existant (wordLabel, wordMeaning, wordInUse, url) et la séparation Word/Revision (dates SRS) sont conservés tels quels, comme choisi.
Migration générée et appliquée : 20260928145053_add_word_tags/migration.sql.
Client Prisma régénéré au bon endroit, et création d'un singleton src/lib/prisma.ts (pattern standard Next.js avec l'adapter pg, pour être réutilisé par les futures Server Actions).
