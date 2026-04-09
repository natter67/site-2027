

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAswSl10Bv7Sq3LnFZP_nfagQJ_qdfAads",
  authDomain: "eoh-2026-backend.firebaseapp.com",
  projectId: "eoh-2026-backend",
  storageBucket: "eoh-2026-backend.firebasestorage.app",
  messagingSenderId: "572164577617",
  appId: "1:572164577617:web:f6d71a17342d8fc0415b70",
  measurementId: "G-SZXT94GRL4"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  firestore,
  auth,
  provider,
  signInWithPopup,
  signOut,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
};