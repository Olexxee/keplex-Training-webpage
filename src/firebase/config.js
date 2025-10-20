import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATq8JBimrIt4b8pr_IoMbvdb1Dg_NSuiQ",
  authDomain: "keplex-training.firebaseapp.com",
  projectId: "keplex-training",
  storageBucket: "keplex-training.appspot.com",
  messagingSenderId: "765296464013",
  appId: "1:765296464013:web:19139818b4928431e6d2c4",
  measurementId: "G-Q5J8RV7GKK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
