"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
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
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-primary-deep text-white"
    >
      {/* 1. Premium Background Image with Green Opacity Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Authentic West African farm photo */}
        <Image
          src="/ferme_moderne.png"
          alt="Win Agro Ferme d'Élevage Moderne au Bénin"
          fill
          priority
          className="object-cover object-center scale-102"
        />

        {/* Dynamic mesh gradients overlaying photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/90 via-primary-deep/80 to-noir-vert/90 mix-blend-multiply" />
        
        {/* Glowing floating decorative circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-green/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent-yellow/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: "2s" }} />

        {/* SVG Noise Grain Filter */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
      </div>

      {/* 2. Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Staggered Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-green/30 border border-primary-green/50 text-accent-yellow font-sans font-bold text-xs uppercase tracking-wider mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-yellow"></span>
            </span>
            🌱 Plus de 500+ éleveurs déjà accompagnés au Bénin
          </motion.div>

          {/* Staggered Main Title (H1) */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-6">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="block"
            >
              Tu veux lancer ou développer
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="block mt-2 text-white"
            >
              ton élevage au Bénin ?
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              className="block mt-4"
            >
              On t'accompagne jusqu'aux premiers{" "}
              <span className="relative inline-block text-accent-yellow font-black">
                résultats
                <motion.span
                  animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["0% 50%", "0% 50%", "100% 50%", "100% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
                  className="absolute bottom-1 left-0 w-full h-[4px] bg-accent-yellow rounded-full"
                />
              </span>
              .
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-200 font-sans leading-relaxed max-w-2xl mb-10"
          >
            Formation pratique, installation de ferme, vente de volailles et intrants agricoles.{" "}
            <span className="font-bold text-white">Win Agro Agri Tech Solutions</span> est ton partenaire terrain depuis le premier jour.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <motion.button
              onClick={() => handleScroll("#contact")}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(9, 137, 71, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut"
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-base shadow-xl border border-primary-green flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary-green/50 btn-shimmer"
            >
              Être accompagné sur mon projet
              <span className="text-lg">→</span>
            </motion.button>

            <div className="flex items-center gap-2 text-sm text-gray-300 font-sans font-medium">
              <button
                onClick={() => handleScroll("#services")}
                className="hover:text-accent-yellow underline transition-colors cursor-pointer"
              >
                Voir nos formations
              </button>
              <span>·</span>
              <button
                onClick={() => handleScroll("#produits")}
                className="hover:text-accent-yellow underline transition-colors cursor-pointer"
              >
                Commander nos produits
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant Slanted Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FAFAF3]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}
