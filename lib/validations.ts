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
