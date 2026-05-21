"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Loader2, CheckCircle2, Sprout, BookOpen } from "lucide-react";

type Path = null | "accompagnement" | "formation";
type Step = "choice" | "form" | "success";

interface FormData {
  prenom: string;
  nom: string;
  whatsapp: string;
  ville: string;
  // accompagnement
  typeElevage: string;
  experience: string;
  besoin: string;
  budget: string;
  // formation
  formationSouhaitee: string;
  modePreferee: string;
  disponibilite: string;
}

const initialForm: FormData = {
  prenom: "", nom: "", whatsapp: "", ville: "",
  typeElevage: "", experience: "", besoin: "", budget: "",
  formationSouhaitee: "", modePreferee: "", disponibilite: "",
};

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: "accompagnement" | "formation" | null;
}

const Select = ({ label, name, value, onChange, options, required }: {
  label: string; name: keyof FormData; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-primary-deep uppercase tracking-wider">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-primary-green/20 bg-white text-sm text-gray-700 font-sans focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-all"
    >
      <option value="">-- Choisir --</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text", placeholder, required }: {
  label: string; name: keyof FormData; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-primary-deep uppercase tracking-wider">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-primary-green/20 bg-white text-sm text-gray-700 font-sans placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-all"
    />
  </div>
);

export default function LeadModal({ isOpen, onClose, initialPath = null }: LeadModalProps) {
  const [path, setPath] = useState<Path>(initialPath);
  const [step, setStep] = useState<Step>(initialPath ? "form" : "choice");
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync state when opened or reset on close
  useEffect(() => {
    if (isOpen) {
      setPath(initialPath);
      setStep(initialPath ? "form" : "choice");
    } else {
      setTimeout(() => {
        setPath(initialPath);
        setStep(initialPath ? "form" : "choice");
        setForm(initialForm);
        setError("");
        setWhatsappUrl("");
      }, 300);
    }
  }, [isOpen, initialPath]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChoose = (choice: Path) => {
    setPath(choice);
    setStep("form");
  };

  const handleBack = () => {
    setStep("choice");
    setPath(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        type: path,
        prenom: form.prenom,
        nom: form.nom,
        whatsapp: form.whatsapp,
        ville: form.ville,
        ...(path === "accompagnement" ? {
          typeElevage: form.typeElevage,
          experience: form.experience,
          besoin: form.besoin,
          budget: form.budget,
        } : {
          formationSouhaitee: form.formationSouhaitee,
          modePreferee: form.modePreferee,
          disponibilite: form.disponibilite,
        }),
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Erreur réseau");
      }

      const url = result.data?.whatsappUrl;
      if (url) {
        setWhatsappUrl(url);
        // Auto-redirect to WhatsApp after 1.5 seconds
        setTimeout(() => {
          window.open(url, "_blank", "noopener,noreferrer");
        }, 1500);
      }
      setStep("success");
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue. Veuillez réessayer ou nous contacter sur WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg bg-[#FAFAF3] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              {/* Header */}
              <div 
                className={`px-6 pt-6 pb-5 relative shrink-0 ${step === 'form' ? 'bg-cover bg-center overflow-hidden' : 'bg-noir-vert'}`}
                style={step === 'form' ? { 
                  backgroundImage: path === 'accompagnement' 
                    ? 'url("https://images.unsplash.com/photo-1591793433098-92dc8d0e9c05?auto=format&fit=crop&w=900&q=80")' 
                    : 'url("https://images.unsplash.com/photo-1628352081506-83c43123c5bc?auto=format&fit=crop&w=900&q=80")' 
                } : {}}
              >
                {step === 'form' && <div className="absolute inset-0 bg-noir-vert/80 z-0 backdrop-blur-sm" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {step === "form" && (
                      <button onClick={handleBack} className="mr-1 text-white/70 hover:text-white transition-colors shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    
                    <div className="w-10 h-10 shrink-0 bg-white rounded-lg p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                      <img src="/Logo Win Agro.png" alt="Win Agro" className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <p className="text-accent-yellow text-[10px] font-sans font-black uppercase tracking-widest">Win Agro Agri Tech Solutions</p>
                      <h2 className="text-white font-serif text-lg font-bold leading-tight mt-0.5">
                        {step === "choice" && "Comment pouvons-nous vous aider ?"}
                        {step === "form" && path === "accompagnement" && "Votre projet d'élevage"}
                        {step === "form" && path === "formation" && "Inscription à la formation"}
                        {step === "success" && "Demande envoyée ! 🎉"}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                <AnimatePresence mode="wait">

                  {/* Step: Choice */}
                  {step === "choice" && (
                    <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <p className="text-sm text-gray-500 font-sans text-center">Choisissez votre parcours pour que nous vous proposions le meilleur accompagnement.</p>
                      
                      <button
                        onClick={() => handleChoose("accompagnement")}
                        className="group w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-primary-green/20 hover:border-primary-green bg-white hover:bg-primary-pale transition-all duration-200 text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary-green/10 group-hover:bg-primary-green/20 flex items-center justify-center shrink-0 transition-colors">
                          <Sprout className="w-6 h-6 text-primary-green" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-primary-deep text-base">Je veux être accompagné sur mon projet</p>
                          <p className="text-xs text-gray-500 font-sans mt-1">Installation de ferme, suivi technique, conseils personnalisés</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleChoose("formation")}
                        className="group w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-primary-green/20 hover:border-primary-green bg-white hover:bg-primary-pale transition-all duration-200 text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent-yellow/20 group-hover:bg-accent-yellow/30 flex items-center justify-center shrink-0 transition-colors">
                          <BookOpen className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-primary-deep text-base">Je veux me former en élevage</p>
                          <p className="text-xs text-gray-500 font-sans mt-1">Volailles, lapins, porcs, nutrition animale, transformation</p>
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {/* Step: Form */}
                  {step === "form" && (
                    <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Common fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Kokou" required />
                        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} placeholder="Agbodjan" required />
                      </div>
                      <Input label="Numéro WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel" placeholder="+229 01 XX XX XX XX" required />
                      <Input label="Ville / Localisation" name="ville" value={form.ville} onChange={handleChange} placeholder="Cotonou, Parakou, Porto-Novo..." required />

                      {/* Accompagnement fields */}
                      {path === "accompagnement" && (<>
                        <Select label="Type d'élevage envisagé" name="typeElevage" value={form.typeElevage} onChange={handleChange} required
                          options={["Poulets de chair", "Pondeuses", "Pintades", "Cailles", "Lapins", "Porcs", "Autre"]} />
                        <Select label="Niveau d'expérience" name="experience" value={form.experience} onChange={handleChange} required
                          options={["Débutant complet", "J'ai déjà essayé", "J'ai une ferme active"]} />
                        <Select label="Besoin principal" name="besoin" value={form.besoin} onChange={handleChange} required
                          options={["Installation de ferme", "Accompagnement technique", "Financement de projet", "Formation + suivi", "Autre"]} />
                        <Select label="Budget estimé (FCFA)" name="budget" value={form.budget} onChange={handleChange}
                          options={["Moins de 500 000 FCFA", "500 000 – 2 000 000 FCFA", "Plus de 2 000 000 FCFA", "Je ne sais pas encore"]} />
                      </>)}

                      {/* Formation fields */}
                      {path === "formation" && (<>
                        <Select label="Formation souhaitée" name="formationSouhaitee" value={form.formationSouhaitee} onChange={handleChange} required
                          options={["Élevage de volailles", "Élevage de lapins", "Élevage de porcs", "Nutrition animale", "Transformation de produits", "Autre"]} />
                        <Select label="Mode préféré" name="modePreferee" value={form.modePreferee} onChange={handleChange} required
                          options={["Présentiel", "En ligne", "Les deux"]} />
                        <Select label="Disponibilité" name="disponibilite" value={form.disponibilite} onChange={handleChange} required
                          options={["En semaine", "Le weekend", "Flexible"]} />
                      </>)}

                      {error && <p className="text-red-500 text-xs font-sans bg-red-50 rounded-xl px-3 py-2">{error}</p>}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                      >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</> : "Envoyer ma demande →"}
                      </button>

                      <div className="pt-4 mt-2 border-t border-gray-200/60 flex flex-col items-center gap-1.5">
                        <img src="/Logo Win Agro.png" alt="Signature Win Agro" className="w-12 h-12 object-contain mix-blend-multiply opacity-80" />
                        <p className="text-sm font-serif font-bold text-primary-deep">L'équipe Win Agro</p>
                        <p className="text-[10px] text-gray-400 font-sans text-center max-w-[280px]">
                          Vos informations sont confidentielles. Un conseiller technique vous contactera dans les 24h.
                        </p>
                      </div>
                    </motion.form>
                  )}

                  {/* Step: Success */}
                  {step === "success" && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="flex flex-col items-center text-center gap-4 py-6">
                      <div className="w-16 h-16 rounded-full bg-primary-green/10 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-primary-green animate-bounce" />
                      </div>
                      <div>
                        <p className="font-serif text-xl font-bold text-primary-deep">Merci {form.prenom} ! 💪🏾</p>
                        <p className="text-sm text-gray-600 font-sans mt-2 leading-relaxed max-w-sm">
                          {whatsappUrl ? (
                            <>Votre demande a été enregistrée avec succès ! Redirection automatique vers WhatsApp en cours...</>
                          ) : (
                            <>Votre demande a bien été reçue. Un conseiller Win Agro vous contactera sur WhatsApp dans les prochaines 24h pour la suite de votre projet agricole.</>
                          )}
                        </p>
                      </div>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-green hover:bg-primary-green/90 text-white font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.52 1 6.082 1 1.657 5.37 1.653 10.801c-.001 1.737.478 3.436 1.388 4.935L2.03 21.03l5.097-1.336zM18.66 14.86c-.512-.258-3.033-1.493-3.501-1.662-.468-.17-.81-.256-1.15.257-.34.513-1.32 1.662-1.618 2.003-.298.34-.595.383-1.107.127-.513-.257-2.165-.796-4.124-2.54-1.524-1.357-2.553-3.034-2.851-3.547-.298-.513-.032-.79.224-1.046.23-.23.512-.596.766-.893.255-.298.34-.51.51-.85.17-.34.085-.637-.043-.893-.127-.257-1.15-2.766-1.574-3.786-.413-.997-.833-.861-1.15-.877-.297-.015-.638-.016-.979-.016-.34 0-.894.127-1.362.637-.468.51-1.787 1.744-1.787 4.254 0 2.51 1.83 4.935 2.085 5.276.255.341 3.6 5.49 8.72 7.705 1.218.527 2.17.84 2.912 1.077 1.224.387 2.34.333 3.22.202.982-.146 3.033-1.237 3.46-2.433.427-1.196.427-2.22.298-2.434-.127-.213-.467-.34-.98-.598z" />
                          </svg>
                          Ouvrir WhatsApp Manuellement
                        </a>
                      )}

                      <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 font-sans font-bold text-xs hover:bg-gray-100 transition-colors"
                      >
                        Fermer la fenêtre
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
