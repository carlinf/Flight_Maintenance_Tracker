import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGBWxrUurGVk1xYhtujkaBznenc9oT96E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aircraft-maintenance-bc999.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aircraft-maintenance-bc999",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aircraft-maintenance-bc999.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "68672114500",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:68672114500:web:8a85c00f4a6b5be1901111",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BP5YWGYKLC"
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

// Initialize Analytics (only in browser environment)
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
    console.log('Firebase Analytics initialized')
  } catch (error) {
    console.warn('Analytics initialization failed (this is okay):', error)
  }
}

export { analytics }
export default app


