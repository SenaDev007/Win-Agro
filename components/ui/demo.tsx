"use client";

import React from "react";
import { PillBase } from "@/components/ui/3d-adaptive-navigation-bar";
import { TestimonialsCarousel, Testimonial } from "@/components/ui/testimonials-carousel";

const testimonialsDemo: Testimonial[] = [
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

export default function Demo() {
  return (
    <div className="bg-[#FAFAF3] min-h-screen py-12 flex flex-col items-center justify-start overflow-hidden">
      {/* 3D Navigation Bar Showcase */}
      <div className="w-full flex justify-center py-6 border-b border-primary-pale bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl w-full px-4 flex justify-between items-center">
          <span className="font-serif font-bold text-lg text-primary-deep">Win Agro Component Suite</span>
          <PillBase />
          <button className="px-4 py-2 bg-primary-green text-white text-xs font-sans font-bold rounded-full">
            Showcase
          </button>
        </div>
      </div>

      {/* Testimonials Carousel Section Showcase */}
      <section className="py-16 w-full max-w-7xl px-4 flex-grow flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary-green bg-primary-pale px-3 py-1 rounded-full border border-primary-green/10">
            shadcn Component Integration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-deep mt-4">
            Témoignages Réels
          </h2>
          <p className="mt-3 text-sm text-gray-text font-sans max-w-lg mx-auto">
            Test de défilement infini asynchrone bidirectionnel en situation réelle pour l'évaluation des animations Framer Motion.
          </p>
        </div>

        {/* Carousel Rows */}
        <div className="space-y-6 w-full mt-6 select-none">
          <TestimonialsCarousel
            testimonials={testimonialsDemo}
            speed={25}
            direction="left"
            cardHeight={210}
          />
          <TestimonialsCarousel
            testimonials={testimonialsDemo}
            speed={30}
            direction="right"
            cardHeight={210}
          />
        </div>
      </section>
    </div>
  );
}
