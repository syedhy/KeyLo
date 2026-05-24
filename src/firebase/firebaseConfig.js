import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDfZfO6tixlz0jofofLBAYI22qOBl1RMpc",
  authDomain: "keylo-156c8.firebaseapp.com",
  projectId: "keylo-156c8",
  storageBucket: "keylo-156c8.firebasestorage.app",
  messagingSenderId: "511446416781",
  appId: "1:511446416781:web:f7014496a56c2073ed11c4",
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)