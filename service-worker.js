/**
 * Hi Self — Service Worker
 * ─────────────────────────
 *
 * Purpose: enable the app to be installed as a PWA on iOS / Android home
 * screens and to work offline for the core crisis-resource + coping-tool
 * screens. Being installable is a prerequisite for wrapping this web app
 * as an Android package (via Bubblewrap / PWABuilder → Google Play) and
 * an iOS package (via Capacitor → Apple App Store).
 *
 * Strategy:
 *   • Network-first for HTML/JSON so users get fresh crisis-hotline info.
 *   • Cache-first for static assets (CSS, images, fonts, favicon) — these
 *     rarely change and this keeps the app instant on flaky mobile data.
 *   • Never intercept Firebase, Firestore, Google APIs, or Gemini calls.
 *     Those must ALWAYS go direct to the network so the SW doesn't
 *     accidentally serve stale auth state or corrupt Firestore writes.
 *
 * Safety-critical: if the SW ever throws or its cache lookup times out,
 * we fall back to the network. Users of a mental-health app must NEVER
 * see a "you're offline" screen when they're reaching out for help.
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `hi-self-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `hi-self-runtime-${CACHE_VERSION}`;

// Pre-cache the shell so the app opens even with zero signal. Keep this
// list tight — anything not here still works, it just needs one online
// visit before it's cached.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/privacy.html',
  '/terms.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo.png'
];

// Hosts we must NEVER intercept. Auth, Firestore live-sync, and Gemini
// calls need direct network access — no caching, no offline fallback.
const NEVER_CACHE_HOSTS = [
  'firebaseapp.com',
  'firebaseio.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'generativelanguage.googleapis.com',
  'googleapis.com',
  'gstatic.com'
];

// ─── Install: pre-cache the shell ────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => {
        // Don't fail install if one precache asset 404s — most of the app
        // will still work as long as index.html cached OK.
        console.warn('[SW] Precache warning:', err);
      })
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: clean up old caches ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((n) => n.startsWith('hi-self-') && n !== STATIC_CACHE && n !== RUNTIME_CACHE)
          .map((n) => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch: route requests through the right strategy ────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only intercept GETs — POSTs (Firestore writes, Gemini calls) must
  // always go straight to the network.
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); }
  catch (_) { return; }

  // NEVER touch auth/Firestore/AI hosts — let them hit the network raw.
  if (NEVER_CACHE_HOSTS.some((h) => url.hostname.endsWith(h))) return;

  // Only cache same-origin requests plus a few known CDN fonts.
  const isSameOrigin = url.origin === self.location.origin;
  const isFontCdn = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!isSameOrigin && !isFontCdn) return;

  // HTML / JSON / API-shaped requests → network-first (freshness matters
  // — crisis-hotline numbers must always be current). Fall back to cache
  // only if the network is down.
  const isHtmlLike = req.mode === 'navigate'
    || req.headers.get('accept')?.includes('text/html')
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('.json');

  if (isHtmlLike) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Everything else (images, CSS, fonts, SVG) → cache-first for speed.
  event.respondWith(cacheFirst(req));
});

// ─── Network-first ──────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Only cache successful, basic (same-origin) responses.
    if (response && response.status === 200 && response.type === 'basic') {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last-resort fallback for navigation requests: serve the shell so
    // the user sees the app (with cached crisis buttons) instead of the
    // browser's offline error page.
    if (request.mode === 'navigate') {
      const shell = await caches.match('/index.html');
      if (shell) return shell;
    }
    // If we truly have nothing, re-throw so the browser can display its
    // own error (better than serving a lie).
    throw _;
  }
}

// ─── Cache-first ────────────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    // For images we don't care about a hard fail — let the browser show
    // a broken-image icon rather than crashing the page.
    throw err;
  }
}
