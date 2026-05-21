"use client";

import React from "react";
import { motion } from "framer-motion";
import { TestimonialsCarousel, Testimonial } from "@/components/ui/testimonials-carousel";

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      text: "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles. Je perdais près d'un tiers de mes poussins d'un jour sans comprendre pourquoi. Victoire a diagnostiqué une mauvaise aération et ajusté mes formules.",
      highlight: "Mon taux de mortalité est passé de 30% à 8%",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Kofi A.",
      role: "Aviculteur · Parakou, Bénin",
    },
    {
      text: "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois. J'avais la volonté d'installer ma ferme, mais j'étais terrifiée par le risque. Win Agro a pris en charge l'étude de faisabilité et l'installation.",
      highlight: "ferme rentable de 1000 pondeuses en 3 mois",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Chantal M.",
      role: "Entrepreneuse · Ouidah, Bénin",
    },
    {
      text: "Une productivité globale améliorée de 25% sur mon cheptel. Mes lapines avaient des portées faibles. Victoire a revu notre plan de prophylaxie naturelle et introduit des fourrages locaux riches.",
      highlight: "productivité globale améliorée de 25%",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Mathieu S.",
      role: "Éleveur de Lapins · Bohicon, Bénin",
    },
    {
      text: "Mon rendement de culture a doublé grâce aux semences sélectionnées et au système d'irrigation économique proposé par Win Agro. Les résultats sont visibles dès le premier mois.",
      highlight: "Mon rendement de culture a doublé",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Adama B.",
      role: "Maraîcher · Malanville, Bénin",
    },
    {
      text: "Grâce à la formation en ligne de Win Agro, j'ai lancé mon élevage de pintades à domicile. Le démarrage a été simple, et le taux de survie est excellent avec leur accompagnement.",
      highlight: "lancement simple et taux de survie excellent",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Amina T.",
      role: "Avicultrice · Djougou, Bénin",
    },
    {
      text: "J'économise 30% sur les coûts alimentaires de mes bêtes en fabriquant ma propre provende grâce aux formulations naturelles apprises dans les ateliers pratiques de Win Agro.",
      highlight: "J'économise 30% sur les coûts alimentaires",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Fabrice K.",
      role: "Producteur de provendes · Calavi, Bénin",
    }
  ];

  // Split to prevent cards duplication between the two scrolling carousels
  const firstRow = testimonials.filter((_, index) => index % 2 === 0);
  const secondRow = testimonials.filter((_, index) => index % 2 !== 0);

  return (
    <section id="témoignages" className="py-24 bg-[#FAFAF3] relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-4 border border-primary-green/10">
            Témoignages Réels
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-deep leading-tight"
          >
            Ils ont démarré comme toi.
          </motion.h2>
          
          <p className="text-primary-green font-serif text-lg sm:text-xl font-bold mt-2">
            Voilà ce qu'ils ont obtenu avec Win Agro.
          </p>
          
          <motion.div
            animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
            className="h-1 w-16 bg-accent-yellow mx-auto mt-6 rounded-full"
          />
        </div>
      </div>

      {/* Dual Infinite Scrolling Carousels */}
      <div className="space-y-6 w-full relative z-10 select-none pointer-events-auto">
        <TestimonialsCarousel
          testimonials={firstRow}
          speed={28}
          direction="left"
          cardHeight={210}
        />
        <TestimonialsCarousel
          testimonials={secondRow}
          speed={34}
          direction="right"
          cardHeight={210}
        />
      </div>
    </section>
  );
}
