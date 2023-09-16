// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkXyiJAN0KlkFKidNxxSmf7UAwpbjU-6U",
  authDomain: "chat-app-a1f0b.firebaseapp.com",
  projectId: "chat-app-a1f0b",
  storageBucket: "chat-app-a1f0b.appspot.com",
  messagingSenderId: "508770814035",
  appId: "1:508770814035:web:5c05b1a0acf6612231dea6"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app);
const storage = getStorage(app);
export { auth ,db,storage};