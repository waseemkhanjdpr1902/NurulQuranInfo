// Standard Hafs ayah counts, indexed by surah number minus one.
const AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3,5,4,5,6,
] as const;

export const URDU_AUDIO_SURAHS: Readonly<Record<number, number>> = Object.freeze(
  Object.fromEntries(AYAH_COUNTS.map((count, index) => [index + 1, count]))
);

export type AudioPhase = "arabic" | "urdu";

export function urduAudioUrl(surah: number, ayah: number): string | null {
  const count = URDU_AUDIO_SURAHS[surah];
  if (!count || !Number.isInteger(ayah) || ayah < 1 || ayah > count) return null;
  return `https://everyayah.com/data/translations/urdu_shamshad_ali_khan_46kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
}

export function nextAudioAction(phase: AudioPhase, hasUrdu: boolean, repeat: boolean): "urdu" | "replay" | "next" {
  if (phase === "arabic" && hasUrdu) return "urdu";
  return repeat ? "replay" : "next";
}
