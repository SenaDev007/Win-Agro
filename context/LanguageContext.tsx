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

    // Set the googtrans cookie for Google Translate
    // Format: /pageLanguage/targetLanguage -> /fr/en or /fr/fr
    const cookieValue = `/fr/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    
    // Set domain ONLY if it is not localhost or IP to avoid browser rejection
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.includes('192.168.') || !host.includes('.');
    if (!isLocal) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host};`;
      const hostParts = host.split('.');
      if (hostParts.length > 2) {
        const baseDomain = hostParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${baseDomain};`;
      }
    }

    // Also update the select dropdown in the DOM if loaded
    const translateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (translateCombo) {
      translateCombo.value = lang;
      translateCombo.dispatchEvent(new Event("change"));
    }

    // Refresh the page to guarantee clean translation of all React hydrated nodes
    window.location.reload();
  };

  useEffect(() => {
    const saved = localStorage.getItem("winagro_lang") as Language;
    if (saved === "fr" || saved === "en") {
      setLanguage(saved);
      
      // Ensure the cookie is populated on load
      const cookieValue = `/fr/${saved}`;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      
      const host = window.location.hostname;
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host.includes('192.168.') || !host.includes('.');
      if (!isLocal) {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host};`;
        const hostParts = host.split('.');
        if (hostParts.length > 2) {
          const baseDomain = hostParts.slice(-2).join('.');
          document.cookie = `googtrans=${cookieValue}; path=/; domain=.${baseDomain};`;
        }
      }
      
      // Delay to ensure the Google Translate widget has fully loaded in DOM
      const timer = setTimeout(() => {
        const translateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (translateCombo) {
          translateCombo.value = saved;
          translateCombo.dispatchEvent(new Event("change"));
        }
      }, 1000);
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
