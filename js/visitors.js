import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  increment,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 1. Paste your Firebase Web App configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMFIUQU61EipJ_V5PyGJmPhGGiwhcTo9g",
  authDomain: "ai-avlokan-2k26.firebaseapp.com",
  projectId: "ai-avlokan-2k26",
  storageBucket: "ai-avlokan-2k26.firebasestorage.app",
  messagingSenderId: "658722000798",
  appId: "1:658722000798:web:37f5f75c79acf30829108f",
  measurementId: "G-2PM9Y9NL0T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to the stats document: analytics/pageStats
const statsDocRef = doc(db, "analytics", "pageStats");

async function recordMetrics() {
  // Check if user has a persistent identifier in localStorage
  const hasVisitedBefore = localStorage.getItem("site_visitor_logged");

  const updatePayload = {
    totalViews: increment(1) // Always increments on every page load
  };

  if (!hasVisitedBefore) {
    updatePayload.uniqueVisitors = increment(1); // Increment only once per device/browser
    localStorage.setItem("site_visitor_logged", "true");
  }

  // Atomically apply increments (creates document if it does not exist)
  await setDoc(statsDocRef, updatePayload, { merge: true });
}

// Listen to real-time changes and update the UI
onSnapshot(statsDocRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const totalViewsEl = document.getElementById("totalViews");
    const uniqueVisitorsEl = document.getElementById("uniqueVisitors");

    if (totalViewsEl) {
      totalViewsEl.textContent = (data.totalViews || 0).toLocaleString();
    }
    if (uniqueVisitorsEl) {
      uniqueVisitorsEl.textContent = (data.uniqueVisitors || 0).toLocaleString();
    }
  }
});

// Only run the tracker if we are on the index/home page
const pathname = window.location.pathname;
const isHomePage = pathname.endsWith('index.html') || pathname.endsWith('/') || !pathname.includes('.html');

if (isHomePage) {
  recordMetrics();
}