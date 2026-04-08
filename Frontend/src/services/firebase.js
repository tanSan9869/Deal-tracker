// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeNkw9cf9PuuruMymBy9pazaqCAeiz0qU",
  authDomain: "database-5d8b3.firebaseapp.com",
  projectId: "database-5d8b3",
  storageBucket: "database-5d8b3.firebasestorage.app",
  messagingSenderId: "646412418328",
  appId: "1:646412418328:web:8bd7e42a745480128bf26d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);