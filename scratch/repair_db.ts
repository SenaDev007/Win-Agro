import { prisma } from "../lib/prisma";

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

async function repair() {
  try {
    console.log("Checking and repairing form configurations...");
    for (const f of defaultForms) {
      const existing = await prisma.formConfig.findUnique({
        where: { key: f.key }
      });
      if (!existing) {
        console.log(`Form configuration '${f.key}' is missing. Creating it...`);
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
        console.log(`Form configuration '${f.key}' created successfully.`);
      } else {
        console.log(`Form configuration '${f.key}' already exists.`);
      }
    }
    console.log("Repair finished.");
  } catch (error) {
    console.error("Error during repair:", error);
  } finally {
    await prisma.$disconnect();
  }
}

repair();
