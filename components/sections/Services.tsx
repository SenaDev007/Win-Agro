"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Info } from "lucide-react";
import LeadModal from "@/components/ui/LeadModal";

interface ServicesProps {
  onSelectService: (serviceKey: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPath, setModalPath] = useState<"accompagnement" | "formation" | "consultation" | null>(null);

  const handleServiceClick = (serviceKey: string) => {
    // 1. Trigger service selection state for compatibility with bottom form
    onSelectService(serviceKey);

    // 2. Open the LeadModal with adapted path
    if (serviceKey === "formation_elevage") {
      setModalPath("formation");
    } else if (serviceKey === "consultation") {
      setModalPath("consultation");
    } else {
      setModalPath("accompagnement");
    }
    setIsModalOpen(true);
  };

  const servicesList = [
    {
      key: "formation_elevage",
      title: "Formation Pratique",
      hook: "La plupart des formations t'apprennent à prendre des notes. La nôtre t'apprend à ne pas perdre tes animaux.",
      problem: "Beaucoup de cours sont déconnectés de la réalité du terrain béninois. Tu sors diplômé, mais quand la mortalité frappe ta bande, tu es désarmé.",
      bullets: [
        "Élevage de volaille complet (chairs, pondeuses, goliaths, pintades, dindes, cailles)",
        "Élevage professionnel de lapins (cuniculiculture)",
        "Élevage porcin rentable",
        "Formulation de nutrition animale",
        "Transformation agro-alimentaire locale",
      ],
      availability: "Disponible en présentiel & en ligne · Adapté au climat africain",
      cta: "Je veux me former →",
      isPremium: false,
    },
    {
      key: "installation_ferme",
      title: "Accompagnement & Installation de Ferme",
      hook: "Tu arrives avec une idée en tête. Tu repars avec une exploitation agricole qui tourne.",
      problem: "Tu as un projet d'élevage ou un terrain disponible, mais tu manques de repères pour démarrer et tu ne veux pas gaspiller tes économies.",
      bullets: [
        "Étude de faisabilité et plan d'affaires terrain",
        "Installation complète de tes bâtiments et équipements",
        "Suivi technique rigoureux post-installation",
        "Encadrement et formation de tes employés sur place",
      ],
      availability: "Accompagnement clé en main de A à Z par Victoire et ses équipes",
      cta: "Lancer mon projet →",
      isPremium: true, // stands out visually
    },
    {
      key: "consultation",
      title: "Consultation & Diagnostic",
      hook: "Ta ferme tourne déjà, mais les résultats ne suivent pas. On va trouver pourquoi.",
      problem: "Tu investis ton temps et ton argent mais tes marges restent faibles, ou tu fais face à des vagues de pertes inexpliquées.",
      bullets: [
        "Audit complet et diagnostic des blocages terrain",
        "Résolution des problèmes sanitaires et techniques",
        "Optimisation de tes performances d'alimentation",
      ],
      availability: "Intervention rapide, conseils actionnables, résultats garantis",
      cta: "Demander une consultation →",
      isPremium: false,
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#FAFAF3] relative overflow-hidden">
      {/* Background Graphic Patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-pale/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-accent-pale/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-3"
          >
            Nos Services
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-deep leading-tight"
          >
            Ce que nous faisons pour toi
          </motion.h2>
          
          <motion.div
            animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
            className="h-1 w-16 bg-accent-yellow mx-auto mt-6 rounded-full"
          />
        </div>

        {/* Services Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {servicesList.map((service, index) => {
            if (service.isPremium) {
              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                    borderColor: "rgba(253, 221, 0, 0.4)",
                    boxShadow: "0 20px 25px -5px rgba(253, 221, 0, 0.15), 0 8px 10px -6px rgba(253, 221, 0, 0.15)",
                  }}
                  className="relative rounded-3xl bg-primary-deep text-white border-2 border-accent-yellow shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 card-shimmer"
                >
                  {/* Premium Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-accent-yellow text-primary-deep font-sans font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 shrink-0" /> Plus Haute Valeur
                  </div>

                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="font-serif text-2xl font-black text-white">
                        {service.title}
                      </h3>
                      <p className="font-sans font-bold text-accent-yellow text-sm mt-3 leading-relaxed italic">
                        "{service.hook}"
                      </p>
                    </div>

                    <div className="w-full h-px bg-white/10 my-4" />

                    {/* Content */}
                    <p className="font-sans text-sm text-gray-200 leading-relaxed mb-6">
                      {service.problem}
                    </p>

                    <h4 className="font-sans font-bold text-sm text-accent-yellow uppercase tracking-wider mb-3">
                      Ce que nous prenons en charge :
                    </h4>
                    
                    <ul className="space-y-3 mb-8">
                      {service.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-200 font-sans">
                          <span className="text-accent-yellow mt-0.5">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Area */}
                  <div className="mt-auto">
                    <p className="text-xs text-primary-pale font-sans font-medium mb-4 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-center flex items-center justify-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-accent-yellow" /> {service.availability}
                    </p>
                    <motion.button
                      onClick={() => handleServiceClick(service.key)}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(253, 221, 0, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ scale: { repeat: Infinity, duration: 2.0, ease: "easeInOut" } }}
                      className="w-full py-4 rounded-full bg-accent-yellow hover:bg-white text-primary-deep font-sans font-black text-base shadow-xl cursor-pointer btn-shimmer"
                    >
                      {service.cta}
                    </motion.button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={service.key}
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
                className="rounded-3xl bg-white border border-primary-pale shadow-lg p-8 flex flex-col justify-between transition-all duration-300 card-shimmer"
              >
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-bold text-primary-deep">
                      {service.title}
                    </h3>
                    <p className="font-sans font-semibold text-primary-green text-sm mt-3 leading-relaxed italic">
                      "{service.hook}"
                    </p>
                  </div>

                  <div className="w-full h-px bg-primary-pale my-4" />

                  {/* Content */}
                  <p className="font-sans text-sm text-gray-text leading-relaxed mb-6">
                    {service.problem}
                  </p>

                  <h4 className="font-sans font-bold text-sm text-primary-deep uppercase tracking-wider mb-3">
                    Notre programme comprend :
                  </h4>
                  
                  <ul className="space-y-3 mb-8">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-text font-sans">
                        <span className="text-primary-green mt-0.5">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Area */}
                <div className="mt-auto">
                  <p className="text-xs text-primary-green font-sans font-medium mb-4 py-2 px-3 rounded-lg bg-primary-pale border border-primary-pale/50 text-center flex items-center justify-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-primary-deep" /> {service.availability}
                  </p>
                  <motion.button
                    onClick={() => handleServiceClick(service.key)}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(9, 137, 71, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-base shadow-md cursor-pointer btn-shimmer"
                  >
                    {service.cta}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialPath={modalPath} 
      />
    </section>
  );
}
