"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Compass, Loader2, Sun, Moon, Sunrise, Sunset, CloudSun } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const prayerIcons: { [key: string]: any } = {
  Fajr: <Sunrise size={24} />,
  Sunrise: <Sun size={24} />,
  Dhuhr: <Sun size={24} />,
  Asr: <CloudSun size={24} />,
  Maghrib: <Sunset size={24} />,
  Isha: <Moon size={24} />,
};

export default function PrayerTimesPage() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<{city: string, country: string, lat?: number, lng?: number}>({ 
    city: "London", 
    country: "UK" 
  });
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "";
        if (location.lat && location.lng) {
          url = `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`;
        } else {
          url = `https://api.aladhan.com/v1/timingsByCity?city=${location.city}&country=${location.country}&method=2`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.code === 200) {
          setTimes(data.data.timings);
        } else {
          throw new Error("Failed to fetch prayer times");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load prayer times. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [location.city, location.country, location.lat, location.lng]);

  const detectLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            // Reverse geocode using a free service to get city name
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const geoData = await geoRes.json();
            const city = geoData.address.city || geoData.address.town || geoData.address.village || "My Location";
            const country = geoData.address.country || "";
            
            setLocation({ city, country, lat: latitude, lng: longitude });
            calculateQibla(latitude, longitude);
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            setLocation({ city: "My Location", country: "", lat: latitude, lng: longitude });
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied. Please enter your city manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, [calculateQibla]);

  useEffect(() => {
    // Attempt auto-detection on mount
    detectLocation();
  }, [detectLocation]);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block"
          >
            Daily Connection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight"
          >
            Prayer <span className="text-gold italic">Times</span>
          </motion.h1>
          <div className="flex items-center justify-center gap-4 text-parchment/40">
            <MapPin size={18} className="text-gold" />
            <span className="text-lg font-light">{location.city}, {location.country}</span>
          </div>
        </div>

        {/* Location Selector */}
        <div className="max-w-xl mx-auto mb-24 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex-1 min-w-[280px] relative">
            <input 
              type="text" 
              placeholder="Enter City (e.g. New York, Mecca)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLocation({ city: inputValue, country: "", lat: undefined, lng: undefined });
                }
              }}
              className="w-full px-8 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => setLocation({ city: inputValue, country: "", lat: undefined, lng: undefined })}
            className="px-8 py-5 gold-gradient text-ink font-bold rounded-[32px] hover:scale-105 transition-transform shadow-lg shadow-gold/20"
          >
            Update
          </button>
          <button 
            onClick={detectLocation}
            className="px-8 py-5 glass border border-gold/20 text-gold font-bold rounded-[32px] hover:bg-gold/10 transition-colors flex items-center gap-2"
            title="Detect my current location"
          >
            <MapPin size={20} />
            <span className="hidden md:inline">Auto-Detect</span>
          </button>
        </div>

        {/* Times Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="text-gold animate-spin" size={48} />
            <p className="text-parchment/40 font-display text-xl">Calculating times...</p>
          </div>
        ) : times ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(times).filter(([key]) => prayerIcons[key]).map(([name, time], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[40px] border-white/5 hover:border-gold/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-all">
                    {prayerIcons[name]}
                  </div>
                  <span className="text-gold/30 font-mono text-xs uppercase tracking-widest">Upcoming</span>
                </div>
                <h3 className="text-3xl font-display text-parchment mb-2">{name}</h3>
                <p className="text-5xl font-mono text-gold mb-8">{time}</p>
                <p className="w-full py-3 rounded-2xl bg-gold/5 text-gold/70 text-[10px] font-bold uppercase tracking-widest text-center">
                  Local prayer time
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-red-400 text-xl font-display italic">{error}</p>
          </div>
        )}

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
