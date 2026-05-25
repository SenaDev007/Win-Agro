import { Pool } from "pg";

// Win Agro Database interfaces
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
  formKey?: string;
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

// Database Connection URL
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_i6mT2sMkFWth@ep-spring-sun-abljcx2p-pooler.eu-west-2.aws.neon.tech/Win%20Agro?sslmode=require&channel_binding=require";

const globalRef = global as any;
if (!globalRef.dbPool) {
  globalRef.dbPool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export const pool = globalRef.dbPool as Pool;

class LocalStore {
  private loginAttempts: Record<string, { count: number; lockedUntil: string | null }> = {};

  constructor() {
    // Run initialization inside constructors asynchronously, process-wide once
    if (!globalRef.dbInitPromise) {
      globalRef.dbInitPromise = this.initDb();
    }
  }

  async initDb() {
    try {
      // 1. Create DB tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS stats (
          id VARCHAR(50) PRIMARY KEY,
          value INTEGER NOT NULL,
          suffix VARCHAR(10) NOT NULL,
          label VARCHAR(255) NOT NULL,
          sub_text TEXT NOT NULL
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(50) PRIMARY KEY,
          category VARCHAR(100) NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DOUBLE PRECISION,
          unit VARCHAR(50) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(50) PRIMARY KEY,
          text TEXT NOT NULL,
          highlight VARCHAR(255) NOT NULL,
          image TEXT NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS services (
          key VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          hook TEXT NOT NULL,
          problem TEXT NOT NULL,
          bullets TEXT[] NOT NULL,
          availability VARCHAR(255) NOT NULL,
          cta VARCHAR(255) NOT NULL,
          is_premium BOOLEAN NOT NULL DEFAULT FALSE,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          form_key VARCHAR(100)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS form_configs (
          key VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          hero_bg_url TEXT,
          description TEXT NOT NULL,
          fields JSONB NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id VARCHAR(50) PRIMARY KEY,
          date VARCHAR(100) NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(100) NOT NULL,
          type VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          details JSONB NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'new'
        )
      `);

      // 2. Seed stats if empty
      const statsCheck = await pool.query("SELECT COUNT(*) FROM stats");
      if (parseInt(statsCheck.rows[0].count, 10) === 0) {
        const defaultStats = [
          ["s1", 500, "+", "Porteurs de projets", "Formés et accompagnés vers la réussite sur le terrain."],
          ["s2", 6, "", "Filières d'élevage", "Maîtrisées de bout en bout avec des méthodes éprouvées."],
          ["s3", 24, "h", "Délai de réponse", "Garanti pour ne jamais vous laisser seul face aux doutes."],
          ["s4", 100, "%", "Méthodes naturelles", "Sans aucun intrant chimique pour préserver vos bandes."]
        ];
        for (const s of defaultStats) {
          await pool.query(
            "INSERT INTO stats (id, value, suffix, label, sub_text) VALUES ($1, $2, $3, $4, $5)",
            s as any[]
          );
        }
      }

      // 3. Seed products if empty
      const productsCheck = await pool.query("SELECT COUNT(*) FROM products");
      if (parseInt(productsCheck.rows[0].count, 10) === 0) {
        const defaultProducts = [
          ["e1", "elevage", "Poussins d'1 jour — Coquellets (chair)", "Souche adaptée au climat du Bénin, robuste et à croissance rapide.", 850, "sujet", true],
          ["e2", "elevage", "Poussins d'1 jour — Pondeuses", "Pondeuses haute performance, démarrage optimal garanti.", 950, "sujet", true],
          ["e3", "elevage", "Pintadeaux", "Excellente souche adaptée à l'élevage familial ou commercial.", 700, "sujet", true],
          ["e4", "elevage", "Cailletaux", "Élevage rapide, très rentable, idéal pour les débutants.", 650, "sujet", true],
          ["e5", "elevage", "Lapins reproducteurs", "Races sélectionnées pour leur prolificité et croissance rapide.", 8000, "sujet", true],
          ["e6", "elevage", "Volailles prêtes à consommer", "Volailles vivantes ou abattues proprement selon votre besoin.", 3500, "sujet", true],
          ["e7", "elevage", "Œufs de table frais (plateau)", "Collectés chaque matin, fraîcheur garantie.", 3000, "plateau 30", true],
          
          ["n1", "nutrition", "Provende démarrage (0–3 semaines)", "Formule haute densité nutritionnelle pour l'immunité et la croissance initiale.", 12500, "sac 25kg", true],
          ["n2", "nutrition", "Provende croissance (3–6 semaines)", "Maintien optimal de la croissance et de la conversion alimentaire.", 11000, "sac 25kg", true],
          ["n3", "nutrition", "Provende finition (>6 semaines)", "Formule économique pour la phase finale avant vente.", 10500, "sac 25kg", true],
          ["n4", "nutrition", "Provende pondeuse", "Enrichie en calcium pour des œufs solides et une bonne ponte.", 12000, "sac 25kg", true],
          ["n5", "nutrition", "Formulation personnalisée", "Consultation + formulation sur mesure selon votre élevage.", null, "Sur devis", true],
          
          ["a1", "agriculture", "Plants d'eucalyptus (lot 10)", "Vigoureux et adaptés au sol béninois. Reboisement ou vente de bois.", 2500, "lot 10 plants", true],
          ["a2", "agriculture", "Plants d'eucalyptus (lot 50)", "Tarif dégressif — idéal pour les grandes parcelles.", 10000, "lot 50 plants", true],
          ["a3", "agriculture", "Plants d'eucalyptus (lot 100)", "Meilleur rapport qualité-prix pour projets de reboisement.", 18000, "lot 100 plants", true],
          ["a4", "agriculture", "Autres plants agricoles (lot 10)", "Espèces sélectionnées pour nos sols — variétés selon disponibilité saisonnière.", 3000, "lot 10 plants", true]
        ];
        for (const p of defaultProducts) {
          await pool.query(
            "INSERT INTO products (id, category, name, description, price, unit, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            p as any[]
          );
        }
      }

      // 4. Seed testimonials if empty
      const testimonialsCheck = await pool.query("SELECT COUNT(*) FROM testimonials");
      if (parseInt(testimonialsCheck.rows[0].count, 10) === 0) {
        const defaultTestimonials = [
          ["t1", "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles. Je perdais près d'un tiers de mes poussins d'un jour sans comprendre pourquoi. Victoire a diagnostiqué une mauvaise aération et ajusté mes formules.", "Mon taux de mortalité est passé de 30% à 8%", "/avatar_chabi.png", "Chabi A.", "Aviculteur · Parakou, Bénin", true],
          ["t2", "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois. J'avais la volonté d'installer ma ferme, mais j'étais terrifiée par le risque. Win Agro a pris en charge l'étude de faisabilité et l'installation.", "ferme rentable de 1000 pondeuses en 3 mois", "/avatar_pascaline.png", "Pascaline M.", "Entrepreneuse · Ouidah, Bénin", true],
          ["t3", "Une productivité globale améliorée de 25% sur mon cheptel. Mes lapines avaient des portées faibles. Victoire a revu notre plan de prophylaxie naturelle et introduit des fourrages locaux riches.", "productivité globale améliorée de 25%", "/avatar_romaric.png", "Romaric S.", "Éleveur de Lapins · Bohicon, Bénin", true],
          ["t4", "Mon rendement de culture a doublé grâce aux semences sélectionnées et au système d'irrigation économique proposé par Win Agro. Les résultats sont visibles dès le premier mois.", "Mon rendement de culture a doublé", "/avatar_sanni.png", "Sanni B.", "Maraîcher · Malanville, Bénin", true]
        ];
        for (const t of defaultTestimonials) {
          await pool.query(
            "INSERT INTO testimonials (id, text, highlight, image, name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            t as any[]
          );
        }
      }

      // 5. Seed services if empty
      const servicesCheck = await pool.query("SELECT COUNT(*) FROM services");
      if (parseInt(servicesCheck.rows[0].count, 10) === 0) {
        const defaultServices = [
          ["formation_elevage", "Formations Élevage Pro", "Ne perds plus ton temps à improviser.", "La plupart des formations t'apprennent la théorie. Chez Win Agro, nous transmettons la réalité brute du terrain avec des ateliers à Porto-Novo (Parakou auparavant) et en ligne.", ["Élevage complet de Volailles & Lapins", "Fabrication d'aliments (provenderie)", "Formules de phytothérapie naturelle", "Gestion financière & rentabilité"], "Disponible en présentiel & en ligne", "Je veux me former →", false, true, "formation"],
          ["accompagnement_projet", "Accompagnement Clé en Main", "Ton projet, de l'idée jusqu'au premier profit.", "Construire un bâtiment inadapté ou acheter des intrants trop chers peut ruiner ton projet d'élevage avant même qu'il ne démarre. Nous planifions, installons et gérons ta ferme.", ["Étude de faisabilité technique & financière", "Supervision de la construction des poulaillers", "Suivi quotidien de ta première bande", "Mise en relation avec notre réseau de vente"], "Disponible sur toute l'étendue du Bénin", "Lancer mon élevage →", true, true, "accompagnement"],
          ["diagnostic_consultation", "Consultation & Diagnostic", "Un problème d'élevage à résoudre immédiatement ?", "Mortalité inexpliquée, ponte faible, provende inefficace... Chaque jour d'attente te coûte des centaines de mille. Nous intervenons en urgence pour redresser la barre.", ["Analyse de biosécurité & d'aération", "Ajustement des rations alimentaires", "Audit de prophylaxie & traitements bio", "Rapport de recommandations exploitables"], "Déplacement sur site ou télé-diagnostic", "Demander un diagnostic →", false, true, "consultation"]
        ];
        for (const s of defaultServices) {
          await pool.query(
            "INSERT INTO services (key, title, hook, problem, bullets, availability, cta, is_premium, is_active, form_key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            s as any[]
          );
        }
      }

      // 6. Seed form configs if empty
      const formsCheck = await pool.query("SELECT COUNT(*) FROM form_configs");
      if (parseInt(formsCheck.rows[0].count, 10) === 0) {
        const defaultForms = [
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
        for (const f of defaultForms) {
          await pool.query(
            "INSERT INTO form_configs (key, title, hero_bg_url, description, fields, is_active) VALUES ($1, $2, $3, $4, $5, $6)",
            [f.key, f.title, f.heroBgUrl, f.description, JSON.stringify(f.fields), f.isActive]
          );
        }
      }
    } catch (err: any) {
      if (err.code === "23505" || err.message?.includes("already exists")) {
        // Table/type was created by a concurrent connection/worker, ignore
        return;
      }
      console.error("Database initialization failed:", err);
    }
  }

  // --- Leads SQL CRUD ---
  async getLeads(): Promise<LeadRecord[]> {
    const res = await pool.query("SELECT * FROM leads ORDER BY date DESC");
    return res.rows.map(row => ({
      id: row.id,
      date: row.date,
      name: row.name,
      phone: row.phone,
      type: row.type,
      location: row.location,
      details: row.details,
      status: row.status
    }));
  }

  async addLead(lead: Omit<LeadRecord, "id" | "date" | "status">): Promise<LeadRecord> {
    const id = "l_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const date = new Date().toISOString();
    const status = "new";

    await pool.query(
      "INSERT INTO leads (id, date, name, phone, type, location, details, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, date, lead.name, lead.phone, lead.type, lead.location, JSON.stringify(lead.details), status]
    );

    return { ...lead, id, date, status };
  }

  async updateLeadStatus(id: string, status: LeadRecord["status"]): Promise<boolean> {
    const res = await pool.query("UPDATE leads SET status = $1 WHERE id = $2", [status, id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- Catalog SQL CRUD ---
  async getProducts(): Promise<CatalogProduct[]> {
    const res = await pool.query("SELECT * FROM products ORDER BY id");
    return res.rows.map(row => ({
      id: row.id,
      category: row.category,
      name: row.name,
      description: row.description,
      price: row.price,
      unit: row.unit,
      isActive: row.is_active
    }));
  }

  async updateProductPriceAndStatus(id: string, price: number | null, isActive: boolean): Promise<boolean> {
    const res = await pool.query(
      "UPDATE products SET price = $1, is_active = $2 WHERE id = $3",
      [price, isActive, id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async updateProductPrice(id: string, price: number | null): Promise<boolean> {
    const res = await pool.query("UPDATE products SET price = $1 WHERE id = $2", [price, id]);
    return (res.rowCount ?? 0) > 0;
  }

  async updateProductStatus(id: string, isActive: boolean): Promise<boolean> {
    const res = await pool.query("UPDATE products SET is_active = $1 WHERE id = $2", [isActive, id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- Admin Settings SQL ---
  async getAdminPassword(): Promise<string | null> {
    const res = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_password'");
    return res.rows[0]?.value || null;
  }

  async setAdminPassword(password: string): Promise<void> {
    await pool.query(
      "INSERT INTO admin_settings (key, value) VALUES ('admin_password', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [password]
    );
  }

  async getAdminEmail(): Promise<string | null> {
    const res = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_email'");
    return res.rows[0]?.value || null;
  }

  async setAdminEmail(email: string): Promise<void> {
    await pool.query(
      "INSERT INTO admin_settings (key, value) VALUES ('admin_email', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [email]
    );
  }

  // --- Testimonials SQL CRUD ---
  async getTestimonials(): Promise<TestimonialRecord[]> {
    const res = await pool.query("SELECT * FROM testimonials ORDER BY id");
    return res.rows.map(row => ({
      id: row.id,
      text: row.text,
      highlight: row.highlight,
      image: row.image,
      name: row.name,
      role: row.role,
      isActive: row.is_active
    }));
  }

  async addTestimonial(t: Omit<TestimonialRecord, "id">): Promise<TestimonialRecord> {
    const randId = "t_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    await pool.query(
      "INSERT INTO testimonials (id, text, highlight, image, name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [randId, t.text, t.highlight, t.image, t.name, t.role, t.isActive]
    );
    return { ...t, id: randId };
  }

  async updateTestimonial(t: TestimonialRecord): Promise<boolean> {
    const res = await pool.query(
      "UPDATE testimonials SET text = $1, highlight = $2, image = $3, name = $4, role = $5, is_active = $6 WHERE id = $7",
      [t.text, t.highlight, t.image, t.name, t.role, t.isActive, t.id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const res = await pool.query("DELETE FROM testimonials WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- Services SQL CRUD ---
  async getServices(): Promise<ServiceRecord[]> {
    const res = await pool.query("SELECT * FROM services ORDER BY key");
    return res.rows.map(row => ({
      key: row.key,
      title: row.title,
      hook: row.hook,
      problem: row.problem,
      bullets: row.bullets,
      availability: row.availability,
      cta: row.cta,
      isPremium: row.is_premium,
      isActive: row.is_active,
      formKey: row.form_key || undefined
    }));
  }

  async addService(s: Omit<ServiceRecord, "key"> & { key?: string }): Promise<ServiceRecord> {
    const key = s.key || "srv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    await pool.query(
      "INSERT INTO services (key, title, hook, problem, bullets, availability, cta, is_premium, is_active, form_key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [key, s.title, s.hook, s.problem, s.bullets, s.availability, s.cta, s.isPremium, s.isActive, s.formKey || null]
    );
    return { ...s, key };
  }

  async updateService(s: ServiceRecord): Promise<boolean> {
    const res = await pool.query(
      "UPDATE services SET title = $1, hook = $2, problem = $3, bullets = $4, availability = $5, cta = $6, is_premium = $7, is_active = $8, form_key = $9 WHERE key = $10",
      [s.title, s.hook, s.problem, s.bullets, s.availability, s.cta, s.isPremium, s.isActive, s.formKey || null, s.key]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async deleteService(key: string): Promise<boolean> {
    const res = await pool.query("DELETE FROM services WHERE key = $1", [key]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- Stats SQL CRUD ---
  async getStats(): Promise<StatRecord[]> {
    const res = await pool.query("SELECT * FROM stats ORDER BY id");
    return res.rows.map(row => ({
      id: row.id,
      value: row.value,
      suffix: row.suffix,
      label: row.label,
      subText: row.sub_text
    }));
  }

  async updateStat(s: StatRecord): Promise<boolean> {
    const res = await pool.query(
      "UPDATE stats SET value = $1, suffix = $2, label = $3, sub_text = $4 WHERE id = $5",
      [s.value, s.suffix, s.label, s.subText, s.id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  // --- Form configs SQL CRUD ---
  async getFormConfigs(): Promise<FormConfigRecord[]> {
    const res = await pool.query("SELECT * FROM form_configs ORDER BY key");
    return res.rows.map(row => ({
      key: row.key,
      title: row.title,
      heroBgUrl: row.hero_bg_url || undefined,
      description: row.description,
      fields: Array.isArray(row.fields) ? row.fields : JSON.parse(JSON.stringify(row.fields)),
      isActive: row.is_active
    }));
  }

  async addFormConfig(config: FormConfigRecord): Promise<boolean> {
    const check = await pool.query("SELECT COUNT(*) FROM form_configs WHERE key = $1", [config.key]);
    if (parseInt(check.rows[0].count, 10) === 0) {
      await pool.query(
        "INSERT INTO form_configs (key, title, hero_bg_url, description, fields, is_active) VALUES ($1, $2, $3, $4, $5, $6)",
        [config.key, config.title, config.heroBgUrl || null, config.description, JSON.stringify(config.fields), config.isActive]
      );
      return true;
    }
    return false;
  }

  async updateFormConfig(config: FormConfigRecord): Promise<boolean> {
    const res = await pool.query(
      "UPDATE form_configs SET title = $1, hero_bg_url = $2, description = $3, fields = $4, is_active = $5 WHERE key = $6",
      [config.title, config.heroBgUrl || null, config.description, JSON.stringify(config.fields), config.isActive, config.key]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async deleteFormConfig(key: string): Promise<boolean> {
    const res = await pool.query("DELETE FROM form_configs WHERE key = $1", [key]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- Brute Force Protection (In-memory is sufficient) ---
  trackLoginAttempt(ip: string, success: boolean) {
    if (!this.loginAttempts[ip]) {
      this.loginAttempts[ip] = { count: 0, lockedUntil: null };
    }

    const record = this.loginAttempts[ip];

    if (record.lockedUntil && new Date(record.lockedUntil) < new Date()) {
      record.lockedUntil = null;
    }

    if (success) {
      record.count = 0;
      record.lockedUntil = null;
    } else {
      record.count += 1;
      if (record.count >= 15) {
        record.lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      } else if (record.count >= 10) {
        record.lockedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      } else if (record.count >= 5) {
        record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
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

const globalStoreRef = global as any;
if (!globalStoreRef.localStore) {
  globalStoreRef.localStore = new LocalStore();
}

export const localStore = globalStoreRef.localStore as LocalStore;
