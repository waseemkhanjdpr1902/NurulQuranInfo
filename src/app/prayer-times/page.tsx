"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PrayerPanel } from "@/components/PrayerTimesProvider";
import Footer from "@/components/Footer";

export default function PrayerTimesPage() {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState(0);

  const calculateQibla = useCallback((lat: number, lng: number) => {
    const phi1 = lat * (Math.PI / 180);
    const phi2 = 21.4225 * (Math.PI / 180);
    const lambda1 = lng * (Math.PI / 180);
    const lambda2 = 39.8262 * (Math.PI / 180);

    const qibla = Math.atan2(
      Math.sin(lambda2 - lambda1),
      Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lambda2 - lambda1)
    ) * (180 / Math.PI);

    setQiblaAngle((qibla + 360) % 360);
  }, []);

  const startCompass = () => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // Request permission for iOS 13+
      if ((DeviceOrientationEvent as any).requestPermission) {
        (DeviceOrientationEvent as any).requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    }

    // Get location for Qibla calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        calculateQibla(pos.coords.latitude, pos.coords.longitude);
      });
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    const heading = e.alpha || 0;
    setCompassHeading(heading);
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <PrayerPanel />

        {/* Qibla Finder Section */}
        <div className="mt-32 glass p-12 md:p-24 rounded-[60px] border-white/5 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="relative w-48 h-48 mx-auto mb-12">
              <motion.div 
                animate={{ rotate: qiblaAngle ? qiblaAngle - compassHeading : 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Compass size={80} className="text-gold" />
              </motion.div>
              <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display text-parchment mb-8">Qibla <span className="text-gold italic">Finder</span></h2>
            
            {qiblaAngle !== null && (
              <div className="mb-8">
                <span className="text-gold font-mono text-2xl">{Math.round(qiblaAngle)}°</span>
                <p className="text-parchment/30 text-[10px] uppercase tracking-widest mt-2">Angle from North</p>
              </div>
            )}

            <p className="text-parchment/40 text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Find the direction of the Kaaba from your current location using our 
              real-time digital compass.
            </p>
            <button 
              onClick={startCompass}
              className="px-12 py-5 gold-gradient text-ink font-bold rounded-full hover:scale-105 transition-transform shadow-xl shadow-gold/20"
            >
              {qiblaAngle ? "Calibrate Compass" : "Find Qibla Direction"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
