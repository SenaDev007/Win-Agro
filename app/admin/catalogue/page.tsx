"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Tag, Loader2, ArrowLeft, Save, ShieldAlert, Check, CheckCircle2, AlertCircle
} from "lucide-react";

export default function AdminCatalogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [successMsg, setSuccessMsg] = useState("");

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
            <p className="text-[10px] text-gray-400 font-sans">Modifie les prix des articles et leur visibilité en direct</p>
          </div>
        </div>

        {successMsg && (
          <div className="text-[11px] font-bold text-primary-green bg-primary-green/10 border border-primary-green/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
            <Check className="w-3.5 h-3.5" />
            {successMsg}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {categories.map(cat => (
          <div key={cat.key} className="bg-[#0F2214]/50 border border-primary-green/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold border-b border-white/5 pb-2 text-primary-green">{cat.label}</h2>
            
            <div className="divide-y divide-white/5">
              {products.filter(p => p.category === cat.key).map(prod => (
                <div key={prod.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-white leading-tight">{prod.name}</p>
                    <p className="text-xs text-gray-400 font-sans max-w-md">{prod.description}</p>
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

                    {/* Save Button */}
                    <button
                      onClick={() => handleSaveProduct(prod.id)}
                      disabled={savingId === prod.id}
                      className="p-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {savingId === prod.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#07130A]" />
                      ) : (
                        <Save className="w-4 h-4 text-[#07130A]" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
