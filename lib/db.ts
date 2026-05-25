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

// In-Memory store (persisted for the lifecycle of Next.js dev server, fallback structure)
class LocalStore {
  private leads: LeadRecord[] = [];
  private products: CatalogProduct[] = [];

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
}

// Global variable mock to preserve state in dev reload
const globalRef = global as any;
if (!globalRef.localStore) {
  globalRef.localStore = new LocalStore();
}

export const localStore = globalRef.localStore as LocalStore;
