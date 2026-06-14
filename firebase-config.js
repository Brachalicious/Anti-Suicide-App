import { config } from './secrets.js';

export const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: "antisuicideapp.firebaseapp.com",
    databaseURL: "https://antisuicideapp-default-rtdb.firebaseio.com",
    projectId: "antisuicideapp",
    storageBucket: "antisuicideapp.firebasestorage.app",
    messagingSenderId: "149935134747",
    appId: "1:149935134747:web:8e128c56c0b4005e7d00be",
    measurementId: "G-GYX63Q43EJ"
};

export const GIPHY_API_KEY = config.GIPHY_API_KEY;
window.GIPHY_API_KEY = GIPHY_API_KEY;