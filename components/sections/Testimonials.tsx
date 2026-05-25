"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TestimonialsCarousel, Testimonial } from "@/components/ui/testimonials-carousel";
import SubmitTestimonialModal from "@/components/ui/SubmitTestimonialModal";

const STATIC_FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    text: "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles. Je perdais près d'un tiers de mes poussins d'un jour sans comprendre pourquoi. Victoire a diagnostiqué une mauvaise aération et ajusté mes formules.",
    highlight: "Mon taux de mortalité est passé de 30% à 8%",
    image: "/avatar_chabi.png",
    name: "Chabi A.",
    role: "Aviculteur · Parakou, Bénin",
  },
  {
    text: "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois. J'avais la volonté d'installer ma ferme, mais j'étais terrifiée par le risque. Win Agro a pris en charge l'étude de faisabilité et l'installation.",
    highlight: "ferme rentable de 1000 pondeuses en 3 mois",
    image: "/avatar_pascaline.png",
    name: "Pascaline M.",
    role: "Entrepreneuse · Ouidah, Bénin",
  },
  {
    text: "Une productivité globale améliorée de 25% sur mon cheptel. Mes lapines avaient des portées faibles. Victoire a revu notre plan de prophylaxie naturelle et introduit des fourrages locaux riches.",
    highlight: "productivité globale améliorée de 25%",
    image: "/avatar_romaric.png",
    name: "Romaric S.",
    role: "Éleveur de Lapins · Bohicon, Bénin",
  },
  {
    text: "Mon rendement de culture a doublé grâce aux semences sélectionnées et au système d'irrigation économique proposé par Win Agro. Les résultats sont visibles dès le premier mois.",
    highlight: "Mon rendement de culture a doublé",
    image: "/avatar_sanni.png",
    name: "Sanni B.",
    role: "Maraîcher · Malanville, Bénin",
  },
  {
    text: "Grâce à la formation en ligne de Win Agro, j'ai lancé mon élevage de pintades à domicile. Le démarrage a été simple, et le taux de survie est excellent avec leur accompagnement.",
    highlight: "lancement simple et taux de survie excellent",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=120&h=120",
    name: "Amina T.",
    role: "Avicultrice · Djougou, Bénin",
  },
  {
    text: "J'économise 30% sur les coûts alimentaires de mes bêtes en fabriquant ma propre provende grâce aux formulations naturelles apprises dans les ateliers pratiques de Win Agro.",
    highlight: "J'économise 30% sur les coûts alimentaires",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120",
    name: "Gildas K.",
    role: "Producteur de provendes · Calavi, Bénin",
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(STATIC_FALLBACK_TESTIMONIALS);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(err => console.error("Error loading testimonials", err));
  }, []);

  // Split to prevent cards duplication between the two scrolling carousels only if we have enough testimonials (>= 6)
  const isLargeSet = testimonials.length >= 6;
  const firstRow = isLargeSet ? testimonials.filter((_, index) => index % 2 === 0) : testimonials;
  const secondRow = isLargeSet ? testimonials.filter((_, index) => index % 2 !== 0) : [];

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

          <div className="mt-8">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-6 py-3 rounded-full bg-primary-green text-[#07130A] font-bold text-xs hover:bg-primary-green/90 transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              ⭐ Donner mon avis / témoignage
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Scrolling Carousels */}
      <div className="space-y-6 w-full relative z-10 select-none pointer-events-auto">
        <TestimonialsCarousel
          testimonials={firstRow}
          speed={isLargeSet ? 28 : 34}
          direction="left"
          cardHeight={210}
        />
        {isLargeSet && (
          <TestimonialsCarousel
            testimonials={secondRow}
            speed={34}
            direction="right"
            cardHeight={210}
          />
        )}
      </div>

      <SubmitTestimonialModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </section>
  );
}
