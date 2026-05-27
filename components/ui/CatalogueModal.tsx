"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Plus, Minus, Send, Bird, Wheat, Trees, Trash2, ChevronLeft, Loader2 } from "lucide-react";

/* ─── Local Components ───────────────────────────────────── */
const Input = ({ label, name, value, onChange, type = "text", placeholder, required }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5 font-sans">
    <label className="text-xs font-bold text-primary-deep uppercase tracking-wider">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-primary-green/20 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-all"
    />
  </div>
);

/* ─── Types ─────────────────────────────────────────────── */
export interface CatalogueProduct {
  id: string;
  name: string;
  description: string;
  price: number | null; // null = "Sur devis"
  unit: string;
  promoPrice?: number | null;
  promoUntil?: string | null;
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

/* ─── Promo Helpers & Components ────────────────────────── */
const isPromoActive = (product: CatalogueProduct) => {
  if (product.promoPrice === null || product.promoPrice === undefined) return false;
  if (!product.promoUntil) return false;
  return new Date(product.promoUntil) > new Date();
};

function CountdownTimer({ until }: { until: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(until) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [until]);

  if (timeLeft.expired) {
    return <span className="text-[10px] text-red-500 font-sans font-bold">Offre expirée</span>;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 text-[10px] font-sans text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 mt-1.5 w-fit">
      <span className="font-bold flex items-center gap-0.5">⏱️ Promo finit dans :</span>
      <span className="font-mono bg-red-100 px-1 rounded">{timeLeft.days}j</span>
      <span className="font-mono bg-red-100 px-1 rounded">{pad(timeLeft.hours)}h</span>
      <span className="font-mono bg-red-100 px-1 rounded">{pad(timeLeft.minutes)}m</span>
      <span className="font-mono bg-red-100 px-1 rounded">{pad(timeLeft.seconds)}s</span>
    </div>
  );
}

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
  const promoActive = isPromoActive(product);

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 shadow-sm transition-all duration-200 ${qty > 0 ? "border-primary-green/50 ring-1 ring-primary-green/20" : "border-gray-100"}`}
    >
      <div className="flex-1">
        <p className="font-serif font-bold text-primary-deep text-sm leading-snug">{product.name}</p>
        <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed">{product.description}</p>
        {promoActive && product.promoUntil && (
          <CountdownTimer until={product.promoUntil} />
        )}
      </div>

      <div className="flex items-center justify-between mt-auto gap-2">
        <div>
          {product.price !== null ? (
            promoActive ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString("fr-FR")} {product.unit}
                </span>
                <span className="text-red-600 font-extrabold text-sm font-sans flex items-center gap-1">
                  🔥 {product.promoPrice?.toLocaleString("fr-FR")} <span className="text-xs font-normal text-gray-400">{product.unit}</span>
                </span>
              </div>
            ) : (
              <p className="text-primary-green font-bold text-sm font-sans">
                {product.price.toLocaleString("fr-FR")} <span className="text-xs font-normal text-gray-400">{product.unit}</span>
              </p>
            )
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
  products?: any[];
  discounts?: Record<string, any>;
}

export default function CatalogueModal({ isOpen, onClose, categoryKey, products: propProducts, discounts: propDiscounts }: CatalogueModalProps) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [localDiscounts, setLocalDiscounts] = useState<Record<string, any>>({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [step, setStep] = useState<"list" | "checkout">("list");
  const [form, setForm] = useState<Record<string, string>>({
    prenom: "", nom: "", whatsapp: "", email: "", ville: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dynamicProducts = propProducts !== undefined ? propProducts : localProducts;
  const discounts = propDiscounts !== undefined ? propDiscounts : localDiscounts;

  // Fetch updated catalog products from the admin store dynamically
  useEffect(() => {
    if (isOpen && propProducts === undefined) {
      setProductsLoading(true);
      fetch("/api/admin/products")
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            if (resData.products) setLocalProducts(resData.products);
            if (resData.discounts) setLocalDiscounts(resData.discounts);
          }
        })
        .catch((err) => console.error("❌ Failed to fetch current catalog prices:", err))
        .finally(() => setProductsLoading(false));
    } else if (isOpen && propProducts !== undefined) {
      setProductsLoading(false);
    }
  }, [isOpen, propProducts]);

  const rawCategory = catalogueData.find(c => c.key === categoryKey) ?? null;

  // Merge static metadata with dynamic price and status variables from the database
  const category = React.useMemo(() => {
    if (!rawCategory) return null;
    
    // If we have fetched products from the database, use those for this category.
    // Otherwise fall back to the static catalogue array as a loading preview.
    const sourceProducts = dynamicProducts.length > 0
      ? dynamicProducts.filter((dp: any) => dp.category === categoryKey)
      : rawCategory.products.map(p => ({ ...p, isActive: true }));

    const mappedProducts = sourceProducts
      .filter((p: any) => p.isActive)
      .map((p: any) => {
        const price = p.price;
        let promoPrice = p.promoPrice;
        let promoUntil = p.promoUntil;

        // Apply global category-level discount if active and no individual promo is active
        const individualPromoActive = promoPrice !== null && promoPrice !== undefined && promoUntil && new Date(promoUntil) > new Date();
        
        if (!individualPromoActive) {
          const catDiscount = categoryKey ? discounts?.[categoryKey] : null;
          const catPromoActive = catDiscount && catDiscount.percentage > 0 && catDiscount.until && new Date(catDiscount.until) > new Date() && price !== null;
          
          if (catPromoActive) {
            promoPrice = Math.round(price * (1 - catDiscount.percentage / 100));
            promoUntil = catDiscount.until;
          }
        }

        return {
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: price,
          unit: p.unit.startsWith("FCFA") ? p.unit : `FCFA / ${p.unit}`,
          isActive: p.isActive,
          promoPrice: promoPrice,
          promoUntil: promoUntil
        };
      });

    return {
      ...rawCategory,
      products: mappedProducts
    };
  }, [rawCategory, dynamicProducts, categoryKey, discounts]);

  // Reset cart and step when category changes
  useEffect(() => {
    setCart({});
    setStep("list");
    setForm({ prenom: "", nom: "", whatsapp: "", email: "", ville: "" });
    setError("");
  }, [categoryKey]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("list");
        setForm({ prenom: "", nom: "", whatsapp: "", email: "", ville: "" });
        setCart({});
        setError("");
      }, 300);
    }
  }, [isOpen]);

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
  const totalPrice = cartItems.reduce((s, i) => {
    const activePrice = isPromoActive(i.product) ? (i.product.promoPrice ?? i.product.price ?? 0) : (i.product.price ?? 0);
    return s + activePrice * i.qty;
  }, 0);

  const handleSendOrder = () => {
    if (!category || cartItems.length === 0) return;
    setStep("checkout");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!category || cartItems.length === 0) return;

      const token = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_session") : null;
      const utmSource = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_source") : null;
      const utmMedium = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_medium") : null;
      const utmCampaign = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_campaign") : null;

      // Construct lead details object with the products ordered
      const detailsObj: Record<string, string> = {
        "Catégorie catalogue": category.title,
        "Total estimé (FCFA)": `${totalPrice.toLocaleString("fr-FR")} FCFA`,
      };

      cartItems.forEach(item => {
        const promoActive = isPromoActive(item.product);
        const activePrice = promoActive ? (item.product.promoPrice ?? item.product.price ?? 0) : (item.product.price ?? 0);
        detailsObj[`Commande: ${item.product.name}`] = `${item.qty} × ${activePrice.toLocaleString("fr-FR")} FCFA${promoActive ? " (PROMO)" : ""}`;
      });

      // 1. Submit lead to database/API (notifies backoffice and email!)
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: `Commande Catalogue — ${category.title}`,
          prenom: form.prenom,
          nom: form.nom,
          whatsapp: form.whatsapp,
          email: form.email,
          ville: form.ville,
          sessionToken: token || undefined,
          utmSource: utmSource || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: utmCampaign || undefined,
          ...cart // passes raw cart items for auto-save compatibility
        })
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }

      // 2. Format the WhatsApp message with user coordinates + cart items + polite closing message
      const lines = cartItems.map(item => {
        const promoActive = isPromoActive(item.product);
        const activePrice = promoActive ? (item.product.promoPrice ?? item.product.price ?? 0) : (item.product.price ?? 0);
        return `- ${item.product.name} × ${item.qty} = ${(activePrice * item.qty).toLocaleString("fr-FR")} FCFA${promoActive ? " (PROMO)" : ""}`;
      });

      const message = `Bonjour Victoire,
 
Je m'appelle ${form.prenom} ${form.nom}. Je souhaite passer une commande dans la catégorie *${category.title}* :
 
${lines.join("\n")}
 
Total estimé : *${totalPrice.toLocaleString("fr-FR")} FCFA*
 
Mes coordonnées :
- Localisation : ${form.ville}
- WhatsApp : ${form.whatsapp}
- E-mail : ${form.email}

Merci de confirmer les disponibilités et modalités de livraison. Merci à vous, dans l'attente de votre réponse.`;

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      // 3. Clear cart and close modal
      setCart({});
      setStep("list");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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

              {step === "checkout" ? (
                /* Checkout Form Step */
                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5">
                  <button
                    onClick={() => setStep("list")}
                    className="flex items-center gap-1 text-primary-green hover:text-primary-deep text-xs font-sans font-bold mb-4 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Retour au catalogue
                  </button>
                  
                  <h3 className="font-serif font-black text-primary-deep text-lg mb-1">Finalisez votre commande</h3>
                  <p className="text-xs text-gray-500 font-sans mb-5">
                    Entrez vos coordonnées. Votre commande sera enregistrée dans le suivi clients et ouverte directement sur WhatsApp.
                  </p>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Kokou" required />
                      <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} placeholder="Agbodjan" required />
                    </div>
                    <Input label="Numéro WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel" placeholder="+229 01 XX XX XX XX" required />
                    <Input label="Adresse e-mail" name="email" value={form.email} onChange={handleChange} type="email" placeholder="exemple@email.com" required />
                    <Input label="Ville / Localisation" name="ville" value={form.ville} onChange={handleChange} placeholder="Cotonou, Parakou, Porto-Novo..." required />

                    {error && <p className="text-red-500 text-xs font-sans bg-red-50 rounded-xl px-3 py-2">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 cursor-pointer mt-4"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Valider et Commander via WhatsApp</>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Products Grid Step */
                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5">
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
              )}

              {/* Floating Cart Bar (only visible in list step) */}
              <AnimatePresence>
                {totalItems > 0 && step === "list" ? (
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
                ) : step === "list" ? (
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
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
