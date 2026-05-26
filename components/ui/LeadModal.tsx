"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Loader2, CheckCircle2, Sprout, BookOpen, Stethoscope } from "lucide-react";

type Step = "choice" | "form" | "success";

interface FormField {
  name: string;
  label: string;
  type: "text" | "select";
  options?: string[];
  required: boolean;
}

interface FormConfig {
  key: string;
  title: string;
  heroBgUrl?: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: string | null;
}

const Select = ({ label, name, value, onChange, onBlur, options, required }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: string[]; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5 font-sans">
    <label className="text-xs font-bold text-primary-deep uppercase tracking-wider">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-primary-green/20 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-all"
    >
      <option value="">-- Choisir --</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Input = ({ label, name, value, onChange, onBlur, type = "text", placeholder, required }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5 font-sans">
    <label className="text-xs font-bold text-primary-deep uppercase tracking-wider">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-primary-green/20 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-all"
    />
  </div>
);

const defaultHeroBg: Record<string, string> = {
  accompagnement: 'url("/lead_accompagnement.png")',
  formation: 'url("/lead_formation.png")',
  consultation: 'url("/lead_consultation.png")',
};

export default function LeadModal({ isOpen, onClose, initialPath = null }: LeadModalProps) {
  const [formConfigs, setFormConfigs] = useState<FormConfig[]>([]);
  const [path, setPath] = useState<string | null>(initialPath);
  const [step, setStep] = useState<Step>(initialPath ? "form" : "choice");
  const [form, setForm] = useState<Record<string, string>>({
    prenom: "", nom: "", whatsapp: "", email: "", ville: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Fetch form configs dynamically
  useEffect(() => {
    fetch("/api/forms")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.forms)) {
          setFormConfigs(data.forms);
        }
      })
      .catch(err => console.error("Error fetching form configurations:", err));
  }, []);

  const trackVirtualPage = (stagePath: string) => {
    if (typeof window === "undefined") return;
    const token = sessionStorage.getItem("win_agro_session");
    if (!token) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: stagePath,
        referrer: null,
        sessionToken: token,
        utmSource: sessionStorage.getItem("win_agro_utm_source"),
        utmMedium: sessionStorage.getItem("win_agro_utm_medium"),
        utmCampaign: sessionStorage.getItem("win_agro_utm_campaign")
      })
    }).catch(err => console.warn("Failed to send virtual stage tracking:", err));
  };

  // Sync state when opened or reset on close
  useEffect(() => {
    if (isOpen) {
      setPath(initialPath);
      setStep(initialPath ? "form" : "choice");
      // Track virtual modal open
      trackVirtualPage(initialPath ? `/modal/open/${initialPath}` : "/modal/open/choice");
    } else {
      setTimeout(() => {
        setPath(initialPath);
        setStep(initialPath ? "form" : "choice");
        setForm({ prenom: "", nom: "", whatsapp: "", email: "", ville: "" });
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

  const handleAutoSave = async (updatedForm: typeof form) => {
    if (!path) return;
    // Only auto-save if we have at least a WhatsApp number or first name
    if (!updatedForm.whatsapp && !updatedForm.prenom) return;

    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_session") : null;
      const utmSource = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_source") : null;
      const utmMedium = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_medium") : null;
      const utmCampaign = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_campaign") : null;

      const payload: Record<string, any> = {
        type: path,
        prenom: updatedForm.prenom || "",
        nom: updatedForm.nom || "",
        whatsapp: updatedForm.whatsapp || "",
        email: updatedForm.email || "",
        ville: updatedForm.ville || "",
        isPartial: true,
        sessionToken: token || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined
      };

      if (currentConfig) {
        for (const field of currentConfig.fields) {
          payload[field.name] = updatedForm[field.name] || "";
        }
      }

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Failed to auto-save partial lead details:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Trigger auto-save immediately on select fields, or on input change if it's longer
      if (e.target.tagName === "SELECT") {
        handleAutoSave(updated);
      }
      return updated;
    });
  };

  const handleBlur = () => {
    handleAutoSave(form);
  };

  const handleChoose = (choice: string) => {
    setPath(choice);
    setStep("form");
    trackVirtualPage(`/modal/open/${choice}`);
  };

  const handleBack = () => {
    if (initialPath) {
      onClose();
    } else {
      setStep("choice");
      setPath(null);
      setError("");
    }
  };

  const currentConfig = formConfigs.find(f => f.key === path);
  const bgStyle = currentConfig?.heroBgUrl 
    ? `url("${currentConfig.heroBgUrl}")` 
    : (path && defaultHeroBg[path] ? defaultHeroBg[path] : 'url("/lead_accompagnement.png")');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!path) return;
      
      const token = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_session") : null;
      const utmSource = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_source") : null;
      const utmMedium = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_medium") : null;
      const utmCampaign = typeof window !== "undefined" ? sessionStorage.getItem("win_agro_utm_campaign") : null;

      const payload: Record<string, any> = {
        type: path,
        prenom: form.prenom,
        nom: form.nom,
        whatsapp: form.whatsapp,
        email: form.email,
        ville: form.ville,
        sessionToken: token || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined
      };

      // Add extra form fields to payload
      if (currentConfig) {
        for (const field of currentConfig.fields) {
          payload[field.name] = form[field.name] || "";
        }
      }

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
                style={step === 'form' && path ? { backgroundImage: bgStyle } : {}}
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
                        {step === "form" && currentConfig?.title}
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
                      
                      {formConfigs.length === 0 ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-6 h-6 text-primary-green animate-spin" />
                        </div>
                      ) : (
                        formConfigs.map((cfg) => {
                          const Icon = cfg.key === "accompagnement" ? Sprout : cfg.key === "formation" ? BookOpen : Stethoscope;
                          const iconBg = cfg.key === "accompagnement" ? "bg-primary-green/10 text-primary-green" : cfg.key === "formation" ? "bg-accent-yellow/20 text-amber-600" : "bg-red-50 text-red-500";
                          return (
                            <button
                              key={cfg.key}
                              onClick={() => handleChoose(cfg.key)}
                              className="group w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-primary-green/20 hover:border-primary-green bg-white hover:bg-primary-pale transition-all duration-200 text-left"
                            >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${iconBg}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-serif font-bold text-primary-deep text-base">{cfg.title}</p>
                                <p className="text-xs text-gray-500 font-sans mt-1">{cfg.description}</p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </motion.div>
                  )}

                  {/* Step: Form */}
                  {step === "form" && (
                    <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Common fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} onBlur={handleBlur} placeholder="Kokou" required />
                        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} onBlur={handleBlur} placeholder="Agbodjan" required />
                      </div>
                      <Input label="Numéro WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} onBlur={handleBlur} type="tel" placeholder="+229 01 XX XX XX XX" required />
                      <Input label="Adresse e-mail" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="exemple@email.com" required />
                      <Input label="Ville / Localisation" name="ville" value={form.ville} onChange={handleChange} onBlur={handleBlur} placeholder="Cotonou, Parakou, Porto-Novo..." required />

                      {/* Dynamic fields from chosen form config */}
                      {currentConfig?.fields.map((field) => {
                        if (field.type === "select") {
                          return (
                            <Select
                              key={field.name}
                              label={field.label}
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required={field.required}
                              options={field.options || []}
                            />
                          );
                        } else {
                          return (
                            <Input
                              key={field.name}
                              label={field.label}
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required={field.required}
                              placeholder={`Saisir votre ${field.label.toLowerCase()}`}
                            />
                          );
                        }
                      })}

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
                            <>Votre demande a bien été reçue. Un conseiller Win Agro vous contactera sur WhatsApp dans les prochaines 24h.</>
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
