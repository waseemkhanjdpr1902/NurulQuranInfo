self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/names-of-allah";

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existingWindow = windows.find(client => "focus" in client);
    if (existingWindow) {
      await existingWindow.navigate(targetUrl);
      return existingWindow.focus();
    }
    return self.clients.openWindow(targetUrl);
  })());
});

// Only explicitly downloaded original Mushaf scans are served cache-first.
// Never cache authentication, API JSON, prayer times or other personalised pages.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (/^\/api\/indopak-mushaf\/\d+$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open("nurulquran-indopak-downloads-v1");
      return (await cache.match(url.pathname)) || fetch(event.request);
    })());
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith((async () => {
      const cache = await caches.open("nurulquran-mushaf-assets-v1");
      const saved = await cache.match(event.request);
      if (saved) return saved;
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    })());
  } else if (event.request.mode === "navigate" && url.pathname === "/mushaf") {
    event.respondWith((async () => {
      try { return await fetch(event.request); }
      catch {
        return (await caches.open("nurulquran-mushaf-shell-v1")).match("/mushaf")
          .then(saved => saved || new Response("Open the Mushaf online and download pages before reading offline.", {status:503, headers:{"Content-Type":"text/plain"}}));
      }
    })());
  }
});
