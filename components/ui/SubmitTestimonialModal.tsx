"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Star, Upload, Check } from "lucide-react";

interface SubmitTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitTestimonialModal({ isOpen, onClose }: SubmitTestimonialModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [highlight, setHighlight] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // We upload to our testimonials media handler via Vercel Blob
      const res = await fetch("/api/testimonials/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        setUploadError(data.error || "Échec du téléversement");
      }
    } catch (err) {
      setUploadError("Une erreur s'est produite lors du téléversement.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !text) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          text,
          highlight: highlight || undefined,
          image: image || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setName("");
          setRole("");
          setText("");
          setHighlight("");
          setImage("");
          onClose();
        }, 3000);
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      alert("Impossible de soumettre le témoignage.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F2214] border border-primary-green/20 rounded-3xl p-6 shadow-2xl space-y-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-accent-yellow" />
                Laisser un avis ou témoignage
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary-green/20 border border-primary-green/30 flex items-center justify-center text-primary-green">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">Merci pour votre retour !</h4>
                <p className="text-xs text-gray-400 max-w-sm">
                  Votre témoignage a été soumis avec succès. Un administrateur va le valider sous peu afin qu'il apparaisse sur le site.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Image Upload Row */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={image} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Star className="w-6 h-6 text-primary-green/40" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[10px] text-primary-green font-bold animate-pulse">...</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Téléverser ma photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Format carré recommandé, max 5 Mo.</p>
                    {uploadError && <p className="text-[10px] text-red-400 mt-1">{uploadError}</p>}
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Romaric S."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 focus:border-primary-green/30 text-white focus:outline-none placeholder-gray-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Activité / Localisation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Éleveur · Bohicon"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 focus:border-primary-green/30 text-white focus:outline-none placeholder-gray-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Votre témoignage / Avis *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Partagez votre expérience avec Win Agro (vos résultats, le professionnalisme, etc.)..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 focus:border-primary-green/30 text-white focus:outline-none placeholder-gray-600 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Phrase clé à mettre en avant (facultatif)
                    <span className="text-[10px] text-gray-500 normal-case ml-1">(Sera surlignée en jaune)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: productivité globale améliorée de 25%"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 focus:border-primary-green/30 text-white focus:outline-none placeholder-gray-600 transition-all"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-primary-green hover:bg-primary-green/90 text-[#07130A] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Envoi..." : "Soumettre"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
