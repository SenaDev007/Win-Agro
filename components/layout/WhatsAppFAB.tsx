"use client";

import React, { useState } from "react";

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
        className="w-14 h-14 bg-primary-green hover:bg-primary-deep text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-slow focus:outline-none focus:ring-4 focus:ring-primary-pale"
        aria-label="Discuter avec Victoire sur WhatsApp"
      >
        <svg
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
        </svg>
      </a>
    </div>
  );
}
