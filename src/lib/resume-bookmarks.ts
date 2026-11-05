export type ResumeBookmark = { surahNumber: number; surahName: string; slug: string; ayah: number };
const key = (kind: 'reading' | 'listening') => `nurulquran.resume.${kind}.v1`;
export function getResumeBookmark(kind: 'reading' | 'listening'): ResumeBookmark | null {
  try {
    const value = JSON.parse(localStorage.getItem(key(kind)) || 'null');
    return value && Number.isInteger(value.surahNumber) && value.surahNumber >= 1 && value.surahNumber <= 114 && Number.isInteger(value.ayah) && value.ayah > 0 && typeof value.slug === 'string' && /^[a-z0-9-]+$/.test(value.slug) && typeof value.surahName === 'string' ? value : null;
  } catch { return null; }
}
export function saveResumeBookmark(kind: 'reading' | 'listening', bookmark: ResumeBookmark): boolean {
  try { localStorage.setItem(key(kind), JSON.stringify(bookmark)); window.dispatchEvent(new Event('nurulquran:resume')); return true; } catch { return false; }
}
