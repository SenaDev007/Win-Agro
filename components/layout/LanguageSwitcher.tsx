"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const FRFlag = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 rounded-full overflow-hidden shadow-md shrink-0 border border-white/20" xmlns="http://www.w3.org/2000/svg">
    <rect width="8" height="24" fill="#00209F"/>
    <rect x="8" width="8" height="24" fill="#FFFFFF"/>
    <rect x="16" width="8" height="24" fill="#F31830"/>
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 rounded-full overflow-hidden shadow-md shrink-0 border border-white/20" xmlns="http://www.w3.org/2000/svg">
    {/* Blue background */}
    <rect width="24" height="24" fill="#00247D"/>
    {/* White diagonals */}
    <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="2.5"/>
    {/* Red diagonals */}
    <path d="M0 0 L24 24 M24 0 L0 24" stroke="#CF142B" strokeWidth="1"/>
    {/* White cross */}
    <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="4.5"/>
    {/* Red cross */}
    <path d="M12 0 V24 M0 12 H24" stroke="#CF142B" strokeWidth="2.5"/>
  </svg>
);

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
        className="relative z-10 w-1/2 h-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer"
        aria-label="Passer le site en Français"
      >
        <motion.div
          animate={{ scale: language === "fr" ? 1.15 : 0.85, opacity: language === "fr" ? 1 : 0.6 }}
          whileHover={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <FRFlag />
        </motion.div>
      </button>

      {/* EN Button */}
      <button
        onClick={() => setLanguage("en")}
        className="relative z-10 w-1/2 h-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer"
        aria-label="Switch website to English"
      >
        <motion.div
          animate={{ scale: language === "en" ? 1.15 : 0.85, opacity: language === "en" ? 1 : 0.6 }}
          whileHover={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <UKFlag />
        </motion.div>
      </button>
    </div>
  );
}
