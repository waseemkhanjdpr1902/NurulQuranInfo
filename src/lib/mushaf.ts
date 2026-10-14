export const MUSHAF_PAGE_COUNT = 610;
export const MUSHAF_STORAGE_KEY = "nurulquran.mushaf.indopak.v1";
export function validMushafPage(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  if (typeof value === "string" && !/^\d+$/.test(value)) return null;
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= MUSHAF_PAGE_COUNT ? page : null;
}
export function mushafSourceUrl(page: number) {
  if (validMushafPage(page) === null) throw new Error("Invalid Mushaf page");
  return `https://raw.githubusercontent.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages/${page + 5}.jpg`;
}

// Reading pages 1–610 are scan files 6–615, printed pages 2–611.
// Exclude publisher front matter, reading instructions, index and covers.
