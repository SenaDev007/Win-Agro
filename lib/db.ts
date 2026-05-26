import { prisma } from "./prisma";

// Win Agro Database interfaces
export interface LeadRecord {
  id: string;
  date: string;
  name: string;
  phone: string;
  email?: string | null;
  type: string;
  location: string;
  details: Record<string, string>;
  status: string;
  notes?: string | null;
  reminderDate?: string | null;
  sessionToken?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface CatalogProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number | null;
  unit: string;
  isActive: boolean;
  promoPrice: number | null;
  promoUntil: string | null; // ISO date string
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

const globalRef = global as any;

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
      // 1. Seed stats if empty
      const statsCheck = await prisma.stat.count();
      if (statsCheck === 0) {
        const defaultStats = [
          { id: "s1", value: 500, suffix: "+", label: "Porteurs de projets", subText: "Formés et accompagnés vers la réussite sur le terrain." },
          { id: "s2", value: 6, suffix: "", label: "Filières d'élevage", subText: "Maîtrisées de bout en bout avec des méthodes éprouvées." },
          { id: "s3", value: 24, suffix: "h", label: "Délai de réponse", subText: "Garanti pour ne jamais vous laisser seul face aux doutes." },
          { id: "s4", value: 100, suffix: "%", label: "Méthodes naturelles", subText: "Sans aucun intrant chimique pour préserver vos bandes." }
        ];
        await prisma.stat.createMany({ data: defaultStats });
      }

      // 2. Seed products if empty
      const productsCheck = await prisma.product.count();
      if (productsCheck === 0) {
        const defaultProducts = [
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
        await prisma.product.createMany({ data: defaultProducts });
      }

      // 3. Seed testimonials if empty
      const testimonialsCheck = await prisma.testimonial.count();
      if (testimonialsCheck === 0) {
        const defaultTestimonials = [
          { id: "t1", text: "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles. Je perdais près d'un tiers de mes poussins d'un jour sans comprendre pourquoi. Victoire a diagnostiqué une mauvaise aération et ajusté mes formules.", highlight: "Mon taux de mortalité est passé de 30% à 8%", image: "/avatar_chabi.png", name: "Chabi A.", role: "Aviculteur · Parakou, Bénin", isActive: true },
          { id: "t2", text: "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois. J'avais la volonté d'installer ma ferme, mais j'étais terrifiée par le risque. Win Agro a pris en charge l'étude de faisabilité et l'installation.", highlight: "ferme rentable de 1000 pondeuses en 3 mois", image: "/avatar_pascaline.png", name: "Pascaline M.", role: "Entrepreneuse · Ouidah, Bénin", isActive: true },
          { id: "t3", text: "Une productivité globale améliorée de 25% sur mon cheptel. Mes lapines avaient des portées faibles. Victoire a revu notre plan de prophylaxie naturelle et introduit des fourrages locaux riches.", highlight: "productivité globale améliorée de 25%", image: "/avatar_romaric.png", name: "Romaric S.", role: "Éleveur de Lapins · Bohicon, Bénin", isActive: true },
          { id: "t4", text: "Mon rendement de culture a doublé grâce aux semences sélectionnées et au système d'irrigation économique proposé par Win Agro. Les résultats sont visibles dès le premier mois.", highlight: "Mon rendement de culture a doublé", image: "/avatar_sanni.png", name: "Sanni B.", role: "Maraîcher · Malanville, Bénin", isActive: true }
        ];
        await prisma.testimonial.createMany({ data: defaultTestimonials });
      }

      // 4. Seed services if empty
      const servicesCheck = await prisma.service.count();
      if (servicesCheck === 0) {
        const defaultServices = [
          { key: "formation_elevage", title: "Formations Élevage Pro", hook: "Ne perds plus ton temps à improviser.", problem: "La plupart des formations t'apprennent la théorie. Chez Win Agro, nous transmettons la réalité brute du terrain avec des ateliers à Porto-Novo (Parakou auparavant) et en ligne.", bullets: ["Élevage complet de Volailles & Lapins", "Fabrication d'aliments (provenderie)", "Formules de phytothérapie naturelle", "Gestion financière & rentabilité"], availability: "Disponible en présentiel & en ligne", cta: "Je veux me former →", isPremium: false, isActive: true, formKey: "formation" },
          { key: "accompagnement_projet", title: "Accompagnement Clé en Main", hook: "Ton projet, de l'idée jusqu'au premier profit.", problem: "Construire un bâtiment inadapté ou acheter des intrants trop chers peut ruiner ton projet d'élevage avant même qu'il ne démarre. Nous planifions, installons et gérons ta ferme.", bullets: ["Étude de faisabilité technique & financière", "Supervision de la construction des poulaillers", "Suivi quotidien de ta première bande", "Mise en relation avec notre réseau de vente"], availability: "Disponible sur toute l'étendue du Bénin", cta: "Lancer mon élevage →", isPremium: true, isActive: true, formKey: "accompagnement" },
          { key: "diagnostic_consultation", title: "Consultation & Diagnostic", hook: "Un problème d'élevage à résoudre immédiatement ?", problem: "Mortalité inexpliquée, ponte faible, provende inefficace... Chaque jour d'attente te coûte des centaines de mille. Nous intervenons en urgence pour redresser la barre.", bullets: ["Analyse de biosécurité & d'aération", "Ajustement des rations alimentaires", "Audit de prophylaxie & traitements bio", "Rapport de recommandations exploitables"], availability: "Déplacement sur site ou télé-diagnostic", cta: "Demander un diagnostic →", isPremium: false, isActive: true, formKey: "consultation" }
        ];
        await prisma.service.createMany({ data: defaultServices });
      }

      // 5. Seed form configs if empty or missing
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
        const count = await prisma.formConfig.count({ where: { key: f.key } });
        if (count === 0) {
          await prisma.formConfig.create({
            data: {
              key: f.key,
              title: f.title,
              heroBgUrl: f.heroBgUrl,
              description: f.description,
              isActive: f.isActive,
              fields: f.fields as any
            }
          });
        }
      }
    } catch (err: any) {
      if (
        err.code === "23505" ||
        err.code === "P2002" ||
        err.message?.includes("already exists") ||
        err.message?.includes("Unique constraint")
      ) {
        return;
      }
      console.error("Database initialization failed:", err);
    }
  }

  // --- Leads CRUD ---
  async getLeads(): Promise<LeadRecord[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { date: "desc" }
    });
    return leads.map(l => ({
      id: l.id,
      date: l.date,
      name: l.name,
      phone: l.phone,
      email: l.email || null,
      type: l.type,
      location: l.location,
      details: l.details as Record<string, string>,
      status: l.status,
      notes: l.notes,
      reminderDate: l.reminderDate,
      sessionToken: l.sessionToken,
      utmSource: l.utmSource,
      utmMedium: l.utmMedium,
      utmCampaign: l.utmCampaign
    }));
  }

  async addLead(lead: Omit<LeadRecord, "id" | "date" | "status">): Promise<LeadRecord> {
    const id = "l_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const date = new Date().toISOString();
    const status = "new";

    await prisma.lead.create({
      data: {
        id,
        date,
        name: lead.name,
        phone: lead.phone,
        type: lead.type,
        location: lead.location,
        details: lead.details as any,
        status,
        notes: lead.notes || "",
        reminderDate: lead.reminderDate || null,
        sessionToken: lead.sessionToken || null,
        utmSource: lead.utmSource || null,
        utmMedium: lead.utmMedium || null,
        utmCampaign: lead.utmCampaign || null
      }
    });

    return { ...lead, id, date, status };
  }

  async updateLeadStatus(id: string, status: LeadRecord["status"]): Promise<boolean> {
    try {
      await prisma.lead.update({
        where: { id },
        data: { status }
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Catalog CRUD ---
  async getProducts(): Promise<CatalogProduct[]> {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" }
    });
    return products.map(p => ({
      id: p.id,
      category: p.category,
      name: p.name,
      description: p.description,
      price: p.price,
      unit: p.unit,
      isActive: p.isActive,
      promoPrice: p.promoPrice ?? null,
      promoUntil: p.promoUntil ? p.promoUntil.toISOString() : null
    }));
  }

  async updateProductPriceAndStatus(id: string, price: number | null, isActive: boolean): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: { price, isActive }
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateProductPrice(id: string, price: number | null): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: { price }
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateProductStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: { isActive }
      });
      return true;
    } catch {
      return false;
    }
  }

  async createProduct(product: Omit<CatalogProduct, "id">): Promise<CatalogProduct | null> {
    try {
      const id = `${product.category[0] || 'p'}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const created = await prisma.product.create({
        data: {
          id,
          category: product.category,
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          isActive: product.isActive ?? true,
          promoPrice: product.promoPrice ?? null,
          promoUntil: product.promoUntil ? new Date(product.promoUntil) : null
        }
      });
      return {
        id: created.id,
        category: created.category,
        name: created.name,
        description: created.description,
        price: created.price,
        unit: created.unit,
        isActive: created.isActive,
        promoPrice: created.promoPrice ?? null,
        promoUntil: created.promoUntil ? created.promoUntil.toISOString() : null
      };
    } catch (err) {
      console.error("Error creating product in db:", err);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (err) {
      console.error("Error deleting product in db:", err);
      return false;
    }
  }

  async updateProductDetails(id: string, data: Partial<Omit<CatalogProduct, "id">>): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: {
          category: data.category,
          name: data.name,
          description: data.description,
          price: data.price,
          unit: data.unit,
          isActive: data.isActive,
          promoPrice: data.promoPrice !== undefined ? data.promoPrice : undefined,
          promoUntil: data.promoUntil !== undefined
            ? (data.promoUntil ? new Date(data.promoUntil) : null)
            : undefined
        }
      });
      return true;
    } catch (err) {
      console.error("Error updating product details in db:", err);
      return false;
    }
  }

  async updateProductPromo(id: string, promoPrice: number | null, promoUntil: string | null): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: {
          promoPrice,
          promoUntil: promoUntil ? new Date(promoUntil) : null
        }
      });
      return true;
    } catch (err) {
      console.error("Error updating product promo in db:", err);
      return false;
    }
  }


  // --- Admin Settings ---
  async getAdminPassword(): Promise<string | null> {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: "admin_password" }
    });
    return setting?.value || null;
  }

  async setAdminPassword(password: string): Promise<void> {
    await prisma.adminSetting.upsert({
      where: { key: "admin_password" },
      update: { value: password },
      create: { key: "admin_password", value: password }
    });
  }

  async getAdminEmail(): Promise<string | null> {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: "admin_email" }
    });
    return setting?.value || null;
  }

  async setAdminEmail(email: string): Promise<void> {
    await prisma.adminSetting.upsert({
      where: { key: "admin_email" },
      update: { value: email },
      create: { key: "admin_email", value: email }
    });
  }

  // --- Testimonials CRUD ---
  async getTestimonials(): Promise<TestimonialRecord[]> {
    const list = await prisma.testimonial.findMany({
      orderBy: { id: "asc" }
    });
    return list;
  }

  async addTestimonial(t: Omit<TestimonialRecord, "id">): Promise<TestimonialRecord> {
    const randId = "t_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    await prisma.testimonial.create({
      data: {
        id: randId,
        text: t.text,
        highlight: t.highlight,
        image: t.image,
        name: t.name,
        role: t.role,
        isActive: t.isActive
      }
    });
    return { ...t, id: randId };
  }

  async updateTestimonial(t: TestimonialRecord): Promise<boolean> {
    try {
      await prisma.testimonial.update({
        where: { id: t.id },
        data: {
          text: t.text,
          highlight: t.highlight,
          image: t.image,
          name: t.name,
          role: t.role,
          isActive: t.isActive
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      await prisma.testimonial.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Services CRUD ---
  async getServices(): Promise<ServiceRecord[]> {
    const srvs = await prisma.service.findMany({
      orderBy: { key: "asc" }
    });
    return srvs.map(s => ({
      key: s.key,
      title: s.title,
      hook: s.hook,
      problem: s.problem,
      bullets: s.bullets,
      availability: s.availability,
      cta: s.cta,
      isPremium: s.isPremium,
      isActive: s.isActive,
      formKey: s.formKey || undefined
    }));
  }

  async addService(s: Omit<ServiceRecord, "key"> & { key?: string }): Promise<ServiceRecord> {
    const key = s.key || "srv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    await prisma.service.create({
      data: {
        key,
        title: s.title,
        hook: s.hook,
        problem: s.problem,
        bullets: s.bullets,
        availability: s.availability,
        cta: s.cta,
        isPremium: s.isPremium,
        isActive: s.isActive,
        formKey: s.formKey || null
      }
    });
    return { ...s, key };
  }

  async updateService(s: ServiceRecord): Promise<boolean> {
    try {
      await prisma.service.update({
        where: { key: s.key },
        data: {
          title: s.title,
          hook: s.hook,
          problem: s.problem,
          bullets: s.bullets,
          availability: s.availability,
          cta: s.cta,
          isPremium: s.isPremium,
          isActive: s.isActive,
          formKey: s.formKey || null
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteService(key: string): Promise<boolean> {
    try {
      await prisma.service.delete({
        where: { key }
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Stats CRUD ---
  async getStats(): Promise<StatRecord[]> {
    const list = await prisma.stat.findMany({
      orderBy: { id: "asc" }
    });
    return list;
  }

  async updateStat(s: StatRecord): Promise<boolean> {
    try {
      await prisma.stat.update({
        where: { id: s.id },
        data: {
          value: s.value,
          suffix: s.suffix,
          label: s.label,
          subText: s.subText
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Form configs CRUD ---
  async getFormConfigs(): Promise<FormConfigRecord[]> {
    const list = await prisma.formConfig.findMany({
      orderBy: { key: "asc" }
    });
    return list.map(f => ({
      key: f.key,
      title: f.title,
      heroBgUrl: f.heroBgUrl || undefined,
      description: f.description,
      fields: f.fields as unknown as FormField[],
      isActive: f.isActive
    }));
  }

  async addFormConfig(config: FormConfigRecord): Promise<boolean> {
    try {
      const check = await prisma.formConfig.count({
        where: { key: config.key }
      });
      if (check === 0) {
        await prisma.formConfig.create({
          data: {
            key: config.key,
            title: config.title,
            heroBgUrl: config.heroBgUrl || null,
            description: config.description,
            fields: config.fields as any,
            isActive: config.isActive
          }
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async updateFormConfig(config: FormConfigRecord): Promise<boolean> {
    try {
      await prisma.formConfig.update({
        where: { key: config.key },
        data: {
          title: config.title,
          heroBgUrl: config.heroBgUrl || null,
          description: config.description,
          fields: config.fields as any,
          isActive: config.isActive
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteFormConfig(key: string): Promise<boolean> {
    try {
      await prisma.formConfig.delete({
        where: { key }
      });
      return true;
    } catch {
      return false;
    }
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
