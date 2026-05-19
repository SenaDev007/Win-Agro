"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { leadFormSchema, LeadFormData, serviceLabels } from "@/lib/validations";
import { Smartphone, MessageSquare, Sprout, AlertTriangle, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";

interface LeadFormProps {
  selectedService: string;
}

export default function LeadForm({ selectedService }: LeadFormProps) {
  const [isSubmittingState, setIsSubmittingState] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      service: "formation_elevage",
      message: "",
    },
  });

  const watchedService = watch("service");
  const currentService = watchedService || (selectedService as LeadFormData["service"]) || "formation_elevage";
  const selectedLabel = serviceLabels[currentService] || "Formation élevage";
  const directMessage = encodeURIComponent(
    `Bonjour Victoire, je souhaite me renseigner concernant votre service : ${selectedLabel}.`
  );
  const directWhatsappUrl = `https://wa.me/2290161336548?text=${directMessage}`;

  // Keep dropdown value synchronized with parent selections from Services cards
  useEffect(() => {
    if (selectedService) {
      setValue("service", selectedService as LeadFormData["service"]);
    }
  }, [selectedService, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmittingState(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        setSuccessMessage(result.message);
        
        // Prefilled structured WhatsApp message
        const selectedLabel = serviceLabels[data.service];
        const rawMessageContent = data.message ? `\n"${data.message}"` : "";
        const formattedMsg = `Bonjour Victoire,

Je m'appelle ${data.fullName}.
Je suis intéressé(e) par : ${selectedLabel}.${rawMessageContent}

Mon numéro : ${data.phone}`;

        const encodedMsg = encodeURIComponent(formattedMsg);
        const whatsappUrl = `https://wa.me/2290161336548?text=${encodedMsg}`;

        // Redirect to WhatsApp after 1.5 seconds
        setTimeout(() => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          reset();
          setSubmitSuccess(false);
        }, 1500);

      } else {
        alert(result.message || "Une erreur est survenue lors de la soumission. Veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de joindre le serveur. Soumission par WhatsApp de secours...");
      // WhatsApp fallback
      const selectedLabel = serviceLabels[data.service];
      const formattedMsg = `Bonjour Victoire, je m'appelle ${data.fullName} (${data.phone}) et j'aimerais vous contacter concernant : ${selectedLabel}. ${data.message || ""}`;
      window.open(`https://wa.me/2290161336548?text=${encodeURIComponent(formattedMsg)}`, "_blank");
    } finally {
      setIsSubmittingState(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-pale rounded-full blur-[100px] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* 1. Copywriting Content (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary-pale text-primary-deep text-xs font-sans font-bold uppercase tracking-wider mb-2">
                Nous Contacter
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-deep leading-tight">
                Tu as un projet d'élevage ? Ne reste pas bloqué.
              </h2>

              <p className="font-sans text-sm sm:text-base text-gray-text leading-relaxed">
                Remplis ce formulaire en 30 secondes pour qualifier ton projet, ou appelle-moi directement.{" "}
                <strong className="text-primary-deep">Je réponds personnellement sous 24h.</strong> Pas d'assistant distant, pas de message égaré. Victoire.
              </p>

              <div className="w-16 h-1 bg-accent-yellow rounded-full" />
            </div>

            {/* Direct Contact Anchors */}
            <div className="space-y-4 pt-4 border-t border-primary-pale">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-pale flex items-center justify-center text-primary-green">
                  <Smartphone className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-sans uppercase font-bold tracking-wider">
                    WhatsApp principal (Victoire)
                  </p>
                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold text-primary-deep hover:text-primary-green transition-colors font-sans"
                  >
                    +229 0161336548
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-pale flex items-center justify-center text-primary-green">
                  <Smartphone className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-sans uppercase font-bold tracking-wider">
                    Ligne téléphonique d'urgence
                  </p>
                  <a
                    href="tel:+2290147221458"
                    className="text-base sm:text-lg font-bold text-primary-deep hover:text-primary-green transition-colors font-sans"
                  >
                    +229 0147221458
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-4">
              <motion.a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(9, 137, 71, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-base shadow-md cursor-pointer btn-shimmer"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" /> Écrire directement sur WhatsApp
              </motion.a>
            </div>
          </div>

          {/* 2. Interactive Lead Capture Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel border border-primary-pale shadow-2xl p-8 sm:p-10 relative overflow-hidden h-full flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  // Success State Animated Overlay
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 flex flex-col items-center justify-center"
                  >
                    <Sprout className="w-16 h-16 text-primary-green mb-6 animate-bounce" />
                    <h3 className="font-serif text-2xl font-black text-primary-deep mb-4 leading-tight">
                      {successMessage}
                    </h3>
                    <p className="font-sans text-sm text-gray-text max-w-sm mb-6 leading-relaxed">
                      Redirection instantanée vers WhatsApp en cours... Tu vas pouvoir envoyer ton message pré-rempli à Victoire.
                    </p>
                    <div className="w-12 h-12 rounded-full border-4 border-primary-pale border-t-primary-green animate-spin" />
                  </motion.div>
                ) : (
                  // Active Interactive Form
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary-deep leading-tight">
                        Ou remplis ce formulaire — je te rappelle.
                      </h3>
                      <p className="text-xs text-gray-400 font-sans mt-1">
                        Les champs marqués d'une étoile (*) sont obligatoires.
                      </p>
                    </div>

                    <div className="w-full h-px bg-primary-pale" />

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="block text-xs font-bold text-primary-deep uppercase tracking-wider font-sans">
                        Ton prénom et ton nom *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        placeholder="Ex: Kofi Mensah"
                        {...register("fullName")}
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
                          errors.fullName
                            ? "border-red-500 focus:ring-red-200"
                            : "border-primary-pale focus:ring-primary-pale focus:border-primary-green"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs font-bold text-red-500 mt-1 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-xs font-bold text-primary-deep uppercase tracking-wider font-sans">
                        Ton numéro WhatsApp / Tél *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="Ex: +229 0161336548"
                        {...register("phone")}
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-200"
                            : "border-primary-pale focus:ring-primary-pale focus:border-primary-green"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs font-bold text-red-500 mt-1 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Service selection */}
                    <div className="space-y-1">
                      <label htmlFor="service" className="block text-xs font-bold text-primary-deep uppercase tracking-wider font-sans">
                        Ce qui t'intéresse *
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
                          errors.service
                            ? "border-red-500 focus:ring-red-200"
                            : "border-primary-pale focus:ring-primary-pale focus:border-primary-green"
                        }`}
                      >
                        <option value="formation_elevage">Formation élevage pratique</option>
                        <option value="installation_ferme">Accompagnement & Installation de ferme</option>
                        <option value="consultation">Consultation / Diagnostic technique</option>
                        <option value="achat_volailles">Achat de volailles ou poussins</option>
                        <option value="commande_provendes">Commande de provendes de qualité</option>
                        <option value="autre_produit">Autre produit agricole</option>
                        <option value="autre">Autre demande spécifique</option>
                      </select>
                      {errors.service && (
                        <p className="text-xs font-bold text-red-500 mt-1 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> {errors.service.message}
                        </p>
                      )}
                    </div>

                    {/* Free message */}
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-xs font-bold text-primary-deep uppercase tracking-wider font-sans">
                        Décris ton projet en quelques mots (facultatif)
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Décris ton projet en quelques mots (animaux ciblés, taille de ta ferme, terrain disponible...)"
                        {...register("message")}
                        className={`w-full px-4 py-3.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all font-sans text-sm resize-none ${
                          errors.message
                            ? "border-red-500 focus:ring-red-200"
                            : "border-primary-pale focus:ring-primary-pale focus:border-primary-green"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs font-bold text-red-500 mt-1 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit CTA */}
                    <motion.button
                      type="submit"
                      disabled={isSubmittingState}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(9, 137, 71, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      animate={isSubmittingState ? {} : { scale: [1, 1.02, 1] }}
                      transition={isSubmittingState ? {} : { scale: { repeat: Infinity, duration: 3.0, ease: "easeInOut" } }}
                      className="w-full py-4 rounded-full bg-primary-green hover:bg-primary-deep text-white font-sans font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
                    >
                      {isSubmittingState ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Transmission en cours...
                        </>
                      ) : (
                        <>
                          Envoyer ma demande et ouvrir WhatsApp <ArrowRight className="w-5 h-5 shrink-0" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
