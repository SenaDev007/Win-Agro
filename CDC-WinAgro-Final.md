# Cahier des Charges
## Plateforme Web Vitrine Scalable — Version 2.0

**Win Agro Agri Tech Solutions**
*Production Animale · Formation Agricole · Services Vétérinaires*

---

| | |
|---|---|
| **Version** | 2.0 — Avril 2025 (architecture scalable Option 1 → Option 2) |
| **Statut** | Document de référence contractuel |
| **Rédigé par** | Keter Marketing — Dawes AKPOVI |
| **Client** | Win Agro Agri Tech Solutions — Victoire AHOGNON |
| **Contacts client** | +229 0161336548 / +229 0147221458 |
| **Documents liés** | Copywriting complet (doc séparé) · Prompt de production (doc séparé) |

---

*Dawes AKPOVI — CEO & Co-founder Keter Marketing*

---

## 01 — Présentation & Contexte

### 1.1 Présentation du client

**Win Agro Agri Tech Solutions** est une entreprise béninoise fondée par Victoire AHOGNON, spécialisée dans la formation agricole professionnelle, l'accompagnement à l'installation de fermes, la vente d'animaux vivants (volailles, lapins), de provendes, et de plants agricoles. Sa philosophie est fondée sur les méthodes naturelles — zéro intrant chimique — et sur un accompagnement terrain distinct de la formation théorique classique.

### 1.2 Problème à résoudre

Win Agro n'a pas de présence digitale. Toute son activité repose sur le bouche-à-oreille et WhatsApp. Ce modèle plafonne la croissance et rend invisible l'expertise de Victoire face à des clients potentiels qui cherchent ses services sur Google.

| PROBLÈME | IMPACT | SOLUTION ATTENDUE |
|---|---|---|
| Absence de site web | Zéro trafic organique, zéro lead entrant | Site vitrine SEO-optimisé |
| Pas de formulaire contact | Leads perdus faute de canal structuré | Formulaire qualifié + WhatsApp |
| Pas de preuves en ligne | Crédibilité limitée aux contacts existants | Témoignages + chiffres clés |
| Vision non racontée | Investisseurs et partenaires non adressés | Architecture scalable Option 2 |

---

## 02 — Objectifs Stratégiques

Ce site a un objectif unique : convertir le visiteur en lead ou en acheteur. Pas en admirateur. En client. Chaque décision technique et éditoriale est subordonnée à cet impératif.

| OBJECTIF | MÉCANISME | KPI CIBLE |
|---|---|---|
| Générer des leads qualifiés | Formulaire de contact + redirection WhatsApp | Taux soumission > 5% |
| Déclencher des appels directs | CTAs tap-to-call dans hero, header, footer | Clics appel > 3% sessions |
| Convertir via WhatsApp | Bouton flottant + message pré-rempli automatique | Taux engagement WA > 8% |
| Rankuer sur Google Bénin | SEO on-page + technique + schema.org | Top 5 mots-clés en 6 mois |
| Installer la crédibilité | Chiffres clés + témoignages vérifiés | Temps sur page > 2 min |
| Préparer la scalabilité | Route groups (corporate) désactivés mais posés | 0 refactoring au passage Option 2 |

---

## 03 — Architecture Plateforme

### 3.1 Décision architecturale

Architecture retenue : **Single Page Application (Option 1)** avec routing évolutif préparé pour l'Option 2 — sans reconstruire le projet le moment venu.

| OPTION | DESCRIPTION | STATUT | DÉCLENCHEUR |
|---|---|---|---|
| Option 1 (active) | SPA vitrine — un seul parcours, orienté vente et conversion client | Production dès maintenant | — |
| Option 2 (planifiée) | Deux parcours : client (vente) + corporate (partenaires, investisseurs, presse) | Activation future | Voir section 3.3 |
| Option 3 (long terme) | Deux domaines distincts : winagro.com (commercial) + winagrocorp.com (institutionnel) | Non planifié | Levée de fonds / structure juridique distincte |

### 3.2 Structure du projet Next.js (App Router)

```
win-agro/
├── app/
│   ├── page.tsx                ← SPA principale (Option 1)
│   ├── layout.tsx              ← Layout global + SEO + GA4
│   ├── api/lead/route.ts       ← Soumission formulaire + WhatsApp
│   ├── (client)/               ← Route group Option 1 (actif)
│   └── (corporate)/            ← Route group Option 2 (posé, désactivé)
│       ├── vision/page.tsx
│       ├── partenaires/page.tsx
│       └── investisseurs/page.tsx
├── components/
│   ├── layout/    Navbar  Footer  WhatsAppFAB
│   ├── sections/  Hero  Stats  Services  Products  About  WhyUs  Testimonials  LeadForm
│   └── ui/        shadcn/ui components
├── lib/           validations.ts  analytics.ts  whatsapp.ts
└── public/images/ tailwind.config.ts  next.config.ts
```

### 3.3 Signaux de déclenchement de l'Option 2

| SIGNAL | DESCRIPTION | ACTION TECHNIQUE |
|---|---|---|
| Partenariats entrants | Demandes d'ONG, distributeurs, institutions | Activer (corporate)/partenaires — copy B2B |
| Financement | Appels à projets BOAD, AFD, fonds agricoles | Activer (corporate)/investisseurs — métriques + vision |
| Couverture presse | Interviews, demandes de dossiers de présentation | Activer (corporate)/presse — kit média téléchargeable |

> ✎ Le passage Option 1 → Option 2 nécessite 2 à 3 jours de travail si l'architecture est correctement posée dès maintenant. C'est la garantie de cet engagement.

---

## 04 — Stack Technique

### 4.1 Stack core

| TECHNOLOGIE | RÔLE | VER. | JUSTIFICATION |
|---|---|---|---|
| Next.js | Framework React fullstack, SSR + SSG, App Router | 15+ | Performance, SEO, scalabilité |
| TypeScript | Typage strict, maintenabilité | 5.x | Qualité code production |
| Tailwind CSS | Styling utilitaire, design system cohérent | 4.x | Rapidité, cohérence visuelle |
| shadcn/ui | Composants UI accessibles (Radix UI) | Latest | Accessibilité WCAG 2.1 |
| Framer Motion | Animations et micro-interactions | 11+ | UX différenciante |
| React Hook Form | Gestion formulaires performante | 7.x | Zéro re-render inutile |
| Zod | Validation schémas TypeScript-first | 3.x | Sécurité, cohérence client/serveur |
| next-sitemap | Génération sitemap.xml + robots.txt | Latest | SEO technique automatisé |
| next/font | Chargement optimisé Google Fonts | Natif | CLS = 0 garanti |

### 4.2 Infrastructure & services tiers

| SERVICE | USAGE | COÛT |
|---|---|---|
| Vercel | Hébergement, CDN Edge Network, CI/CD | 0 XOF au démarrage |
| GitHub | Contrôle de version, backup code | 0 XOF |
| Resend | Emails de notification formulaire leads | 0 XOF (3 000 emails/mois gratuits) |
| Google Analytics 4 | Analyse trafic, événements de conversion | 0 XOF |
| Google Search Console | Suivi indexation SEO, performance requêtes | 0 XOF |

> **Coût d'infrastructure mensuel au démarrage : 0 XOF — tout en gratuit jusqu'à besoin de scaling**

---

## 05 — Design System

### 5.1 Palette de couleurs — extraite du logo Win Agro

| COULEUR | HEX | USAGE |
|---|---|---|
| Vert profond | `#076B37` | Sections sombres, accents forts, sidebar |
| Vert logo (primary) | `#098947` | Boutons CTA, liens actifs, liseré navbar |
| Vert pâle (background) | `#E6F4EC` | Fonds de section, citations, encarts |
| Jaune logo (accent) | `#FDDD00` | Highlights, séparateurs, traits déco |
| Jaune foncé (texte/accent) | `#C8A800` | Texte accent sur fond blanc, hover subtil |
| Jaune pâle (background) | `#FFFBE0` | Notes, alertes, encarts d'attention |
| Crème (fond principal) | `#FAFAF3` | Fond alterné des sections |
| Blanc pur | `#FFFFFF` | Navbar, cartes, formulaires — logo lisible |
| Noir vert profond | `#0F1F14` | Footer — logo lisible, contraste fort |
| Gris texte | `#4A4A4A` | Corps de texte, descriptions |

### 5.2 Décision navbar & footer — justification

La règle est absolue : ne jamais poser un logo sur une couleur issue de sa propre palette. Le vert du logo `#098947` sur fond vert foncé `#076B37` produit un ratio de contraste de 1.8:1 — le coq et les lettres deviennent illisibles. Deux fonds garantissent la lisibilité totale :

| ÉLÉMENT | COULEUR FOND | HEX | CONTRASTE LOGO VERT | CONTRASTE LOGO JAUNE | JUSTIFICATION |
|---|---|---|---|---|---|
| Navbar | Blanc pur | `#FFFFFF` | 7.5:1 ✓ AAA | — pas de jaune sur blanc | Logo parfaitement lisible. Texte nav en vert profond `#076B37`. |
| Footer | Noir vert | `#0F1F14` | 4.8:1 ✓ AA | 10.2:1 ✓ AAA | Les deux couleurs du logo explosent. Signature en jaune `#FDDD00`. |

> ✎ Règle de référence : Whole Foods, John Deere, Starbucks appliquent le même principe — logo bicolore vert/jaune sur blanc (navbar) et sur noir (footer). Jamais sur vert.

### 5.3 Typographie

| USAGE | POLICE | STYLE | CHARGEMENT |
|---|---|---|---|
| Titres / Display | Playfair Display | Serif — élégance, autorité visuelle | next/font/google |
| Corps / Interface | DM Sans | Sans-serif — lisibilité, modernité | next/font/google |

> ✎ Chargement via next/font avec font-display: swap. Jamais via CDN externe. Garantit un CLS = 0.

### 5.4 Principes visuels

- **Navbar** : fond `#FFFFFF` blanc au top, transition vers fond blanc + border-bottom verte `#098947` au scroll. Texte nav : `#076B37`.
- **Footer** : fond `#0F1F14` noir vert. Texte : blanc et jaune `#FDDD00`. Liseré vert `#098947` en haut du footer.
- Sections alternées : fond `#FAFAF3` (crème) / fond `#FFFFFF` (blanc). Sections d'impact : fond `#076B37` vert profond.
- Cards : border 1px `#C8E4D0`, border-radius 12px. Hover : scale 1.02 + shadow verte.
- Boutons primaires : fond `#098947`, texte blanc, flèche →. Hover : fond `#076B37`.
- Accent permanent : ligne jaune `#FDDD00` sur headers de tableaux, séparateurs clés, sous-titres de section.

---

## 06 — Architecture du Site

SPA avec navigation par ancres. Ordre des sections : Attirer → Convaincre → Rassurer → Convertir.

| # | SECTION | ANCRE | CONTENU | OBJECTIF |
|---|---|---|---|---|
| — | Navbar | — | Logo + 5 liens + CTA sticky | Accès rapide #contact |
| 01 | Hero | `#hero` | H1 problème-solution + sous-titre + 2 CTAs | Clic CTA / WhatsApp |
| 02 | Stats | `#stats` | 4 compteurs : 500+ / 6 / 24h / 100% | Réassurance, crédibilité |
| 03 | Services | `#services` | 3 fiches : Formation / Installation / Consultation | Qualification + CTA distinct |
| 04 | Produits | `#produits` | 3 catégories : animaux / nutrition / agriculture | Commande directe WhatsApp |
| 05 | À propos | `#about` | Parcours Victoire + mission + vision 1000 ha | Confiance, attachement |
| 06 | Différenciation | `#pourquoi-nous` | 5 arguments avec texte + icône | Élimination des objections |
| 07 | Témoignages | `#témoignages` | 3 cartes clients (résultat + avant/après) | Social proof |
| 08 | Contact | `#contact` | Formulaire + numéros + WhatsApp | Capture lead — closing |
| — | Footer | — | Liens + contacts + CTA + copyright | Dernière conversion |

---

## 07 — Stratégie de Conversion & Capture de Leads

### 7.1 Parcours de conversion en 4 étapes

| ÉTAPE | ACTION | MÉCANISME | SECTION |
|---|---|---|---|
| 1 — Attirer | Capter l'attention en < 3s | Hero : problème + promesse + badge social proof | `#hero` |
| 2 — Convaincre | Démontrer l'expertise | Stats animées + Services + Catalogue produits | `#stats` → `#produits` |
| 3 — Rassurer | Éliminer les objections | About (Victoire réelle) + Différenciation + Témoignages | `#about` → `#témoignages` |
| 4 — Convertir | Déclencher l'action maintenant | Formulaire + tap-to-call + bouton WhatsApp flottant | `#contact` + FAB |

### 7.2 Formulaire de contact — champs et logique

| CHAMP | TYPE | REQ. | CONTENU |
|---|---|---|---|
| Nom complet | text | Oui | Placeholder : "Ton prénom et ton nom" |
| Téléphone/WhatsApp | tel | Oui | Placeholder : "+229 XXXXXXXXXX" |
| Service d'intérêt | select | Oui | 7 options : Formation / Installation / Consultation / Achat volailles / Provendes / Autre produit / Autre |
| Message | textarea | Non | Placeholder : "Décris ton projet en quelques mots (facultatif)..." |

**Comportement à la soumission :**

- Validation Zod côté client en temps réel — erreurs inline, jamais au submit
- POST vers `/api/lead` — validation Zod côté serveur également
- Email de notification envoyé via Resend à l'adresse de Victoire
- Confirmation animée dans le formulaire : « Reçu ✓ Victoire te contacte dans les 24h. 🌱 »
- Après 1.5s : redirection WhatsApp avec message pré-rempli (nom, service, message, téléphone)
- Événement GA4 : `lead_submitted` avec propriété `service_type`

### 7.3 Points de contact permanents

| MÉCANISME | POSITION | COMPORTEMENT |
|---|---|---|
| Bouton WhatsApp (FAB) | Fixed bas droit, z-50, toutes pages | Pulse animation, tooltip au hover |
| CTA nav sticky | Header fixe au scroll | Visible quelle que soit la position |
| Numéros tap-to-call | Hero, header, contact, footer | `<a href="tel:">` — appel direct mobile |
| CTA WhatsApp contact | Section `#contact` | Lien direct WA avec message générique |
| CTA par service (×3) | Fin de chaque carte service | Ancre `#contact` + service pré-sélectionné |

---

## 08 — Animations & Expérience Utilisateur

Intention avant ostentation. Chaque animation a un but UX.

| SECTION | TYPE | PARAMÈTRES | DÉCLENCHEUR |
|---|---|---|---|
| Hero — titres | staggered fadeUp | opacity 0→1, y 32→0, delay 0.15s/ligne | Page load |
| Hero — CTAs | slideUp | opacity 0→1, y 20→0, delay 0.5s | Page load |
| Stats — compteurs | count animation | 0 → valeur, 1.5s, easeOut | whileInView once |
| Services — cards | stagger fadeUp | opacity 0→1, stagger 0.08s | whileInView once |
| About — image | clipPath reveal | left→right, 0.8s | whileInView once |
| Différenciation — cards | stagger slideRight | x -32→0, stagger 0.1s | whileInView once |
| Témoignages | carousel drag | useDrag Framer Motion | Interaction user |
| Boutons hover | translateY + shadow | -2px, shadow verte, 0.2s | Hover |
| Cards hover | scale + shadow | scale 1.02, shadow +, 0.2s | Hover |
| FAB WhatsApp | pulse permanente | scale 1→1.08→1, shadow, 2s ∞ | Auto |
| Navbar | backdrop-blur | transparent → vert profond + blur | IntersectionObserver hero |

---

## 09 — SEO & Performance

### 9.1 SEO On-Page — configuration exacte

| | |
|---|---|
| **Meta title** | Élevage au Bénin — Formation, Installation, Vente \| Win Agro Agri Tech |
| **Meta description** | Win Agro Agri Tech Solutions t'accompagne dans ton projet d'élevage au Bénin. Formation pratique, installation de ferme, vente de volailles et provendes. |
| **H1 unique** | Lance ou développe ton élevage au Bénin — avec quelqu'un qui connaît le terrain. |
| **OG title** | Win Agro Agri Tech Solutions — Formation & Élevage au Bénin |
| **OG description** | Formations pratiques, installation de ferme et vente d'animaux sélectionnés. Victoire AHOGNON t'accompagne jusqu'aux résultats. |
| **Canonical URL** | https://winagro.bj (ou domaine confirmé par le client) |
| **Schema.org** | LocalBusiness + AgricultureBusiness — JSON-LD dans `<head>` |
| **Locale** | fr_BJ |

### 9.2 Mots-clés cibles — priorisés

| PRIORITÉ | MOT-CLÉ | SECTION |
|---|---|---|
| P1 | production animale Bénin | H1, H2, meta title |
| P1 | formation élevage Bénin | Services, H2, meta description |
| P1 | vente poulet Cotonou | Produits, H2 |
| P2 | provendes Bénin qualité | Produits, meta description |
| P2 | installation ferme avicole Bénin | Services |
| P3 — longue traîne | acheter poussins d'un jour Bénin | Produits — texte carte |
| P3 — longue traîne | formation élevage volaille Afrique en ligne | Services — Formation |
| P3 — longue traîne | consultant ferme avicole Bénin | About, Services |

### 9.3 Exigences de performance — Core Web Vitals

| MÉTRIQUE | CIBLE | OUTIL |
|---|---|---|
| Lighthouse Score desktop | ≥ 90 (Perf + SEO + Accessibility) | PageSpeed Insights |
| Lighthouse Score mobile | ≥ 85 | PageSpeed Insights |
| LCP (Largest Contentful Paint) | < 2.5 secondes | Core Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Core Web Vitals |
| FID / INP | < 100ms | Chrome UX Report |
| TTFB (Time to First Byte) | < 600ms | WebPageTest |
| Bundle JS total | < 150 KB gzipé | Next.js Bundle Analyzer |

> ⚠ Ces métriques sont des critères de livraison. Le site n'est pas considéré livré tant qu'elles ne sont pas atteintes et documentées par captures Lighthouse.

---

## 10 — Copywriting

Le copywriting complet — titre par titre, CTA par CTA, micro-copy inclus — est documenté dans le **document de production séparé : « Copywriting Complet »**. Ce document fait partie intégrante du présent CDC.

> « Un site qui vend, c'est 80% de copy et 20% de design. Le document copywriting est votre 80%. »

### 10.1 Principes éditoriaux

- **Problème avant vision** : le hero parle au visiteur, pas à Victoire.
- **CTA unique par section** : chaque service a un seul bouton d'action.
- **Preuve avant promesse** : les chiffres arrivent avant les arguments.
- **Tension narrative** : chaque section ouvre un problème avant de le résoudre.
- **Micro-copy soigné** : messages WhatsApp pré-remplis, confirmations, erreurs — rien laissé au développeur.

### 10.2 Contenus à fournir par le client

> ⚠ Ces éléments sont bloquants. La Phase 3 ne démarre pas sans eux.

| ÉLÉMENT | FORMAT REQUIS | DÉLAI |
|---|---|---|
| Photos ferme et animaux | JPEG ou PNG, min. 1200px | Avant Phase 3 (J6) |
| Portrait de Victoire — terrain | JPEG ou PNG, haute résolution | Avant Phase 3 (J6) |
| Logo officiel Win Agro | PNG avec fond transparent | Avant Phase 1 (J1) |
| 3 témoignages clients vérifiés | Prénom + résultat chiffré + texte + localité | Avant Phase 4 (J10) |
| Adresse email de notification | Format standard | Avant Phase 1 (J1) |
| Domaine souhaité | Ex : winagro.bj / winagro.com | Avant Phase 6 (J15) |
| Tarifs publics (optionnel) | Liste produits/services | Phase 3 si voulu |

---

## 11 — Responsive & Accessibilité

### 11.1 Breakpoints

| BREAKPOINT | RÉSOLUTION | LAYOUT |
|---|---|---|
| Mobile (default) | < 768px | 1 colonne, font réduit, CTAs pleine largeur, hamburger menu |
| Tablet (sm/md) | 768 — 1024px | 2 colonnes pour les cards services et produits |
| Desktop (lg/xl) | ≥ 1024px | 3 colonnes, layout complet, sidebar visible |

### 11.2 Accessibilité — exigences WCAG 2.1 AA

- Tap targets : minimum 48px × 48px sur tous les éléments interactifs
- Contraste : ratio minimum 4.5:1 pour le texte standard
- Focus visible : outline sur tous les éléments focusables au clavier
- Alt text : obligatoire et descriptif sur toutes les images
- Sémantique HTML : `nav`, `main`, `section`, `article`, `h1`–`h3` utilisés correctement
- ARIA labels : sur les boutons icône (FAB WhatsApp, hamburger)
- Formulaire : labels associés à leurs champs, erreurs annoncées en `aria-live`

---

## 12 — Planning de Réalisation

18 jours ouvrables. 7 phases. Zéro livraison sans validation.

| PHASE | DURÉE | LIVRABLES | VALIDATION |
|---|---|---|---|
| Phase 1 — Setup | J1 — J2 | Repo GitHub · Next.js 15 + TypeScript + Tailwind + shadcn · ESLint + Prettier · Structure dossiers · Variables env | Accès repo client |
| Phase 2 — Composants | J3 — J5 | Layout Navbar + Footer · WhatsAppFAB · Design tokens Tailwind · Composants shadcn/ui | Review design system |
| Phase 3 — Sections 1/2 | J6 — J9 | Hero · Stats · Services · Produits · Intégration photos client | Validation copy + visuels |
| Phase 4 — Sections 2/2 | J10 — J12 | About · WhyUs · Testimonials · LeadForm + /api/lead · Logique WhatsApp pré-rempli | Test formulaire complet |
| Phase 5 — SEO | J13 — J14 | Metadata Next.js · Schema.org JSON-LD · next-sitemap · robots.txt · Balises OG | Validation Search Console |
| Phase 6 — Performance | J15 — J16 | Audit Lighthouse ≥ 90 · Tests responsive · WebP · Optimisation bundle · Animations | Rapport Lighthouse |
| Phase 7 — Livraison | J17 — J18 | Corrections finales · Déploiement Vercel + domaine · Formation client 30 min · README | Signature livraison |

> **Durée totale : 18 jours ouvrables — à compter de la réception du logo et de l'email client**

---

## 13 — Livrables

| # | LIVRABLE | FORMAT | MOMENT |
|---|---|---|---|
| 01 | Code source complet — propriété intégrale client | Repo GitHub privé — accès transféré | Phase 7 |
| 02 | Site déployé et accessible en ligne | URL Vercel + domaine configuré | Phase 7 |
| 03 | Rapport d'audit Lighthouse | PDF captures desktop + mobile | Phase 6 + 7 |
| 04 | Google Analytics 4 configuré | Accès compte GA4 transmis | Phase 5 |
| 05 | Google Search Console configuré | Accès + sitemap soumis | Phase 5 |
| 06 | Documentation technique | README.md (setup + déploiement) | Phase 7 |
| 07 | Session de formation client (30 min) | Appel vidéo : modifier textes, ajouter photos | Phase 7 |
| 08 | Garantie de maintenance | 30 jours post-livraison — corrections bugs | Phase 7 + 30j |
| 09 | Fichiers design system | Tokens Tailwind + palette documentée | Phase 7 |

---

## 14 — Conditions Commerciales & Juridiques

### 14.1 Périmètre du projet

**Inclus dans ce CDC :**

- Développement complet du site (11 sections + API Route + logique WhatsApp)
- Configuration SEO, Analytics, Search Console
- Déploiement Vercel + configuration domaine
- Formation client 30 minutes
- Maintenance 30 jours post-livraison (corrections bugs uniquement)
- Documents associés : copywriting complet + prompt de production

**Non inclus — facturation séparée si demandé :**

- Achat et gestion du nom de domaine (à la charge du client)
- Création du logo (le client fournit le logo)
- Rédaction ou traduction du contenu (le client fournit textes et photos)
- Fonctionnalités e-commerce / paiement en ligne
- Espace membre / authentification
- Blog ou système CMS
- Activation du parcours corporate (Option 2) — avenant tarifaire
- Maintenance mensuelle après la période de 30 jours garantie

### 14.2 Droits & propriété intellectuelle

À la livraison finale et après règlement complet, le client est propriétaire intégral du code source, du déploiement et de tous les assets produits. Keter Marketing conserve le droit de mentionner ce projet dans son portfolio, avec accord du client sur les visuels partagés.

### 14.3 Modifications hors périmètre

Toute fonctionnalité non mentionnée dans ce document fera l'objet d'un avenant écrit avant exécution. Aucune modification structurelle sans validation préalable.

### 14.4 Confidentialité

Document confidentiel, destiné exclusivement à Win Agro Agri Tech Solutions et à Keter Marketing. Reproduction ou diffusion à des tiers interdite sans accord écrit des deux parties.

---

## Signatures

| Pour Win Agro Agri Tech Solutions | Pour Keter Marketing |
|---|---|
| Nom : ____________________________ | **Dawes AKPOVI** |
| Date : ___________________________ | CEO & Co-founder |
| Signature : _______________________ | Avril 2025 |
| *Lu et approuvé* | |

---

*Ce document est confidentiel et destiné exclusivement à Win Agro Agri Tech Solutions*

*Rédigé par Keter Marketing — Dawes AKPOVI, CEO & Co-founder — Avril 2025*
