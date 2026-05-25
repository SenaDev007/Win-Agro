"use client";

import React from "react";
import { ArrowLeft, ShieldCheck, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MentionsLegalesPage() {
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
            <Sprout className="w-3.5 h-3.5" />
            <span>Transparence & Rigueur Biologique</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
            Mentions Légales
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Conformément aux dispositions réglementaires en vigueur sur l'économie numérique et la protection des droits technologiques et agricoles au Bénin, cette page présente les mentions légales régissant l'accès et l'utilisation de la plateforme Win Agro.
          </p>
        </div>

        <div className="border-t border-white/5 pt-10 space-y-10 font-sans text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">01.</span> Éditeur de la Plateforme
            </h2>
            <div className="bg-[#0F2214]/30 border border-primary-green/5 rounded-2xl p-5 space-y-2 text-gray-300">
              <p><span className="font-semibold text-gray-400">Nom commercial :</span> Win Agro Agri Tech Solutions</p>
              <p><span className="font-semibold text-gray-400">Promotrice & Directrice :</span> Victoire AHOGNON</p>
              <p><span className="font-semibold text-gray-400">Siège social :</span> Porto-Novo, République du Bénin</p>
              <p><span className="font-semibold text-gray-400">Email de contact :</span> <a href="mailto:contact@winagrotech.com" className="text-primary-green hover:underline">contact@winagrotech.com</a></p>
              <p><span className="font-semibold text-gray-400">Téléphone / WhatsApp officiel :</span> +229 01 61 33 65 48</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">02.</span> Hébergement du Site
            </h2>
            <p className="text-gray-400">
              Ce site web est propulsé et hébergé à l'échelle internationale sur la plateforme cloud de <strong>Vercel Inc.</strong> (située au 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis), garantissant un accès hautement sécurisé, redondant et ultra-rapide aux éleveurs et investisseurs sur tout le continent africain.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">03.</span> Propriété Intellectuelle & Droits Agricoles
            </h2>
            <p className="text-gray-400">
              L'ensemble des contenus présents sur ce site (textes techniques, chartes graphiques, photographies de terrain, illustrations, formules zootechniques et guides de prophylaxie biologique) est protégé par les lois internationales sur la propriété intellectuelle et les brevets de l'Organisation Africaine de la Propriété Intellectuelle (OAPI).
            </p>
            <p className="text-gray-400">
              Toute reproduction, distribution ou exploitation non autorisée de nos guides d'alimentation animale, schémas de phytothérapie ou de nos marques déposées constitue une contrefaçon passible de poursuites judiciaires.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-primary-green">04.</span> Limites de Responsabilité Technique & Zootechnique
            </h2>
            <p className="text-gray-400">
              Win Agro s'efforce de fournir des formules de nutrition, des conseils d'élevage et des plans de prophylaxie biologique d'une précision absolue. Cependant, l'élevage moderne dépend de facteurs biologiques vivants, environnementaux et climatiques locaux (aération de votre bâtiment, température, qualité initiale de l'eau, rigueur de l'éleveur). 
            </p>
            <p className="text-gray-400">
              Nos diagnostics, cours et conseils constituent des obligations de moyens d'excellence zootechnique et non des garanties de résultats absolus. L'éleveur demeure le seul responsable de la surveillance quotidienne de ses animaux de ferme et de l'application stricte des mesures d'hygiène préconisées.
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
