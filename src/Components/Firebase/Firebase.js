import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyASJWvTlQuTeBFaE76xT-tN9sxEuDnZ0EM",
  authDomain: "react-auth-f2819.firebaseapp.com",
  projectId: "react-auth-f2819",
  storageBucket: "react-auth-f2819.firebasestorage.app",
  messagingSenderId: "329574140091",
  appId: "1:329574140091:web:c819121afbafca5053019e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(); 
export { auth,db };
