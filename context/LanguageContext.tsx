"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("winagro_lang", lang);

    // Update the Google Translate widget select element and dispatch change event
    const translateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (translateCombo) {
      translateCombo.value = lang;
      translateCombo.dispatchEvent(new Event("change"));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("winagro_lang") as Language;
    if (saved === "fr" || saved === "en") {
      setLanguage(saved);
      
      // Delay to ensure the Google Translate widget has fully loaded in DOM
      const timer = setTimeout(() => {
        const translateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (translateCombo) {
          translateCombo.value = saved;
          translateCombo.dispatchEvent(new Event("change"));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
