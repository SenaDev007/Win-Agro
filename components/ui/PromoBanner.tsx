"use client";

import React, { useState, useEffect } from "react";
import { X, Flame } from "lucide-react";

interface PromoProduct {
  id: string;
  name: string;
  price: number | null;
  promoPrice: number | null;
  promoUntil: string | null;
  isActive: boolean;
}

interface PromoBannerProps {
  activePromos: PromoProduct[];
  onClose: () => void;
}

export default function PromoBanner({ activePromos, onClose }: PromoBannerProps) {
  const [now, setNow] = useState<Date>(new Date());

  // Update current time every second to tick the countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (activePromos.length === 0) return null;

  // Helper to format remaining time
  const getRemainingTime = (until: string) => {
    const diff = +new Date(until) - +now;
    if (diff <= 0) return "Expiré";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  // Duplicate items to ensure smooth continuous scrolling marquee
  const displayItems = [
    ...activePromos,
    ...activePromos,
    ...activePromos,
    ...activePromos,
  ];

  return (
    <div className="fixed top-0 left-0 right-0 overflow-hidden bg-gradient-to-r from-noir-vert via-[#06331A] to-noir-vert text-white border-b border-accent-yellow/20 flex items-center z-50 h-10 select-none shadow-md">
      {/* Left Badge */}
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-r-full shadow-md z-10 shrink-0 animate-pulse">
        <Flame className="w-3.5 h-3.5 fill-white" />
        <span>Offres Flash</span>
      </div>

      {/* Marquee area */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {/* Shadow overlays for smooth fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-noir-vert to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-noir-vert to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <div className="flex whitespace-nowrap animate-marquee items-center py-2">
          {displayItems.map((p, idx) => (
            <span key={`${p.id}-${idx}`} className="mx-8 inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-bold">
              <span className="text-[#FAFAF3] font-serif font-black">{p.name}</span>
              <span className="text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/30 px-2 py-0.5 rounded text-[10px] sm:text-xs font-sans">
                {p.promoPrice?.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="text-gray-400 line-through text-[10px]">
                {p.price?.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30 text-[10px] font-mono">
                ⏳ Finit dans : {getRemainingTime(p.promoUntil!)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="h-full px-3 flex items-center justify-center bg-noir-vert/80 hover:bg-noir-vert hover:text-red-400 transition-colors z-10 shrink-0 text-white/60 border-l border-white/5"
        aria-label="Fermer la bannière"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
