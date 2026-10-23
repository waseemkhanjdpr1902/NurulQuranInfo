// Pages containing each para's opening ayah in the pinned Nasta'liq edition.
// Visually checked against original_pages/{printedPage + 4}.jpg at
// a93e8947229889a2e486d9b414fe94e69c72c6e4 in
// 1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images.
// Paras 7, 11, 14, 21 and 22 begin within a page; open the containing page.
export const MUSHAF_PARAS = [
  2, 23, 43, 63, 83, 103, 122, 143, 163, 183,
  202, 223, 243, 262, 283, 303, 323, 343, 363, 383,
  403, 422, 443, 463, 483, 503, 523, 543, 563, 587,
].map((printedPage, index) => ({ number: index + 1, printedPage }));
