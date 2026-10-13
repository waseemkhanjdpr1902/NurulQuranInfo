import assert from "node:assert/strict";
const mod = await import("../src/lib/study-answer.ts");
const { acceptableStudyAnswer, studyContext, normalizeDigits } =
  mod.default || mod;
const context = studyContext("صبر کا مطلب مختصر بتائیں۔");
assert.ok(context.references.includes("2:153"));
assert.equal(
  acceptableStudyAnswer(
    "صبر کا مطلب ثابت قدمی اور تحمل ہے۔ قرآن میں صبر اور نماز سے مدد لینے کی تعلیم ہے (۲:۱۵۳)۔",
    context.references,
  ),
  true,
);
assert.equal(
  acceptableStudyAnswer(
    "سورۃ العصر (۱۰۲:۱‑۳) صبر کی تعلیم دیتی ہے۔",
    context.references,
  ),
  false,
);
assert.equal(
  acceptableStudyAnswer("صبر کے ساتھ ".repeat(20), context.references),
  false,
);
assert.equal(
  acceptableStudyAnswer("A general study answer about patience.", []),
  true,
);
assert.equal(
  acceptableStudyAnswer("A fabricated reference 999:999.", []),
  false,
);
assert.equal(
  acceptableStudyAnswer("صبر صبر صبر ".repeat(1000), context.references),
  false,
);
assert.equal(normalizeDigits("٢:۱۵۳"), "2:153");
assert.equal(
  acceptableStudyAnswer(
    "إِنَّ الإِنْسَانَ لَفِي خُسْرٍ وَالْعَصْرِ لَا تُؤَلِّفْ نَصَّ الْقُرْآنِ",
    [],
  ),
  false,
);
console.log(
  "PASS: reviewed topic references accepted; wrong Urdu-numbered citations, ungrounded references, repetition and generated vowel-marked scripture rejected.",
);

assert.equal(
  acceptableStudyAnswer("The verse says to be thankful (94:5-6).", []),
  false,
);
