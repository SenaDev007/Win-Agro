"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import TeamShowcase from "@/components/ui/team-showcase";

export default function About() {
  const handleScroll = (href: string) => {
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary-pale rounded-full blur-3xl opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* 1. Narrative Content (60%) */}
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-2">
              À Propos de Win Agro
            </div>

            {/* Hook statement */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-deep leading-snug"
            >
              "J'ai vu trop de gens perdre leurs économies sur des projets d'élevage qui n'auraient pas dû échouer."
            </motion.h2>

            <motion.div
              animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
              className="h-1 w-16 bg-accent-yellow rounded-full"
            />

            {/* Structured Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-gray-text font-sans leading-relaxed">
              <p>
                Je suis <strong className="text-primary-deep">Victoire AHOGNON</strong>, promotrice de Win Agro Agri Tech Solutions. Depuis plusieurs années, j'accompagne des porteurs de projets à créer des élevages rentables et durables. Pas dans des salles de formation climatisées.{" "}
                <span className="relative inline-block font-bold text-primary-green">
                  Directement sur le terrain.
                  <motion.span
                    animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-yellow rounded-full"
                  />
                </span>
              </p>
              
              <p>
                Ma mission est simple : te transmettre les animaux sélectionnés les plus résistants, t'enseigner les techniques biologiques adaptées à notre contexte local béninois, et t'apporter le suivi rigoureux qu'il faut pour traverser les premières semaines critiques sans perte inutile. Que tu partes de zéro ou que tu veuilles optimiser ton exploitation actuelle.
              </p>
            </div>

            {/* 1000 Hectares Vision Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-primary-pale rounded-3xl border border-primary-green/20 my-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-yellow/10 rounded-full blur-xl" />
              <h3 className="font-serif text-lg font-extrabold text-primary-deep mb-2 flex items-center gap-1.5">
                <Sprout className="w-5 h-5 text-primary-green shrink-0" /> Une vision d'envergure africaine
              </h3>
              <p className="font-sans text-sm sm:text-base text-primary-deep font-semibold leading-relaxed">
                Derrière cette rigueur quotidienne, une ambition plus grande nous porte :{" "}
                <span className="text-primary-green font-black font-serif text-base sm:text-lg block mt-1">
                  Construire la plus grande ferme biologique intégrée d'Afrique, former une génération d'agriculteurs modernes et produire des aliments 100% naturels pour le continent.
                </span>
              </p>
            </motion.div>

            {/* Signature Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
              <div>
                <p className="font-serif text-xl font-extrabold text-primary-deep italic flex items-center gap-1">
                  On y va ensemble. <Sprout className="w-5 h-5 text-primary-green shrink-0" />
                </p>
                <p className="font-sans text-xs text-gray-text font-bold uppercase tracking-wider mt-1">
                  Victoire AHOGNON · Directrice Win Agro
                </p>
              </div>

              <motion.button
                onClick={() => handleScroll("#contact")}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(9, 137, 71, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-base shadow-md cursor-pointer btn-shimmer"
              >
                Prendre contact avec Victoire →
              </motion.button>
            </div>
          </div>

          {/* 2. Professional Photo (40%) -> Premium Team Showcase */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <TeamShowcase />
          </div>

        </div>
      </div>
    </section>
  );
}
