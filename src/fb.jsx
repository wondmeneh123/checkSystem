// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMIdtjkfvjBDdYCOoov7Ev5NAcD-Hrz4Q",
  authDomain: "eduquest-cb4ef.firebaseapp.com",
  databaseURL: "https://eduquest-cb4ef-default-rtdb.firebaseio.com",
  projectId: "eduquest-cb4ef",
  storageBucket: "eduquest-cb4ef.firebasestorage.app",
  messagingSenderId: "948188018763",
  appId: "1:948188018763:web:597df852a66a8fa8a275ce",
  measurementId: "G-BL09DBVHR6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
