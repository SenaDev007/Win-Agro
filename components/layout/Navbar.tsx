"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PillBase } from "@/components/ui/3d-adaptive-navigation-bar";
import LeadModal from "@/components/ui/LeadModal";

export default function Navbar({ hasPromo = false }: { hasPromo?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Formation", href: "#services" },
    { label: "Accompagnement", href: "#services" },
    { label: "Produits", href: "#produits" },
    { label: "À propos", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const openModal = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsMobileMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          hasPromo ? "top-10" : "top-0"
        } ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-primary-green py-2"
            : "bg-white py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, "#hero")}
              className="flex items-center gap-3 focus:outline-none"
              aria-label="Win Agro — Retour en haut"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary-green/30 bg-noir-vert logo-light-beam shadow-md flex items-center justify-center p-0.5">
                <Image
                  src="/favicon-for-app/icon0.svg"
                  alt="Win Agro Logo"
                  width={44}
                  height={44}
                  className="object-contain rounded-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-tight text-primary-deep tracking-wide">
                  Win Agro
                </span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary-green">
                  Agri Tech Solutions
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:block">
              <PillBase />
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(9, 137, 71, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 btn-shimmer"
              >
                Être accompagné →
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-deep hover:text-primary-green focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Ouvrir le menu"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-primary-pale shadow-2xl transition-all duration-300 ease-in-out">
            <div className="px-4 pt-2 pb-6 space-y-3 bg-white">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block px-3 py-3 rounded-lg text-primary-deep hover:bg-primary-pale hover:text-primary-green font-sans font-bold text-base transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-primary-pale flex flex-col gap-4">
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-base shadow-md transition-colors cursor-pointer btn-shimmer"
                >
                  Être accompagné →
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Lead Modal */}
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
