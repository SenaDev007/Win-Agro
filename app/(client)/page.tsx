"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import Footer4Col from "@/components/ui/footer-column";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import About from "@/components/sections/About";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import LeadForm from "@/components/sections/LeadForm";

export default function Home() {
  // Shared state to allow services cards to dynamically set the contact form dropdown value
  const [selectedService, setSelectedService] = useState<string>("formation_elevage");

  const handleSelectService = (serviceKey: string) => {
    setSelectedService(serviceKey);
  };

  return (
    <>
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main SPA Sections (Strategic flow: Attract -> Persuade -> Assure -> Convert) */}
      <main className="flex-grow pt-16">
        {/* Section 01 — Hero (Problem-solution focus) */}
        <Hero />

        {/* Section 02 — stats (Proof and authority) */}
        <Stats />

        {/* Section 03 — Services (Value detailed packages) */}
        <Services onSelectService={handleSelectService} />

        {/* Section 04 — Products (Animals, Nutrition and Plants catalog with direct ordering) */}
        <Products />

        {/* Section 05 — About (Victoire's personal story & biological vision) */}
        <About />

        {/* Section 06 — Objection Killer (Why Choose Win Agro) */}
        <WhyUs />

        {/* Section 07 — Testimonials (Social Proof) */}
        <Testimonials />

        {/* Section 08 — Contact Lead Capture Form (Conversion closing) */}
        <LeadForm selectedService={selectedService} />
      </main>

      {/* 3. Global Footer & Floating Support Action */}
      <Footer4Col />
      <WhatsAppFAB />
    </>
  );
}
