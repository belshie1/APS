/*
   AGA Workshop PWA - Service Worker

   Strategy: "cache first, then network".

   - APP_SHELL: the core app files are pre-cached on install, which makes
     the app work fully offline (scan QR -> update status, even without
     a connection). When you release a new version, bump CACHE_VERSION.
   - CDN_LIBS: the QR / scanner libraries are cached on first use so the
     scanner keeps working offline as well.
   - Everything else (photos etc.) is only served from cache when offline.

   When CACHE_VERSION changes, old caches are deleted automatically.
*/

const CACHE_VERSION = "aga-v1";

/* Prefix shared by all caches this worker creates.
   Same as CACHE_VERSION's first part; bumping CACHE_VERSION
   (e.g. "aga-v2") causes the old version's cache to be
   deleted on activate. */
const CACHE_PREFIX = "aga-";

const APP_SHELL = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./email.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png",
];

/* Third-party libraries - cached after first successful fetch. */
const CDN_LIBS = [
    "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
    "https://unpkg.com/html5-qrcode",
];

/* ---- Shared helpers ------------------------------------------------- */

function appVersionCacheName() {
    return CACHE_VERSION;
}

/* Cache-name prefix used to find this worker's own caches when cleaning
   up old versions (defined here so it stays in sync with CACHE_VERSION). */
function appCachePrefix() {
    return CACHE_PREFIX;
}

/* ------------------------------------------------------------------ */

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(appVersionCacheName())
            .then((cache) => {
                /* Promise.all: one failing file aborts the whole addAll,
                   so log but do NOT reject - the rest of the shell still
                   works, and remaining files get re-cached on first use. */
                return cache.addAll(APP_SHELL).catch((err) => {
                    console.error("AGA SW: app shell pre-cache failed", err);
                });
            })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    /* Only delete OUR caches, and only the old versions. */
                    .filter((key) => key.startsWith(appCachePrefix()) && key !== appVersionCacheName())
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    /* Only handle GET requests (QR / form posts go straight to the server). */
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    /* Never intercept the browser's own requests (extension, etc.). */
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return;
    }

    /* Pre-cached app shell: cache first, fall back to network. */
    if (APP_SHELL.includes(url.pathname) || url.pathname.endsWith("index.html")) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request);
            })
        );
        return;
    }

    /* CDN libraries: cache on first successful fetch. */
    if (request.destination === "script" && url.href.startsWith("https://")) {
        const cacheName = appVersionCacheName();
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    return cached;
                }
                /* Network with cache fallback-only (no stale CDN files). */
                return (
                    fetch(request)
                        /* Cache successful CDN responses. */
                        .then((response) => {
                            if (response && response.ok) {
                                const copy = response.clone();
                                caches.open(cacheName).then((cache) => {
                                    cache.put(request, copy);
                                });
                            }
                            return response;
                        })
                        /* If offline, fall back to cache. */
                        .catch(() => {
                            return caches.match(request);
                        })
                );
            })
        );
        return;
    }

    /* Everything else (photos: blob/data URLs are handled by the browser
       directly): try network first, fall back to cache when offline. */
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});