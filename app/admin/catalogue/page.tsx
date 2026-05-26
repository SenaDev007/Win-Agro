"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tag, Loader2, ArrowLeft, Save, ShieldAlert, Check, AlertCircle,
  Eye, Plus, Edit2, Trash2, X, Flame, Calendar, Percent
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────── */
function isPromoActive(promoPrice: number | null, promoUntil: string | null): boolean {
  if (!promoPrice || !promoUntil) return false;
  return new Date(promoUntil) > new Date();
}

// Formats a datetime-local string from an ISO date
function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function AdminCatalogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [successMsg, setSuccessMsg] = useState("");

  // Product Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalUnit, setModalUnit] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [modalCategory, setModalCategory] = useState("elevage");
  const [modalIsActive, setModalIsActive] = useState(true);
  const [modalPromoPrice, setModalPromoPrice] = useState("");
  const [modalPromoUntil, setModalPromoUntil] = useState("");
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Quick Promo Panel State
  const [promoProductId, setPromoProductId] = useState<string | null>(null);
  const [promoPrice, setPromoPrice] = useState("");
  const [promoUntil, setPromoUntil] = useState("");
  const [promoSaving, setPromoSaving] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [productToDeleteName, setProductToDeleteName] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        const priceMap: Record<string, string> = {};
        const statusMap: Record<string, boolean> = {};
        data.products.forEach((p: any) => {
          priceMap[p.id] = p.price === null ? "" : String(p.price);
          statusMap[p.id] = p.isActive;
        });
        setPrices(priceMap);
        setStatus(statusMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (id: string) => {
    setSavingId(id);
    setSuccessMsg("");
    try {
      const priceVal = prices[id];
      const activeVal = status[id];
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          price: priceVal === "" ? null : priceVal,
          isActive: activeVal
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Produit enregistré avec succès");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleOpenAddModal = (categoryKey: string) => {
    setModalProduct(null);
    setModalName("");
    setModalDescription("");
    setModalUnit("");
    setModalPrice("");
    setModalPromoPrice("");
    setModalPromoUntil("");
    setModalCategory(categoryKey);
    setModalIsActive(true);
    setModalError("");
    setModalSaving(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setModalProduct(prod);
    setModalName(prod.name);
    setModalDescription(prod.description || "");
    setModalUnit(prod.unit);
    setModalPrice(prod.price === null ? "" : String(prod.price));
    setModalPromoPrice(prod.promoPrice === null ? "" : String(prod.promoPrice));
    setModalPromoUntil(isoToDatetimeLocal(prod.promoUntil));
    setModalCategory(prod.category);
    setModalIsActive(prod.isActive);
    setModalError("");
    setModalSaving(false);
    setIsModalOpen(true);
  };

  const handleSaveModalProduct = async () => {
    if (!modalName.trim()) {
      setModalError("Le nom de l'article est obligatoire.");
      return;
    }
    if (!modalUnit.trim()) {
      setModalError("L'unité de l'article est obligatoire.");
      return;
    }

    setModalSaving(true);
    setModalError("");

    try {
      const promoPriceVal = modalPromoPrice.trim() === "" ? null : Number(modalPromoPrice);
      // Convert datetime-local to full ISO string
      const promoUntilVal = modalPromoUntil ? new Date(modalPromoUntil).toISOString() : null;

      const payload = {
        action: modalProduct ? "update" : "create",
        id: modalProduct?.id,
        name: modalName.trim(),
        description: modalDescription.trim(),
        category: modalCategory,
        unit: modalUnit.trim(),
        price: modalPrice.trim() === "" ? null : Number(modalPrice),
        isActive: modalIsActive,
        promoPrice: promoPriceVal,
        promoUntil: promoUntilVal
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(modalProduct ? "Article modifié avec succès" : "Article ajouté avec succès");
        setTimeout(() => setSuccessMsg(""), 3000);
        setIsModalOpen(false);
        await loadProducts();
      } else {
        setModalError(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      console.error(err);
      setModalError("Erreur de connexion avec le serveur.");
    } finally {
      setModalSaving(false);
    }
  };

  // Open the quick promo panel for a given product
  const handleOpenPromoPanel = (prod: any) => {
    setPromoProductId(prod.id);
    setPromoPrice(prod.promoPrice === null ? "" : String(prod.promoPrice));
    setPromoUntil(isoToDatetimeLocal(prod.promoUntil));
    setPromoError("");
  };

  const handleSavePromo = async () => {
    if (!promoProductId) return;
    setPromoSaving(true);
    setPromoError("");
    try {
      const promoPriceVal = promoPrice.trim() === "" ? null : Number(promoPrice);
      const promoUntilVal = promoUntil ? new Date(promoUntil).toISOString() : null;

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-promo",
          id: promoProductId,
          promoPrice: promoPriceVal,
          promoUntil: promoUntilVal
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Offre promotionnelle mise à jour !");
        setTimeout(() => setSuccessMsg(""), 3000);
        setPromoProductId(null);
        await loadProducts();
      } else {
        setPromoError(data.error || "Erreur lors de l'enregistrement de la promo.");
      }
    } catch (err) {
      console.error(err);
      setPromoError("Erreur de connexion avec le serveur.");
    } finally {
      setPromoSaving(false);
    }
  };

  const handleClearPromo = async () => {
    if (!promoProductId) return;
    setPromoSaving(true);
    setPromoError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-promo",
          id: promoProductId,
          promoPrice: null,
          promoUntil: null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Offre promotionnelle supprimée.");
        setTimeout(() => setSuccessMsg(""), 3000);
        setPromoProductId(null);
        await loadProducts();
      } else {
        setPromoError(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPromoSaving(false);
    }
  };

  const handleDeleteClick = (prod: any) => {
    setProductToDeleteId(prod.id);
    setProductToDeleteName(prod.name);
    setDeletingProduct(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDeleteId) return;
    setDeletingProduct(true);
    try {
      const res = await fetch(`/api/admin/products?id=${productToDeleteId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Article supprimé avec succès");
        setTimeout(() => setSuccessMsg(""), 3000);
        setIsConfirmOpen(false);
        await loadProducts();
      } else {
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    } finally {
      setDeletingProduct(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07130A] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary-green animate-spin" />
          <p className="text-gray-400 text-sm">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { key: "elevage", label: "Élevage (Animaux vivants)" },
    { key: "nutrition", label: "Nutrition Animale" },
    { key: "agriculture", label: "Agriculture & Plants" }
  ];

  const activePromoProduct = products.find(p => p.id === promoProductId);

  return (
    <div className="min-h-screen bg-[#07130A] text-white font-sans flex flex-col">
      <header className="border-b border-primary-green/10 bg-[#0F2214]/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">Gestion du Catalogue</h1>
            <p className="text-[10px] text-gray-400 font-sans">Crée, modifie, organise et gère les offres promotionnelles</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="text-[11px] font-bold text-primary-green bg-primary-green/10 border border-primary-green/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              {successMsg}
            </div>
          )}
          <a
            href={typeof window !== "undefined" ? (window.location.hostname.startsWith("admin.") ? `${window.location.protocol}//${window.location.hostname.replace("admin.", "")}${window.location.port ? ":" + window.location.port : ""}` : "/") : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <Eye className="w-3.5 h-3.5 text-primary-green" />
            Voir le site
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {categories.map(cat => (
          <div key={cat.key} className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h2 className="font-serif text-base font-bold text-primary-green">{cat.label}</h2>
              <button
                onClick={() => handleOpenAddModal(cat.key)}
                className="px-3 py-1.5 rounded-xl bg-primary-green/10 hover:bg-primary-green hover:text-[#07130A] text-primary-green text-xs font-black inline-flex items-center gap-1.5 border border-primary-green/20 hover:border-primary-green transition-all cursor-pointer shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {products.filter(p => p.category === cat.key).length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center italic font-sans">Aucun article dans cette catégorie.</p>
              ) : (
                products.filter(p => p.category === cat.key).map(prod => {
                  const promoActive = isPromoActive(prod.promoPrice, prod.promoUntil);
                  return (
                    <div key={prod.id} className="py-4 flex flex-col gap-3 first:pt-0 last:pb-0">
                      {/* Row 1: Product info + controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white leading-tight">{prod.name}</p>
                            {promoActive && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-400 text-white px-2 py-0.5 rounded-full">
                                <Flame className="w-2.5 h-2.5" /> PROMO ACTIVE
                              </span>
                            )}
                          </div>
                          {prod.description && <p className="text-xs text-gray-400 font-sans max-w-md">{prod.description}</p>}
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono font-semibold">Unité : {prod.unit}</p>
                          {promoActive && (
                            <p className="text-[10px] font-bold text-orange-400 font-mono">
                              🔥 {prod.promoPrice?.toLocaleString("fr-FR")} FCFA — expire le {new Date(prod.promoUntil).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          {/* Price Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Sur devis"
                              value={prices[prod.id] || ""}
                              onChange={(e) => setPrices(prev => ({ ...prev, [prod.id]: e.target.value }))}
                              className="w-28 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green text-right font-mono"
                            />
                            <span className="text-[10px] text-gray-400 font-sans font-bold">FCFA</span>
                          </div>

                          {/* Active toggle */}
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-300 font-bold bg-white/5 px-2.5 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <input
                              type="checkbox"
                              checked={status[prod.id] || false}
                              onChange={(e) => setStatus(prev => ({ ...prev, [prod.id]: e.target.checked }))}
                              className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                            />
                            Actif
                          </label>

                          {/* Quick Save */}
                          <button
                            onClick={() => handleSaveProduct(prod.id)}
                            disabled={savingId === prod.id}
                            className="p-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] disabled:opacity-60 transition-colors cursor-pointer border border-primary-green"
                            title="Sauvegarder le prix & visibilité"
                          >
                            {savingId === prod.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#07130A]" />
                            ) : (
                              <Save className="w-4 h-4 text-[#07130A]" />
                            )}
                          </button>

                          {/* Promo Button */}
                          <button
                            onClick={() => handleOpenPromoPanel(prod)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${promoActive ? "bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30" : "bg-white/5 border-white/5 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30"}`}
                            title="Gérer l'offre promotionnelle"
                          >
                            <Flame className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                            title="Modifier les détails"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteClick(prod)}
                            className="p-2 rounded-xl bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-900/30 hover:border-red-500 transition-all cursor-pointer"
                            title="Supprimer l'article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Inline Promo Panel */}
                      {promoProductId === prod.id && (
                        <div className="mt-1 bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-700/30 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <p className="text-xs font-black text-orange-300 uppercase tracking-wider">Offre Promotionnelle — {prod.name}</p>
                            <button
                              onClick={() => setPromoProductId(null)}
                              className="ml-auto p-1 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {promoError && (
                            <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/30 text-red-400 text-xs flex items-center gap-2">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              {promoError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-orange-300/70 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Percent className="w-3 h-3" /> Prix Promotionnel (FCFA)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  placeholder={`Prix normal : ${prod.price?.toLocaleString("fr-FR") || "Sur devis"}`}
                                  value={promoPrice}
                                  onChange={e => setPromoPrice(e.target.value)}
                                  className="w-full px-3 py-2 bg-black/40 border border-orange-700/30 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 text-right font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-orange-300/70 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Fin de la promo
                              </label>
                              <input
                                type="datetime-local"
                                value={promoUntil}
                                onChange={e => setPromoUntil(e.target.value)}
                                className="w-full px-3 py-2 bg-black/40 border border-orange-700/30 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end pt-1">
                            {(prod.promoPrice || prod.promoUntil) && (
                              <button
                                onClick={handleClearPromo}
                                disabled={promoSaving}
                                className="px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-800/30 text-red-400 hover:text-red-300 text-xs font-bold border border-red-900/30 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <X className="w-3 h-3" /> Supprimer la promo
                              </button>
                            )}
                            <button
                              onClick={handleSavePromo}
                              disabled={promoSaving}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-orange-900/30"
                            >
                              {promoSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flame className="w-3 h-3" />}
                              Activer la promo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}

        <footer className="pt-8 mt-12 border-t border-primary-green/10 flex flex-col items-center gap-1.5 pb-6 shrink-0">
          <img src="/Logo Win Agro.png" alt="Signature Win Agro" className="w-12 h-12 object-contain mix-blend-multiply opacity-80" />
          <p className="text-sm font-serif font-bold text-gray-300">L'équipe Win Agro</p>
          <p className="text-[10px] text-gray-500 font-sans text-center max-w-[280px]">
            Win Agro Agri Tech Solutions — Console d'administration sécurisée.
          </p>
        </footer>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F2214] border border-primary-green/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-serif text-base font-bold text-white">
                {modalProduct ? "Modifier l'article" : "Ajouter un article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {modalError}
              </div>
            )}

            <div className="space-y-3.5">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Catégorie</label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.key} value={c.key} className="bg-[#07130A]">{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nom de l'article *</label>
                <input
                  type="text"
                  placeholder="Ex: Poussins d'1 jour..."
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Description ou caractéristiques de l'article..."
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green resize-none"
                />
              </div>

              {/* Unit & Price */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unité *</label>
                  <input
                    type="text"
                    placeholder="Ex: sujet, sac 25kg..."
                    value={modalUnit}
                    onChange={(e) => setModalUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prix normal (FCFA)</label>
                  <input
                    type="number"
                    placeholder="Sur devis"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green text-right font-mono"
                  />
                </div>
              </div>

              {/* Promo section */}
              <div className="bg-orange-950/20 border border-orange-700/20 rounded-2xl p-3.5 space-y-2.5">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3 h-3" /> Offre Promotionnelle (optionnel)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prix promo (FCFA)</label>
                    <input
                      type="number"
                      placeholder="Prix remisé..."
                      value={modalPromoPrice}
                      onChange={(e) => setModalPromoPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-orange-700/20 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-right font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fin de la promo</label>
                    <input
                      type="datetime-local"
                      value={modalPromoUntil}
                      onChange={(e) => setModalPromoUntil(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-orange-700/20 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-bold bg-white/5 px-3 py-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors w-max">
                <input
                  type="checkbox"
                  checked={modalIsActive}
                  onChange={(e) => setModalIsActive(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                />
                Actif (Visible sur le site)
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveModalProduct}
                disabled={modalSaving}
                className="px-4 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                {modalSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0F2214] border border-red-950/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
              <h3 className="font-serif text-sm font-bold text-white">Supprimer l'article ?</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Voulez-vous vraiment supprimer définitivement l'article <strong className="text-white">"{productToDeleteName}"</strong> ? Cette opération est irréversible.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingProduct}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                {deletingProduct && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
