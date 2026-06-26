// Firebase web configuration.
//
// NOTE: The Firebase Web API key is safe to expose in client-side code.
// Per Firebase docs (https://firebase.google.com/docs/projects/api-keys),
// the apiKey identifies the project on Google's servers; access control is
// enforced by Firestore/Realtime Database security rules and Firebase Auth.
// We inline it here so the module loads correctly in production
// (previously `./secrets.js` was git-ignored, which broke the import in
// deployed builds and silently disabled the sign-in button).

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
    // Expose the resolved config for easy debugging in DevTools.
    window.__FIREBASE_CONFIG__ = firebaseConfig;
}