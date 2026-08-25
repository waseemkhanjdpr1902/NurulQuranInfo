"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SurahGrid from "@/components/SurahGrid";
import AIAssistant from "@/components/AIAssistant";
import RemembrancePopup from "@/components/RemembrancePopup";
import MuraqbaSection from "@/components/MuraqbaSection";
import HomeSections from "@/components/HomeSections";
import JourneyDashboard from "@/components/JourneyDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <JourneyDashboard compact />
      </div>

      {/* Main Content Areas */}
      <div className="relative z-10">
        <SurahGrid />
        
        <MuraqbaSection />

        <HomeSections />
      </div>

      <AIAssistant />
      <RemembrancePopup />
      <Footer />
    </main>
  );
}
