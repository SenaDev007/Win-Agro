"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Products() {
  const whatsappNumber = "2290161336548";

  const categories = [
    {
      title: "Élevage (Animaux vivants)",
      hook: "Des animaux sélectionnés pour le terrain béninois — pas pour le catalogue.",
      icon: "🐓",
      items: [
        "Poussins d'un jour vigoureux (coquellets, goliaths, pondeuses)",
        "Pintadeaux, dindonneaux et cailletaux d'excellente souche",
        "Lapins reproducteurs de races sélectionnées ou pour la chair",
        "Volailles prêtes à consommer (abattues proprement ou vivantes)",
        "Œufs de table frais collectés tous les matins",
      ],
      whatsappMsg: "Bonjour Victoire, je souhaite commander des animaux vivants (poussins, pintades, lapins...) auprès de Win Agro. Quels sont les tarifs et disponibilités actuels ?",
    },
    {
      title: "Nutrition Animale",
      hook: "La mortalité dans les élevages béninois vient souvent d'une alimentation mal adaptée.",
      icon: "🌾",
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
      icon: "🌳",
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
                    <span className="text-4xl p-3 bg-primary-pale rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
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
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
                    </svg>
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
