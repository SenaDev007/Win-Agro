import fs from "fs";
import path from "path";

// Fallback in-memory & file-persisted database for Win Agro
export interface LeadRecord {
  id: string;
  date: string;
  name: string;
  phone: string;
  type: string;
  location: string;
  details: Record<string, string>;
  status: "new" | "contacted" | "archived";
}

export interface CatalogProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number | null;
  unit: string;
  isActive: boolean;
}

export interface TestimonialRecord {
  id: string;
  text: string;
  highlight: string;
  image: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface ServiceRecord {
  key: string;
  title: string;
  hook: string;
  problem: string;
  bullets: string[];
  availability: string;
  cta: string;
  isPremium: boolean;
  isActive: boolean;
}

export interface StatRecord {
  id: string;
  value: number;
  suffix: string;
  label: string;
  subText: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "select";
  options?: string[];
  required: boolean;
}

export interface FormConfigRecord {
  key: string;
  title: string;
  heroBgUrl?: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
}

const STORE_FILE = path.join(process.cwd(), "lib", "db_store.json");

class LocalStore {
  private leads: LeadRecord[] = [];
  private products: CatalogProduct[] = [];
  private testimonials: TestimonialRecord[] = [];
  private services: ServiceRecord[] = [];
  private stats: StatRecord[] = [];
  private formConfigs: FormConfigRecord[] = [];
  private adminPasswordOverride: string | null = null;
  private adminEmailOverride: string | null = null;
  private loginAttempts: Record<string, { count: number; lockedUntil: string | null }> = {};

  constructor() {
    // 1. Initialize default/seed data for layout/pages if not loaded from file
    this.stats = [
      {
        id: "s1",
        value: 500,
        suffix: "+",
        label: "Porteurs de projets",
        subText: "Formés et accompagnés vers la réussite sur le terrain.",
      },
      {
        id: "s2",
        value: 6,
        suffix: "",
        label: "Filières d'élevage",
        subText: "Maîtrisées de bout en bout avec des méthodes éprouvées.",
      },
      {
        id: "s3",
        value: 24,
        suffix: "h",
        label: "Délai de réponse",
        subText: "Garanti pour ne jamais vous laisser seul face aux doutes.",
      },
      {
        id: "s4",
        value: 100,
        suffix: "%",
        label: "Méthodes naturelles",
        subText: "Sans aucun intrant chimique pour préserver vos bandes.",
      },
    ];

    // Seed initial products
    this.products = [
      { id: "e1", category: "elevage", name: "Poussins d'1 jour — Coquellets (chair)", description: "Souche adaptée au climat du Bénin, robuste et à croissance rapide.", price: 850, unit: "sujet", isActive: true },
      { id: "e2", category: "elevage", name: "Poussins d'1 jour — Pondeuses", description: "Pondeuses haute performance, démarrage optimal garanti.", price: 950, unit: "sujet", isActive: true },
      { id: "e3", category: "elevage", name: "Pintadeaux", description: "Excellente souche adaptée à l'élevage familial ou commercial.", price: 700, unit: "sujet", isActive: true },
      { id: "e4", category: "elevage", name: "Cailletaux", description: "Élevage rapide, très rentable, idéal pour les débutants.", price: 650, unit: "sujet", isActive: true },
      { id: "e5", category: "elevage", name: "Lapins reproducteurs", description: "Races sélectionnées pour leur prolificité et croissance rapide.", price: 8000, unit: "sujet", isActive: true },
      { id: "e6", category: "elevage", name: "Volailles prêtes à consommer", description: "Volailles vivantes ou abattues proprement selon votre besoin.", price: 3500, unit: "sujet", isActive: true },
      { id: "e7", category: "elevage", name: "Œufs de table frais (plateau)", description: "Collectés chaque matin, fraîcheur garantie.", price: 3000, unit: "plateau 30", isActive: true },
      
      { id: "n1", category: "nutrition", name: "Provende démarrage (0–3 semaines)", description: "Formule haute densité nutritionnelle pour l'immunité et la croissance initiale.", price: 12500, unit: "sac 25kg", isActive: true },
      { id: "n2", category: "nutrition", name: "Provende croissance (3–6 semaines)", description: "Maintien optimal de la croissance et de la conversion alimentaire.", price: 11000, unit: "sac 25kg", isActive: true },
      { id: "n3", category: "nutrition", name: "Provende finition (>6 semaines)", description: "Formule économique pour la phase finale avant vente.", price: 10500, unit: "sac 25kg", isActive: true },
      { id: "n4", category: "nutrition", name: "Provende pondeuse", description: "Enrichie en calcium pour des œufs solides et une bonne ponte.", price: 12000, unit: "sac 25kg", isActive: true },
      { id: "n5", category: "nutrition", name: "Formulation personnalisée", description: "Consultation + formulation sur mesure selon votre élevage.", price: null, unit: "Sur devis", isActive: true },
      
      { id: "a1", category: "agriculture", name: "Plants d'eucalyptus (lot 10)", description: "Vigoureux et adaptés au sol béninois. Reboisement ou vente de bois.", price: 2500, unit: "lot 10 plants", isActive: true },
      { id: "a2", category: "agriculture", name: "Plants d'eucalyptus (lot 50)", description: "Tarif dégressif — idéal pour les grandes parcelles.", price: 10000, unit: "lot 50 plants", isActive: true },
      { id: "a3", category: "agriculture", name: "Plants d'eucalyptus (lot 100)", description: "Meilleur rapport qualité-prix pour projets de reboisement.", price: 18000, unit: "lot 100 plants", isActive: true },
      { id: "a4", category: "agriculture", name: "Autres plants agricoles (lot 10)", description: "Espèces sélectionnées pour nos sols — variétés selon disponibilité saisonnière.", price: 3000, unit: "lot 10 plants", isActive: true }
    ];

    // Seed testimonials
    this.testimonials = [
      {
        id: "t1",
        text: "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles. Je perdais près d'un tiers de mes poussins d'un jour sans comprendre pourquoi. Victoire a diagnostiqué une mauvaise aération et ajusté mes formules.",
        highlight: "Mon taux de mortalité est passé de 30% à 8%",
        image: "/avatar_chabi.png",
        name: "Chabi A.",
        role: "Aviculteur · Parakou, Bénin",
        isActive: true
      },
      {
        id: "t2",
        text: "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois. J'avais la volonté d'installer ma ferme, mais j'étais terrifiée par le risque. Win Agro a pris en charge l'étude de faisabilité et l'installation.",
        highlight: "ferme rentable de 1000 pondeuses en 3 mois",
        image: "/avatar_pascaline.png",
        name: "Pascaline M.",
        role: "Entrepreneuse · Ouidah, Bénin",
        isActive: true
      },
      {
        id: "t3",
        text: "Une productivité globale améliorée de 25% sur mon cheptel. Mes lapines avaient des portées faibles. Victoire a revu notre plan de prophylaxie naturelle et introduit des fourrages locaux riches.",
        highlight: "productivité globale améliorée de 25%",
        image: "/avatar_romaric.png",
        name: "Romaric S.",
        role: "Éleveur de Lapins · Bohicon, Bénin",
        isActive: true
      },
      {
        id: "t4",
        text: "Mon rendement de culture a doublé grâce aux semences sélectionnées et au système d'irrigation économique proposé par Win Agro. Les résultats sont visibles dès le premier mois.",
        highlight: "Mon rendement de culture a doublé",
        image: "/avatar_sanni.png",
        name: "Sanni B.",
        role: "Maraîcher · Malanville, Bénin",
        isActive: true
      }
    ];

    // Seed default service packages
    this.services = [
      {
        key: "formation_elevage",
        title: "Formations Élevage Pro",
        hook: "Ne perds plus ton temps à improviser.",
        problem: "La plupart des formations t'apprennent la théorie. Chez Win Agro, nous transmettons la réalité brute du terrain avec des ateliers à Porto-Novo (Parakou auparavant) et en ligne.",
        bullets: [
          "Élevage complet de Volailles & Lapins",
          "Fabrication d'aliments (provenderie)",
          "Formules de phytothérapie naturelle",
          "Gestion financière & rentabilité"
        ],
        availability: "Disponible en présentiel & en ligne",
        cta: "Je veux me former →",
        isPremium: false,
        isActive: true
      },
      {
        key: "accompagnement_projet",
        title: "Accompagnement Clé en Main",
        hook: "Ton projet, de l'idée jusqu'au premier profit.",
        problem: "Construire un bâtiment inadapté ou acheter des intrants trop chers peut ruiner ton projet d'élevage avant même qu'il ne démarre. Nous planifions, installons et gérons ta ferme.",
        bullets: [
          "Étude de faisabilité technique & financière",
          "Supervision de la construction des poulaillers",
          "Suivi quotidien de ta première bande",
          "Mise en relation avec notre réseau de vente"
        ],
        availability: "Disponible sur toute l'étendue du Bénin",
        cta: "Lancer mon élevage →",
        isPremium: true,
        isActive: true
      },
      {
        key: "diagnostic_consultation",
        title: "Consultation & Diagnostic",
        hook: "Un problème d'élevage à résoudre immédiatement ?",
        problem: "Mortalité inexpliquée, ponte faible, provende inefficace... Chaque jour d'attente te coûte des centaines de mille. Nous intervenons en urgence pour redresser la barre.",
        bullets: [
          "Analyse de biosécurité & d'aération",
          "Ajustement des rations alimentaires",
          "Audit de prophylaxie & traitements bio",
          "Rapport de recommandations exploitables"
        ],
        availability: "Déplacement sur site ou télé-diagnostic",
        cta: "Demander un diagnostic →",
        isPremium: false,
        isActive: true
      }
    ];

    // Seed default form configurations
    this.formConfigs = [
      {
        key: "accompagnement",
        title: "Votre projet d'élevage",
        heroBgUrl: "/lead_accompagnement.png",
        description: "Installation de ferme, suivi technique, conseils personnalisés",
        isActive: true,
        fields: [
          { name: "typeElevage", label: "Type d'élevage envisagé", type: "select", options: ["Poulets de chair", "Pondeuses", "Pintades", "Cailles", "Lapins", "Porcs", "Autre"], required: true },
          { name: "experience", label: "Niveau d'expérience", type: "select", options: ["Débutant complet", "J'ai déjà essayé", "J'ai une ferme active"], required: true },
          { name: "besoin", label: "Besoin principal", type: "select", options: ["Installation de ferme", "Accompagnement technique", "Financement de projet", "Formation + suivi", "Autre"], required: true },
          { name: "budget", label: "Budget estimé (FCFA)", type: "select", options: ["Moins de 500 000 FCFA", "500 000 – 2 000 000 FCFA", "Plus de 2 000 000 FCFA", "Je ne sais pas encore"], required: false }
        ]
      },
      {
        key: "formation",
        title: "Inscription à la formation",
        heroBgUrl: "/lead_formation.png",
        description: "Volailles, lapins, porcs, nutrition animale, transformation",
        isActive: true,
        fields: [
          { name: "formationSouhaitee", label: "Formation souhaitée", type: "select", options: ["Élevage de volailles", "Élevage de lapins", "Élevage de porcs", "Nutrition animale", "Transformation de produits", "Autre"], required: true },
          { name: "modePreferee", label: "Mode préféré", type: "select", options: ["Présentiel", "En ligne", "Les deux"], required: true },
          { name: "disponibilite", label: "Disponibilité", type: "select", options: ["En semaine", "Le weekend", "Flexible"], required: true }
        ]
      },
      {
        key: "consultation",
        title: "Consultation & Diagnostic",
        heroBgUrl: "/lead_consultation.png",
        description: "Audit, résolution de problèmes, optimisation des performances",
        isActive: true,
        fields: [
          { name: "typeElevageActuel", label: "Type d'élevage actuel", type: "select", options: ["Volailles (chair / pondeuses)", "Pintades / Cailles", "Lapins", "Porcs", "Élevage mixte", "Autre"], required: true },
          { name: "problemePrincipal", label: "Problème principal constaté", type: "select", options: ["Mortalité élevée", "Faible productivité / croissance lente", "Maladies récurrentes", "Alimentation inadaptée", "Rentabilité insuffisante", "Autre"], required: true },
          { name: "depuisCombienDeTemps", label: "Depuis combien de temps ?", type: "select", options: ["Moins d'1 mois", "1 à 3 mois", "Plus de 3 mois"], required: true },
          { name: "urgence", label: "Niveau d'urgence", type: "select", options: ["Urgent — cette semaine", "Dans le mois", "Pas encore urgent"], required: true }
        ]
      }
    ];

    // Leads start mock-free and completely blank
    this.leads = [];

    // Load from local store file if exists
    this.loadFromFile();
  }

  private saveToFile() {
    try {
      const data = {
        leads: this.leads,
        products: this.products,
        testimonials: this.testimonials,
        services: this.services,
        stats: this.stats,
        formConfigs: this.formConfigs,
        adminEmailOverride: this.adminEmailOverride,
        adminPasswordOverride: this.adminPasswordOverride
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database to file:", err);
    }
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        if (data.leads) this.leads = data.leads;
        if (data.products) this.products = data.products;
        if (data.testimonials) this.testimonials = data.testimonials;
        if (data.services) this.services = data.services;
        if (data.stats) this.stats = data.stats;
        if (data.formConfigs) this.formConfigs = data.formConfigs;
        if (data.adminEmailOverride) this.adminEmailOverride = data.adminEmailOverride;
        if (data.adminPasswordOverride) this.adminPasswordOverride = data.adminPasswordOverride;
      }
    } catch (err) {
      console.error("Error loading database from file:", err);
    }
  }

  // --- Leads CRUD ---
  getLeads() {
    return this.leads;
  }

  addLead(lead: Omit<LeadRecord, "id" | "date" | "status">) {
    const newLead: LeadRecord = {
      ...lead,
      id: "l_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString(),
      status: "new"
    };
    this.leads.push(newLead);
    this.saveToFile();
    return newLead;
  }

  updateLeadStatus(id: string, status: LeadRecord["status"]) {
    const index = this.leads.findIndex(l => l.id === id);
    if (index !== -1) {
      this.leads[index].status = status;
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Catalog CRUD ---
  getProducts() {
    return this.products;
  }

  updateProductPriceAndStatus(id: string, price: number | null, isActive: boolean) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].price = price;
      this.products[index].isActive = isActive;
      this.saveToFile();
      return true;
    }
    return false;
  }

  updateProductPrice(id: string, price: number | null) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].price = price;
      this.saveToFile();
      return true;
    }
    return false;
  }

  updateProductStatus(id: string, isActive: boolean) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].isActive = isActive;
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Admin credentials ---
  getAdminPassword() {
    return this.adminPasswordOverride;
  }

  setAdminPassword(password: string) {
    this.adminPasswordOverride = password;
    this.saveToFile();
  }

  getAdminEmail() {
    return this.adminEmailOverride;
  }

  setAdminEmail(email: string) {
    this.adminEmailOverride = email;
    this.saveToFile();
  }

  // --- Testimonials CRUD ---
  getTestimonials() {
    return this.testimonials;
  }

  addTestimonial(t: Omit<TestimonialRecord, "id">) {
    const newT: TestimonialRecord = {
      ...t,
      id: "t" + (this.testimonials.length + 1)
    };
    this.testimonials.push(newT);
    this.saveToFile();
    return newT;
  }

  updateTestimonial(t: TestimonialRecord) {
    const index = this.testimonials.findIndex(item => item.id === t.id);
    if (index !== -1) {
      this.testimonials[index] = { ...this.testimonials[index], ...t };
      this.saveToFile();
      return true;
    }
    return false;
  }

  deleteTestimonial(id: string) {
    const index = this.testimonials.findIndex(item => item.id === id);
    if (index !== -1) {
      this.testimonials.splice(index, 1);
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Services CRUD ---
  getServices() {
    return this.services;
  }

  addService(s: Omit<ServiceRecord, "key"> & { key?: string }) {
    const key = s.key || "srv_" + (this.services.length + 1);
    const newS: ServiceRecord = {
      ...s,
      key
    };
    this.services.push(newS);
    this.saveToFile();
    return newS;
  }

  updateService(s: ServiceRecord) {
    const index = this.services.findIndex(item => item.key === s.key);
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...s };
      this.saveToFile();
      return true;
    }
    return false;
  }

  deleteService(key: string) {
    const index = this.services.findIndex(item => item.key === key);
    if (index !== -1) {
      this.services.splice(index, 1);
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Stats CRUD ---
  getStats() {
    return this.stats;
  }

  updateStat(s: StatRecord) {
    const index = this.stats.findIndex(item => item.id === s.id);
    if (index !== -1) {
      this.stats[index] = { ...this.stats[index], ...s };
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Form configs CRUD ---
  getFormConfigs() {
    return this.formConfigs;
  }

  addFormConfig(config: FormConfigRecord) {
    const index = this.formConfigs.findIndex(f => f.key === config.key);
    if (index === -1) {
      this.formConfigs.push(config);
      this.saveToFile();
      return true;
    }
    return false;
  }

  updateFormConfig(config: FormConfigRecord) {
    const index = this.formConfigs.findIndex(f => f.key === config.key);
    if (index !== -1) {
      this.formConfigs[index] = { ...config };
      this.saveToFile();
      return true;
    }
    return false;
  }

  deleteFormConfig(key: string) {
    const index = this.formConfigs.findIndex(f => f.key === key);
    if (index !== -1) {
      this.formConfigs.splice(index, 1);
      this.saveToFile();
      return true;
    }
    return false;
  }

  // --- Brute Force Protection (IP Lockout) ---
  trackLoginAttempt(ip: string, success: boolean) {
    if (!this.loginAttempts[ip]) {
      this.loginAttempts[ip] = { count: 0, lockedUntil: null };
    }

    const record = this.loginAttempts[ip];

    // If lockout expired, reset
    if (record.lockedUntil && new Date(record.lockedUntil) < new Date()) {
      record.lockedUntil = null;
    }

    if (success) {
      record.count = 0;
      record.lockedUntil = null;
    } else {
      record.count += 1;
      if (record.count >= 15) {
        record.lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
      } else if (record.count >= 10) {
        record.lockedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h
      } else if (record.count >= 5) {
        record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15m
      }
    }
  }

  isIpLocked(ip: string): { locked: boolean; remainingMin: number } {
    const record = this.loginAttempts[ip];
    if (!record || !record.lockedUntil) {
      return { locked: false, remainingMin: 0 };
    }

    const lockedTime = new Date(record.lockedUntil);
    const now = new Date();

    if (lockedTime > now) {
      const diffMs = lockedTime.getTime() - now.getTime();
      return { locked: true, remainingMin: Math.ceil(diffMs / (60 * 1000)) };
    } else {
      record.lockedUntil = null;
      return { locked: false, remainingMin: 0 };
    }
  }
}

// Global variable mock to preserve state in dev reload
const globalRef = global as any;
if (!globalRef.localStore) {
  globalRef.localStore = new LocalStore();
}

export const localStore = globalRef.localStore as LocalStore;
