"use client";
import { useUILanguage } from "@/components/UILanguageProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import Link from "next/link";
import { Bell, Clock, MapPin, X } from "lucide-react";
import {
  addDay,
  alertDue,
  fetchPrayerDay,
  formatTime,
  localDate,
  methods,
  nextPrayer,
  nightMidpoint,
  PrayerDay,
  PrayerLocation,
  prayers,
  schedule,
} from "@/lib/prayer-times";
const key = "nurulquran-prayer-settings-v1";
interface Settings {
  location: PrayerLocation | null;
  method: number;
  school: number;
  alerts: boolean;
}
function prayerLabel(
  name: string,
  t: (en: string, hi: string, ur: string) => string,
) {
  const labels: Record<string, [string, string, string]> = {
    Fajr: ["Fajr", "फज्र", "فجر"],
    Dhuhr: ["Zuhr", "ज़ुहर", "ظہر"],
    Asr: ["Asr", "अस्र", "عصر"],
    Maghrib: ["Maghrib", "मग़रिब", "مغرب"],
    Isha: ["Isha", "इशा", "عشاء"],
  };
  return labels[name] ? t(...labels[name]) : name;
}
interface State {
  settings: Settings;
  update: (s: Partial<Settings>) => void;
  today: PrayerDay | null;
  tomorrow: PrayerDay | null;
  now: number;
  loading: boolean;
  error: string;
  detect: () => void;
  enableAlerts: () => Promise<void>;
  notice: string;
  retry: () => void;
}
const Context = createContext<State | null>(null);
function usePrayer() {
  const value = useContext(Context);
  if (!value) throw new Error("Prayer provider missing");
  return value;
}
const defaults: Settings = {
  location: null,
  method: 1,
  school: 1,
  alerts: false,
};
export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const { t } = useUILanguage();
  const [settings, setSettings] = useState<Settings>(defaults);
  const [ready, setReady] = useState(false);
  const [zone, setZone] = useState("UTC");
  const [today, setToday] = useState<PrayerDay | null>(null);
  const [tomorrow, setTomorrow] = useState<PrayerDay | null>(null);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState("");
  const [refresh, setRefresh] = useState(0);
  const sent = useRef(new Set<string>());
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (
        saved &&
        typeof saved.location?.city === "string" &&
        typeof saved.location?.country === "string" &&
        methods.some((m) => m.id === saved.method) &&
        [0, 1].includes(saved.school)
      )
        setSettings({ ...defaults, ...saved });
    } catch {}
    setNow(Date.now());
    setReady(true);
    const tick = () => setNow(Date.now());
    const interval = setInterval(tick, 15000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(settings));
      } catch {}
    }
  }, [ready, settings]);
  const date = now ? localDate(now, zone) : "";
  useEffect(() => {
    if (!ready || !settings.location || !date) return;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    setToday(null);
    setTomorrow(null);
    (async () => {
      try {
        let day = await fetchPrayerDay(
          settings.location!,
          date,
          settings.method,
          settings.school,
          controller.signal,
        );
        const actualDate = localDate(Date.now(), day.meta.timezone);
        if (actualDate !== date)
          day = await fetchPrayerDay(
            settings.location!,
            actualDate,
            settings.method,
            settings.school,
            controller.signal,
          );
        const next = await fetchPrayerDay(
          settings.location!,
          addDay(actualDate),
          settings.method,
          settings.school,
          controller.signal,
        );
        if (active) {
          setZone(day.meta.timezone);
          setToday(day);
          setTomorrow(next);
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "Unable to load prayer times.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [
    ready,
    settings.location,
    settings.method,
    settings.school,
    date,
    refresh,
  ]);
  const update = useCallback((values: Partial<Settings>) =>
    setSettings((s) => ({ ...s, ...values })), []);
  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Location is unavailable. Enter your city and country below.");
      return;
    }
    setError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location: PrayerLocation = {
          city: "Current location",
          country: "",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`,
            { signal: AbortSignal.timeout(8000) },
          );
          const data = await res.json();
          location.city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Current location";
          location.country = data.address?.country || "";
        } catch {}
        const india = /india|pakistan|bangladesh/i.test(location.country);
        const saudi = /saudi/i.test(location.country);
        update({
          location,
          method: india ? 1 : saudi ? 4 : 3,
          school: india ? 1 : 0,
        });
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError(
          "Location access was denied or unavailable. Enter your city and country below.",
        );
      },
      { timeout: 12000, maximumAge: 60000 },
    );
  }, [update]);
  const refreshedGps = useRef(false);
  // Refresh a previously GPS-selected location when returning after travel.
  useEffect(() => {
    if (ready && settings.location?.lat !== undefined && !refreshedGps.current) {
      refreshedGps.current = true;
      detect();
    }
  }, [ready, settings.location?.lat, detect]);
  const enableAlerts = async () => {
    if (!settings.location) {
      setNotice(
        t(
          "Choose your location first.",
          "पहले अपना स्थान चुनें।",
          "پہلے اپنا مقام منتخب کریں۔",
        ),
      );
      return;
    }
    update({ alerts: true });
    if (!("Notification" in window)) {
      setNotice(
        t(
          "In-app alerts enabled. Device notifications are unavailable in this browser.",
          "ऐप के अंदर सूचनाएँ चालू हैं। इस ब्राउज़र में डिवाइस सूचनाएँ उपलब्ध नहीं हैं।",
          "ایپ کے اندر اطلاعات فعال ہیں۔ اس براؤزر میں ڈیوائس اطلاعات دستیاب نہیں ہیں۔",
        ),
      );
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotice(
        permission === "granted"
          ? t(
              "Prayer alerts enabled while the app is open.",
              "ऐप खुला रहने पर नमाज़ की सूचनाएँ चालू हैं।",
              "ایپ کھلی ہونے پر نماز کی اطلاعات فعال ہیں۔",
            )
          : t(
              "In-app alerts enabled. Device notifications are blocked; you can allow them in browser settings.",
              "ऐप के अंदर सूचनाएँ चालू हैं। डिवाइस सूचनाओं के लिए ब्राउज़र सेटिंग में अनुमति दें।",
              "ایپ کے اندر اطلاعات فعال ہیں۔ ڈیوائس اطلاعات کے لیے براؤزر کی سیٹنگ میں اجازت دیں۔",
            ),
      );
    } catch {
      setNotice(
        t(
          "In-app alerts enabled. Device notifications are unavailable.",
          "ऐप के अंदर सूचनाएँ चालू हैं। डिवाइस सूचनाएँ उपलब्ध नहीं हैं।",
          "ایپ کے اندر اطلاعات فعال ہیں۔ ڈیوائس اطلاعات دستیاب نہیں ہیں۔",
        ),
      );
    }
  };
  useEffect(() => {
    if (!settings.alerts || !today || !tomorrow || loading || error) return;
    for (const name of prayers) {
      const start = Date.parse(today.timings[name]);
      if (!alertDue(start, now)) continue;
      const id = `${settings.location?.lat ?? settings.location?.city}:${settings.location?.lng ?? settings.location?.country}:${name}:${start}`;
      let stored = false;
      try {
        stored = localStorage.getItem("prayer-alert-" + id) === "sent";
      } catch {}
      if (stored || sent.current.has(id)) continue;
      sent.current.add(id);
      try {
        localStorage.setItem("prayer-alert-" + id, "sent");
      } catch {}
      const body = `${prayerLabel(name, t)} · ${settings.location?.city}. ${t("Prayer time has started. May Allah accept your prayer.", "नमाज़ का समय शुरू हो गया है। अल्लाह आपकी नमाज़ क़बूल करे।", "نماز کا وقت شروع ہو گیا ہے۔ اللہ آپ کی نماز قبول فرمائے۔")}`;
      setToast(body);
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        "serviceWorker" in navigator
      ) {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => navigator.serviceWorker.ready)
          .then((reg) =>
            reg.showNotification(`${name} prayer time`, {
              body,
              icon: "/icons/nurulquran-192.png",
              tag: id,
              data: { url: "/prayer-times" },
            }),
          )
          .catch(() =>
            setNotice(
              t(
                "Device notification could not be delivered. In-app alerts remain enabled.",
                "डिवाइस सूचना नहीं भेजी जा सकी। ऐप के अंदर सूचनाएँ चालू हैं।",
                "ڈیوائس اطلاع نہیں بھیجی جا سکی۔ ایپ کے اندر اطلاعات فعال ہیں۔",
              ),
            ),
          );
      }
    }
  }, [
    now,
    today,
    tomorrow,
    settings.alerts,
    settings.location,
    loading,
    error,
    t,
  ]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 60000);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <Context.Provider
      value={{
        settings,
        update,
        today,
        tomorrow,
        now,
        loading,
        error,
        detect,
        enableAlerts,
        notice,
        retry: () => setRefresh((v) => v + 1),
      }}
    >
      {children}
      {toast && (
        <div
          role="alert"
          className="fixed bottom-6 left-4 right-4 z-[150] mx-auto max-w-lg rounded-2xl border border-gold bg-ink p-5 text-parchment shadow-xl"
        >
          <button
            aria-label="Dismiss prayer alert"
            onClick={() => setToast("")}
            className="float-right p-1"
          >
            <X size={18} />
          </button>
          <Bell className="mb-2 text-gold" size={22} />
          {toast}
          <Link className="mt-2 block text-gold underline" href="/prayer-times">
            {t(
              "View prayer times",
              "नमाज़ का समय देखें",
              "نماز کے اوقات دیکھیں",
            )}
          </Link>
        </div>
      )}
    </Context.Provider>
  );
}
export function PrayerBanner() {
  const { t } = useUILanguage();
  const p = usePrayer();
  const next =
    p.today && p.tomorrow && !p.loading
      ? nextPrayer(p.today, p.tomorrow, p.now)
      : undefined;
  const remaining = next
    ? Math.max(0, Math.ceil((next.start - p.now) / 60000))
    : 0;
  return (
    <div className="flex min-h-10 items-center justify-center gap-2 bg-[#123d32] px-3 py-2 text-center text-xs text-white sm:text-sm">
      <Clock size={14} aria-hidden="true" />
      <Link href="/prayer-times" className="hover:underline">
        {!p.settings.location
          ? t(
              "Prayer times · Choose your location",
              "नमाज़ का समय · अपना स्थान चुनें",
              "نماز کے اوقات · اپنا مقام منتخب کریں",
            )
          : p.loading
            ? t(
                "Loading local prayer times…",
                "स्थानीय नमाज़ का समय लोड हो रहा है…",
                "مقامی نماز کے اوقات لوڈ ہو رہے ہیں…",
              )
            : p.error
              ? t(
                  "Prayer times unavailable · Retry",
                  "नमाज़ का समय उपलब्ध नहीं · फिर कोशिश करें",
                  "نماز کے اوقات دستیاب نہیں · دوبارہ کوشش کریں",
                )
              : next && p.today
                ? `${p.settings.location.city} · ${prayerLabel(next.name, t)} ${formatTime(next.start, p.today.meta.timezone)} · ${t("in", "बाक़ी", "باقی")} ${Math.floor(remaining / 60) ? Math.floor(remaining / 60) + "h " : ""}${remaining % 60}m`
                : t(
                    "View local prayer times",
                    "स्थानीय नमाज़ का समय देखें",
                    "مقامی نماز کے اوقات دیکھیں",
                  )}
      </Link>
    </div>
  );
}
export function PrayerPanel() {
  const { t, language, rtl } = useUILanguage();
  const p = usePrayer();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const s = p.settings;
  const day = p.today;
  const tomorrow = p.tomorrow;
  const next = day && tomorrow ? nextPrayer(day, tomorrow, p.now) : undefined;
  const field =
    "rounded-xl border border-gold/30 bg-ink px-4 py-3 text-parchment";
  const button = "rounded-xl bg-gold px-5 py-3 font-semibold text-ink";
  return (
    <section
      dir={rtl ? "rtl" : "ltr"}
      className="mx-auto max-w-6xl text-parchment"
    >
      <h1 className="text-4xl font-display sm:text-6xl">
        {t("Local Prayer Times", "स्थानीय नमाज़ का समय", "مقامی نماز کے اوقات")}
      </h1>
      <p className="mt-4 text-parchment/70">
        {t(
          "Prayer start times and boundaries for your location. These are calculated times, not mosque jamaat times.",
          "आपके स्थान के अनुसार नमाज़ की शुरुआत और अंतिम सीमा। ये गणना के समय हैं, मस्जिद की जमात के समय नहीं।",
          "آپ کے مقام کے مطابق نماز کی ابتدا اور آخری حد۔ یہ حساب سے طے شدہ اوقات ہیں، مسجد کی جماعت کے اوقات نہیں۔",
        )}
      </p>
      <form
        className="mt-8 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (city.trim() && country.trim())
            p.update({
              location: { city: city.trim(), country: country.trim() },
            });
        }}
      >
        <label className="flex flex-col gap-2">
          {t("City", "शहर", "شہر")}
          <input
            required
            maxLength={100}
            placeholder="Jaipur"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-2">
          {t("Country", "देश", "ملک")}
          <input
            required
            maxLength={100}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={field}
          />
        </label>
        <button className={button + " self-end"}>
          {t("Show times", "समय देखें", "اوقات دیکھیں")}
        </button>
        <button
          type="button"
          onClick={p.detect}
          className={button + " self-end flex items-center gap-2"}
        >
          <MapPin size={18} />
          {t("Use my location", "मेरा स्थान पता करें", "میرا مقام معلوم کریں")}
        </button>
      </form>
      <div className="mt-6 flex flex-wrap gap-5">
        <label className="flex flex-col gap-2">
          {t("Calculation method", "गणना का तरीका", "حساب کا طریقہ")}
          <select
            className={field}
            value={s.method}
            onChange={(e) => p.update({ method: Number(e.target.value) })}
          >
            {methods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          {t("Asr calculation", "अस्र की गणना", "عصر کا حساب")}
          <select
            className={field}
            value={s.school}
            onChange={(e) => p.update({ school: Number(e.target.value) })}
          >
            <option value={1}>
              {t(
                "Hanafi (later Asr)",
                "हनफ़ी (अस्र बाद में)",
                "حنفی (عصر بعد میں)",
              )}
            </option>
            <option value={0}>
              {t(
                "Standard (Shafi‘i / Maliki / Hanbali)",
                "मानक (शाफ़िई / मालिकी / हंबली)",
                "معیاری (شافعی / مالکی / حنبلی)",
              )}
            </option>
          </select>
        </label>
      </div>
      <div className="mt-6 rounded-2xl border border-gold/20 p-5">
        <button
          type="button"
          onClick={() => {
            if (s.alerts) p.update({ alerts: false });
            else void p.enableAlerts();
          }}
          className={button + " inline-flex items-center gap-2"}
        >
          <Bell size={18} />
          {s.alerts ? "Turn off prayer alerts" : "Enable prayer alerts"}
        </button>
        <p className="mt-3 text-sm text-parchment/70">
          {t(
            "Alerts appear when a prayer starts while this app is open. Device notifications require permission. Closed or suspended apps cannot guarantee alerts. On iPhone, add the app to your Home Screen for supported notifications.",
            "ऐप खुला होने पर नमाज़ शुरू होते ही सूचना मिलेगी। डिवाइस सूचना के लिए अनुमति ज़रूरी है। बंद या रुके हुए ऐप में सूचना की गारंटी नहीं है। iPhone में समर्थित सूचनाओं के लिए ऐप होम स्क्रीन पर जोड़ें।",
            "ایپ کھلی ہونے پر نماز شروع ہوتے ہی اطلاع ملے گی۔ ڈیوائس اطلاع کے لیے اجازت ضروری ہے۔ بند یا معطل ایپ میں اطلاع کی ضمانت نہیں ہے۔ iPhone میں اطلاعات کے لیے ایپ ہوم اسکرین پر شامل کریں۔",
          )}
        </p>
        {p.notice && (
          <p role="status" className="mt-2 text-gold">
            {p.notice}
          </p>
        )}
      </div>
      {p.error && (
        <div role="alert" className="mt-5 text-red-300">
          {t(
            "Prayer times could not load. Check the city, country and internet connection, then retry.",
            "नमाज़ का समय लोड नहीं हुआ। शहर, देश और इंटरनेट जाँचें और फिर कोशिश करें।",
            "نماز کے اوقات لوڈ نہیں ہوئے۔ شہر، ملک اور انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔",
          )}
          <button onClick={p.retry} className="ml-3 underline">
            {t("Retry", "फिर कोशिश करें", "دوبارہ کوشش کریں")}
          </button>
        </div>
      )}
      {p.loading && (
        <p role="status" className="mt-8 text-gold">
          {t(
            "Calculating local prayer times…",
            "स्थानीय नमाज़ का समय गणना हो रहा है…",
            "مقامی نماز کے اوقات کا حساب ہو رہا ہے…",
          )}
        </p>
      )}
      {!s.location && (
        <p className="mt-8 text-gold">
          {t(
            "Select a city or allow location access to see accurate local times.",
            "सही स्थानीय समय के लिए शहर चुनें या स्थान की अनुमति दें।",
            "درست مقامی اوقات کے لیے شہر منتخب کریں یا مقام کی اجازت دیں۔",
          )}
        </p>
      )}
      {day && tomorrow && !p.loading && !p.error && (
        <>
          <p className="mt-8 text-gold">
            {s.location?.city}, {s.location?.country} ·{" "}
            {new Intl.DateTimeFormat(language, {
              timeZone: day.meta.timezone,
              dateStyle: "full",
            }).format(p.now)}{" "}
            · {day.meta.timezone}
          </p>
          <p className="mt-2 text-sm text-parchment/70">
            {t("Sunrise", "सूर्योदय", "طلوعِ آفتاب")}:{" "}
            {formatTime(Date.parse(day.timings.Sunrise), day.meta.timezone)} ·{" "}
            {t("Sunset", "सूर्यास्त", "غروبِ آفتاب")}:{" "}
            {formatTime(Date.parse(day.timings.Sunset), day.meta.timezone)}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schedule(day, tomorrow).map((prayer) => (
              <article
                key={prayer.name}
                className={`rounded-2xl border p-6 ${next?.name === prayer.name && next.start === prayer.start ? "border-gold bg-gold/10" : "border-white/15 bg-white/5"}`}
              >
                <div className="flex justify-between">
                  <h2 className="text-2xl font-display">
                    {prayerLabel(prayer.name, t)}
                  </h2>
                  <span className="text-xs text-gold">
                    {p.now >= prayer.start && p.now < prayer.end
                      ? t("Within time", "समय जारी है", "وقت جاری ہے")
                      : p.now >= prayer.end
                        ? t("Ended", "समय समाप्त", "وقت ختم")
                        : t("Upcoming", "आने वाली", "آنے والی")}
                  </span>
                </div>
                <p className="mt-4 text-3xl text-gold">
                  {formatTime(prayer.start, day.meta.timezone)}
                </p>
                <p className="mt-3">
                  {prayer.name === "Isha"
                    ? t("Pray by: ", "इससे पहले पढ़ें: ", "اس سے پہلے پڑھیں: ")
                    : t("Boundary: ", "अंतिम सीमा: ", "آخری حد: ")}
                  {formatTime(
                    prayer.name === "Isha"
                      ? nightMidpoint(day, tomorrow)
                      : prayer.end,
                    day.meta.timezone,
                  )}
                </p>
                <p className="mt-3 text-sm text-parchment/70">
                  {prayer.name === "Fajr"
                    ? t(
                        "Ends at sunrise.",
                        "सूर्योदय पर समय समाप्त होता है।",
                        "طلوعِ آفتاب پر وقت ختم ہوتا ہے۔",
                      )
                    : prayer.name === "Dhuhr"
                      ? t(
                          "Ends when the selected Asr time begins.",
                          "चुने गए अस्र समय की शुरुआत पर समाप्त होता है।",
                          "منتخب عصر کے وقت کی ابتدا پر ختم ہوتا ہے۔",
                        )
                      : prayer.name === "Asr"
                        ? t(
                            "Outer boundary: sunset. Pray before the sun turns yellow; do not delay until sunset.",
                            "अंतिम सीमा सूर्यास्त है। सूरज पीला होने से पहले पढ़ें; सूर्यास्त तक देर न करें।",
                            "آخری حد غروبِ آفتاب ہے۔ سورج زرد ہونے سے پہلے پڑھیں؛ غروب تک تاخیر نہ کریں۔",
                          )
                        : prayer.name === "Maghrib"
                          ? t(
                              "Twilight boundary is approximated by the selected Isha method. Pray promptly after sunset.",
                              "शफ़क़ की सीमा चुनी गई इशा गणना से अनुमानित है। सूर्यास्त के बाद जल्द नमाज़ पढ़ें।",
                              "شفق کی حد منتخب عشاء کے حساب سے تخمینی ہے۔ غروب کے بعد جلد نماز پڑھیں۔",
                            )
                          : `${t("Islamic midnight is halfway from sunset to tomorrow’s Fajr, not 12 AM. Some scholarly views extend validity until Fajr; do not treat that as a recommended delay.", "इस्लामी मध्यरात्रि सूर्यास्त और अगले दिन की फज्र के बीच का मध्य बिंदु है, ज़रूरी नहीं कि रात 12 बजे हो। कुछ विद्वानों के मत में समय फज्र तक है; इसे देर करने की सलाह न समझें।", "شرعی نصف شب غروب اور اگلے دن کی فجر کے درمیان کا درمیانی وقت ہے، ضروری نہیں کہ رات 12 بجے ہو۔ بعض فقہی آرا میں وقت فجر تک ہے؛ اسے تاخیر کی سفارش نہ سمجھیں۔")} ${t("Tomorrow’s Fajr", "अगले दिन की फज्र", "اگلے دن کی فجر")}: ${formatTime(prayer.end, day.meta.timezone)}.`}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-parchment/70">
            {t("Method", "गणना का तरीका", "حساب کا طریقہ")}:{" "}
            {day.meta.method.name}.{" "}
            {t(
              "Compare with your local mosque. Start and preferred times vary by scholarly view; being within time does not mean delaying is recommended. Times update at the selected location’s midnight.",
              "अपनी स्थानीय मस्जिद के समय से मिलाएँ। विद्वानों के मत के अनुसार समय में अंतर होता है; समय जारी होने का मतलब देर करने की सलाह नहीं है। चुने गए स्थान की मध्यरात्रि पर समय अपडेट होता है।",
              "اپنی مقامی مسجد کے اوقات سے ملائیں۔ فقہی آرا کے مطابق وقت میں فرق ہوتا ہے؛ وقت جاری ہونے کا مطلب تاخیر کی سفارش نہیں ہے۔ منتخب مقام کی نصف شب پر اوقات اپ ڈیٹ ہوتے ہیں۔",
            )}
          </p>
          <p className="mt-3 text-sm">
            <a
              href="https://sunnah.com/muslim:612a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              Prayer timing guidance: Sahih Muslim 612a
            </a>{" "}
            ·{" "}
            <a
              href="https://aladhan.com/calculation-methods"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline"
            >
              Calculation source: AlAdhan
            </a>
          </p>
        </>
      )}
    </section>
  );
}
