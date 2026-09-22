import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIR6ji3PIIhgkZFUYWr3kvqZvVrl9ZKgA",
  authDomain: "emplementing-fire-base-react.firebaseapp.com",
  projectId: "emplementing-fire-base-react",
  storageBucket: "emplementing-fire-base-react.firebasestorage.app",
  messagingSenderId: "371159525826",
  appId: "1:371159525826:web:f3250fa4d3f0bf5bcd8e5b",
  measurementId: "G-B4NYW6QYBN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);