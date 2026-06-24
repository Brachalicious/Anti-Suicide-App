// Public firebase-config loader for static hosting.
// This file intentionally avoids importing any local secrets file so it can be safely committed.
// To provide real values in production, set a global `window.__PUBLIC_CONFIG__ = { ... }` before this script runs
// (for example, by injecting it from your hosting provider or server-side template).

const defaultConfig = {
  apiKey: null,
  authDomain: null,
  databaseURL: null,
  projectId: null,
  storageBucket: null,
  messagingSenderId: null,
  appId: null,
  measurementId: null,
};

const publicConfig = (typeof window !== 'undefined' && window.__PUBLIC_CONFIG__) ? window.__PUBLIC_CONFIG__ : defaultConfig;

export const firebaseConfig = {
  apiKey: publicConfig.apiKey || defaultConfig.apiKey,
  authDomain: publicConfig.authDomain || defaultConfig.authDomain,
  databaseURL: publicConfig.databaseURL || defaultConfig.databaseURL,
  projectId: publicConfig.projectId || defaultConfig.projectId,
  storageBucket: publicConfig.storageBucket || defaultConfig.storageBucket,
  messagingSenderId: publicConfig.messagingSenderId || defaultConfig.messagingSenderId,
  appId: publicConfig.appId || defaultConfig.appId,
  measurementId: publicConfig.measurementId || defaultConfig.measurementId,
};

export const GIPHY_API_KEY = (typeof window !== 'undefined' && window.__PUBLIC_CONFIG__ && window.__PUBLIC_CONFIG__.giphyKey) || null;
window.GIPHY_API_KEY = GIPHY_API_KEY;

if (!firebaseConfig.apiKey) {
  console.warn('public/firebase-config.js: Firebase config is missing. Sign-in with Google will not work until you provide Firebase credentials via window.__PUBLIC_CONFIG__ or a server-injected script.');
}
import { config } from './secrets.js';

export const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: "antisuicideapp.firebaseapp.com",
    databaseURL: "https://antisuicideapp-default-rtdb.firebaseio.com",
    projectId: "antisuicideapp",
    storageBucket: "antisuicideapp.firebasestorage.app",
    messagingSenderId: "149935134747",
    appId: "1:149935134747:web:8fa44fcb4205d9e47d00be",
    measurementId: "G-1DZLJNRS3D"
};

export const GIPHY_API_KEY = config.GIPHY_API_KEY;
window.GIPHY_API_KEY = GIPHY_API_KEY;
