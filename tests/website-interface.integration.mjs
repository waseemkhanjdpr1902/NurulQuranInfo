import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
const dom = new JSDOM('<div id="root"></div>', {
  url: "https://example.test/?lang=hi",
  pretendToBeVisual: true,
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  SVGElement: dom.window.SVGElement,
  React,
  IS_REACT_ACT_ENVIRONMENT: true,
  getComputedStyle: dom.window.getComputedStyle,
});
Object.defineProperty(globalThis, "localStorage", {
  value: dom.window.localStorage,
  configurable: true,
});
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = dom.window.IntersectionObserver = Observer;
const { createRoot } = await import("react-dom/client");
const { AppRouterContext } =
  await import("next/dist/shared/lib/app-router-context.shared-runtime.js");
const router = {
  push() {},
  replace() {},
  back() {},
  forward() {},
  prefetch() {},
  refresh() {},
};
const unwrap = (mod) =>
  mod.default && typeof mod.default === "object" ? mod.default : mod;
const { UILanguageProvider, LanguageSelector } = unwrap(
  await import("../src/components/UILanguageProvider.tsx"),
);
const heroModule = await import("../src/components/HeroSection.tsx");
const Hero = heroModule.default.default || heroModule.default;
const gridModule = await import("../src/components/SurahGrid.tsx");
const Grid = gridModule.default.default || gridModule.default;
let root = createRoot(document.getElementById("root"));
const render = (child) =>
  act(async () =>
    root.render(
      React.createElement(
        AppRouterContext.Provider,
        { value: router },
        React.createElement(
          UILanguageProvider,
          null,
          React.createElement(LanguageSelector),
          child,
        ),
      ),
    ),
  );
await render(React.createElement(Hero));
assert.equal(document.documentElement.lang, "hi");
assert.ok(document.body.textContent.includes("क़ुरआन पढ़ें"));
assert.ok(document.body.textContent.includes("नमाज़ का समय"));
assert.equal(document.querySelectorAll("section a").length, 4);
await act(async () => {
  const select = document.querySelector("select");
  select.value = "ur";
  select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
});
assert.equal(document.documentElement.lang, "ur");
assert.equal(document.querySelector("section").dir, "rtl");
assert.ok(document.body.textContent.includes("قرآن پڑھیں"));
await act(async () => root.unmount());
window.history.replaceState(null, "", "/");
root = createRoot(document.getElementById("root"));
await render(React.createElement(Hero));
assert.equal(document.documentElement.lang, "ur");
await act(async () => root.unmount());
localStorage.setItem("nurulquran.ui-language.v1", "hi");
root = createRoot(document.getElementById("root"));
let calls = 0;
globalThis.fetch = async () => {
  calls++;
  if (calls === 1) return new Response("", { status: 503 });
  return Response.json({
    data: Array.from({ length: 114 }, (_, i) => ({
      number: i + 1,
      name: "سورة",
      englishName: `Surah ${i + 1}`,
      englishNameTranslation: "Example",
      numberOfAyahs: 7,
      revelationType: "Meccan",
    })),
  });
};
await render(React.createElement(Grid, { limit: 6 }));
assert.ok(document.querySelector('[role="alert"]'));
assert.ok(!document.body.textContent.includes("कोई सूरह नहीं मिली"));
await act(async () =>
  [...document.querySelectorAll("button")]
    .find((x) => x.textContent === "फिर कोशिश करें")
    .click(),
);
assert.equal(document.querySelectorAll("h3").length, 6);
assert.ok(document.body.textContent.includes("सभी 114 सूरहें देखें"));
assert.equal(document.querySelector('[role="alert"]'), null);
await act(async () => root.unmount());
const aiModule = await import("../src/components/AIAssistant.tsx");
const AI = aiModule.default.default || aiModule.default;
root = createRoot(document.getElementById("root"));
let aiCalls = 0;
globalThis.fetch = async () => {
  aiCalls++;
  return aiCalls === 1
    ? Response.json({ error: "internal API key failure" }, { status: 503 })
    : Response.json({ text: "A successful study answer." });
};
await render(React.createElement(AI));
await act(async () => document.querySelector("#ai").click());
const input = document.querySelector("input");
await act(async () => {
  Object.getOwnPropertyDescriptor(
    dom.window.HTMLInputElement.prototype,
    "value",
  ).set.call(input, "Explain patience");
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
const send = [...document.querySelectorAll("button")].find(
  (b) => b.getAttribute("aria-label") === "सवाल भेजें",
);
assert.equal(send.disabled, false);
await act(async () => send.click());
assert.ok(document.querySelector('[role="alert"]'));
assert.ok(!document.body.textContent.includes("internal API key failure"));
await act(async () =>
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent === "सवाल फिर भेजें")
    .click(),
);
assert.equal(aiCalls, 2);
assert.equal(document.querySelector('[role="alert"]'), null);
assert.ok(document.body.textContent.includes("A successful study answer."));
assert.equal(document.body.textContent.split("Explain patience").length - 1, 1);
await act(async () => root.unmount());
const { fetchWithTimeout } = unwrap(
  await import("../src/lib/fetch-with-timeout.ts"),
);
globalThis.fetch = (_, init) =>
  new Promise((resolve, reject) => {
    if (init.signal.aborted) reject(new DOMException("Aborted", "AbortError"));
    else
      init.signal.addEventListener(
        "abort",
        () => reject(new DOMException("Aborted", "AbortError")),
        { once: true },
      );
  });
await assert.rejects(
  fetchWithTimeout("https://example.test", {}, 5),
  (e) => e.name === "AbortError",
);
const controller = new AbortController();
const pending = fetchWithTimeout(
  "https://example.test",
  { signal: controller.signal },
  1000,
);
controller.abort();
await assert.rejects(pending, (e) => e.name === "AbortError");
console.log(
  "PASS: Hindi deep link, four homepage actions, Urdu direction, language persistence, failed-surah retry, six-surah preview, AI error/retry without duplicate questions, request timeout and caller cancellation.",
);
