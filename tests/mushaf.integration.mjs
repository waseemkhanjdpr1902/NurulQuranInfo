import assert from "node:assert/strict";
import React, { act } from "react";
import { JSDOM } from "jsdom";

const unwrap = mod => mod.default && typeof mod.default === "object" ? mod.default : mod;
const { validMushafPage, mushafSourceUrl, MUSHAF_STORAGE_KEY } = unwrap(await import("../src/lib/mushaf.ts"));
for (const invalid of [null, "", "0", 0, -1, 611, "1.5", 1.5, "2x", Infinity]) assert.equal(validMushafPage(invalid), null);
assert.equal(validMushafPage("610"), 610);
assert.equal(mushafSourceUrl(1), "https://raw.githubusercontent.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages/6.jpg");
const { GET } = unwrap(await import("../src/app/api/indopak-mushaf/[page]/route.ts"));
let requests = 0;
const bytes = new Uint8Array([255, 216, 255, 224]);
globalThis.fetch = async url => {
  requests++;
  assert.equal(url, mushafSourceUrl(610));
  return new Response(bytes, { headers: { "content-type": "image/jpeg" } });
};
const get = page => GET(new Request("https://example.test/api/indopak-mushaf/" + page), { params: Promise.resolve({page}) });
assert.equal((await get("611")).status, 400);
assert.equal(requests, 0);
const response = await get("610");
assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes, "publisher image forwarded unchanged");
globalThis.fetch = async () => new Response("not an image", {headers: {"content-type": "text/html"}});
assert.equal((await get("1")).status, 502);
globalThis.fetch = async () => { throw new Error("network"); };
assert.equal((await get("1")).status, 502);

const dom = new JSDOM('<div id="root"></div>', { url: "https://example.test/mushaf?page=610", pretendToBeVisual:true });
Object.assign(globalThis, {requestAnimationFrame:callback => callback(), window:dom.window, self:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, Element:dom.window.Element, React, IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,"navigator",{value:dom.window.navigator, configurable:true});
Object.defineProperty(globalThis,"localStorage",{value:dom.window.localStorage, configurable:true});
dom.window.HTMLElement.prototype.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
const { createRoot } = await import("react-dom/client");
const { UILanguageProvider } = unwrap(await import("../src/components/UILanguageProvider.tsx"));
const readerModule = await import("../src/components/MushafReader.tsx");
const Reader = readerModule.default.default || readerModule.default;
let root = createRoot(document.getElementById("root"));
const render = () => act(async()=>root.render(React.createElement(UILanguageProvider,null,React.createElement(Reader))));
await render();
assert.ok(new URL(document.querySelector("img").getAttribute("src"),window.location.href).pathname.startsWith("/api/indopak-mushaf/610"));
const find = text => [...document.querySelectorAll("button")].find(b=>b.textContent===text);
assert.ok(find("Next page").disabled);
await act(async()=>find("Previous page").click());
assert.ok(new URL(document.querySelector("img").getAttribute("src"),window.location.href).pathname.startsWith("/api/indopak-mushaf/609"));
await act(async()=>document.querySelector('[aria-label="Zoom in"]').click());
assert.equal(JSON.parse(localStorage.getItem(MUSHAF_STORAGE_KEY)).zoom,125);
await act(async()=>document.querySelector("img").dispatchEvent(new dom.window.Event("error")));
assert.ok(find("Retry"));
await act(async()=>find("Retry").click());
assert.ok(document.querySelector("img").getAttribute("src").includes("retry=1"));
await act(async()=>find("Surah index").click());
assert.equal(document.querySelectorAll('section[aria-label="Surah index"] img').length,2);
const { MUSHAF_SURAHS } = unwrap(await import("../src/data/mushaf-surahs.ts"));
assert.equal(MUSHAF_SURAHS.length,114);
assert.equal(new Set(MUSHAF_SURAHS.map(s => s.number)).size,114);
for (const [number, printedPage] of [[1,2],[2,3],[18,294],[36,441],[55,532],[67,563],[112,610],[114,611]]) {
  const surah = MUSHAF_SURAHS.find(s => s.number === number);
  assert.equal(surah.printedPage,printedPage, "matches publisher index");
  const button = [...document.querySelectorAll('section button')].find(b=>b.textContent.startsWith(`${number}. `));
  assert.ok(button);
  await act(async()=>button.click());
  assert.equal(document.querySelector('input[aria-label="Printed page number"]').value,String(printedPage));
  assert.equal(new URL(document.querySelector('div[role="region"] img').getAttribute('src'),window.location.href).pathname, `/api/indopak-mushaf/${printedPage - 1}`);
  assert.equal(JSON.parse(localStorage.getItem(MUSHAF_STORAGE_KEY)).zoom,125, "surah selection preserves zoom");
  await act(async()=>find("Surah index").click());
}
// All 114 controls have the correct reading-page offset, including shared start pages.
for (const surah of MUSHAF_SURAHS) {
  assert.ok(validMushafPage(surah.printedPage - 1));
  const button = [...document.querySelectorAll('section button')].find(b=>b.textContent.startsWith(`${surah.number}. `));
  await act(async()=>button.click());
  assert.equal(document.querySelector('input[aria-label="Printed page number"]').value,String(surah.printedPage));
  await act(async()=>find("Surah index").click());
}
const search=document.querySelector('input[type="search"]');
for (const term of ['al kahf','الكهف']) {
  await act(async()=>{
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(search,term);
    search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  });
  assert.equal(document.querySelectorAll('section button').length,1,"search ignores punctuation and Arabic vowel marks");
}
await act(async()=>{
  Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(search,'');
  search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
});
await act(async()=>find("Close surah index").click());
assert.equal(document.querySelector('input[aria-label="Printed page number"]').value,"611");
assert.equal(mushafSourceUrl(610).endsWith("/615.jpg"),true,"last Quran page excludes back matter");
await act(async()=>find("Full screen").click());
assert.ok(find("Exit full screen"), "in-page full-screen fallback works without native browser support");
assert.ok(document.querySelector('div[style*="position: fixed"]'));
await act(async()=>find("Exit full screen").click());
assert.ok(find("Full screen"));
assert.ok(new URL(document.querySelector("img").getAttribute("src"),window.location.href).pathname.startsWith("/api/indopak-mushaf/610"));
// Save a meaningful position within a zoomed scan, then restore it on remount.
await act(async()=>find("Large controls").click());
const region = document.querySelector('div[role="region"]');
Object.defineProperties(region, {scrollHeight:{value:2000,configurable:true},clientHeight:{value:500,configurable:true},scrollWidth:{value:1000,configurable:true},clientWidth:{value:500,configurable:true}});
await act(async()=>document.querySelector('div[role="region"] img').dispatchEvent(new dom.window.Event("load")));
region.scrollTop=750; region.scrollLeft=125;
await act(async()=>region.dispatchEvent(new dom.window.Event("scroll")));
assert.equal(JSON.parse(localStorage.getItem(MUSHAF_STORAGE_KEY)).top,0.5);
assert.equal(JSON.parse(localStorage.getItem(MUSHAF_STORAGE_KEY)).left,0.25);
await act(async()=>root.unmount());
window.history.replaceState(null,"","/mushaf");
root=createRoot(document.getElementById("root"));
await render();
assert.ok(new URL(document.querySelector("img").getAttribute("src"),window.location.href).pathname.startsWith("/api/indopak-mushaf/610"),"saved page restored");
assert.equal(document.querySelector('[aria-label="Zoom level"]').textContent,"125%");
assert.equal(find("Large controls").getAttribute("aria-pressed"),"true");
const restored = document.querySelector('div[role="region"]');
Object.defineProperties(restored, {scrollHeight:{value:3000},clientHeight:{value:600},scrollWidth:{value:1500},clientWidth:{value:500}});
await act(async()=>document.querySelector('div[role="region"] img').dispatchEvent(new dom.window.Event("load")));
assert.equal(restored.scrollTop,1200,"relative position survives a viewport size change");
assert.equal(restored.scrollLeft,250);
const { MUSHAF_PARAS } = unwrap(await import("../src/data/mushaf-paras.ts"));
assert.equal(MUSHAF_PARAS.length,30);
for (const para of MUSHAF_PARAS) {
  await act(async()=>{
    const select=document.querySelector('[aria-label="Choose para"]');
    select.value=String(para.printedPage);select.dispatchEvent(new dom.window.Event("change",{bubbles:true}));
  });
  assert.equal(document.querySelector('input[aria-label="Printed page number"]').value,String(para.printedPage));
}
await act(async()=>root.unmount());
console.log("Mushaf: page limits, unchanged image proxy, network recovery, navigation, zoom and saved position passed.");
