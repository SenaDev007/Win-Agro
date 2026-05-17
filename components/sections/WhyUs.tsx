"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function WhyUs() {
  const differentiations = [
    {
      num: "01",
      title: "Expertise terrain béninoise",
      description: "On ne t'applique pas des méthodes importées d'Europe déconnectées de nos réalités. On travaille en s'adaptant à notre climat, aux intrants disponibles localement et à nos marchés. Ce qu'on t'enseigne fonctionne vraiment ici.",
      icon: "🌍",
    },
    {
      num: "02",
      title: "Résultats réels et mesurables",
      description: "Nos éleveurs partenaires voient des résultats financiers et sanitaires concrets : un taux de survie de leurs bandes nettement amélioré, des coûts d'alimentation maîtrisés et des fermes rentables dès les premiers cycles.",
      icon: "📈",
    },
    {
      num: "03",
      title: "Présence active après la vente",
      description: "Tu n'es pas seul une fois ton chèque signé ou ta formation validée. Victoire et ses équipes restent joignables. On passe visiter les installations, on suit ta progression sur WhatsApp et on intervient physiquement en cas de doute.",
      icon: "🤝",
    },
    {
      num: "04",
      title: "Vision biologique et durable",
      description: "Zéro intrant chimique. Nous privilégions des méthodes prophylactiques saines et biologiques pour tes animaux, pour ta santé, et pour préserver la fertilité de nos sols. C'est une conviction profonde, pas du simple affichage écologique.",
      icon: "🍃",
    },
    {
      num: "05",
      title: "Réseau Afrique & Europe",
      description: "Un écosystème d'entraide agricole en construction qui grandit chaque mois. Nous connectons nos porteurs de projets à des opportunités de distribution, de financement et de conseils techniques par-delà nos frontières.",
      icon: "⚡",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };


  return (
    <section id="pourquoi-nous" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-primary-pale rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with high contrast strategic statement */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-4">
            Pourquoi choisir Win Agro
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-deep leading-snug"
          >
            "Beaucoup de prestataires t'accompagnent jusqu'à la vente.{" "}
            <span className="relative inline-block text-primary-green">
              Nous, on t'accompagne jusqu'aux résultats.
              <motion.span
                animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-full h-[4px] bg-accent-yellow rounded-full"
              />
            </span>{" "}
            Ce n'est pas la même chose."
          </motion.h2>
          
          <motion.div
            animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
            className="h-1 w-16 bg-accent-yellow mx-auto mt-6 rounded-full"
          />
        </div>

        {/* Staggered Cards List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {differentiations.map((item, idx) => (
            <motion.div
              key={item.num}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
                borderColor: "rgba(9, 137, 71, 0.4)",
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 25px -5px rgba(7, 107, 55, 0.1), 0 8px 10px -6px rgba(7, 107, 55, 0.1)",
              }}
              className="p-8 rounded-3xl border border-primary-pale bg-[#FAFAF3]/30 shadow-sm transition-all duration-300 flex flex-col justify-between card-shimmer"
            >
              <div>
                {/* Header item */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-black text-primary-green bg-primary-pale w-12 h-12 rounded-full flex items-center justify-center">
                    {item.num}
                  </span>
                  <span className="text-3xl filter drop-shadow-sm">{item.icon}</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-primary-deep leading-tight mb-4">
                  {item.title}
                </h3>

                <p className="font-sans text-sm text-gray-text leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
