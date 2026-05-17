"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function WhyUs() {
  const differentiations = [
    {
      num: "01",
      tag: "TERRAIN & RÉALITÉ LOCALE",
      title: "Expertise terrain béninoise",
      description: "On ne t'applique pas des méthodes importées d'Europe déconnectées de nos réalités. On travaille en s'adaptant à notre climat, aux intrants disponibles localement et à nos marchés. Ce qu'on t'enseigne fonctionne vraiment ici.",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    },
    {
      num: "02",
      tag: "FINANCES & RENTABILITÉ",
      title: "Résultats réels et mesurables",
      description: "Nos éleveurs partenaires voient des résultats financiers et sanitaires concrets : un taux de survie de leurs bandes nettement amélioré, des coûts d'alimentation maîtrisés et des fermes rentables dès les premiers cycles.",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=80",
    },
    {
      num: "03",
      tag: "SERVICE APRÈS-VENTE VIA WHATSAPP",
      title: "Présence active après la vente",
      description: "Tu n'es pas seul une fois ton chèque signé ou ta formation validée. Victoire et ses équipes restent joignables. On passe visiter les installations, on suit ta progression sur WhatsApp et on intervient physiquement en cas de doute.",
      image: "https://images.unsplash.com/photo-1589923188900-85dae440342b?w=800&auto=format&fit=crop&q=80",
    },
    {
      num: "04",
      tag: "DURABILITÉ & SANTÉ",
      title: "Vision biologique et durable",
      description: "Zéro intrant chimique. Nous privilégions des méthodes prophylactiques saines et biologiques pour tes animaux, pour ta santé, et pour préserver la fertilité de nos sols. C'est une conviction profonde, pas du simple affichage écologique.",
      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80",
    },
    {
      num: "05",
      tag: "PARTENARIATS INTERNATIONAUX",
      title: "Réseau Afrique & Europe",
      description: "Un écosystème d'entraide agricole en construction qui grandit chaque mois. Nous connectons nos porteurs de projets à des opportunités de distribution, de financement et de conseils techniques par-delà nos frontières.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="pourquoi-nous" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-primary-pale rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with high contrast strategic statement */}
        <div className="max-w-4xl mx-auto text-center mb-16">
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
              Nous, on t'accompagnent jusqu'aux résultats.
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

        {/* Premium Cards Grid in Requested Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-8 w-full mt-6"
        >
          {differentiations.map((item) => (
            <motion.div
              key={item.num}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                borderColor: "rgba(9, 137, 71, 0.3)",
                boxShadow: "0 20px 25px -5px rgba(7, 107, 55, 0.08), 0 8px 10px -6px rgba(7, 107, 55, 0.08)",
              }}
              className="max-w-72 w-full bg-[#FAFAF3]/40 border border-primary-green/10 rounded-2xl p-4 shadow-sm transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Cover */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative shadow-sm border border-primary-green/5">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-sans font-black text-primary-green shadow-sm">
                    {item.num}
                  </div>
                </div>

                {/* Tag Badge */}
                <p className="text-[9px] font-sans font-black uppercase tracking-wider text-primary-green mt-4">
                  {item.tag}
                </p>

                {/* Card Title */}
                <h3 className="text-base font-serif font-bold text-primary-deep mt-2 leading-tight text-left">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs text-gray-500 font-sans mt-2.5 leading-relaxed text-left">
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
