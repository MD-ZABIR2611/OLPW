// OLPW:firebase-config.js | script for firebase-config
/* Shared Firebase web config for OLPW. Load right after the Firebase SDK scripts.
   These values identify the project; they are not secrets. Data is protected by
   firestore.rules and by the API key's HTTP-referrer restriction in Google Cloud. */
window.OLPW_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCOP3TJxLgwUTIwDdxPauS7I-TqtARAKhc",
    authDomain: "olpw-2026.firebaseapp.com",
    projectId: "olpw-2026",
    storageBucket: "olpw-2026.firebasestorage.app",
    messagingSenderId: "495318481064",
    appId: "1:495318481064:web:d33d54abc6e4684196ea9d",
    measurementId: "G-MGFPZDC9ZL"
};
if (window.firebase && !firebase.apps.length) firebase.initializeApp(window.OLPW_FIREBASE_CONFIG);
