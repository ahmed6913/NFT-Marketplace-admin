// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace this config with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA1rJ4ughPooXgsqHAOu2fiSYJpaCAQziI",
  authDomain: "nft-marketplace-admin-5e6c0.firebaseapp.com",
  projectId: "nft-marketplace-admin-5e6c0",
  storageBucket: "nft-marketplace-admin-5e6c0.firebasestorage.app",
  messagingSenderId: "829296654888",
  appId: "1:829296654888:web:7c7facdbffe1175321131d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
