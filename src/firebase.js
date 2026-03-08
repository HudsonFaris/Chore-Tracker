import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//config, railway .env variables will be used for deployment.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "choretracker-8e636.firebaseapp.com",
  projectId: "choretracker-8e636",
  storageBucket: "choretracker-8e636.firebasestorage.app",
  messagingSenderId: "1078067222453",
  appId: "1:1078067222453:web:b14522dfc862e7c45fabfc",
  measurementId: "G-R32G3T7ZHR"
};

//initialize firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);