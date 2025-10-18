// Replace these values with your Firebase project's config
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA12Ozg428CACbtmvXKgJPn9k-IgwrU1ig",
  authDomain: "loginsignup-6033e.firebaseapp.com",
  projectId: "loginsignup-6033e",
  storageBucket: "loginsignup-6033e.appspot.com",
  messagingSenderId: "165138240577",
  appId: "1:165138240577:web:49c344b6426bc6b8e062c0",
  measurementId: "G-0DZ1R1CRZ1"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)