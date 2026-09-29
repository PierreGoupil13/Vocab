# TASKS — Vocab

Chaque tâche doit être traitée **une par une** par l'agent, avec relecture avant de passer à la suivante. Cocher au fur et à mesure.
Avant chaque commit, il faut prompt l'utilisateur pour sa validation ou s'il a des questions, s'il a des questions, la validation est reporté jusqu'à ce qu'il n'en est plus.
## Phase 1 — Gestion des mots (CRUD)
- [x] Modèle de données `Mot` (terme, traduction, exemple, tags, dates SRS)
- [x] Endpoint / fonction : créer un mot
- [ ] Endpoint / fonction : lister les mots
- [ ] Endpoint / fonction : modifier un mot
- [ ] Endpoint / fonction : supprimer un mot
- [ ] Tests unitaires basiques du CRUD

## Phase 2 — Logique SRS
- [ ] Implémenter l'algorithme SRS (SM-2 simplifié) : calcul du prochain intervalle
- [ ] Fonction : sélectionner les mots dus pour aujourd'hui
- [ ] Fonction : enregistrer le résultat d'une révision et mettre à jour le mot
- [ ] Tests unitaires de l'algorithme (cas facile / correct / raté)

## Phase 3 — Session de révision (interface)
- [ ] Écran/vue : démarrer une session de révision
- [ ] Écran/vue : afficher un mot, révéler la réponse
- [ ] Écran/vue : boutons d'auto-évaluation
- [ ] Enchaînement automatique des mots de la session

## Phase 4 — Suivi de progression
- [ ] Vue : nombre de mots dus aujourd'hui / à venir
- [ ] Vue : historique des sessions (taux de réussite, streak)

## Notes pour l'agent
- Toujours committer après chaque tâche validée
- Expliquer les choix de structure/pattern quand ils ne sont pas évidents
- Ne pas anticiper les fonctionnalités "hors périmètre V1" listées dans le PRD
- Ne jamais s'ajouter comme co-author (trailer `Co-authored-by`) dans les messages de commit
