"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        const isSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
        router.push(isSubdomain ? "/" : "/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07130A] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-green/10 blur-[120px] pointer-events-none" />

      {/* Back to website button */}
      <button
        onClick={() => {
          if (typeof window !== "undefined" && window.location.hostname.startsWith("admin.")) {
            window.location.href = "https://winagrotech.com";
          } else {
            router.push("/");
          }
        }}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au site
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0F2214]/60 border border-primary-green/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl p-2 mb-4 border border-white/5">
            <img src="/Logo Win Agro.png" alt="Win Agro" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">Administration</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-sans">Espace sécurisé de gestion Win Agro</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-primary-green uppercase tracking-wider">
              Mot de passe d'accès
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-500">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-primary-green/20 bg-black/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all font-sans placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-500 hover:text-white cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs bg-red-950/40 border border-red-900/30 rounded-xl px-3 py-2 text-center"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Vérification...
              </>
            ) : (
              "Se connecter →"
            )}
          </button>
        </form>

        {/* Professional Win Agro signature and logo */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-col items-center gap-1.5">
          <img src="/Logo Win Agro.png" alt="Signature Win Agro" className="w-10 h-10 object-contain brightness-95 opacity-80" />
          <p className="text-xs font-serif font-bold text-white font-sans">L'équipe Win Agro</p>
          <p className="text-[9px] text-gray-500 font-sans text-center max-w-[280px]">
            Espace d'administration réservé. Toute tentative d'accès non autorisée est enregistrée.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
