import { z } from "zod";

export const leadFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Ce champ est requis (minimum 3 caractères) pour que Victoire puisse te recontacter." })
    .max(50, { message: "Le nom ne doit pas dépasser 50 caractères." }),
  phone: z
    .string()
    .min(8, { message: "Vérifie ce numéro — il nous faut un numéro valide pour te rappeler." })
    .regex(/^[+]?[0-9\s-]{8,20}$/, {
      message: "Vérifie ce numéro — il doit contenir uniquement des chiffres et d'éventuels indicatifs (ex: +229).",
    }),
  service: z.enum([
    "formation_elevage",
    "installation_ferme",
    "consultation",
    "achat_volailles",
    "commande_provendes",
    "autre_produit",
    "autre",
  ]),
  message: z.string().max(500, { message: "Le message ne doit pas dépasser 500 caractères." }).optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const serviceLabels: Record<LeadFormData["service"], string> = {
  formation_elevage: "Formation élevage",
  installation_ferme: "Installation de ferme",
  consultation: "Consultation / Diagnostic",
  achat_volailles: "Achat de volailles ou poussins",
  commande_provendes: "Commande de provendes",
  autre_produit: "Autre produit agricole",
  autre: "Autre demande",
};

// --- Lead Modal New Schemas ---

export const accompagnementSchema = z.object({
  type: z.literal("accompagnement"),
  prenom: z
    .string()
    .min(2, { message: "Le prénom doit faire au moins 2 caractères." })
    .max(50),
  nom: z
    .string()
    .min(2, { message: "Le nom doit faire au moins 2 caractères." })
    .max(50),
  whatsapp: z
    .string()
    .min(8, { message: "Le numéro WhatsApp doit faire au moins 8 caractères." })
    .regex(/^[+]?[0-9\s-]{8,20}$/, {
      message: "Vérifie ce numéro — il doit contenir uniquement des chiffres et d'éventuels indicatifs (ex: +229).",
    }),
  ville: z
    .string()
    .min(2, { message: "La ville est requise." })
    .max(100),
  typeElevage: z.string().min(1, { message: "Le type d'élevage est requis." }),
  experience: z.string().min(1, { message: "Le niveau d'expérience est requis." }),
  besoin: z.string().min(1, { message: "Le besoin principal est requis." }),
  budget: z.string().optional(),
});

export const formationSchema = z.object({
  type: z.literal("formation"),
  prenom: z
    .string()
    .min(2, { message: "Le prénom doit faire au moins 2 caractères." })
    .max(50),
  nom: z
    .string()
    .min(2, { message: "Le nom doit faire au moins 2 caractères." })
    .max(50),
  whatsapp: z
    .string()
    .min(8, { message: "Le numéro WhatsApp doit faire au moins 8 caractères." })
    .regex(/^[+]?[0-9\s-]{8,20}$/, {
      message: "Vérifie ce numéro — il doit contenir uniquement des chiffres et d'éventuels indicatifs (ex: +229).",
    }),
  ville: z
    .string()
    .min(2, { message: "La ville est requise." })
    .max(100),
  formationSouhaitee: z.string().min(1, { message: "La formation souhaitée est requise." }),
  modePreferee: z.string().min(1, { message: "Le mode d'apprentissage est requis." }),
  disponibilite: z.string().min(1, { message: "La disponibilité est requise." }),
});

export const modalLeadSchema = z.discriminatedUnion("type", [
  accompagnementSchema,
  formationSchema,
]);

export type AccompagnementData = z.infer<typeof accompagnementSchema>;
export type FormationData = z.infer<typeof formationSchema>;
export type ModalLeadData = z.infer<typeof modalLeadSchema>;

