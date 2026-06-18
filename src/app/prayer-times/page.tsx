"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Clock, MapPin, Compass, Loader2, Sun, Moon, Sunrise, Sunset, CloudSun } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

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
  const [compassActive, setCompassActive] = useState(false);
  const [qiblaError, setQiblaError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const safariHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
    const heading = typeof safariHeading === "number" ? safariHeading : event.alpha || 0;
    setCompassHeading(heading);
  }, []);

  useEffect(() => {
    if (!compassActive) return;
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [compassActive, handleOrientation]);

  const startCompass = () => {
    setQiblaError(null);
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // Request permission for iOS 13+
      if ((DeviceOrientationEvent as any).requestPermission) {
        (DeviceOrientationEvent as any).requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              setCompassActive(true);
            } else {
              setQiblaError("Compass permission was denied.");
            }
          })
          .catch(() => setQiblaError("Unable to start the compass on this device."));
      } else {
        setCompassActive(true);
      }
    } else {
      setQiblaError("Device compass is not supported in this browser.");
    }

    // Get location for Qibla calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          calculateQibla(pos.coords.latitude, pos.coords.longitude);
        },
        () => setQiblaError("Location permission is needed to calculate Qibla direction.")
      );
    } else {
      setQiblaError("Geolocation is not supported by your browser.");
    }
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
          url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country || "United Kingdom")}&method=2`;
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

  const updateManualLocation = () => {
    const [cityPart, countryPart] = inputValue.split(",").map((part) => part.trim());
    if (!cityPart) return;
    setLocation({
      city: cityPart,
      country: countryPart || location.country || "United Kingdom",
      lat: undefined,
      lng: undefined,
    });
  };

  const prayerEntries = times
    ? Object.entries(times).filter(([key]) => prayerIcons[key])
    : [];

  const nextPrayer = prayerEntries.reduce<{ name: string; time: string; date: Date } | null>((next, [name, time]) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 1);
    if (!next || date < next.date) return { name, time, date };
    return next;
  }, null);

  const countdown = nextPrayer
    ? new Date(nextPrayer.date.getTime() - now.getTime()).toISOString().slice(11, 19)
    : null;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Prayer Times" }]} />
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
                  updateManualLocation();
                }
              }}
              className="w-full px-8 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <button 
            onClick={updateManualLocation}
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

        {nextPrayer && (
          <div className="max-w-3xl mx-auto glass p-8 rounded-[40px] border-gold/10 mb-16 text-center">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Next Prayer</p>
            <h2 className="text-4xl font-display text-parchment mb-2">{nextPrayer.name}</h2>
            <p className="text-parchment/40 font-mono text-sm mb-4">{nextPrayer.time}</p>
            <p className="text-gold font-mono text-3xl">{countdown}</p>
          </div>
        )}

        {/* Times Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="text-gold animate-spin" size={48} />
            <p className="text-parchment/40 font-display text-xl">Calculating times...</p>
          </div>
        ) : times ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prayerEntries.map(([name, time], i) => (
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
                  <span className={`font-mono text-xs uppercase tracking-widest ${nextPrayer?.name === name ? "text-gold" : "text-gold/30"}`}>
                    {nextPrayer?.name === name ? "Next" : "Today"}
                  </span>
                </div>
                <h3 className="text-3xl font-display text-parchment mb-2">{name}</h3>
                <p className="text-5xl font-mono text-gold mb-8">{time}</p>
                <button
                  onClick={() => {
                    setNotificationMessage("Prayer notifications will be available after browser notification setup is enabled.");
                    window.setTimeout(() => setNotificationMessage(null), 2500);
                  }}
                  className="w-full py-4 glass rounded-2xl text-parchment/40 text-[10px] font-bold uppercase tracking-widest hover:text-gold hover:bg-white/10 transition-all"
                >
                  Notification Soon
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-red-400 text-xl font-display italic">{error}</p>
          </div>
        )}

        {/* Qibla Finder Section */}
        <div id="qibla" className="mt-32 glass p-12 md:p-24 rounded-[60px] border-white/5 relative overflow-hidden text-center scroll-mt-32">
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
            {qiblaError && (
              <p className="text-red-400 text-sm mb-8">{qiblaError}</p>
            )}
            <button 
              onClick={startCompass}
              className="px-12 py-5 gold-gradient text-ink font-bold rounded-full hover:scale-105 transition-transform shadow-xl shadow-gold/20"
            >
              {qiblaAngle ? "Calibrate Compass" : "Find Qibla Direction"}
            </button>
          </div>
        </div>
      </div>

      {notificationMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-gold text-ink text-xs font-bold shadow-2xl z-50">
          {notificationMessage}
        </div>
      )}

      <ToolGuidance
        title="Plan your salah and find Qibla"
        what="Prayer Times shows daily timings, a next-prayer countdown, manual/auto location support, and a Qibla finder for compatible devices."
        how={[
          "Enter your city and country, or use auto-detect when location permission is available.",
          "Use the next-prayer card to see the upcoming salah and countdown.",
          "Open the Qibla section and allow location/compass permissions when your browser supports them.",
        ]}
      />
      <RelatedTools currentHref="/prayer-times" />
      <Footer />
    </main>
  );
}
