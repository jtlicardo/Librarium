import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDmpWucdj9MuwM5mvjA5_TKMCFlsUXUGpg",
  authDomain: "librarium-11060.firebaseapp.com",
  projectId: "librarium-11060",
  storageBucket: "librarium-11060.appspot.com",
  messagingSenderId: "599810153981",
  appId: "1:599810153981:web:3f37c90da71ecab6580d94",
}

const app = initializeApp(firebaseConfig)

export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
}
