"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
    <footer className="bg-noir-vert text-gray-300 border-t-4 border-primary-green relative overflow-hidden">
      {/* Decorative overlay grids */}
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Presentation */}
          <div className="space-y-6">
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, "#hero")}
              className="inline-flex items-center gap-3 focus:outline-none"
            >
              <div className="relative w-16 h-16 overflow-hidden rounded-full border border-primary-green/30 bg-[#076B37] flex items-center justify-center p-0.5 shadow-md">
                <Image
                  src="/favicon-for-app/icon0.svg"
                  alt="Win Agro Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-tight text-white tracking-wide">
                  Win Agro
                </span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-accent-yellow">
                  Agri Tech Solutions
                </span>
              </div>
            </a>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Nous cultivons des élevages rentables. Et la vision d'une Afrique agricole moderne et autosuffisante.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Être accompagné →
              </a>
            </div>
          </div>

          {/* Column 1 — Services */}
          <div>
            <h3 className="text-white font-serif text-base font-bold tracking-wider mb-6 border-b border-primary-green/20 pb-2">
              Services
            </h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, "#services")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Formation élevage
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, "#services")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Accompagnement & Installation
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, "#services")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Consultation & Diagnostic
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 — Produits */}
          <div>
            <h3 className="text-white font-serif text-base font-bold tracking-wider mb-6 border-b border-primary-green/20 pb-2">
              Produits
            </h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <a
                  href="#produits"
                  onClick={(e) => handleLinkClick(e, "#produits")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Volailles & Animaux vivants
                </a>
              </li>
              <li>
                <a
                  href="#produits"
                  onClick={(e) => handleLinkClick(e, "#produits")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Nutrition Animale (Provendes)
                </a>
              </li>
              <li>
                <a
                  href="#produits"
                  onClick={(e) => handleLinkClick(e, "#produits")}
                  className="hover:text-accent-yellow transition-colors duration-200"
                >
                  Plants & Diversification
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="text-white font-serif text-base font-bold tracking-wider mb-6 border-b border-primary-green/20 pb-2">
              Contact Direct
            </h3>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex items-center gap-3">
                <span className="text-accent-yellow">📱</span>
                <a
                  href="tel:+2290161336548"
                  className="hover:text-accent-yellow transition-colors font-bold"
                >
                  +229 0161336548
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent-yellow">📱</span>
                <a
                  href="tel:+2290147221458"
                  className="hover:text-accent-yellow transition-colors font-bold"
                >
                  +229 0147221458
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent-yellow">✉️</span>
                <a
                  href="mailto:contact@winagro.bj"
                  className="hover:text-accent-yellow transition-colors"
                >
                  contact@winagro.bj
                </a>
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-400">
                <span className="text-primary-green">📍</span>
                <span>Cotonou, République du Bénin</span>
              </li>
              <li className="pt-4 border-t border-primary-green/10">
                <p className="text-xs text-gray-400 font-sans uppercase font-bold tracking-wider mb-3">
                  Suivez Win Agro
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href={`https://wa.me/2290161336548?text=${encodeURIComponent("Bonjour Victoire, je viens de visiter votre site Win Agro et j'aimerais en savoir plus sur vos services et produits d'élevage.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-green/20 hover:bg-primary-green text-white hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="WhatsApp Win Agro"
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100063562046259"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600 text-white hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Facebook Win Agro"
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-green/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="font-sans">
            © {currentYear} Win Agro Agri Tech Solutions. Tous droits réservés.
          </p>
          <p className="font-sans flex gap-2">
            <span>Conçu avec excellence par</span>
            <a
              href="https://ketermarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-yellow hover:underline font-bold"
            >
              Keter Marketing
            </a>
          </p>
          <div className="flex gap-4 font-sans">
            <a href="#contact" className="hover:text-accent-yellow transition-colors">
              Politique de confidentialité
            </a>
            <span>·</span>
            <a href="#contact" className="hover:text-accent-yellow transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
