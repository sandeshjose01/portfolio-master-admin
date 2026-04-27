import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCChQzdSuNW8EzBXtRxZyvwh4WOjj67FCs",
    authDomain: "my-portfolio-96764.firebaseapp.com",
    projectId: "my-portfolio-96764",
    storageBucket: "my-portfolio-96764.firebasestorage.app",
    messagingSenderId: "1018154031940",
    appId: "1:1018154031940:web:937edbfb442a6dfc041511"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfoly0uwe/auto/upload";
export const CLOUDINARY_PRESET = "dfoly0uwe";
