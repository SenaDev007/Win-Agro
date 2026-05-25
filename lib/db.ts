// Fallback in-memory database for local development to simulate lead accumulation and catalog edits
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

// In-Memory store (persisted for the lifecycle of Next.js dev server, fallback structure)
class LocalStore {
  private leads: LeadRecord[] = [];
  private products: CatalogProduct[] = [];
  private testimonials: TestimonialRecord[] = [];
  private services: ServiceRecord[] = [];
  private adminPasswordOverride: string | null = null;

  constructor() {
    this.leads = [
      {
        id: "l1",
        date: "2026-05-25T10:15:30Z",
        name: "Abdoulaye Sanni",
        phone: "+22997123456",
        type: "Formation",
        location: "Cotonou",
        details: { "Formation souhaitée": "Élevage Volaille", "Mode d'apprentissage": "Présentiel", "Disponibilité": "Week-ends" },
        status: "new"
      },
      {
        id: "l2",
        date: "2026-05-25T08:42:15Z",
        name: "Pascaline Chabi",
        phone: "+22966897541",
        type: "Accompagnement",
        location: "Parakou",
        details: { "Type d'élevage": "Lapins", "Expérience": "Débutant", "Besoin principal": "Planification & Budget" },
        status: "new"
      },
      {
        id: "l3",
        date: "2026-05-24T15:22:00Z",
        name: "Romaric Hounkpatin",
        phone: "+22995324578",
        type: "Consultation",
        location: "Porto-Novo",
        details: { "Problème constaté": "Mortalité élevée", "Type d'élevage": "Volailles", "Urgence": "Urgent" },
        status: "contacted"
      }
    ];

    // Seed initial products
    this.products = [
      // Élevage
      { id: "e1", category: "elevage", name: "Poussins d'1 jour — Coquellets (chair)", description: "Souche adaptée au climat du Bénin, robuste et à croissance rapide.", price: 850, unit: "sujet", isActive: true },
      { id: "e2", category: "elevage", name: "Poussins d'1 jour — Pondeuses", description: "Pondeuses haute performance, démarrage optimal garanti.", price: 950, unit: "sujet", isActive: true },
      { id: "e3", category: "elevage", name: "Pintadeaux", description: "Excellente souche adaptée à l'élevage familial ou commercial.", price: 700, unit: "sujet", isActive: true },
      { id: "e4", category: "elevage", name: "Cailletaux", description: "Élevage rapide, très rentable, idéal pour les débutants.", price: 650, unit: "sujet", isActive: true },
      { id: "e5", category: "elevage", name: "Lapins reproducteurs", description: "Races sélectionnées pour leur prolificité et croissance rapide.", price: 8000, unit: "sujet", isActive: true },
      { id: "e6", category: "elevage", name: "Volailles prêtes à consommer", description: "Volailles vivantes ou abattues proprement selon votre besoin.", price: 3500, unit: "sujet", isActive: true },
      { id: "e7", category: "elevage", name: "Œufs de table frais (plateau)", description: "Collectés chaque matin, fraîcheur garantie.", price: 3000, unit: "plateau 30", isActive: true },
      // Nutrition
      { id: "n1", category: "nutrition", name: "Provende démarrage (0–3 semaines)", description: "Formule haute densité nutritionnelle pour l'immunité et la croissance initiale.", price: 12500, unit: "sac 25kg", isActive: true },
      { id: "n2", category: "nutrition", name: "Provende croissance (3–6 semaines)", description: "Maintien optimal de la croissance et de la conversion alimentaire.", price: 11000, unit: "sac 25kg", isActive: true },
      { id: "n3", category: "nutrition", name: "Provende finition (>6 semaines)", description: "Formule économique pour la phase finale avant vente.", price: 10500, unit: "sac 25kg", isActive: true },
      { id: "n4", category: "nutrition", name: "Provende pondeuse", description: "Enrichie en calcium pour des œufs solides et une bonne ponte.", price: 12000, unit: "sac 25kg", isActive: true },
      { id: "n5", category: "nutrition", name: "Formulation personnalisée", description: "Consultation + formulation sur mesure selon votre élevage.", price: null, unit: "Sur devis", isActive: true },
      // Agriculture
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

    // Seed services
    this.services = [
      {
        key: "formation_elevage",
        title: "Formation Pratique",
        hook: "La plupart des formations t'apprennent à prendre des notes. La nôtre t'apprend à ne pas perdre tes animaux.",
        problem: "Beaucoup de cours sont déconnectés de la réalité du terrain béninois. Tu sors diplômé, mais quand la mortalité frappe ta bande, tu es désarmé.",
        bullets: [
          "Élevage de volaille complet (chairs, pondeuses, goliaths, pintades, dindes, cailles)",
          "Élevage professionnel de lapins (cuniculiculture)",
          "Élevage porcin rentable",
          "Formulation de nutrition animale",
          "Transformation agro-alimentaire locale"
        ],
        availability: "Disponible en présentiel & en ligne · Adapté au climat africain",
        cta: "Je veux me former →",
        isPremium: false,
        isActive: true
      },
      {
        key: "installation_ferme",
        title: "Accompagnement & Installation de Ferme",
        hook: "Tu arrives avec une idée en tête. Tu repars avec une exploitation agricole qui tourne.",
        problem: "Tu as un projet d'élevage ou un terrain disponible, mais tu manques de repères pour démarrer et tu ne veux pas gaspiller tes économies.",
        bullets: [
          "Étude de faisabilité et plan d'affaires terrain",
          "Installation complète de tes bâtiments et équipements",
          "Suivi technique rigoureux post-installation",
          "Encadrement et formation de tes employés sur place"
        ],
        availability: "Accompagnement clé en main de A à Z par Victoire et ses équipes",
        cta: "Lancer mon projet →",
        isPremium: true,
        isActive: true
      },
      {
        key: "consultation",
        title: "Consultation & Diagnostic",
        hook: "Ta ferme tourne déjà, mais les résultats ne suivent pas. On va trouver pourquoi.",
        problem: "Tu investis ton temps et ton argent mais tes marges restent faibles, ou tu fais face à des vagues de pertes inexpliquées.",
        bullets: [
          "Audit complet et diagnostic des blocages terrain",
          "Résolution des problèmes sanitaires et techniques",
          "Optimisation de tes performances d'alimentation"
        ],
        availability: "Intervention rapide, conseils actionnables, résultats garantis",
        cta: "Demander une consultation →",
        isPremium: false,
        isActive: true
      }
    ];
  }

  getLeads() {
    return this.leads;
  }

  addLead(lead: Omit<LeadRecord, "id" | "date" | "status">) {
    const newLead: LeadRecord = {
      ...lead,
      id: "l" + (this.leads.length + 1),
      date: new Date().toISOString(),
      status: "new"
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  updateLeadStatus(id: string, status: "new" | "contacted" | "archived") {
    const index = this.leads.findIndex(l => l.id === id);
    if (index !== -1) {
      this.leads[index].status = status;
      return true;
    }
    return false;
  }

  getProducts() {
    return this.products;
  }

  updateProductPrice(id: string, price: number | null) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].price = price;
      return true;
    }
    return false;
  }

  updateProductStatus(id: string, isActive: boolean) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].isActive = isActive;
      return true;
    }
    return false;
  }

  addProduct(product: Omit<CatalogProduct, "id">) {
    const newProduct: CatalogProduct = {
      ...product,
      id: "p" + (this.products.length + 1)
    };
    this.products.push(newProduct);
    return newProduct;
  }

  getAdminPassword() {
    return this.adminPasswordOverride;
  }

  setAdminPassword(password: string) {
    this.adminPasswordOverride = password;
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
    return newT;
  }

  updateTestimonial(t: TestimonialRecord) {
    const index = this.testimonials.findIndex(item => item.id === t.id);
    if (index !== -1) {
      this.testimonials[index] = { ...this.testimonials[index], ...t };
      return true;
    }
    return false;
  }

  deleteTestimonial(id: string) {
    const index = this.testimonials.findIndex(item => item.id === id);
    if (index !== -1) {
      this.testimonials.splice(index, 1);
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
    return newS;
  }

  updateService(s: ServiceRecord) {
    const index = this.services.findIndex(item => item.key === s.key);
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...s };
      return true;
    }
    return false;
  }

  deleteService(key: string) {
    const index = this.services.findIndex(item => item.key === key);
    if (index !== -1) {
      this.services.splice(index, 1);
      return true;
    }
    return false;
  }

  // --- Brute Force Protection (IP Lockout) ---
  private loginAttempts: Record<string, { count: number; lockedUntil: string | null }> = {};

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
