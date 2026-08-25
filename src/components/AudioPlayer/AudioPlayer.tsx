"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Settings, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

interface AudioPlayerProps {
  audioUrl: string | null;
  onNext?: () => void;
  onPrev?: () => void;
  onPlayRequest?: () => void;
  onPlayStateChange?: (playing: boolean) => void;
  onClose?: () => void;
  title: string;
  subtitle: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioUrl, onNext, onPrev, onPlayRequest, onPlayStateChange, onClose, title, subtitle }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== "AbortError") {
            console.error("Audio play error:", error);
          }
        });
      }
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioUrl) {
      onPlayRequest?.();
      return;
    }

    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== "AbortError") {
            console.error("Audio play error:", error);
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (onNext) {
      onNext();
    } else {
      setPlaying(false);
      onPlayStateChange?.(false);
    }
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      audioRef.current?.pause();
      onPlayStateChange?.(false);
      onClose?.();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, onPlayStateChange]);

  return (
    <div className="pointer-events-none fixed left-3 right-3 z-[90] md:left-6 md:right-6" style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`pointer-events-auto relative mx-auto max-w-5xl border border-gold/40 bg-ink shadow-2xl shadow-black/60 ${collapsed ? "rounded-2xl p-3 pr-28" : "rounded-[28px] p-4 pr-14 md:p-5 md:pr-16"}`}
      >
        <button
          type="button"
          onClick={() => setCollapsed(value => !value)}
          className="absolute right-14 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-parchment hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label={collapsed ? "Expand recitation player" : "Collapse recitation player"}
          title={collapsed ? "Expand player" : "Collapse player"}
        >
          {collapsed ? <ChevronUp size={21} /> : <ChevronDown size={21} />}
        </button>
        <button
          type="button"
          onClick={() => {
            audioRef.current?.pause();
            onPlayStateChange?.(false);
            onClose?.();
          }}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold text-ink shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment"
          aria-label="Close recitation player"
          title="Close player"
        >
          <X size={22} strokeWidth={3} />
        </button>
        {collapsed ? (
          <div className="flex min-h-10 items-center gap-3">
            <button onClick={togglePlay} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink" aria-label={playing ? "Pause recitation" : "Play recitation"}>
              {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-parchment">{title}</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-gold/70">{subtitle}</p>
            </div>
          </div>
        ) : <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-lg shrink-0">
              <Settings size={20} className={playing ? "animate-spin" : ""} />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-parchment font-bold truncate text-sm md:text-base">{title}</h4>
              <p className="text-gold/60 text-[10px] uppercase tracking-widest truncate">{subtitle}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onPrev}
              className="text-parchment/30 hover:text-gold transition-colors"
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-ink hover:scale-110 transition-transform shadow-xl shadow-gold/20"
            >
              {playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>

            <button 
              onClick={onNext}
              className="text-parchment/30 hover:text-gold transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Progress & Volume */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-4">
            <span className="text-[10px] text-parchment/30 font-mono w-10">
              {formatTime(audioRef.current?.currentTime || 0)}
            </span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress || 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
            />
            <span className="text-[10px] text-parchment/30 font-mono w-10">
              {formatTime(duration || 0)}
            </span>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={`transition-colors ${isRepeat ? "text-gold" : "text-parchment/30 hover:text-gold"}`}
            >
              <Repeat size={20} />
            </button>
            
            <div className="relative group">
              <button className="text-parchment/30 hover:text-gold transition-colors flex items-center gap-1">
                <span className="text-[10px] font-bold">{playbackRate}x</span>
              </button>
              <div className="absolute bottom-full right-0 mb-4 glass p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto flex flex-col gap-1">
                {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                  <button 
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      if (audioRef.current) audioRef.current.playbackRate = rate;
                    }}
                    className={`px-4 py-1 rounded-lg text-[10px] font-bold transition-colors ${playbackRate === rate ? "bg-gold text-ink" : "hover:bg-white/10 text-parchment"}`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 w-24">
              <Volume2 size={16} className="text-parchment/30" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>
          </div>
        </div>}

        <audio 
          key={audioUrl || 'no-audio'}
          ref={audioRef}
          src={audioUrl || undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => {
            setPlaying(true);
            onPlayStateChange?.(true);
          }}
          onPause={() => {
            setPlaying(false);
            onPlayStateChange?.(false);
          }}
        />
      </motion.div>
    </div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
