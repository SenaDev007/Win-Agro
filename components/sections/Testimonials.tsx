"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TestimonialsCarousel, Testimonial } from "@/components/ui/testimonials-carousel";

export default function Testimonials() {
  const { language } = useLanguage();

  const testimonialsFR: Testimonial[] = [
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

  const testimonialsEN: Testimonial[] = [
    {
      text: "My mortality rate dropped from 30% to 8% in just two cycles. I was losing nearly a third of my day-old chicks. Victoire diagnosed a coop ventilation issue and adjusted my feed formulas.",
      highlight: "My mortality rate dropped from 30% to 8%",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Kofi A.",
      role: "Poultry Farmer · Parakou, Benin",
    },
    {
      text: "I went from an idea to a profitable farm of 1,000 layers in 3 months. I had the will to build it, but was terrified of failing. Win Agro handled feasibility studies, plans, and full setup.",
      highlight: "profitable farm of 1,000 layers in 3 months",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Chantal M.",
      role: "Entrepreneur · Ouidah, Benin",
    },
    {
      text: "An overall productivity increase of 25% on my livestock. My rabbits had small litters and slow growth. Victoire completely revised our natural prevention plan and local green forage.",
      highlight: "overall productivity increase of 25%",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Mathieu S.",
      role: "Rabbit Breeder · Bohicon, Benin",
    },
    {
      text: "My crop yields doubled thanks to selected seeds and the economic drip irrigation system designed by Win Agro. Results were visible from the first month.",
      highlight: "My crop yields doubled",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Adama B.",
      role: "Vegetable Farmer · Malanville, Benin",
    },
    {
      text: "Thanks to Win Agro's online training, I launched my guinea fowl breeding from home. Startup was easy, and the survival rate is excellent with their follow-up.",
      highlight: "easy startup and excellent survival rate",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Amina T.",
      role: "Poultry Breeder · Djougou, Benin",
    },
    {
      text: "I save 30% on feed costs for my animals by formulating my own feed using natural methods learned in Win Agro's practical workshops.",
      highlight: "I save 30% on feed costs",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
      name: "Fabrice K.",
      role: "Feed Producer · Calavi, Benin",
    }
  ];

  const currentTestimonials = language === "en" ? testimonialsEN : testimonialsFR;

  // Split to prevent cards duplication between the two scrolling carousels
  const firstRow = currentTestimonials.filter((_, index) => index % 2 === 0);
  const secondRow = currentTestimonials.filter((_, index) => index % 2 !== 0);

  return (
    <section id="témoignages" className="py-24 bg-[#FAFAF3] relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-4 border border-primary-green/10">
            {language === "en" ? "Real Testimonials" : "Témoignages Réels"}
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-deep leading-tight"
          >
            {language === "en" ? "They started just like you." : "Ils ont démarré comme toi."}
          </motion.h2>
          
          <p className="text-primary-green font-serif text-lg sm:text-xl font-bold mt-2">
            {language === "en" ? "Here is what they achieved with Win Agro." : "Voilà ce qu'ils ont obtenu avec Win Agro."}
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
