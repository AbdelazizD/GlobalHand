// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSquTdKmejcao_3w5GHjFBq4jFcv1b-jA",
  authDomain: "global-hand-f49b7.firebaseapp.com",
  projectId: "global-hand-f49b7",
  storageBucket: "global-hand-f49b7.firebasestorage.app",
  messagingSenderId: "269242258543",
  appId: "1:269242258543:web:faea7490b85c3a2984299a",
  measurementId: "G-J39HM7JYJM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app)



export { db, auth, provider, collection, addDoc, getDocs, query, where, storage };
