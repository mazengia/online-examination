// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDUZ2t6CapfPozY0frEDaynJZtQ2UR6Ow",
  authDomain: "online-examination-9f654.firebaseapp.com",
  projectId: "online-examination-9f654",
  storageBucket: "online-examination-9f654.firebasestorage.app",
  messagingSenderId: "798155898612",
  appId: "1:798155898612:web:cd01e7e1ec017c8b35e8a1",
  measurementId: "G-8HNL6EWQMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
