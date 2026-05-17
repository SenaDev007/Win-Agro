"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative flex items-center p-0.5 rounded-full bg-primary-pale/60 border border-primary-green/20 shadow-inner w-[84px] h-[36px] overflow-hidden select-none">
      {/* Sliding Background */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-primary-green shadow-sm"
        initial={false}
        animate={{
          left: language === "fr" ? "2px" : "42px",
          right: language === "fr" ? "42px" : "2px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {/* FR Button */}
      <button
        onClick={() => setLanguage("fr")}
        className={`relative z-10 w-1/2 h-full text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center transition-colors duration-200 focus:outline-none ${
          language === "fr" ? "text-white" : "text-primary-deep hover:text-primary-green"
        }`}
        aria-label="Passer le site en Français"
      >
        FR
      </button>

      {/* EN Button */}
      <button
        onClick={() => setLanguage("en")}
        className={`relative z-10 w-1/2 h-full text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center transition-colors duration-200 focus:outline-none ${
          language === "en" ? "text-white" : "text-primary-deep hover:text-primary-green"
        }`}
        aria-label="Switch website to English"
      >
        EN
      </button>
    </div>
  );
}
