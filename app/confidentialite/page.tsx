"use client";

import React from "react";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConfidentialitePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07130A] text-gray-300 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background light beams */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-accent-yellow/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-primary-green/10 bg-[#0F2214]/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
              <img src="/Logo Win Agro.png" alt="Win Agro" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif font-bold text-white text-md">Win Agro Tech</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 relative z-10 space-y-12">
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-green/10 border border-primary-green/20 text-xs font-bold text-primary-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sécurité des Données d'Élevage</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Chez Win Agro Tech, nous sommes conscients que la structure de votre ferme, les taux de ponte de vos sujets, vos formules de provende et vos projets d'expansion agricole sont des secrets industriels stratégiques. Cette charte détaille comment nous protégeons et traitons vos données.
          </p>
        </div>

        <div className="border-t border-white/5 pt-10 space-y-10 font-sans text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">01.</span> Collecte des Informations
            </h2>
            <p className="text-gray-400">
              Nous collectons uniquement les informations nécessaires au diagnostic technique de votre exploitation ou à votre inscription à nos parcours de formation. Il s'agit notamment de :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Vos coordonnées personnelles (nom, prénom, ville, numéro de téléphone / WhatsApp).</li>
              <li>Les caractéristiques de votre projet (type d'élevage envisagé, budget disponible, niveau d'expérience).</li>
              <li>Les données de santé de votre élevage en cas de consultation (symptômes, taux de mortalité observés, antécédents médicaux des sujets).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">02.</span> Utilisation des Données
            </h2>
            <p className="text-gray-400">
              Les données collectées sont utilisées exclusivement par l'équipe technique de Win Agro pour :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Établir un diagnostic zootechnique précis et personnalisé pour votre ferme.</li>
              <li>Vous contacter sous 24h via WhatsApp ou appel téléphonique pour organiser votre accompagnement.</li>
              <li>Améliorer nos modèles d'apprentissage et nos conseils phytosanitaires.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">03.</span> Confidentialité & Non-Divulgation
            </h2>
            <div className="bg-[#0F2214]/30 border border-primary-green/5 rounded-2xl p-5 flex gap-3 text-gray-300">
              <Lock className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
              <p className="text-xs">
                <strong>Garantie absolue :</strong> Win Agro s'engage formellement à ne jamais vendre, louer, échanger ou divulguer vos informations d'élevage ou vos secrets de provende à des tiers ou à des concurrents de votre secteur. Toutes vos données sont stockées sur des serveurs sécurisés et cryptés.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">04.</span> Vos Droits d'Accès et de Suppression
            </h2>
            <p className="text-gray-400">
              Conformément à la législation sur la protection des données numériques, vous disposez d'un droit permanent d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit ou retirer votre projet d'élevage de nos bases de données de consultation, il vous suffit de nous envoyer un courriel à <a href="mailto:contact@winagrotech.com" className="text-primary-green hover:underline font-bold">contact@winagrotech.com</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-8 border-t border-primary-green/10 flex flex-col items-center gap-1.5 pb-8 shrink-0 relative z-10">
        <img src="/Logo Win Agro.png" alt="Win Agro" className="w-10 h-10 object-contain mix-blend-multiply opacity-80" />
        <p className="text-xs text-gray-500 font-sans text-center">
          © {new Date().getFullYear()} Win Agro Tech. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
