# Checkout sans étape "email" — plan de test

Branche : `feat/stepless-checkout`

## Ce qui change

- **Frontend** : l'étape "Saisissez votre adresse e-mail" est supprimée. Un
  acheteur non connecté est redirigé directement vers Stripe, qui collecte
  l'email sur sa propre page. (`page.tsx` fait la redirection côté serveur ;
  `check-email.tsx` et `sign-user.tsx` supprimés.)
- **Webhook** (`stripe.ts`) : l'utilisateur est retrouvé par **customer_id OU
  email**. Indispensable maintenant : Stripe crée un nouveau customer pour un
  client déjà existant, donc le customer_id seul ne suffit plus. Le customer_id
  est réconcilié et le programme n'est rattaché qu'une fois (idempotence).
- **Checkout controller** (`program.ts`) : `customer_creation: "always"` par
  défaut + correction du typo `discouns` → `discounts` (le code promo crashait).

## Pré-requis

Tester en **mode test Stripe** (clés test), jamais en prod. Utiliser le
webhook de test (Stripe CLI `stripe listen` ou endpoint test).

## Scénarios à valider

| # | Cas | Étapes | Attendu |
|---|-----|--------|---------|
| 1 | **Nouvel acheteur** (email jamais vu) | Aller sur `/checkout/<id>` non connecté → paie sur Stripe avec un email neuf | Redirection directe vers Stripe (aucune étape email). Après paiement : 1 compte créé, programme rattaché, contact Brevo + liste + tag OK, auto-login via success_url |
| 2 | **Client existant non connecté** (email a déjà un compte) | `/checkout/<id2>` d'un 2e programme, non connecté, paie avec l'email existant | **Aucun doublon de compte**. Le 2e programme s'ajoute au compte existant. customer_id réconcilié. Pas de crash |
| 3 | **Client connecté** | Se connecter → `/checkout/<id>` | Redirigé direct vers Stripe avec son customer_id (inchangé) |
| 4 | **Déjà propriétaire du programme** | Connecté possédant déjà le programme → `/checkout/<id>` | Redirigé vers `/app/trainings/<id>` (pas de re-paiement) |
| 5 | **Rachat même programme** (edge) | Payer 2× le même programme | Programme non dupliqué dans `programs` (idempotence) |
| 6 | **Code promo** | Checkout avec `?coupon=` et `?promotion_code=` | Remise appliquée, plus de crash (typo corrigé) |
| 7 | **Webhook rejoué** | Renvoyer le même event `checkout.session.completed` | Pas de doublon compte/programme |

## Points de vigilance

- **Auto-login après rachat (client existant)** : `loggedUserFromSession`
  se connecte avec `temp_password`. Un client qui a déjà défini son mot de passe
  a `temp_password = ''` → l'auto-login échouera, il devra se connecter
  manuellement. Non bloquant (accès + programme OK), mais à surveiller. Corriger
  plus tard si friction (ex : ne pas tenter l'auto-login si `createdPassword`).
- **Ancien customer Stripe** : pour un client existant, le customer_id est
  remplacé par le nouveau généré au paiement. Historique/cartes de l'ancien
  customer non fusionnés (acceptable).
- **Relance panier abandonné** : non incluse ici (décision produit en attente).
  Si retenue : activer `after_expiration.recovery` sur la session + écouter
  `checkout.session.expired`.

## Avant merge

- [ ] `cd backend && npm run build` (typecheck Strapi)
- [ ] `cd frontend && npm run build` (typecheck Next)
- [ ] Scénarios 1→7 en mode test Stripe
