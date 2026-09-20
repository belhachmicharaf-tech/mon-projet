# Journal d'itération — analyse de courriels

## 2026-09-20
- Score initial : harnais cassé (0/20, import cyclique + client Anthropic construit avant dotenv.config)
- Changement : extraction de la logique LLM dans lib/analyser.ts, client Anthropic paresseux
- Résultat : 16/20

## 2026-09-20 (suite)
- Changement : correction du validateur (action_requise peut être null hors "ignorer")
- Résultat : 18/20

## 2026-09-20 (suite)
- Changement : règle "haute" resserrée ("attend une réponse/décision" au lieu de "écrit par un humain") + confirmation de paiement reclassée "moyenne"
- Résultat : 20/20, deux fois de suite
