// Pilot only. Extend after listening review of each recording and ayah mapping.
export const URDU_AUDIO_PILOT: Readonly<Record<number, number>> = {
  1: 7, 112: 4, 113: 5, 114: 6,
};

export type AudioPhase = "arabic" | "urdu";

export function urduAudioUrl(surah: number, ayah: number): string | null {
  const count = URDU_AUDIO_PILOT[surah];
  if (!count || !Number.isInteger(ayah) || ayah < 1 || ayah > count) return null;
  return `https://everyayah.com/data/translations/urdu_shamshad_ali_khan_46kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
}

export function nextAudioAction(phase: AudioPhase, hasUrdu: boolean, repeat: boolean): "urdu" | "replay" | "next" {
  if (phase === "arabic" && hasUrdu) return "urdu";
  return repeat ? "replay" : "next";
}
