import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Replace these with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key from Firebase
  authDomain: "personalized-fitness-coach.firebaseapp.com", // Your actual auth domain
  projectId: "personalized-fitness-coach", // Your actual project ID
  storageBucket: "personalized-fitness-coach.appspot.com", // Your actual storage bucket
  messagingSenderId: "123456789", // Your actual messaging sender ID
  appId: "1:123456789:web:abc123def456" // Your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
