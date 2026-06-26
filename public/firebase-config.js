// Public Firebase web configuration (safe to commit).
//
// Why this file exists:
//   index.html does `import { firebaseConfig } from './firebase-config.js'`.
//   When the site is deployed (Netlify/Firebase Hosting) the document is served
//   from `public/`, so THIS file is what the browser actually loads — not the
//   root-level firebase-config.js. Previously this file `import`ed a
//   git-ignored `./secrets.js`, which 404'd in production and crashed the
//   entire `<script type="module">` block, silently disabling the Sign-in
//   button. We now inline the public web config so the module always loads.
//
// Security note:
//   Firebase Web API keys are *publishable* identifiers, not secrets. Access
//   control is enforced by Firebase Auth + Firestore/RTDB security rules.
//   See: https://firebase.google.com/docs/projects/api-keys

// Optional override: hosting environments may inject `window.__PUBLIC_CONFIG__`
// (e.g. a different project for staging) BEFORE this module loads.
const override = (typeof window !== 'undefined' && window.__PUBLIC_CONFIG__) || {};

export const firebaseConfig = {
    apiKey:            override.apiKey            || "AIzaSyBbVt6AmWRi61VHZVF12ernzt8nJR0uaDM",
    authDomain:        override.authDomain        || "antisuicideapp.firebaseapp.com",
    databaseURL:       override.databaseURL       || "https://antisuicideapp-default-rtdb.firebaseio.com",
    projectId:         override.projectId         || "antisuicideapp",
    storageBucket:     override.storageBucket     || "antisuicideapp.firebasestorage.app",
    messagingSenderId: override.messagingSenderId || "149935134747",
    appId:             override.appId             || "1:149935134747:web:8fa44fcb4205d9e47d00be",
    measurementId:     override.measurementId     || "G-1DZLJNRS3D",
};

// GIPHY key is also a public client key. Override via window.__PUBLIC_CONFIG__.giphyKey if desired.
export const GIPHY_API_KEY = override.giphyKey || "wPRdvFvMfriKnCOK9TAjQpKZofRBeRjt";

if (typeof window !== 'undefined') {
    window.GIPHY_API_KEY = GIPHY_API_KEY;
    // Expose the resolved config so devs can sanity-check it in DevTools.
    window.__FIREBASE_CONFIG__ = firebaseConfig;
    // Loud breadcrumb — if you don't see this in the console, the module never
    // executed (parse error, 404, MIME-type mismatch, CSP block, etc.).
    console.info('[firebase-config] loaded', { projectId: firebaseConfig.projectId });
}
