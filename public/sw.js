// Service Worker para NIKA PWA
// Estrategia: Cache-first para assets estáticos, Network-first para páginas

const CACHE_NAME = "nika-cache-v1";

// Recursos que se cachean inmediatamente al instalar el SW
const PRECACHE_URLS = [
  "/",
  "/images/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Instalar: pre-cachear los recursos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar caches antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: estrategia mixta
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar peticiones del mismo origen (ignorar APIs externas)
  if (url.origin !== self.location.origin) return;

  // Para navegación (páginas HTML): Network-first → fallback a caché
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Para assets estáticos (imágenes, fuentes, JS, CSS): Cache-first
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }
});
