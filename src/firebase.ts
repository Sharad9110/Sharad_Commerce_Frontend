import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxfjdNR8Cd7BbIeD0-y9LjbE_-XHOSjqk",
  authDomain: "e-commerce-application-a6963.firebaseapp.com",
  projectId: "e-commerce-application-a6963",
  storageBucket: "e-commerce-application-a6963.appspot.com",
  messagingSenderId: "1049413059510",
  appId: "1:1049413059510:web:57e1ea0c36211f7090f717",
  measurementId: "G-JPTWVZLBK5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
