"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Tag, Loader2, ArrowLeft, Save, ShieldAlert, Check, CheckCircle2, AlertCircle, Eye, Plus, Edit2, Trash2, X
} from "lucide-react";

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
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState("");

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
        // Prep price and status fields
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
      const payload = {
        action: modalProduct ? "update" : "create",
        id: modalProduct?.id,
        name: modalName.trim(),
        description: modalDescription.trim(),
        category: modalCategory,
        unit: modalUnit.trim(),
        price: modalPrice.trim() === "" ? null : Number(modalPrice),
        isActive: modalIsActive
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
            <p className="text-[10px] text-gray-400 font-sans">Crée, modifie et organise les articles du catalogue en direct</p>
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
                products.filter(p => p.category === cat.key).map(prod => (
                  <div key={prod.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-white leading-tight">{prod.name}</p>
                      {prod.description && <p className="text-xs text-gray-400 font-sans max-w-md">{prod.description}</p>}
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono font-semibold">Unité : {prod.unit}</p>
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

                      {/* Active toggle check */}
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-300 font-bold bg-white/5 px-2.5 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={status[prod.id] || false}
                          onChange={(e) => setStatus(prev => ({ ...prev, [prod.id]: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-primary-green focus:ring-0 cursor-pointer"
                        />
                        Actif
                      </label>

                      {/* Quick Save Button */}
                      <button
                        onClick={() => handleSaveProduct(prod.id)}
                        disabled={savingId === prod.id}
                        className="p-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] disabled:opacity-60 transition-colors cursor-pointer border border-primary-green"
                        title="Sauvegarde rapide du prix & visibilité"
                      >
                        {savingId === prod.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#07130A]" />
                        ) : (
                          <Save className="w-4 h-4 text-[#07130A]" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                        title="Modifier les détails"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(prod)}
                        className="p-2 rounded-xl bg-red-950/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-900/30 hover:border-red-500 transition-all cursor-pointer"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

        {/* Global Backoffice Footer with Win Agro Signature */}
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F2214] border border-primary-green/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
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
              {/* Category Select */}
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

              {/* Name Input */}
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

              {/* Description Input */}
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

              {/* Row for Unit & Price */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unité *</label>
                  <input
                    type="text"
                    placeholder="Ex: sujet, sac 25kg, lot 10 plants..."
                    value={modalUnit}
                    onChange={(e) => setModalUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prix (FCFA)</label>
                  <input
                    type="number"
                    placeholder="Sur devis"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-green text-right font-mono"
                  />
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
