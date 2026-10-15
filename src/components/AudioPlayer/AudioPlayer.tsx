"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import { nextAudioAction, type AudioPhase } from "@/lib/quran-audio";

interface AudioPlayerProps {
  modeLabel?: string;
  translationAudioUrl?: string | null;
  onPhaseChange?: (phase: AudioPhase) => void;
  audioUrl: string | null;
  playbackRequest?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onPlayRequest?: () => void;
  onPlayStateChange?: (playing: boolean) => void;
  onStop?: () => void;
  title: string;
  subtitle: string;
}

export default function AudioPlayer({
  modeLabel,
  audioUrl,
  translationAudioUrl = null,
  onPhaseChange,
  playbackRequest = 0,
  onNext,
  onPrev,
  onPlayRequest,
  onPlayStateChange,
  onStop,
  title,
  subtitle,
}: AudioPlayerProps) {
  const { t } = useUILanguage();
  const [buffering, setBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<AudioPhase>("arabic");
  const phaseRef = useRef<AudioPhase>("arabic");
  const [segmentRequest, setSegmentRequest] = useState(0);
  const currentUrl = phase === "urdu" ? translationAudioUrl : audioUrl;
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");

  const startAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError("");
    setBuffering(true);
    if (audio.error) audio.load();
    try {
      await audio.play();
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setBuffering(false);
      setError(
        t(
          "Audio could not start. Tap Retry audio.",
          "ऑडियो शुरू नहीं हुआ। ऑडियो फिर चलाएँ दबाएँ।",
          "آڈیو شروع نہیں ہوئی۔ آڈیو دوبارہ چلائیں دبائیں۔",
        ),
      );
    }
  };

  const changePhase = (next: AudioPhase) => {
    phaseRef.current = next;
    setPhase(next);
    onPhaseChange?.(next);
  };

  const replayAyah = () => {
    audioRef.current?.pause();
    changePhase("arabic");
    setSegmentRequest((value) => value + 1);
  };

  useEffect(() => {
    phaseRef.current = "arabic";
    setPhase("arabic");
    setSegmentRequest((value) => value + 1);
    onPhaseChange?.("arabic");
  }, [audioUrl, translationAudioUrl, playbackRequest, onPhaseChange]);

  useEffect(() => {
    const audio = audioRef.current;
    let cancelled = false;
    setTime(0);
    setDuration(audio && Number.isFinite(audio.duration) ? audio.duration : 0);
    setPlaying(false);
    setBuffering(false);
    setError("");
    if (!audio || !currentUrl) return;
    // Parent changes reset the pair before any stale Urdu clip can start.
    if (phaseRef.current !== phase) return;
    audio.currentTime = 0;
    setBuffering(true);
    audio.play().catch((cause) => {
      if (cancelled || cause.name === "AbortError") return;
      setBuffering(false);
      setError(
        t(
          "Audio could not start. Tap Retry audio.",
          "ऑडियो शुरू नहीं हुआ। ऑडियो फिर चलाएँ दबाएँ।",
          "آڈیو شروع نہیں ہوئی۔ آڈیو دوبارہ چلائیں دبائیں۔",
        ),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [currentUrl, phase, segmentRequest, t]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = rate;
    }
  }, [volume, rate, currentUrl]);

  useEffect(() => {
    if (!buffering) return;
    const timer = setTimeout(() => {
      audioRef.current?.pause();
      setBuffering(false);
      setError(
        t(
          "Audio is taking too long to load. Check your connection and retry.",
          "ऑडियो लोड होने में ज़्यादा समय लग रहा है। इंटरनेट जाँचें और फिर कोशिश करें।",
          "آڈیو لوڈ ہونے میں زیادہ وقت لگ رہا ہے۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔",
        ),
      );
    }, 20000);
    return () => clearTimeout(timer);
  }, [buffering, t]);

  const togglePlay = () => {
    if (!audioUrl) {
      onPlayRequest?.();
      return;
    }
    if (audioRef.current?.paused) void startAudio();
    else audioRef.current?.pause();
  };

  return (
    <section
      aria-label={t("Quran recitation", "क़ुरआन तिलावत", "قرآن کی تلاوت")}
      className="fixed left-2 right-2 z-[90] sm:left-4 sm:right-4"
      style={{ bottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-5xl rounded-2xl border border-emerald-200/30 bg-[#0b332d] p-3 text-white shadow-xl sm:p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              playing
                ? t("Pause recitation", "तिलावत रोकें", "تلاوت روکیں")
                : t("Play recitation", "तिलावत चलाएँ", "تلاوت چلائیں")
            }
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#e8b94f] px-4 font-semibold text-[#0b332d] focus-visible:outline-white"
          >
            {playing ? (
              <Pause size={22} aria-hidden="true" />
            ) : (
              <Play size={22} aria-hidden="true" />
            )}
            {playing
              ? t("Pause", "रोकें", "وقفہ")
              : t("Play", "चलाएँ", "چلائیں")}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{title}</p>
            <p className="truncate text-xs text-emerald-100">{subtitle}</p>
            {modeLabel && (
              <p className="text-xs text-emerald-100">{modeLabel}</p>
            )}
            {audioUrl && (
              <p role="status" className="text-xs text-amber-200">
                {phase === "urdu"
                  ? t("Urdu translation", "उर्दू तर्जुमा", "اردو ترجمہ")
                  : t("Arabic tilawat", "अरबी तिलावत", "عربی تلاوت")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowSettings((value) => !value)}
            aria-label={t(
              "Recitation options",
              "तिलावत के विकल्प",
              "تلاوت کے اختیارات",
            )}
            aria-expanded={showSettings}
            aria-controls="recitation-options"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 hover:bg-white/10 focus-visible:outline-white"
          >
            {showSettings ? <ChevronDown size={22} /> : <Settings size={22} />}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!audioUrl || !onPrev}
            aria-label={t("Previous ayah", "पिछली आयत", "پچھلی آیت")}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
          >
            <SkipBack size={18} />
            {t("Previous ayah", "पिछली आयत", "پچھلی آیت")}
          </button>
          <button
            type="button"
            onClick={replayAyah}
            disabled={!audioUrl}
            aria-label={t(
              "Replay ayah from Arabic",
              "आयत अरबी से फिर सुनें",
              "آیت عربی سے دوبارہ سنیں",
            )}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
          >
            <RotateCcw size={18} />{" "}
            {t("Replay ayah", "आयत फिर सुनें", "آیت دوبارہ سنیں")}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!audioUrl || !onNext}
            aria-label={t("Next ayah", "अगली आयत", "اگلی آیت")}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
          >
            {t("Next ayah", "अगली आयत", "اگلی آیت")} <SkipForward size={18} />
          </button>
        </div>
        {buffering && (
          <p
            role="status"
            className="mt-2 flex items-center gap-2 text-sm text-amber-200"
          >
            <Loader2 size={16} className="animate-spin" />
            {t("Loading audio…", "ऑडियो लोड हो रहा है…", "آڈیو لوڈ ہو رہی ہے…")}
          </p>
        )}
        {error && (
          <div role="alert" className="mt-2 text-sm text-amber-200">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void startAudio()}
              className="mt-2 min-h-11 rounded-xl border border-amber-200 px-3 text-white"
            >
              {t("Retry audio", "ऑडियो फिर चलाएँ", "آڈیو دوبارہ چلائیں")}
            </button>
          </div>
        )}
        {showSettings && (
          <div
            id="recitation-options"
            className="mt-3 space-y-3 border-t border-white/20 pt-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums">{formatTime(time)}</span>
              <input
                type="range"
                aria-label={t(
                  "Recitation progress",
                  "तिलावत की प्रगति",
                  "تلاوت کی پیش رفت",
                )}
                min="0"
                max={duration || 1}
                step="0.1"
                value={Math.min(time, duration || 0)}
                disabled={!duration}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (audioRef.current) audioRef.current.currentTime = next;
                  setTime(next);
                }}
                className="min-h-11 min-w-0 flex-1 accent-[#e8b94f]"
              />
              <span className="text-xs tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!audioUrl || !onPrev}
                aria-label={t("Previous ayah", "पिछली आयत", "پچھلی آیت")}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
              >
                <SkipBack size={18} />{" "}
                {t("Previous ayah", "पिछली आयत", "پچھلی آیت")}
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!audioUrl || !onNext}
                aria-label={t(
                  "Next ayah in options",
                  "विकल्प में अगली आयत",
                  "اختیارات میں اگلی آیت",
                )}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
              >
                {t("Next", "अगली", "اگلی")} <SkipForward size={18} />
              </button>
              <button
                type="button"
                onClick={() => setRepeat((value) => !value)}
                aria-pressed={repeat}
                className={`min-h-11 rounded-xl border border-white/30 px-3 text-sm ${repeat ? "bg-emerald-700" : ""}`}
              >
                {t("Repeat ayah", "आयत दोहराएँ", "آیت دہرائیں")}{" "}
                {repeat ? t("on", "चालू", "فعال") : t("off", "बंद", "بند")}
              </button>
              <button
                type="button"
                disabled={!audioUrl}
                onClick={() => {
                  audioRef.current?.pause();
                  if (audioRef.current) audioRef.current.currentTime = 0;
                  onStop?.();
                  setShowSettings(false);
                }}
                className="min-h-11 rounded-xl border border-white/30 px-3 text-sm disabled:opacity-40"
              >
                {t("Stop recitation", "तिलावत बंद करें", "تلاوت بند کریں")}
              </button>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                {t("Speed", "गति", "رفتار")}
                <select
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="min-h-11 rounded-xl bg-[#174c42] px-3 text-white"
                >
                  {[0.5, 1, 1.25, 1.5, 2].map((value) => (
                    <option key={value} value={value}>
                      {value}×
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                {t("Volume", "आवाज़", "آواز")}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="min-h-11 w-24 accent-[#e8b94f]"
                />
              </label>
            </div>
          </div>
        )}
        <audio
          onWaiting={() => setBuffering(true)}
          onStalled={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          ref={audioRef}
          src={currentUrl || undefined}
          preload="none"
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) =>
            setDuration(
              Number.isFinite(event.currentTarget.duration)
                ? event.currentTarget.duration
                : 0,
            )
          }
          onPlay={() => {
            setPlaying(true);
            setError("");
            onPlayStateChange?.(true);
          }}
          onPause={() => {
            setBuffering(false);
            setPlaying(false);
            onPlayStateChange?.(false);
          }}
          onError={() => {
            setBuffering(false);
            setPlaying(false);
            onPlayStateChange?.(false);
            setError(
              t(
                "Audio is unavailable. Retry, or choose Arabic only. Playback stopped without skipping the translation.",
                "ऑडियो उपलब्ध नहीं है। फिर कोशिश करें या केवल अरबी चुनें। तर्जुमा छोड़े बिना प्लेबैक रोक दिया गया है।",
                "آڈیو دستیاب نہیں ہے۔ دوبارہ کوشش کریں یا صرف عربی منتخب کریں۔ ترجمہ چھوڑے بغیر پلے بیک روک دیا گیا ہے۔",
              ),
            );
          }}
          onEnded={() => {
            setPlaying(false);
            onPlayStateChange?.(false);
            const action = nextAudioAction(
              phaseRef.current,
              Boolean(translationAudioUrl),
              repeat,
            );
            if (action === "urdu") {
              changePhase("urdu");
              setSegmentRequest((value) => value + 1);
            } else if (action === "replay") replayAyah();
            else onNext?.();
          }}
        />
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60)
    .toString()
    .padStart(2, "0")}`;
}
