__YEHI OR TECH__

*Academia Helm  \-\-  MediHelm  \-\-  Travel Helm  \-\-  LifeHelm*

__SECURITY__

__HARDENING GUIDE__

*HYPER HIGH LEVEL*

Stack : Next\.js  \-\-  NestJS  \-\-  PostgreSQL  \-\-  Prisma ORM  \-\-  Vercel  \-\-  Fly\.io  \-\-  Cloudflare R2

Referentiel : OWASP Top 10 2025  \-\-  NIST CSF  \-\-  ISO 27001

__Version 1\.0  \-\-  Avril 2026  \-\-  CONFIDENTIEL__

__Perimetre__

Academia Helm, MediHelm, Travel Helm, LifeHelm

__Referentiels__

OWASP Top 10 2025, NIST Cybersecurity Framework, ISO 27001

__CTO & Auteur__

Senakpon Dawes Akpovi \-\- YEHI OR Tech

__Version__

1\.0 \-\- Document de reference officiel

__Statut__

CONFIDENTIEL \-\- Usage interne YEHI OR Tech uniquement

__01__

__INTRODUCTION & PHILOSOPHIE DE SECURITE__

*Security by Design \-\- Anticiper avant de reparer*

__Philosophie : __*"Security by Design" \-\- la securite n'est pas une couche additionnelle\. Elle est integree a chaque decision d'architecture, de code et d'infrastructure\. Chaque developpeur est responsable de la securite de ce qu'il ecrit\.*

__Proverbe 22:3 \-\- __*"L'homme prudent voit le danger et se met a l'abri\." Cette vision guide notre approche : anticiper avant de reparer\.*

## __Perimetre d'application__

__\+ __Academia Helm \-\- SaaS multi\-tenant de gestion scolaire \(donnees eleves, parents, notes\)

__\+ __MediHelm \-\- SaaS de gestion pharmaceutique \(donnees medicales, ordonnances, stock\)

__\+ __Travel Helm \-\- Marketplace B2B/B2C de transport \(paiements, reservations, trajets\)

__\+ __LifeHelm \-\- Application de gestion de vie personnelle \(donnees ultra\-sensibles\)

## __Niveaux de criticite__

__Niveau__

__Definition__

__Consequence sur le deploiement__

CRITIQUE

Exploitation directe possible \-\- impact catastrophique immediat

Bloquer le deploiement si non resolu

ELEVE

Exploitation probable avec dommages significatifs

A corriger avant mise en production

MODERE

Risque reel mais necessite conditions specifiques

A corriger dans le sprint suivant

FAIBLE

Bonne pratique defensive

A integrer dans le cycle normal

__02__

__AUTHENTIFICATION & GESTION DES SESSIONS__

*Premier rempart \-\- Une faille ici donne acces a tout le reste*

L'authentification est le premier rempart\. Chaque plateforme YEHI OR Tech manipule des donnees sensibles \-\- une compromission d'acces peut etre fatale a la reputation et a la viabilite legale de l'entreprise\.

## __2\.1 Hachage des mots de passe__

__CRITIQUE__

Lecon LinkedIn 2012 : hacher sans salt = desastre\. Regle absolue pour toutes les plateformes YEHI OR Tech\.

// NestJS \-\- bcrypt avec salt rounds minimum 12

import \* as bcrypt from 'bcrypt';

const SALT\_ROUNDS = 12;

const hash    = await bcrypt\.hash\(password, SALT\_ROUNDS\);

const isValid = await bcrypt\.compare\(password, hash\);

 

// Alternative recommandee pour nouveaux projets : Argon2

import \* as argon2 from 'argon2';

const hash = await argon2\.hash\(password, \{ type: argon2\.argon2id \}\);

__INTERDIT__

Ne jamais utiliser MD5, SHA1, ou SHA256 brut pour les mots de passe\.

__Salt__

Automatiquement inclus dans bcrypt \-\- ne pas gerer manuellement\.

__Argon2id__

Prefere pour les nouveaux projets\. Plus resistant aux attaques GPU\.

## __2\.2 Authentification Multi\-Facteurs \(MFA\)__

__ELEVE__

Obligatoire pour tous les acces administrateurs\. Fortement recommande pour les utilisateurs finaux\.

// NestJS \-\- Integration TOTP avec speakeasy

import \* as speakeasy from 'speakeasy';

 

const secret = speakeasy\.generateSecret\(\{ name: 'AcademiaHelm' \}\);

const verified = speakeasy\.totp\.verify\(\{

  secret: secret\.base32,

  encoding: 'base32',

  token: userToken

\}\);

## __2\.3 Gestion des JWT__

__CRITIQUE__

Mauvaise configuration JWT = acces permanent non revocable\. Impact immediat sur toutes les donnees d'un tenant\.

__Parametre JWT__

__Valeur requise__

Duree access token

15 minutes maximum

Duree refresh token

7 jours maximum

Algorithme signature

RS256 \(asymetrique\) \-\- jamais HS256 en production

Stockage refresh token

En base de donnees avec hash \-\- jamais en clair

Revocation

Blacklist Redis operationnelle pour invalidation immediate

Payload JWT

Jamais de donnees sensibles dans le payload

Cle secrete

Minimum 256 bits \-\- stockee dans les secrets Vercel/Fly\.io

// NestJS \-\- Configuration JWT securisee

JwtModule\.register\(\{

  secret: process\.env\.JWT\_SECRET, // min 256 bits

  signOptions: \{

    expiresIn: '15m',

    algorithm: 'RS256'

  \}

\}\)

## __2\.4 Protection Brute Force & Rate Limiting Auth__

__ELEVE__

Blocage progressif obligatoire sur toutes les routes d'authentification\.

// NestJS \-\- Rate limiting avec @nestjs/throttler

ThrottlerModule\.forRoot\(\[\{

  name: 'auth',

  ttl: 60000,

  limit: 5  // 5 tentatives max par minute

\}\]\)

__\+ __5 echecs \-> lockout 15 minutes

__\+ __10 echecs \-> lockout 1 heure

__\+ __15 echecs \-> lockout 24 heures \+ alerte admin

__\+ __Notification email automatique apres 3 tentatives echouees

__\+ __CAPTCHA declenche apres 3 echecs consecutifs

__\+ __Rate limiting : 5 requetes / minute / IP sur /auth/\*

__03__

__CONTROLE D'ACCES & MULTI\-TENANCY__

*Vulnerabilite \#1 OWASP 2025 \-\- Priorite absolue pour Academia Helm*

Pour Academia Helm specifiquement, la separation des tenants \(ecoles\) est une exigence absolue et non negociable\. Un directeur d'ecole ne doit JAMAIS voir les donnees d'une autre ecole\. Cette regle est verifiee a chaque requete, sans exception\.

## __3\.1 Architecture RBAC \-\- Roles par Plateforme__

__Plateforme__

__Admin Systeme__

__Admin Tenant__

__Utilisateurs__

Academia Helm

SUPER\_ADMIN

SCHOOL\_ADMIN / DIRECTOR

TEACHER / PARENT / STUDENT / ACCOUNTANT

MediHelm

SUPER\_ADMIN

PHARMACY\_ADMIN

PHARMACIST / CLIENT

Travel Helm

SUPER\_ADMIN

COMPANY\_ADMIN

DRIVER / PASSENGER

LifeHelm

SUPER\_ADMIN

N/A

USER

## __3\.2 Modele Prisma \-\- UserRole Multi\-Tenant__

__CRITIQUE__

Chaque role DOIT etre scope par tenantId\. Sans cette contrainte, l'isolation des ecoles est impossible\.

// prisma/schema\.prisma \-\- Modele de roles multi\-tenant

model UserRole \{

  id       String   @id @default\(cuid\(\)\)

  userId   String

  tenantId String   // TOUJOURS scoper par tenant \-\- sans exception

  role     RoleEnum

 

  @@unique\(\[userId, tenantId\]\)

\}

## __3\.3 TenantGuard NestJS \-\- Validation Obligatoire__

__CRITIQUE__

Ce guard doit etre applique sur TOUTES les routes protegees de l'API Academia Helm\. Aucune exception\.

// NestJS \-\- TenantGuard : validation cross\-tenant

@Injectable\(\)

export class TenantGuard implements CanActivate \{

  canActivate\(ctx: ExecutionContext\): boolean \{

    const req          = ctx\.switchToHttp\(\)\.getRequest\(\);

    const userTenantId  = req\.user\.tenantId;

    const paramTenantId = req\.params\.tenantId;

 

    // Toute tentative cross\-tenant = ForbiddenException \+ audit log

    if \(userTenantId \!== paramTenantId\)

      throw new ForbiddenException\('Cross\-tenant access denied'\);

 

    return true;

  \}

\}

## __3\.4 PostgreSQL Row\-Level Security \(RLS\)__

__MODERE__

Couche de securite supplementaire au niveau base de donnees \-\- renforce le TenantGuard applicatif\.

\-\- PostgreSQL RLS \-\- isolation tenant au niveau base de donnees

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

 

CREATE POLICY tenant\_isolation ON students

  USING \(tenant\_id = current\_setting\('app\.current\_tenant'\)::uuid\);

 

\-\- Appliquer sur toutes les tables critiques :

\-\- students, enrollments, payments, grades, employees, etc\.

__\+ __Chaque query Prisma doit inclure un filtre tenantId \-\- AUCUNE exception

__\+ __Tests automatises d'isolation de tenant dans la CI/CD pipeline

__\+ __Audit log systematique de chaque tentative d'acces cross\-tenant

__\+ __RLS PostgreSQL comme filet de securite supplementaire

__04__

__PREVENTION DES INJECTIONS__

*SQL Injection \-\- XSS \-\- Command Injection*

## __4\.1 SQL Injection \-\- Prisma & Raw Queries__

__CRITIQUE__

Avec Prisma ORM, le risque est naturellement reduit \-\- mais les raw queries restent dangereuses sans precautions\.

// DANGEREUX \-\- A ne JAMAIS faire

await prisma\.$queryRaw\(\`SELECT \* FROM users WHERE id = $\{userId\}\`\);

 

// CORRECT \-\- Parametres types avec Prisma\.sql

await prisma\.$queryRaw\(Prisma\.sql\`SELECT \* FROM users WHERE id = $\{userId\}\`\);

 

// MIEUX \-\- Utiliser les methodes ORM Prisma en priorite

await prisma\.student\.findUnique\(\{ where: \{ id: studentId \} \}\);

__\+ __Utiliser EXCLUSIVEMENT les methodes ORM Prisma \(findMany, findUnique, create\.\.\.\)

__\+ __Si raw query inevitable : Prisma\.sql template literals uniquement \-\- jamais de concatenation

__\+ __Activer le query logging en developpement pour detecter les anomalies

__\+ __Revue de code systematique de toutes les raw queries avant merge

## __4\.2 XSS \-\- Cross\-Site Scripting__

__ELEVE__

Academia Helm affiche des donnees eleves dans l'interface \-\- un XSS stocke peut exfiltrer des donnees sensibles de families\.

// Next\.js \-\- Sanitization DOMPurify cote client

import DOMPurify from 'dompurify';

const clean = DOMPurify\.sanitize\(userInput\);

 

// NestJS \-\- Sanitization avec class\-validator \+ class\-transformer

@IsString\(\)

@Transform\(\(\{ value \}\) => sanitize\(value\)\)

username: string;

 

// next\.config\.js \-\- Content Security Policy stricte

headers: \[\{

  key: 'Content\-Security\-Policy',

  value: "default\-src 'self'; script\-src 'self' 'nonce\-\{NONCE\}'"

\}\]

__\+ __Jamais de dangerouslySetInnerHTML sans sanitization DOMPurify prealable

__\+ __HttpOnly cookies \-\- inaccessibles depuis JavaScript \-\- obligatoire pour les tokens

__\+ __Content Security Policy \(CSP\) stricte dans les headers Next\.js

__\+ __Validation de toutes les entrees utilisateur avant rendu

## __4\.3 Validation Globale des Entrees \-\- NestJS ValidationPipe__

__CRITIQUE__

La validation globale doit etre activee des l'initialisation de l'application NestJS\. Sans cela, toutes les routes sont vulnerables\.

// main\.ts \-\- ValidationPipe global obligatoire

app\.useGlobalPipes\(new ValidationPipe\(\{

  whitelist: true,             // Supprimer les champs inconnus

  forbidNonWhitelisted: true,  // Rejeter si champs inconnus

  transform: true,             // Auto\-transformation des types

  disableErrorMessages: false,

\}\)\);

__05__

__SECURITE DES APIS & ENDPOINTS__

*Colonne vertebrale des plateformes \-\- Sa securisation est non\-negociable*

## __5\.1 CORS \-\- Cross\-Origin Resource Sharing__

__ELEVE__

CORS trop permissif = n'importe quel site peut appeler l'API Academia Helm au nom d'un utilisateur connecte\.

// NestJS main\.ts \-\- CORS restrictif avec whitelist explicite

app\.enableCors\(\{

  origin: \[

    'https://academiahelm\.com',

    'https://\*\.academiahelm\.com',  // Wildcard sous\-domaines

    process\.env\.NODE\_ENV === 'development'

      ? 'http://localhost:3000'

      : ''

  \]\.filter\(Boolean\),

  credentials: true,

  methods: \['GET','POST','PUT','DELETE','PATCH'\],

\}\);

## __5\.2 Rate Limiting Differencie par Route__

__ELEVE__

Trois niveaux de throttling selon la sensibilite de la route\. A configurer avant tout deploiement production\.

__Type de route__

__Limite__

Routes d'authentification

5 requetes / minute / IP

Routes publiques \(landing, SARA\)

20 requetes / minute

API generale \(school\.academiahelm\.com\)

100 requetes / minute

Generation PDF \(bulletins, recus\)

10 requetes / minute

Exports \(EducMaster, CNSS\)

5 requetes / heure

// NestJS \-\- Rate limiting differencie

@Throttle\(\{ default: \{ limit: 100, ttl: 60000 \} \}\)  // Global

@Throttle\(\{ auth:    \{ limit: 5,   ttl: 60000 \} \}\)  // Auth routes

@Throttle\(\{ public:  \{ limit: 20,  ttl: 60000 \} \}\)  // Routes publiques

## __5\.3 Headers HTTP de Securite \-\- Helmet\.js__

__ELEVE__

Headers actives via Helmet\.js sur l'ensemble de l'API NestJS\. Obligatoire avant mise en production\.

// NestJS \-\- Helmet\.js pour les headers de securite

import helmet from 'helmet';

 

app\.use\(helmet\(\{

  contentSecurityPolicy: \{

    directives: \{ defaultSrc: \["'self'"\] \}

  \},

  hsts: \{

    maxAge: 31536000,        // 1 an

    includeSubDomains: true,

    preload: true

  \},

  noSniff: true,

  xssFilter: true,

\}\)\);

__Header HTTP__

__Protection apportee__

X\-Frame\-Options: DENY

Prevention clickjacking

X\-Content\-Type\-Options: nosniff

Prevention MIME sniffing

Strict\-Transport\-Security

Forcer HTTPS sur tous les domaines

Referrer\-Policy: strict\-origin

Controle des informations de referrer

Content\-Security\-Policy

Prevention XSS, controle des ressources chargees

__06__

__CRYPTOGRAPHIE & PROTECTION DES DONNEES__

*Donnees d'eleves mineurs \+ donnees medicales = chiffrement non optionnel*

Academia Helm traite des donnees d'eleves mineurs\. MediHelm traite des donnees medicales\. Ces categories font l'objet de reglementations strictes en Afrique et internationalement\. Le chiffrement est une obligation legale et ethique, pas un choix\.

## __6\.1 Chiffrement des Donnees au Repos__

__CRITIQUE__

Les champs sensibles doivent etre chiffres en base avant stockage \-\- AES\-256\-GCM\. Les cles ne doivent jamais etre dans le code source\.

// Node\.js \-\- Chiffrement AES\-256\-GCM des champs sensibles

import \{ createCipheriv, randomBytes, createDecipheriv \} from 'crypto';

 

const ALGO = 'aes\-256\-gcm';

const KEY  = Buffer\.from\(process\.env\.ENCRYPTION\_KEY, 'hex'\); // 32 bytes

 

// Champs a chiffrer dans Academia Helm :

// \- numeros de telephone parents

// \- adresses domicile

// \- informations medicales \(infirmerie\)

// \- donnees de paie \(salaires, comptes bancaires\)

__Regle__

__Detail__

Champs a chiffrer \(Academia Helm\)

Telephones, adresses, donnees medicales infirmerie, salaires, CNSS

Gestion des cles

Key Management Service \(KMS\) \-\- jamais dans les variables \.env

Rotation des cles

Tous les 90 jours avec processus de re\-chiffrement planifie

Neon PostgreSQL

Activer le chiffrement at\-rest natif sur la base de donnees

Cloudflare R2

Chiffrement automatique des objets stockes active

## __6\.2 Gestion des Variables d'Environnement__

__CRITIQUE__

Jamais de secrets dans le code source\. Jamais de \.env commite dans Git\. Verification mensuelle obligatoire\.

\# \.gitignore \-\- obligatoire dans tous les repositories YEHI OR Tech

\.env

\.env\.local

\.env\.production

\.env\.staging

\*\.pem

\*\.key

 

\# Fly\.io \-\- injection des secrets en production

fly secrets set DATABASE\_URL=postgres://\.\.\. JWT\_SECRET=\.\.\. ENCRYPTION\_KEY=\.\.\.

 

\# Vercel \-\- variables d'environnement chiffrees via dashboard

\# Jamais de NEXT\_PUBLIC\_ pour les secrets \-\- accessible cote client

__\+ __Audit mensuel avec git\-secrets ou TruffleHog pour detecter les leaks historiques

__\+ __Vercel : Environment Variables chiffrees dans le dashboard \-\- jamais en dur dans le code

__\+ __Fly\.io : fly secrets set \-\- jamais dans fly\.toml

__\+ __Separation stricte des environnements : dev / staging / production

## __6\.3 HTTPS & Certificats TLS__

__CRITIQUE__

TLS 1\.3 minimum sur tous les domaines academiahelm\.com\. Desactiver TLS 1\.0 et 1\.1\.

__\+ __TLS 1\.3 minimum \-\- desactiver TLS 1\.0 et 1\.1 sur Fly\.io et Vercel

__\+ __Certificats Let's Encrypt auto\-renouveles \-\- alertes 30 jours avant expiration

__\+ __HSTS preload active sur tous les domaines YEHI OR Tech

__\+ __Certificate Transparency monitoring pour detecter les certificats frauduleux

__07__

__SECURITE DES FICHIERS & UPLOADS__

*Bulletins \-\- Photos \-\- Ordonnances \-\- Vecteur d'attaque tres sous\-estime*

Academia Helm gere des uploads de fichiers : photos d'eleves, bulletins, certificats, pieces d'identite, documents RH\. C'est l'un des vecteurs d'attaque les plus sous\-estimes dans les applications SaaS\.

## __7\.1 Validation Stricte des Fichiers__

__ELEVE__

Ne jamais faire confiance a l'extension du fichier \-\- verifier les magic bytes\. Un \.jpg peut contenir du code executable\.

// NestJS \-\- Validation des fichiers uploades

@UseInterceptors\(FileInterceptor\('file', \{

  fileFilter: \(req, file, cb\) => \{

    const allowed = \['image/jpeg', 'image/png', 'application/pdf'\];

    if \(\!allowed\.includes\(file\.mimetype\)\) \{

      return cb\(

        new BadRequestException\('Type de fichier non autorise'\),

        false

      \);

    \}

    cb\(null, true\);

  \},

  limits: \{ fileSize: 5 \* 1024 \* 1024 \}  // 5MB maximum

\}\)\)

__Regle upload__

__Implementation__

Validation MIME type

Verifier le mimetype ET les magic bytes du fichier \-\- pas seulement l'extension

Scan antivirus

ClamAV ou service cloud \(VirusTotal API\) avant tout stockage definitif

Renommage obligatoire

Renommer avec UUID v4 \-\- jamais conserver le nom original \(traversal attack\)

Stockage securise

Cloudflare R2 uniquement \-\- JAMAIS dans le dossier public accessible en clair

Acces temporaire

URLs signees de 15 minutes maximum pour les fichiers prives

Taille maximale

5 MB par fichier \-\- configurable par type de document

// Cloudflare R2 \-\- URL signee temporaire \(15 minutes\)

const url = await r2\.getSignedUrl\('getObject', \{

  Bucket: process\.env\.R2\_BUCKET,

  Key:    fileKey,        // UUID genere au stockage

  Expires: 900            // 15 minutes

\}\);

__08__

__SECURITE INFRASTRUCTURE \-\- VERCEL, FLY\.IO & POSTGRESQL__

*La securite du code est inutile si l'infrastructure est vulnerable*

## __8\.1 Fly\.io \-\- NestJS Backend__

__ELEVE__

Configuration Fly\.io securisee requise avant tout deploiement en production\.

\# fly\.toml \-\- Configuration securisee

\[http\_service\]

  internal\_port    = 3001

  force\_https      = true

  auto\_stop\_machines = true

 

\[\[vm\]\]

  memory   = '512mb'

  cpu\_kind = 'shared'

__\+ __Fly\.io Firewall Rules \-\- whitelist IP Vercel uniquement \-\- bloquer tout acces direct

__\+ __Endpoint /health dedie et sans informations sensibles pour les health checks

__\+ __Secrets chiffres : fly secrets set DATABASE\_URL=\.\.\. JWT\_SECRET=\.\.\. ENCRYPTION\_KEY=\.\.\.

__\+ __Deploiements zero\-downtime avec rolling updates \-\- jamais de downtime en production

## __8\.2 Vercel \-\- Next\.js Frontend__

__ELEVE__

L'isolation des sous\-domaines par tenant est critique pour Academia Helm\.

__\+ __Wildcard subdomain isolation par tenant \(\*\.academiahelm\.com\)

__\+ __Edge Middleware pour validation des sous\-domaines et redirection tenant

__\+ __Desactiver les preview deployments en environnement de production

__\+ __IP allowlist pour les routes d'administration \(admin\.academiahelm\.com\)

__\+ __Audit regulier des variables NEXT\_PUBLIC\_ \-\- aucun secret ne doit etre expose cote client

__\+ __Vercel Analytics active pour detecter les anomalies de trafic

## __8\.3 Neon PostgreSQL \-\- Base de Donnees__

__CRITIQUE__

La base de donnees est la cible principale \-\- sa securisation est priorite absolue\.

// prisma/schema\.prisma \-\- Connection securisee via pgBouncer

datasource db \{

  provider = 'postgresql'

  url      = env\('DATABASE\_URL'\)  // SSL obligatoire : ?sslmode=require

\}

__Mesure de securite__

__Detail d'implementation__

Connexion SSL

sslmode=require dans DATABASE\_URL \-\- jamais de connexion non chiffree

Utilisateur minimal

Un compte DB dedie par service \-\- jamais l'utilisateur superadmin

Moindre privilege

SELECT/INSERT/UPDATE/DELETE seulement \-\- jamais DROP, ALTER, TRUNCATE

Backups automatiques

Quotidiens avec test de restauration mensuel \-\- retention 30 jours

Row\-Level Security

RLS PostgreSQL active sur toutes les tables critiques \(eleves, finances, RH\)

Audit des connexions

Logging de toutes les connexions et requetes sensibles

__09__

__MONITORING, LOGGING & INCIDENT RESPONSE__

*"Vous ne pouvez pas defendre ce que vous ne voyez pas"*

## __9\.1 Audit Logging Middleware__

__ELEVE__

Toute action sur des donnees sensibles d'Academia Helm doit etre tracee \-\- sans les donnees elles\-memes\.

// NestJS \-\- AuditLogMiddleware sur toutes les routes sensibles

@Injectable\(\)

export class AuditLogMiddleware implements NestMiddleware \{

  use\(req: Request, res: Response, next: NextFunction\) \{

    const log = \{

      timestamp : new Date\(\)\.toISOString\(\),

      ip        : req\.ip,

      method    : req\.method,

      path      : req\.path,

      userId    : req\['user'\]?\.id,

      tenantId  : req\['user'\]?\.tenantId,

      userAgent : req\.headers\['user\-agent'\],

      // JAMAIS les donnees elles\-memes dans les logs

    \};

    // Envoyer vers : Logtail / Datadog / Sentry

    auditService\.log\(log\);

    next\(\);

  \}

\}

## __9\.2 Alertes Automatiques__

__Evenement detecte__

__Seuil d'alerte__

__Action automatique__

Echecs d'authentification

> 5 en 1 minute / IP

Blocage IP temporaire 15 min

Tentative cross\-tenant

1 seule tentative

Alerte immediate \+ audit log \+ blocage

Volume de requetes API

> 1000 req/min

Rate limit automatique \+ alerte Slack

Connexion depuis nouveau pays

Toute connexion admin

Email de confirmation requis

Erreurs 500 en masse

> 10 en 5 minutes

Notification Slack \+ SMS fondateurs

Telechargement massif

> 100 fichiers/heure

Suspension du compte \+ investigation

Modif donnees financieres

Montant > 1M FCFA

Validation manuelle requise

## __9\.3 Plan de Reponse aux Incidents__

__Phase__

__Objectif et delai__

Phase 1 \-\- DETECTION

Alerte automatique generee < 5 minutes apres l'evenement

Phase 2 \-\- CONFINEMENT

Isolation du composant compromis < 15 minutes

Phase 3 \-\- ANALYSE

Identification de la cause racine < 2 heures

Phase 4 \-\- REMEDIATION

Correctif deploye en production < 24 heures

Phase 5 \-\- COMMUNICATION

Notification utilisateurs impactes < 72 heures \(obligation legale RGPD/CEDEAO\)

Phase 6 \-\- POST\-MORTEM

Rapport complet documente et partage < 7 jours

__\+ __Retention des logs : 90 jours minimum pour Academia Helm

__\+ __1 an pour MediHelm \(donnees medicales \-\- obligation legale\)

__\+ __Logger TOUS les acces aux donnees sensibles \-\- sans jamais inclure les donnees

__\+ __Logger les tentatives d'acces cross\-tenant avec IP, timestamp et user

__10__

__SECURITE IA \-\- ORION, ATLAS & AGENTS__

*Surface d'attaque emergente \-\- LLM Security est critique en 2025*

Les modules IA de YEHI OR Tech \(ORION dans Academia Helm, ATLAS, SARA\) constituent une surface d'attaque nouvelle\. La securisation des LLM est un domaine emergent mais critique \-\- particulierement la protection contre les prompt injections\.

## __10\.1 Protection Prompt Injection \-\- ORION__

__ELEVE__

Un utilisateur malveillant pourrait tenter de manipuler ORION pour acceder a des donnees cross\-tenant ou faire fuiter des informations systeme\.

// NestJS \-\- Sanitization obligatoire avant envoi a l'API IA

function sanitizePromptInput\(userInput: string\): string \{

  // Patterns de jailbreak connus

  const blocked = \[

    'ignore previous', 'system:', 'jailbreak', 'DAN',

    'ignore instructions', 'forget everything', 'act as'

  \];

  blocked\.forEach\(term => \{

    if \(userInput\.toLowerCase\(\)\.includes\(term\)\)

      throw new BadRequestException\('Input non autorise'\);

  \}\);

  return userInput\.slice\(0, 2000\); // Limiter la taille du contexte

\}

__Regle de securite IA__

__Detail d'implementation__

Separation systeme/utilisateur

Instructions systeme strictement separees du contexte utilisateur \-\- jamais melanges

Isolation tenant dans le contexte

Ne jamais inclure de donnees d'autres tenants dans le contexte LLM

Audit des interactions IA

Logger toutes les requetes et reponses ORION/ATLAS pour audit de securite

Budget token par tenant

Limite mensuelle de tokens par tenant pour prevenir les abus de couts

Validation des outputs

Filtrer les reponses IA avant affichage \-\- detecter les fuites de donnees systeme

## __10\.2 Agents WhatsApp \-\- Securite__

__MODERE__

Les agents WhatsApp de YEHI OR Tech sont exposes a des abus si mal configures\. Validation stricte requise\.

__\+ __Validation du numero expediteur avant traitement de chaque message entrant

__\+ __Rate limiting : maximum 50 messages/heure par numero

__\+ __Blacklist automatique des numeros identifies comme abusifs

__\+ __Webhook secret token pour validation des requetes WhatsApp Business API

__\+ __Ne jamais exposer de donnees clients dans les reponses automatisees

__\+ __Audit log de toutes les interactions agents

__11__

__SECURITE CHAINE D'APPROVISIONNEMENT__

*npm en 2025 : des milliers de packages malveillants publies chaque mois*

## __11\.1 Audit des Dependances npm__

__ELEVE__

Le developpement rapide avec Cursor implique une integration frequente de nouvelles dependances \-\- chacune est un vecteur de risque\.

\# Audit de securite des dependances npm

npm audit \-\-audit\-level=high

 

\# Outil avance : Snyk \(recommande\)

npx snyk test

npx snyk monitor

 

\# En production \-\- toujours utiliser npm ci \(lockfile strict\)

npm ci  \# Pas npm install \-\- npm ci respecte package\-lock\.json exactement

__\+ __Audit npm automatique a chaque commit dans la pipeline CI/CD

__\+ __Mise a jour des dependances critiques dans les 48h apres alerte CVE

__\+ __Verifier les nouvelles dependances : etoiles GitHub, date MAJ, mainteneur actif

__\+ __GitHub Dependabot active pour alertes automatiques de vulnerabilites

## __11\.2 Pipeline CI/CD Securisee__

__ELEVE__

Chaque merge sur main doit passer par ces verifications automatiques\. Bloquer le merge si le scan echoue\.

\# \.github/workflows/security\.yml

\- name: Security Audit

  run: npm audit \-\-audit\-level=high

 

\- name: Secret Scanning

  uses: trufflesecurity/trufflehog@main

  with:

    path: \./

    base: main

 

\- name: SAST Analysis

  uses: github/codeql\-action/analyze@v3

  with:

    languages: javascript, typescript

__\+ __Bloquer le merge si le scan de securite echoue \-\- regle non contournable

__\+ __Scanner les secrets dans chaque commit avec TruffleHog avant push

__\+ __Analyse statique du code \(SAST\) via CodeQL ou SonarQube sur chaque PR

__\+ __npm ci obligatoire en CI/CD \-\- jamais npm install \(ignore le lockfile\)

__12__

__CHECKLIST MAITRE \-\- DEPLOIEMENT SECURISE__

*A completer et signer avant chaque deploiement en production\. Aucune exception\.*

__\#__

__Action de securite requise__

__Priorite__

__01__

Mots de passe hasches bcrypt/Argon2 avec salt rounds >= 12

__CRITIQUE__

__02__

JWT : expiration 15min, RS256, blacklist Redis operationnelle

__CRITIQUE__

__03__

TenantGuard active sur TOUTES les routes protegees de l'API

__CRITIQUE__

__04__

ValidationPipe global avec whitelist: true active

__CRITIQUE__

__05__

Variables d'environnement dans Vercel/Fly secrets \-\- jamais en dur

__CRITIQUE__

__06__

HTTPS force partout \-\- TLS 1\.3 minimum sur tous les domaines

__CRITIQUE__

__07__

CORS configure avec whitelist explicite des origines autorisees

__ELEVE__

__08__

Rate limiting : auth 5/min, API 100/min, public 20/min

__ELEVE__

__09__

Helmet\.js active avec CSP, HSTS, X\-Frame\-Options

__ELEVE__

__10__

Uploads : validation MIME, magic bytes, taille max, renommage UUID

__ELEVE__

__11__

Cloudflare R2 : URLs signees 15min \-\- pas d'acces public direct

__ELEVE__

__12__

npm audit sans vulnerabilite HIGH ou CRITICAL

__ELEVE__

__13__

Logs d'audit actives sur toutes les routes sensibles

__ELEVE__

__14__

Backups DB Neon configures, testes et restauration validee

__ELEVE__

__15__

MFA active sur tous les comptes admin et super\-admin

__ELEVE__

__16__

Prisma : aucune raw query non parametree \(Prisma\.sql obligatoire\)

__MODERE__

__17__

PostgreSQL RLS active pour isolation des tenants sur tables critiques

__MODERE__

__18__

Headers HTTP verifies via securityheaders\.com \-\- score A minimum

__MODERE__

__19__

Scan secrets dans le repo Git avec TruffleHog

__MODERE__

__20__

Plan de reponse aux incidents documente, accessible et teste

__MODERE__

__13__

__MATRICE DES RISQUES \-\- VUE D'ENSEMBLE__

*Vecteurs d'attaque, risques concrets et contre\-mesures cles*

__Vecteur d'attaque__

__Risque concret pour Academia Helm__

__Contre\-mesure principale__

SQL Injection

Acces total a la DB \-\- fuite de toutes les donnees eleves, finances, RH

Prisma parametre \+ ValidationPipe global NestJS

Broken Access Control

Un tenant accede aux donnees d'une autre ecole

TenantGuard \+ RBAC \+ RLS PostgreSQL

XSS Stocke

Code malveillant persistant injecte \-\- exfiltration de tokens

DOMPurify \+ CSP strict \+ HttpOnly cookies

CSRF

Actions non voulues declenchees depuis session active d'un utilisateur

Anti\-CSRF tokens \+ SameSite=Strict cookies

Brute Force Auth

Compromission de comptes direction, comptable, super\-admin

Rate limiting \+ lockout progressif \+ MFA obligatoire

JWT Abuse

Usurpation d'identite longue duree sans detection

Expiration 15min \+ blacklist Redis \+ RS256

File Upload Attack

Execution de code malveillant via fichier televerse

MIME check \+ magic bytes \+ scan AV \+ R2 hors web root

Secrets Leak

Cles API, JWT, DB exposees dans le code ou les logs

Fly secrets \+ Vercel env \+ TruffleHog CI/CD

Supply Chain Attack

Package npm compromis injecte dans la codebase

npm audit CI \+ Dependabot \+ npm ci lockfile

Prompt Injection IA

Manipulation de ORION ou SARA pour fuite de donnees cross\-tenant

Sanitization input \+ separation systeme/user context

API Scraping

Extraction massive de donnees eleves ou financieres

Rate limiting \+ User\-Agent filtering \+ Cloudflare WAF

Data Breach DB

Acces non autorise a Neon PostgreSQL depuis l'exterieur

SSL obligatoire \+ utilisateur minimal \+ RLS \+ chiffrement

__La securite d'une plateforme n'est pas un etat \-\- c'est un processus continu\.__

*Chaque fonctionnalite ajoutee cree une nouvelle surface d'attaque\.*

*Chaque dependance externe est un vecteur de risque\.*

*"Appliquer ce guide n'est pas un exercice academique\.*

*C'est l'acte de droiture d'un batisseur qui respecte ceux qui lui font confiance\."*

__YEHI OR Tech  \-\-  "Que la lumiere soit"__

Parakou, Benin  \-\-  Senakpon Dawes Akpovi, CTO  \-\-  Avril 2026

