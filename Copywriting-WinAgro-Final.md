# Document de Copywriting Complet
## Plateforme Web Win Agro Agri Tech Solutions

**Rédigé par Keter Marketing — Dawes AKPOWI**
*Document de production · Confidentiel · Avril 2025*

---

| | |
|---|---|
| **Nature du document** | Copy de production — Toutes sections du site web |
| **Architecture cible** | Option 1 (SPA scalable vers Option 2) |
| **Rédigé par** | Keter Marketing — Dawes AKPOWI |
| **Client** | Win Agro Agri Tech Solutions — Victoire AHOGNON |
| **Version** | 1.0 — Avril 2025 |

---

## Introduction — Ce document est le cerveau du site

Il contient l'intégralité du texte qui ira sur la plateforme Win Agro — section par section, mot par mot. Rien n'est laissé au hasard ni à l'improvisation du développeur.

> « Un site qui vend, c'est 80% de copy et 20% de design. Ce document est votre 80%. »

### Comment lire ce document

Chaque section suit la même structure : le contexte stratégique, le texte final à intégrer tel quel, et les notes de production pour le développeur. Le texte en italique est une annotation — il ne va pas sur le site.

### Principes éditoriaux appliqués

| PRINCIPE | APPLICATION SUR CE SITE |
|---|---|
| Problème avant vision | Le hero parle au visiteur, pas à Victoire |
| CTA unique par section | Chaque service a un seul bouton d'action |
| Preuve avant promesse | Les chiffres arrivent avant les arguments |
| Tension narrative | Chaque section ouvre un problème avant de le résoudre |
| Scalabilité architecture | Le copy est écrit pour l'Option 1 et préparé pour l'Option 2 |

---

## Section 01 — Navigation

### Contexte stratégique

La navigation est le premier filtre de qualification. Chaque label doit indiquer immédiatement ce que le visiteur peut faire — pas ce que Victoire propose.

### Copy finale

| ÉLÉMENT | TEXTE FINAL | ANCRE / ROUTE |
|---|---|---|
| Logo + nom | Win Agro | → `#hero` (retour haut de page) |
| Lien 1 | Formation | → `#services` |
| Lien 2 | Accompagnement | → `#services` |
| Lien 3 | Produits | → `#produits` |
| Lien 4 | À propos | → `#about` |
| Lien 5 | Contact | → `#contact` |
| CTA nav principal | **Être accompagné →** | → `#contact` (bouton vert) |

> ✎ Le CTA nav est sticky. Il reste visible en permanence pendant tout le scroll. Couleur : vert `#098947`, border-bottom jaune `#FDDD00` au hover.

---

## Section 02 — Hero · `#hero`

### Contexte stratégique

Le hero a une seule mission : faire en sorte que le visiteur ne parte pas. Il ne décrit pas Win Agro. Il touche le problème du visiteur à la seconde où il arrive.

Le visiteur type arrive avec une de ces deux situations : soit il veut lancer un élevage mais il a peur de se planter, soit il élève déjà et les résultats ne sont pas là. Dans les deux cas, son problème numéro un, c'est la perte. Le hero doit nommer cette peur avant de proposer la solution.

### Copy finale

| ÉLÉMENT | TEXTE FINAL |
|---|---|
| **H1 — Titre (ligne 1)** | Tu veux lancer ou développer ton élevage au Bénin ? |
| **H1 — Titre (ligne 2)** | On t'accompagne jusqu'aux premiers résultats. |
| **Sous-titre** | Formation pratique, installation de ferme, vente de volailles et intrants agricoles. Win Agro Agri Tech Solutions est ton partenaire terrain depuis le premier jour. |
| **CTA principal** | Être accompagné sur mon projet → |
| **CTA secondaire** | Voir nos formations · Commander nos produits |

> ✎ H1 sur deux lignes. Première ligne : question directe. Deuxième ligne : promesse de résultat. Le mot "résultats" en couleur jaune `#FDDD00` ou vert `#098947` — c'est l'ancre émotionnelle.

> ✎ CTA principal : fond vert `#098947`, texte blanc, flèche →. CTA secondaire : texte simple, lien souligné, vert clair. Séparés par un point médian.

> ✎ Background : image plein écran (photo ferme béninoise) avec overlay vert profond `#076B37` à 60% d'opacité. En l'absence de photo, utiliser un gradient mesh `#076B37` → `#098947` avec texture grain (SVG noise filter).

---

## Section 03 — Stats · `#stats`

### Contexte stratégique

Cette section arrive juste sous le hero. Elle répond à la première question silencieuse du visiteur : "Mais est-ce qu'elle sait vraiment de quoi elle parle ?" Quatre chiffres. Rien de plus.

### Copy finale

| CHIFFRE | LABEL | SENS ÉMOTIONNEL |
|---|---|---|
| **500+** | porteurs de projets accompagnés | Elle n'est pas en train d'apprendre sur toi |
| **6** | filières d'élevage maîtrisées | Elle couvre ton besoin, quel qu'il soit |
| **24h** | délai de réponse garanti | Tu ne seras pas abandonné après la vente |
| **100%** | méthodes naturelles | Ce qu'elle fait est bon pour toi et tes animaux |

> ✎ Compteurs animés : chaque chiffre passe de 0 à sa valeur en 1.5s au scroll (Framer Motion whileInView once). Le chiffre est en grand, jaune `#FDDD00`. Le label en dessous, vert profond, taille normale.

---

## Section 04 — À Propos · `#about`

### Contexte stratégique

Structure **[C] — Confession**. Victoire ne parle pas de ses diplômes. Elle dit pourquoi elle a créé Win Agro. La motivation réelle crée l'attachement émotionnel. La vision 1000 hectares vient en fin de section — elle inspire sans bloquer la conversion.

### Copy finale

| BLOC | TEXTE FINAL |
|---|---|
| **Accroche — Hook** | J'ai vu trop de gens perdre leurs économies sur des projets d'élevage qui n'auraient pas dû échouer. |
| **Paragraphe 1 — Identité** | Je suis Victoire AHOGNON, promotrice de Win Agro Agri Tech Solutions. Depuis plusieurs années, j'accompagne des porteurs de projets à créer des élevages rentables et durables. Pas dans les salles de formation. Sur le terrain. |
| **Paragraphe 2 — Mission** | Ma mission est simple : te donner les animaux sélectionnés, les techniques adaptées à notre contexte, et le suivi qu'il faut pour traverser les premières semaines sans perte inutile. Que tu partes de zéro ou que tu veuilles améliorer ce que tu as déjà. |
| **Paragraphe 3 — Vision** | Et derrière tout ça, une vision qui me porte chaque jour : construire la plus grande ferme biologique intégrée d'Afrique. Former une génération d'agriculteurs modernes. Produire des aliments 100% naturels, accessibles, en quantité suffisante pour notre continent. |
| **Signature émotionnelle** | On y va ensemble. 🌱 |
| **CTA** | Prendre contact avec Victoire → |

> ✎ Photo de Victoire sur le terrain — pas en studio. Layout : texte à gauche (60%), photo à droite (40%). Sur mobile, photo en dessous.

> ✎ La ligne "vision 1000 hectares" est en style distinct — plus grande, couleur jaune `#FDDD00` ou vert profond — pour marquer le contraste entre la mission quotidienne et l'ambition long terme.

---

## Section 05 — Services · `#services`

### Contexte stratégique

Chaque service parle à un visiteur différent. Le formateur ne cherche pas la même chose que celui qui veut installer sa ferme. Le copy de chaque carte doit ouvrir la bonne blessure avant de proposer la bonne solution.

**Titre de la section :** Ce que nous faisons pour toi

---

### Service 01 — Formation Pratique

**Hook :**
> La plupart des formations en élevage t'apprennent à prendre des notes. La nôtre t'apprend à ne pas perdre tes animaux.

**Corps :**

Tu veux te lancer dans l'élevage — ou améliorer ce que tu fais déjà.

Le problème : beaucoup de formations sont déconnectées du contexte béninois. Tu sors avec un certificat. Mais quand la mortalité frappe ta première bande, tu ne sais pas quoi faire.

**Nos formations couvrent :**

- Élevage de volaille (chairs, pondeuses, pintades, dindes, cailles)
- Élevage de lapins
- Élevage de porc
- Nutrition animale
- Transformation agro-alimentaire

Disponible en présentiel et en ligne. Méthode 100% pratique, adaptée au terrain africain.

**CTA : Je veux me former →**

> ✎ Format présentiel ou en ligne selon le service. Préciser la disponibilité dans un encart dynamique.

---

### Service 02 — Accompagnement & Installation de Ferme

**Hook :**
> Tu arrives avec une idée. Tu repars avec une ferme qui tourne.

**Corps :**

Tu as un projet. Tu as peut-être même un terrain.

Mais tu ne sais pas par où commencer — et tu ne veux pas te planter au premier obstacle.

**Ce qu'on prend en charge :**

- L'étude de faisabilité de ton projet
- L'installation complète de ta ferme
- Le suivi technique post-installation
- Le coaching personnalisé en continu

Ce n'est pas une formation. C'est un accompagnement de bout en bout.

**CTA : Lancer mon projet →**

> ✎ Ce service est le plus haut en valeur. Le CTA doit visuellement ressortir davantage que les deux autres.

---

### Service 03 — Consultation & Diagnostic

**Hook :**
> Ta ferme tourne. Mais les résultats ne suivent pas. On va trouver pourquoi.

**Corps :**

Ta ferme existe. Tu investis du temps et de l'argent. Mais les marges ne sont pas là — ou les pertes sont trop fréquentes.

**On intervient pour :**

- Diagnostiquer ce qui bloque vraiment
- Résoudre les problèmes techniques concrets
- Optimiser tes performances sur le terrain

Une intervention, des résultats mesurables.

**CTA : Demander une consultation →**

---

## Section 06 — Produits · `#produits`

### Contexte stratégique

Le catalogue ne s'appelle pas "Nos produits". Il s'appelle ce qu'il fait pour le visiteur. Chaque sous-catégorie ouvre sur un problème avant de lister les références.

**Titre de section :** Animaux sélectionnés. Intrants de qualité. Livraison directe.

**Sous-titre :** Ce qu'on vend n'est pas disponible dans n'importe quelle ferme. Nos animaux sont sélectionnés pour leur robustesse et leur adaptation au climat béninois.

---

### Catégorie 1 — Élevage (Animaux vivants)

**Accroche :** Des animaux sélectionnés pour le terrain béninois — pas pour le catalogue.

- Poussins d'un jour (coquellets, goliaths, pondeuses)
- Pintadeaux, dindonneaux, cailletaux
- Lapins — consommation et reproduction
- Volailles prêtes à consommer
- Œufs de table frais

### Catégorie 2 — Nutrition Animale

**Accroche :** La mortalité dans les élevages béninois vient souvent d'une alimentation mal adaptée.

- Provendes de qualité — gros et détail
- Conseils personnalisés en alimentation inclus à chaque commande

### Catégorie 3 — Agriculture

**Accroche :** Pour diversifier ton exploitation et augmenter sa valeur.

- Plants d'eucalyptus et autres espèces
*(disponibilité : nous contacter)*

**CTA global : Commander sur WhatsApp →**
Lien : `https://wa.me/2290161336548`

> ✎ Chaque carte produit affiche : nom, accroche courte (1 ligne), liste, CTA WhatsApp. Pas de prix affiché sauf si Victoire confirme les tarifs publics. Le CTA WhatsApp pré-remplit le message avec le nom du produit.

---

## Section 07 — Différenciation · `#pourquoi-nous`

### Contexte stratégique

Structure **[R] — Retournement**. Cette section contredit l'attente standard du marché. Le titre ne dit pas "Nos avantages". Il pose la vraie question que le visiteur a en tête.

### Copy finale

**Titre de section :**

> Beaucoup de prestataires t'accompagnent jusqu'à la vente. Nous, on t'accompagne jusqu'aux résultats. Ce n'est pas la même chose.

| ARGUMENT | TITRE CARTE | TEXTE CARTE |
|---|---|---|
| 01 | Expertise terrain béninoise | On ne t'applique pas des méthodes importées d'Europe. On travaille avec le contexte : le climat, les intrants disponibles, les marchés locaux. Ce qu'on t'enseigne fonctionne ici. |
| 02 | Résultats mesurables | Nos clients voient des résultats concrets : taux de survie amélioré, coûts maîtrisés, fermes qui deviennent rentables dès les premiers cycles. |
| 03 | Présence après la vente | Tu n'es pas seul après la formation ou l'installation. On reste joignables. On suit. On intervient si besoin. |
| 04 | Vision naturelle et durable | Zéro intrant chimique. Des méthodes saines pour toi, pour tes animaux, pour la terre. C'est une conviction. Pas un argument marketing. |
| 05 | Réseau Afrique & Europe | Un réseau en construction qui grandit chaque mois — pour te connecter à des opportunités au-delà des frontières de ton village ou de ta ville. |

---

## Section 08 — Témoignages · `#témoignages`

### Contexte stratégique

Cette section ne peut pas être écrite sans Victoire. Elle doit fournir trois témoignages réels. Voici le format exact et le template à donner au client pour les collecter.

**Titre de section :** Ils ont démarré comme toi. Voilà où ils en sont.

### Format obligatoire — à donner à Victoire

| CHAMP | CONTENU ATTENDU | EXEMPLE |
|---|---|---|
| Résultat concret | Ce que le client a obtenu — chiffre ou fait précis | Mon taux de mortalité est passé de 30% à 8% en deux cycles. |
| Avant | Situation initiale du client — problème ou blocage | Avant, je perdais un tiers de mes poussins sans comprendre pourquoi. |
| Action de Victoire | Ce qu'elle a fait concrètement | Victoire a diagnostiqué mon alimentation et changé ma provende dès la première visite. |
| Aujourd'hui | Résultat actuel, mesurable | Aujourd'hui ma ferme de 500 sujets tourne à plein régime depuis 6 mois. |
| Identité | Prénom Nom, Localité | — Kofi A., Parakou |

> ✎ Chaque témoignage = une carte avec : résultat en gros (bold, vert), corps du texte en dessous, photo du client si disponible (ronde), nom + localité. Carousel sur mobile, 3 colonnes sur desktop.

> ⚠ **BLOQUER LE LANCEMENT** : ne pas mettre en ligne sans au moins 2 témoignages réels. Un site sans social proof perd 40% de ses conversions potentielles.

---

## Section 09 — Contact & CTA Final · `#contact`

### Contexte stratégique

Cette section est le closing du site. Après le hero, c'est le deuxième endroit où les conversions se décident. Le copy doit être direct, chaud, et ôter la dernière friction. Pas de discours. Juste l'invitation à agir maintenant.

### Copy finale

| ÉLÉMENT | TEXTE FINAL |
|---|---|
| **Accroche principale** | Tu as un projet. Une question. Une commande. Ne reste pas bloqué. Écris maintenant — je réponds sous 24h. |
| **Sous-accroche** | Victoire répond personnellement. Pas un assistant. Pas un formulaire perdu dans une boîte mail. Elle. |
| **Téléphone 1** | 📱 +229 0161336548 (appel direct · WhatsApp) |
| **Téléphone 2** | 📱 +229 0147221458 (appel direct) |
| **WhatsApp CTA** | 💬 Écrire sur WhatsApp → |
| **Titre formulaire** | Ou remplis ce formulaire — je te rappelle. |
| **Champ 1 — Nom** | Ton prénom et ton nom * |
| **Champ 2 — Téléphone** | Ton numéro WhatsApp * (on te rappelle dessus) |
| **Champ 3 — Intérêt** | Ce qui t'intéresse * (liste déroulante — 7 options) |
| **Champ 4 — Message** | Décris ton projet en quelques mots (optionnel) |
| **CTA formulaire** | Envoyer ma demande → |
| **Message confirmation** | Reçu ✓ Victoire te contacte dans les 24h. 🌱 |

### Options du menu déroulant (Champ 3)

| # | VALEUR AFFICHÉE | VALEUR TECHNIQUE |
|---|---|---|
| 01 | Formation élevage | `formation_elevage` |
| 02 | Installation de ferme | `installation_ferme` |
| 03 | Consultation / Diagnostic | `consultation` |
| 04 | Achat de volailles ou poussins | `achat_volailles` |
| 05 | Commande de provendes | `commande_provendes` |
| 06 | Autre produit agricole | `autre_produit` |
| 07 | Autre demande | `autre` |

---

## Section 10 — Micro-Copy & Automatisations

Les petits textes qui font les grandes conversions. Chaque mot compte. Chaque friction éliminée est une conversion sauvée.

### 10.1 Message WhatsApp Pré-rempli

À la soumission du formulaire, le visiteur est redirigé vers WhatsApp avec ce message automatiquement pré-rempli. Les variables entre crochets sont injectées depuis le formulaire.

```
Bonjour Victoire,

Je m'appelle [NOM COMPLET].
Je suis intéressé(e) par : [SERVICE SÉLECTIONNÉ].

[MESSAGE LIBRE]

Mon numéro : [TÉLÉPHONE]
```

### 10.2 Messages Système

| CONTEXTE | TEXTE FINAL |
|---|---|
| Confirmation formulaire (en page) | Reçu ✓ Victoire te contacte dans les 24h. 🌱 |
| Email confirmation (objet) | Win Agro — Ta demande a bien été reçue |
| Email confirmation (corps, 1ère ligne) | Victoire a bien reçu ta demande. Elle te recontacte dans les 24h sur le numéro que tu as fourni. |
| Email notification interne (objet) | 🌱 Nouveau lead Win Agro — [SERVICE] — [NOM] |
| Bouton WhatsApp flottant (tooltip) | Une question ? Écris à Victoire → |
| Erreur champ vide | Ce champ est requis pour que Victoire puisse te recontacter. |
| Erreur numéro invalide | Vérifie ce numéro — il nous faut un numéro valide pour te rappeler. |
| Placeholder Nom | Ton prénom et ton nom |
| Placeholder Téléphone | +229 XXXXXXXXXX |
| Placeholder Message | Décris ton projet en quelques mots (facultatif)... |

---

## Section 11 — SEO Copy

Les textes que Google lit. Et qui font rankuer.

### 11.1 Balises principales

| | |
|---|---|
| **Meta title** | Élevage au Bénin — Formation, Installation, Vente \| Win Agro Agri Tech |
| **Meta description** | Win Agro Agri Tech Solutions t'accompagne dans ton projet d'élevage au Bénin. Formation pratique, installation de ferme, vente de volailles et provendes. Victoire AHOGNON, experte terrain. |
| **H1 unique** | Lance ou développe ton élevage au Bénin — avec quelqu'un qui connaît le terrain. |
| **OG title** | Win Agro Agri Tech Solutions — Formation & Élevage au Bénin |
| **OG description** | Formations pratiques, installation de ferme et vente d'animaux sélectionnés. Victoire AHOGNON t'accompagne jusqu'aux résultats. |
| **Canonical URL** | https://winagro.bj (ou domaine retenu par le client) |

### 11.2 Mots-clés par priorité

| PRIORITÉ | MOT-CLÉ | SECTION CIBLE |
|---|---|---|
| P1 — Haute | production animale Bénin | H1, H2, meta |
| P1 — Haute | formation élevage Bénin | Services, H2 |
| P1 — Haute | vente poulet Cotonou | Produits, H2 |
| P2 — Moyen | provendes Bénin qualité | Produits, méta |
| P2 — Moyen | services vétérinaires bénin | Services |
| P2 — Moyen | installation ferme avicole Bénin | Services |
| P3 — Longue traîne | acheter poussins d'un jour Bénin | Produits |
| P3 — Longue traîne | formation élevage volaille Afrique en ligne | Services — Formation |
| P3 — Longue traîne | consultant ferme avicole Bénin | About, Services |

---

## Section 12 — Footer

### Contexte stratégique

Le footer est le dernier endroit où un visiteur non-converti peut encore agir. Il doit contenir un dernier CTA et les contacts directs — pas seulement des liens légaux.

### Copy finale

| BLOC | TEXTE FINAL |
|---|---|
| **Tagline footer** | Nous cultivons des élevages rentables. Et la vision d'une Afrique agricole moderne. |
| **Colonne 1 — Titre** | Services |
| **Colonne 1 — Liens** | Formation · Accompagnement & Installation · Consultation & Diagnostic |
| **Colonne 2 — Titre** | Produits |
| **Colonne 2 — Liens** | Volailles & Animaux · Nutrition Animale · Agriculture |
| **Colonne 3 — Titre** | Contact |
| **Colonne 3 — Contenu** | +229 0161336548 · +229 0147221458 · [email fourni par Victoire] |
| **CTA footer** | Être accompagné → (bouton vert) |
| **Copyright** | © 2025 Win Agro Agri Tech Solutions — Conçu par Keter Marketing |
| **Mentions légales** | Politique de confidentialité · Mentions légales |

> ✎ Fond footer : `#0F1F14` (noir vert profond). Texte : blanc et jaune `#FDDD00`. Liseré vert `#098947` en haut du footer. Le logo Win Agro est lisible sur ce fond — contraste 4.8:1 pour le vert, 10.2:1 pour le jaune.

---

## Section 13 — Copy Option 2 · Parcours Institutionnel (Futur)

Ce qu'on n'écrit pas aujourd'hui. Mais qu'on prépare.

L'Option 2 s'active quand trois signaux apparaissent. Ce document trace les grandes lignes du copy institutionnel pour ne pas repartir de zéro le moment venu.

### Signaux de déclenchement

| SIGNAL | DESCRIPTION | ACTION |
|---|---|---|
| 01 — Partenaires | Win Agro reçoit des demandes de partenariats (ONG, institutions, distributeurs) | Activer le parcours `/partenaires` avec copy B2B |
| 02 — Investisseurs | Demandes de financement, appels à projets BOAD / AFD / fonds agricoles | Activer `/investisseurs` avec métriques + vision + impact |
| 03 — Médias | Couverture presse, interviews, demandes de dossiers | Activer `/presse` avec kit média téléchargeable |

### Copy institutionnel — Ébauche

| PAGE | TITRE | ACCROCHE |
|---|---|---|
| `/vision` | La plus grande ferme biologique intégrée d'Afrique. | Ce n'est pas un slogan. C'est un plan. Win Agro construit méthodiquement ce que personne n'a encore réalisé à l'échelle du continent. |
| `/partenaires` | Construisons ensemble ce qui nourrit l'Afrique de demain. | Win Agro cherche des partenaires qui ont compris que l'avenir agricole africain se joue maintenant. Pas dans dix ans. |
| `/investisseurs` | Un marché de 400 millions de personnes. Une seule question : quand entrer ? | Les données de Win Agro parlent d'elles-mêmes. 500+ projets accompagnés. Une méthode éprouvée. Une vision continentale. |

---

## Note sur l'authenticité

Ce document encode une mécanique d'écriture. Il ne remplace pas le vécu.

Le contenu le plus fort sort toujours d'une combinaison : **mécanique solide** + **vrai vécu personnel ancré dans le texte**.

Si Victoire n'a pas de vécu à ancrer sur une section, demander avant de rédiger. Un post sans ancrage réel sonne générique, quelle que soit la qualité de la structure.

---

*Document confidentiel et destiné exclusivement à Win Agro Agri Tech Solutions*

*Rédigé par Keter Marketing — Dawes AKPOWI, CEO & Co-founder — Avril 2025*
