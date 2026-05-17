"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Kofi A.",
      location: "Parakou, Bénin",
      activity: "Aviculture (Poulets de chair)",
      result: "Mon taux de mortalité est passé de 30% à 8% en seulement deux cycles.",
      before: "Je perdais près d'un tiers de mes poussins d'un jour sans jamais comprendre l'origine du problème, malgré mes lectures.",
      action: "Victoire est venue sur place. Elle a diagnostiqué un problème d'aération du poulailler et a ajusté mes formules de provende dès la première heure.",
      now: "Ma ferme de 500 sujets tourne aujourd'hui à plein régime et dégage des bénéfices stables chaque mois.",
      stars: 5,
    },
    {
      name: "Chantal M.",
      location: "Ouidah, Bénin",
      activity: "Ferme Intégrée (Pondeuses & Maraîchage)",
      result: "Je suis passée de l'idée à une ferme rentable de 1000 pondeuses en 3 mois.",
      before: "J'avais les économies et la volonté d'installer ma ferme, mais j'étais terrifiée par le risque d'échouer faute de connaissances pratiques.",
      action: "Win Agro a pris en charge l'étude de faisabilité, les plans de mes bâtiments, l'installation complète et l'encadrement de mes ouvriers.",
      now: "Le taux de ponte dépasse les 88%, mes œufs bio sont réservés à l'avance et la ferme est totalement autonome.",
      stars: 5,
    },
    {
      name: "Mathieu S.",
      location: "Bohicon, Bénin",
      activity: "Cuniculiculture (Lapins)",
      result: "Une productivité globale améliorée de 25% sur mon cheptel.",
      before: "Mes lapines avaient des portées faibles, souvent agitées, et la croissance des lapereaux était anormalement lente.",
      action: "Victoire a revu de fond en comble notre plan de prophylaxie naturelle et a introduit des fourrages locaux riches.",
      now: "Mes portées sont vigoureuses et mes lapereaux atteignent la taille commerciale avec deux semaines d'avance.",
      stars: 5,
    },
  ];

  return (
    <section id="témoignages" className="py-24 bg-[#FAFAF3] relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-4">
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

        {/* Testimonials Columns / Swipeable Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{
                y: -10,
                scale: 1.03,
                borderColor: "rgba(9, 137, 71, 0.4)",
                boxShadow: "0 20px 25px -5px rgba(7, 107, 55, 0.1), 0 8px 10px -6px rgba(7, 107, 55, 0.1)",
              }}
              className="rounded-3xl bg-white border border-primary-pale shadow-md p-8 flex flex-col justify-between transition-all duration-300 relative card-shimmer"
            >
              {/* Quote icon watermark */}
              <span className="absolute top-6 right-8 text-6xl text-primary-pale font-serif leading-none select-none opacity-40">
                ”
              </span>

              <div className="space-y-4 relative z-10">
                {/* Gold Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-accent-yellow text-lg">
                      ★
                    </span>
                  ))}
                </div>

                {/* Résultat concret (Bold Green Highlight) */}
                <p className="font-serif text-lg font-black text-primary-deep leading-snug border-l-4 border-primary-green pl-3">
                  {t.result}
                </p>

                <div className="w-full h-px bg-primary-pale/60 my-2" />

                {/* Body Details (Psychological Flow) */}
                <div className="space-y-3 text-sm font-sans leading-relaxed text-gray-text">
                  <p>
                    <strong className="text-primary-deep text-xs uppercase tracking-wider block mb-1">
                      ❌ Avant Win Agro :
                    </strong>
                    "{t.before}"
                  </p>
                  <p>
                    <strong className="text-primary-green text-xs uppercase tracking-wider block mb-1">
                      🔧 Action de Victoire :
                    </strong>
                    {t.action}
                  </p>
                  <p>
                    <strong className="text-accent-dark text-xs uppercase tracking-wider block mb-1">
                      🌱 Aujourd'hui :
                    </strong>
                    <span className="font-semibold text-primary-deep">"{t.now}"</span>
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="mt-8 pt-6 border-t border-primary-pale flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-pale flex items-center justify-center font-serif text-lg font-bold text-primary-deep shadow-inner">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-primary-deep">
                    {t.name}
                  </h4>
                  <p className="font-sans text-xs text-gray-400">
                    {t.location} · <span className="text-primary-green font-medium">{t.activity}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
