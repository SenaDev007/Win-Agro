"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Plus, Minus, Send, Bird, Wheat, Trees, Trash2 } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
export interface CatalogueProduct {
  id: string;
  name: string;
  description: string;
  price: number | null; // null = "Sur devis"
  unit: string;
}

export interface CatalogueCategory {
  key: string;
  title: string;
  hook: string;
  image: string;
  accentColor: string;
  Icon: React.ElementType;
  products: CatalogueProduct[];
}

export type CartItem = { product: CatalogueProduct; qty: number };

const whatsappNumber = "2290161336548";

/* ─── Catalogue Data ─────────────────────────────────────── */
export const catalogueData: CatalogueCategory[] = [
  {
    key: "elevage",
    title: "Élevage — Animaux vivants",
    hook: "Des animaux sélectionnés pour le terrain béninois.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=900",
    accentColor: "text-amber-700",
    Icon: Bird,
    products: [
      { id: "e1", name: "Poussins d'1 jour — Coquellets (chair)", description: "Souche adaptée au climat du Bénin, robuste et à croissance rapide.", price: 850, unit: "FCFA / sujet" },
      { id: "e2", name: "Poussins d'1 jour — Pondeuses", description: "Pondeuses haute performance, démarrage optimal garanti.", price: 950, unit: "FCFA / sujet" },
      { id: "e3", name: "Pintadeaux", description: "Excellente souche adaptée à l'élevage familial ou commercial.", price: 700, unit: "FCFA / sujet" },
      { id: "e4", name: "Cailletaux", description: "Élevage rapide, très rentable, idéal pour les débutants.", price: 650, unit: "FCFA / sujet" },
      { id: "e5", name: "Lapins reproducteurs", description: "Races sélectionnées pour leur prolificité et croissance rapide.", price: 8000, unit: "FCFA / sujet" },
      { id: "e6", name: "Volailles prêtes à consommer", description: "Volailles vivantes ou abattues proprement selon votre besoin.", price: 3500, unit: "FCFA / sujet" },
      { id: "e7", name: "Œufs de table frais (plateau)", description: "Collectés chaque matin, fraîcheur garantie.", price: 3000, unit: "FCFA / plateau 30" },
    ],
  },
  {
    key: "nutrition",
    title: "Nutrition Animale",
    hook: "La mortalité vient souvent d'une alimentation mal adaptée.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=900",
    accentColor: "text-green-700",
    Icon: Wheat,
    products: [
      { id: "n1", name: "Provende démarrage (0–3 semaines)", description: "Formule haute densité nutritionnelle pour l'immunité et la croissance initiale.", price: 12500, unit: "FCFA / sac 25kg" },
      { id: "n2", name: "Provende croissance (3–6 semaines)", description: "Maintien optimal de la croissance et de la conversion alimentaire.", price: 11000, unit: "FCFA / sac 25kg" },
      { id: "n3", name: "Provende finition (>6 semaines)", description: "Formule économique pour la phase finale avant vente.", price: 10500, unit: "FCFA / sac 25kg" },
      { id: "n4", name: "Provende pondeuse", description: "Enrichie en calcium pour des œufs solides et une bonne ponte.", price: 12000, unit: "FCFA / sac 25kg" },
      { id: "n5", name: "Formulation personnalisée", description: "Consultation + formulation sur mesure selon votre élevage. Contactez-nous.", price: null, unit: "Sur devis" },
    ],
  },
  {
    key: "agriculture",
    title: "Agriculture & Plants",
    hook: "Diversifie ton exploitation et augmente sa valeur durablement.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=900",
    accentColor: "text-emerald-700",
    Icon: Trees,
    products: [
      { id: "a1", name: "Plants d'eucalyptus (lot 10)", description: "Vigoureux et adaptés au sol béninois. Reboisement ou vente de bois.", price: 2500, unit: "FCFA / lot 10 plants" },
      { id: "a2", name: "Plants d'eucalyptus (lot 50)", description: "Tarif dégressif — idéal pour les grandes parcelles.", price: 10000, unit: "FCFA / lot 50 plants" },
      { id: "a3", name: "Plants d'eucalyptus (lot 100)", description: "Meilleur rapport qualité-prix pour projets de reboisement.", price: 18000, unit: "FCFA / lot 100 plants" },
      { id: "a4", name: "Autres plants agricoles (lot 10)", description: "Espèces sélectionnées pour nos sols — variétés selon disponibilité saisonnière.", price: 3000, unit: "FCFA / lot 10 plants" },
    ],
  },
];

/* ─── Product Card ────────────────────────────────────────── */
function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
}: {
  product: CatalogueProduct;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 shadow-sm transition-all duration-200 ${qty > 0 ? "border-primary-green/50 ring-1 ring-primary-green/20" : "border-gray-100"}`}
    >
      <div className="flex-1">
        <p className="font-serif font-bold text-primary-deep text-sm leading-snug">{product.name}</p>
        <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto gap-2">
        <div>
          {product.price !== null ? (
            <p className="text-primary-green font-bold text-sm font-sans">
              {product.price.toLocaleString("fr-FR")} <span className="text-xs font-normal text-gray-400">{product.unit}</span>
            </p>
          ) : (
            <p className="text-amber-600 font-bold text-xs font-sans italic">Sur devis</p>
          )}
        </div>

        {product.price !== null ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRemove}
              disabled={qty === 0}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-primary-pale flex items-center justify-center disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-primary-deep" />
            </button>
            <span className={`w-6 text-center font-bold font-sans text-sm ${qty > 0 ? "text-primary-green" : "text-gray-300"}`}>{qty}</span>
            <button
              onClick={onAdd}
              className="w-7 h-7 rounded-full bg-primary-green hover:bg-primary-deep flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 font-sans italic">via WhatsApp</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryKey: string | null;
}

export default function CatalogueModal({ isOpen, onClose, categoryKey }: CatalogueModalProps) {
  const [cart, setCart] = useState<Record<string, number>>({});

  const category = catalogueData.find(c => c.key === categoryKey) ?? null;

  // Reset cart when category changes
  useEffect(() => {
    setCart({});
  }, [categoryKey]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Trap scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const addToCart = useCallback((productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if ((next[productId] ?? 0) > 1) next[productId]--;
      else delete next[productId];
      return next;
    });
  }, []);

  const cartItems: CartItem[] = category
    ? category.products
        .filter(p => (cart[p.id] ?? 0) > 0)
        .map(p => ({ product: p, qty: cart[p.id] }))
    : [];

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + (i.product.price ?? 0) * i.qty, 0);

  const handleSendOrder = () => {
    if (!category || cartItems.length === 0) return;

    const lines = cartItems.map(item =>
      `- ${item.product.name} × ${item.qty} = ${(item.product.price! * item.qty).toLocaleString("fr-FR")} FCFA`
    );

    const message = `Bonjour Victoire,

Je souhaite passer une commande dans la catégorie *${category.title}* :

${lines.join("\n")}

Total estimé : *${totalPrice.toLocaleString("fr-FR")} FCFA*

Merci de confirmer les disponibilités et modalités de livraison. À bientôt !`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!category) return null;

  const CatIcon = category.Icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full sm:max-w-2xl bg-[#FAFAF3] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

              {/* Hero Header */}
              <div
                className="relative h-36 sm:h-48 bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url("${category.image}")` }}
              >
                <div className="absolute inset-0 bg-noir-vert/75" />
                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl p-1 shrink-0">
                      <img src="/Logo Win Agro.png" alt="Win Agro" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-accent-yellow text-[10px] font-sans font-black uppercase tracking-widest">Win Agro · Notre Catalogue</p>
                      <h2 className="text-white font-serif text-xl font-extrabold leading-tight">{category.title}</h2>
                    </div>
                  </div>
                  <p className="text-white/80 text-xs font-sans mt-2 italic ml-[52px]">{category.hook}</p>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Products Grid */}
              <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5">
                <p className="text-xs text-gray-500 font-sans mb-4 text-center">
                  ⚡ Les prix sont indicatifs. Victoire confirmera les tarifs finaux sur WhatsApp.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      qty={cart[product.id] ?? 0}
                      onAdd={() => addToCart(product.id)}
                      onRemove={() => removeFromCart(product.id)}
                    />
                  ))}
                </div>

                {/* Professional Win Agro signature and logo */}
                <div className="pt-8 mt-6 border-t border-gray-200/60 flex flex-col items-center gap-1.5">
                  <img src="/Logo Win Agro.png" alt="Signature Win Agro" className="w-12 h-12 object-contain mix-blend-multiply opacity-80" />
                  <p className="text-sm font-serif font-bold text-primary-deep font-sans">L'équipe Win Agro</p>
                  <p className="text-[10px] text-gray-400 font-sans text-center max-w-[280px]">
                    Commandes sécurisées et gérées par notre équipe. Retrait sur place ou livraison disponible dans tout le Bénin.
                  </p>
                </div>

                {/* Bottom padding for cart bar */}
                <div className="h-28" />
              </div>

              {/* Floating Cart Bar */}
              <AnimatePresence>
                {totalItems > 0 ? (
                  <motion.div
                    key="cart-bar"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 bg-primary-deep px-5 py-4 flex items-center justify-between gap-4 shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ShoppingCart className="w-6 h-6 text-white" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-yellow text-primary-deep text-[10px] font-black rounded-full flex items-center justify-center">
                          {totalItems}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-sans font-bold text-sm leading-tight">{totalItems} article{totalItems > 1 ? "s" : ""}</p>
                        <p className="text-accent-yellow font-sans font-black text-base leading-tight">{totalPrice.toLocaleString("fr-FR")} FCFA</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSendOrder}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-yellow hover:bg-white text-primary-deep font-sans font-black text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      Commander via WhatsApp
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-5 py-3 flex items-center justify-center"
                  >
                    <p className="text-xs text-gray-400 font-sans text-center">
                      Ajoutez des articles au panier avec <Plus className="w-3 h-3 inline" /> pour composer votre commande
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
