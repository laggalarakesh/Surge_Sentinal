import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpcMptKx2ua-N3fR7w_UBbJZDEdT1z_UE",
  authDomain: "surgesentinel.firebaseapp.com",
  databaseURL: "https://surgesentinel-default-rtdb.firebaseio.com",
  projectId: "surgesentinel",
  storageBucket: "surgesentinel.firebasestorage.app",
  messagingSenderId: "610938742983",
  appId: "1:610938742983:web:20115c99000f05953f36e2",
  measurementId: "G-3M0VBR98PS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Cast firebaseAuth to any to bypass "Module has no exported member" errors
const authModule = firebaseAuth as any;

// Export Auth
export const auth = authModule.getAuth(app);
export const googleProvider = new authModule.GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = () => authModule.signInWithPopup(auth, googleProvider);
export const logoutUser = () => authModule.signOut(auth);

// Export Firestore
export const db = getFirestore(app);
