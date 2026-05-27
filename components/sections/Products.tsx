"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bird, Wheat, Trees, ChevronRight } from "lucide-react";
import CatalogueModal from "@/components/ui/CatalogueModal";

interface ProductsProps {
  products?: any[];
  discounts?: Record<string, any>;
}

export default function Products({ products = [], discounts = {} }: ProductsProps) {
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({
    elevage: 7,
    nutrition: 5,
    agriculture: 4
  });
  const [activePromosMap, setActivePromosMap] = useState<Record<string, { active: boolean; label?: string }>>({});

  useEffect(() => {
    if (!products || products.length === 0) return;

    // Calculate counts
    const countsMap: Record<string, number> = { elevage: 0, nutrition: 0, agriculture: 0 };
    products.forEach((p: any) => {
      if (p.isActive) {
        countsMap[p.category] = (countsMap[p.category] || 0) + 1;
      }
    });
    setCounts(countsMap);

    // Calculate which categories have active promos or global discounts
    const promosMap: Record<string, { active: boolean; label?: string }> = {
      elevage: { active: false },
      nutrition: { active: false },
      agriculture: { active: false }
    };

    const categories = ["elevage", "nutrition", "agriculture"];
    const now = new Date();

    // 1. Check global category discounts first
    categories.forEach(cat => {
      const disc = discounts?.[cat];
      if (disc && disc.percentage > 0 && new Date(disc.until) > now) {
        promosMap[cat] = { active: true, label: `-${disc.percentage}% Global` };
      }
    });

    // 2. Check individual product promotions in each category
    products.forEach((p: any) => {
      if (p.isActive && p.promoPrice !== null && p.promoUntil && new Date(p.promoUntil) > now) {
        if (!promosMap[p.category].active) {
          promosMap[p.category] = { active: true, label: "PROMO 🔥" };
        }
      }
    });

    setActivePromosMap(promosMap);
  }, [products, discounts]);

  const handleCardClick = (key: string) => {
    setOpenCategoryKey(key);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setOpenCategoryKey(null), 300);
  };

  const categories = [
    {
      key: "elevage",
      title: "Élevage (Animaux vivants)",
      hook: "Des animaux sélectionnés pour le terrain béninois — pas pour le catalogue.",
      icon: Bird,
      preview: [
        "Poussins d'un jour vigoureux (coquellets, goliaths, pondeuses)",
        "Pintadeaux, dindonneaux et cailletaux d'excellente souche",
        "Lapins reproducteurs de races sélectionnées ou pour la chair",
        "Volailles prêtes à consommer — Œufs de table frais",
      ],
      badge: `${counts["elevage"] || 0} article${counts["elevage"] !== 1 ? "s" : ""}`,
    },
    {
      key: "nutrition",
      title: "Nutrition Animale",
      hook: "La mortalité dans les élevages béninois vient souvent d'une alimentation mal adaptée.",
      icon: Wheat,
      preview: [
        "Provendes haute qualité nutritionnelle — en gros & détail",
        "Formulations équilibrées par phase (démarrage, croissance, finition)",
        "Provende pondeuse enrichie en calcium",
        "Formulation personnalisée sur mesure (avec consultation incluse)",
      ],
      badge: `${counts["nutrition"] || 0} article${counts["nutrition"] !== 1 ? "s" : ""}`,
    },
    {
      key: "agriculture",
      title: "Agriculture & Plants",
      hook: "Pour diversifier ton exploitation et augmenter durablement sa valeur.",
      icon: Trees,
      preview: [
        "Plants d'eucalyptus vigoureux pour le reboisement ou la vente de bois",
        "Autres espèces de plants agricoles sélectionnés pour nos sols",
        "Disponibilité saisonnière et accompagnement à la mise en terre",
      ],
      badge: `${counts["agriculture"] || 0} article${counts["agriculture"] !== 1 ? "s" : ""}`,
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
            Cliquez sur une catégorie pour voir les articles disponibles, composer votre panier et envoyer votre commande directement sur WhatsApp.
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
            const CatIcon = category.icon;
            return (
              <motion.div
                key={category.key}
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
                onClick={() => handleCardClick(category.key)}
                className="rounded-3xl bg-white border border-primary-pale shadow-lg p-8 flex flex-col justify-between transition-all duration-300 group card-shimmer cursor-pointer"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="p-3 bg-primary-pale rounded-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-primary-deep">
                      <CatIcon className="w-8 h-8 text-primary-deep" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary-deep leading-tight">
                        {category.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary-green bg-primary-pale px-2 py-0.5 rounded-full inline-block">
                          {category.badge}
                        </span>
                        {activePromosMap[category.key]?.active && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-gradient-to-r from-orange-600 to-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                            {activePromosMap[category.key]?.label || "PROMO 🔥"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="font-sans font-bold text-primary-green text-sm leading-relaxed mb-6 italic">
                    {category.hook}
                  </p>

                  <div className="w-full h-px bg-primary-pale my-4" />

                  {/* Preview Bullet Points */}
                  <ul className="space-y-3 mb-8">
                    {category.preview.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-text font-sans">
                        <span className="text-accent-dark font-black mt-0.5">▪</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer CTA */}
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary-green group-hover:bg-primary-deep text-white font-sans font-bold text-base shadow-md transition-all duration-300 btn-shimmer"
                  >
                    Voir le catalogue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Catalogue Modal */}
      <CatalogueModal
        isOpen={isModalOpen}
        onClose={handleClose}
        categoryKey={openCategoryKey}
        products={products}
        discounts={discounts}
      />
    </section>
  );
}
