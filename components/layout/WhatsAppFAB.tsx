"use client";

import React, { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";

export default function WhatsAppFAB() {
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide tooltip after 8 seconds, but reappear on hover
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = "2290161336548";
  const defaultMessage = encodeURIComponent(
    "Bonjour Victoire, je viens de visiter votre site Win Agro et j'aimerais en savoir plus sur vos services."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip */}
      {showTooltip && (
        <div className="mb-3 mr-1 bg-white text-primary-deep text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-primary-pale max-w-xs animate-float flex items-center gap-2">
          <span>Une question ? Écris à Victoire →</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-primary-green ml-1 transition-colors"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      {/* Pulsing FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-14 h-14 bg-white hover:bg-primary-pale rounded-full flex items-center justify-center shadow-2xl border border-primary-pale/60 transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-slow focus:outline-none focus:ring-4 focus:ring-primary-pale cursor-pointer"
        aria-label="Discuter avec Victoire sur WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 shrink-0" />
      </a>
    </div>
  );
}
