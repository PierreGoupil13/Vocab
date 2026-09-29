# PRD — Vocab

## 1. Contexte et objectif
Application personnelle pour apprendre du vocabulaire (langue à préciser : ex. anglais, allemand...) via la méthode de **répétition espacée (SRS — Spaced Repetition System)**.

Objectif fonctionnel principal : présenter des mots à l'utilisateur, lui permettre de les réviser, valider sa réponse, et planifier automatiquement la prochaine révision selon un algorithme de type SRS (ex. SM-2 / Anki-like).

## 2. Utilisateur cible
- Utilisateur unique dans un premier temps (Pedro lui-même)
- Pas de multi-compte / authentification complexe à ce stade (à reconsidérer en V2)

## 3. Fonctionnalités (V1 — MVP)
1. **Gestion des mots**
   - Ajouter un mot (terme, traduction, exemple optionnel, tags/catégorie optionnels)
   - Modifier / supprimer un mot
   - Lister les mots existants
2. **Session de révision**
   - Sélectionner *n* mots à réviser selon leur date d'échéance SRS
   - Afficher un mot, l'utilisateur tente de se souvenir, puis révèle la réponse
   - Auto-évaluation (ex. "facile / correct / difficile / raté") qui pilote l'algorithme SRS
   - Mise à jour de l'intervalle de révision et de la date de prochaine échéance
3. **Suivi de progression**
   - Voir le nombre de mots dus aujourd'hui / à venir
   - Historique simple des révisions (streak, taux de réussite)

## 4. Hors périmètre V1 (V2+)
- Multi-utilisateurs / authentification
- Import/export (CSV, Anki)
- Sons / prononciation audio
- Application mobile native (V1 = web ou desktop)

## 5. Contraintes techniques (hypothèses — à valider)
- Stack backend : Next.js
- Persistance : base relationnelle (MCD déjà en cours de conception)
- Frontend : React, objectif web simple, apprentissage de react  (web simple, ou CLI dans un premier temps pour se concentrer sur la logique SRS)

## 6. Algorithme SRS envisagé
- Type SM-2 (simplifié) : chaque mot a un `intervalle`, un `facteur de facilité`, une `date de prochaine révision`
- Une réponse "facile" augmente l'intervalle davantage qu'une réponse "correcte" ; une réponse "raté" réinitialise l'intervalle

## 7. Questions ouvertes
- Langue(s) gérée(s) : une seule paire de langues ou plusieurs ?
- Formats des mots : mot simple, ou expressions/phrases entières ?
- Notion de "paquet" / catégorie de mots (thématiques) ?
