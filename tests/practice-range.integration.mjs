import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
require("next/font/google").Noto_Nastaliq_Urdu = () => ({ className: "test-font" });

const dom = new JSDOM('<div id="root"></div>', { url: "https://example.test", pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, CustomEvent: dom.window.CustomEvent, React, IS_REACT_ACT_ENVIRONMENT: true, getComputedStyle: dom.window.getComputedStyle });
Object.defineProperty(globalThis, "localStorage", { value: dom.window.localStorage, configurable: true });
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
class Observer { observe() {} unobserve() {} disconnect() {} }
globalThis.IntersectionObserver = dom.window.IntersectionObserver = Observer;
dom.window.HTMLElement.prototype.scrollIntoView = function () {};
Object.defineProperty(dom.window.HTMLMediaElement.prototype, "paused", { get() { return this._paused !== false; } });
dom.window.HTMLMediaElement.prototype.play = function () { this._paused = false; this.dispatchEvent(new dom.window.Event("play")); this.dispatchEvent(new dom.window.Event("playing")); return Promise.resolve(); };
dom.window.HTMLMediaElement.prototype.pause = function () { this._paused = true; this.dispatchEvent(new dom.window.Event("pause")); };
const verses = [1, 2].map(n => ({ number: n, numberInSurah: n, text: "verse", audio: `https://test/${n}.mp3` }));
globalThis.fetch = async url => {
  const kanzul = String(url).includes("ur.kanzuliman");
  return Response.json({ data: Array.from({length: 5}, (_, i) => ({
    edition: { identifier: i === 3 ? (kanzul ? "ur.kanzuliman" : "ur.jalandhry") : "test", language: i === 3 ? "ur" : "en" },
    ayahs: verses.map(v => ({...v, text: i === 3 ? (kanzul ? "kanzul-test" : "jalandhry-test") : v.text}))
  })) });
};
const { AppRouterContext } = await import("next/dist/shared/lib/app-router-context.shared-runtime.js");
const router = { push() {}, replace() {}, back() {}, forward() {}, prefetch() {}, refresh() {} };
const unwrap = mod => mod.default && typeof mod.default === "object" ? mod.default : mod;
const { UILanguageProvider } = unwrap(await import("../src/components/UILanguageProvider.tsx"));
const mod = await import("../src/components/QuranReader.tsx");
const Reader = mod.default.default || mod.default;
const root = createRoot(document.getElementById("root"));
await act(async () => root.render(React.createElement(AppRouterContext.Provider, {value: router}, React.createElement(UILanguageProvider, null, React.createElement(Reader, {surah: {number:1, name:"test", englishName:"Test", englishNameTranslation:"test", numberOfAyahs:2, revelationType:"Meccan"}})))));
const labelSelect = text => [...document.querySelectorAll("label")].find(x => x.textContent.includes(text)).querySelector("select");
const setSelect = async (text, value) => act(async () => {const select=labelSelect(text); select.value=String(value); select.dispatchEvent(new dom.window.Event("change", {bubbles:true}));});
const button = text => [...document.querySelectorAll("button")].find(x => x.textContent.trim() === text);
const start = async () => act(async () => button("Start practice").click());
const end = async () => act(async () => document.querySelector("audio").dispatchEvent(new dom.window.Event("ended")));
const src = () => document.querySelector("audio").getAttribute("src");
await setSelect("Written translation", "ur-kanzuliman");
assert.equal(localStorage.getItem("nurulquran.translation-language"), "ur-kanzuliman");
assert.ok(document.querySelector('p[lang="ur"][dir="rtl"]').textContent.includes("kanzul-test"));
assert.ok(document.body.textContent.includes("کنزالایمان"));
await act(async () => button("Arabic + Urdu translation").click());
assert.equal(labelSelect("Written translation").value, "ur-kanzuliman", "audio mode preserves selected Kanzul Iman");
await setSelect("Written translation", "ur");
assert.ok(document.querySelector('p[lang="ur"]').textContent.includes("jalandhry-test"));
await setSelect("Practice pause", 0);
await start();
assert.match(src(), /1.mp3/);
await end(); await end();
assert.match(src(), /1.mp3/);
assert.ok(button("Stop practice"));
await end();
assert.equal(src(), null, "one ayah stops after exactly three recitations");
assert.ok(button("Start practice"));
await setSelect("To ayah", 2);
await start();
await end(); await end(); await end();
assert.match(src(), /2.mp3/, "practice advances to the next ayah");
await end(); await end();
assert.match(src(), /2.mp3/);
await end();
assert.equal(src(), null, "range stops after the last ayah has played three times");
assert.ok(button("Start practice"));
await act(async () => root.unmount());
console.log("PASS: one-ayah and multi-ayah practice stop after the selected repeats.");
