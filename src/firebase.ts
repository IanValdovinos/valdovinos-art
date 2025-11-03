import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT9zJ07pzHji9sJEtH2cjv7ZBLTpa7aXM",
  authDomain: "valdovinos-art.firebaseapp.com",
  projectId: "valdovinos-art",
  storageBucket: "valdovinos-art.firebasestorage.app",
  messagingSenderId: "948599996011",
  appId: "1:948599996011:web:94a034d547cd0b7c62bb2e",
  measurementId: "G-N7WMCPBZ9Y",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
