export const MUSHAF_PAGE_COUNT = 604;
export const MUSHAF_STORAGE_KEY = "nurulquran.mushaf.v1";
export function validMushafPage(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "string" && !/^\d+$/.test(value)) return null;
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= MUSHAF_PAGE_COUNT ? page : null;
}
export function mushafSourceUrl(page: number) {
  if (validMushafPage(page) === null) throw new Error("Invalid Mushaf page");
  return `https://quran.ksu.edu.sa/png_big/${page}.png`;
}
