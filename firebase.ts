import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgMNqyqMFRRJ9JYDQPR9UzkjUuUdEGF6A",
  authDomain: "tifa-finance-analytics.firebaseapp.com",
  projectId: "tifa-finance-analytics",
  storageBucket: "tifa-finance-analytics.firebasestorage.app",
  messagingSenderId: "975056036746",
  appId: "1:975056036746:web:d7423e796bfad7ba1ede73",
  measurementId: "G-Q00V2QW1LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
