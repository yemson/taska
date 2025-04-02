// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFswQZCwOsMW2dVE4MRO0538iKT-m0rCo",
  authDomain: "taska-5f841.firebaseapp.com",
  projectId: "taska-5f841",
  storageBucket: "taska-5f841.firebasestorage.app",
  messagingSenderId: "408634245831",
  appId: "1:408634245831:web:8332c1354f215243b0b4e2",
  measurementId: "G-ZY1KD3HF00",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
