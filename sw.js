// Guarda la app (y las fuentes) para abrirla sin cobertura. Los datos van en el almacenamiento local.
const C = "hyrox-app-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const fuentes = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (u.origin !== location.origin && !fuentes) return;      // API de GitHub: siempre a red
  // red primero (para coger versiones nuevas); sin cobertura, la copia guardada
  e.respondWith(fetch(e.request).then(r => { if (r.ok || r.type === "opaque"){ const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request)));
});
