// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "offline.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
    // eslint-disable-next-line no-console
    console.log("[PWA Builder] Install Event processing");

    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            // eslint-disable-next-line no-console
            console.log("[PWA Builder] Cached offline page during install");
            return cache.add(offlineFallbackPage);
        })
    );
});

// If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
    const offlinePageRequest = new Request(offlineFallbackPage);

    return fetch(offlineFallbackPage).then(function (response) {
        return caches.open(CACHE).then(function (cache) {
            // eslint-disable-next-line no-console
            console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
            return cache.put(offlinePageRequest, response);
        });
    });
});
