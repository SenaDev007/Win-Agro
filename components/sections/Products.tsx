"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bird, Wheat, Trees } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";

export default function Products() {
  const whatsappNumber = "2290161336548";

  const categories = [
    {
      title: "Élevage (Animaux vivants)",
      hook: "Des animaux sélectionnés pour le terrain béninois — pas pour le catalogue.",
      icon: Bird,
      items: [
        "Poussins d'un jour vigoureux (coquellets, goliaths, pondeuses)",
        "Pintadeaux, dindonneaux et cailletaux d'excellente souche",
        "Lapins reproducteurs de races sélectionnées ou pour la chair",
        "Volailles prêtes à consommer (abattues proprement ou vivantes)",
        "Œufs de table frais collectés tous les matins",
      ],
      whatsappMsg: "Bonjour Victoire, je souhaite commander des animaux vivants (poussins, pintades, lapins...) auprès de Win Agro. Quels sont les tarifs et disponibilités actifs ?",
    },
    {
      title: "Nutrition Animale",
      hook: "La mortalité dans les élevages béninois vient souvent d'une alimentation mal adaptée.",
      icon: Wheat,
      items: [
        "Provendes de haute qualité nutritionnelle — en gros & détail",
        "Formulations équilibrées adaptées à chaque phase de croissance",
        "Conseils personnalisés en rationnement alimentaire offerts à chaque commande pour garantir de bons résultats",
      ],
      whatsappMsg: "Bonjour Victoire, j'aimerais commander de la provende de qualité pour mes élevages. Pourrais-je obtenir vos tarifs et conseils de formulation ?",
    },
    {
      title: "Agriculture & Plants",
      hook: "Pour diversifier ton exploitation et augmenter durablement sa valeur.",
      icon: Trees,
      items: [
        "Plants d'eucalyptus vigoureux pour le reboisement ou la vente de bois",
        "Autres espèces de plants agricoles sélectionnés pour nos sols",
        "Disponibilité saisonnière et accompagnement à la mise en terre",
        "Frais de transport optimisés selon le volume commandé",
      ],
      whatsappMsg: "Bonjour Victoire, je souhaite me renseigner sur la commande et la plantation de plants agricoles (eucalyptus...) avec Win Agro.",
    },
  ];

  return (
    <section id="produits" className="py-24 bg-[#FAFAF3] relative overflow-hidden">
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-3"
          >
            Notre Catalogue
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-deep leading-tight"
          >
            Animaux sélectionnés. Intrants de qualité.
          </motion.h2>
          
          <p className="text-primary-green font-serif text-lg sm:text-xl font-bold mt-2">
            Livraison directe et suivi technique inclus.
          </p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-text font-sans mt-4 max-w-2xl mx-auto"
          >
            Ce que nous vendons n'est pas disponible dans n'importe quelle ferme. Nos sujets et intrants sont rigoureusement sélectionnés pour leur robustesse et leur adaptation parfaite au climat béninois.
          </motion.p>
          
          <motion.div
            animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
            className="h-1 w-16 bg-accent-yellow mx-auto mt-6 rounded-full"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {categories.map((category, index) => {
            const encodedMsg = encodeURIComponent(category.whatsappMsg);
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  borderColor: "rgba(9, 137, 71, 0.4)",
                  boxShadow: "0 20px 25px -5px rgba(7, 107, 55, 0.1), 0 8px 10px -6px rgba(7, 107, 55, 0.1)",
                }}
                className="rounded-3xl bg-white border border-primary-pale shadow-lg p-8 flex flex-col justify-between transition-all duration-300 group card-shimmer"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="p-3 bg-primary-pale rounded-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-primary-deep">
                      <category.icon className="w-8 h-8 text-primary-deep" />
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary-deep leading-tight">
                      {category.title}
                    </h3>
                  </div>

                  <p className="font-sans font-bold text-primary-green text-sm leading-relaxed mb-6 italic">
                    {category.hook}
                  </p>

                  <div className="w-full h-px bg-primary-pale my-4" />

                  {/* Bullet Points */}
                  <ul className="space-y-4 mb-8">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-text font-sans">
                        <span className="text-accent-dark font-black mt-0.5">▪</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="mt-auto">
                  <motion.a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(9, 137, 71, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-base shadow-md cursor-pointer btn-shimmer"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    Commander sur WhatsApp →
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
