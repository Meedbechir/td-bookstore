import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Les clés pour la configuration firebase


const firebaseConfig = {
    apiKey: "AIzaSyC7zqV3xG3hXjv3GXggbP_5wN2a_gDwoms",
    authDomain: "bootcamp-1-e6b28.firebaseapp.com",
    projectId: "bootcamp-1-e6b28",
    storageBucket: "bootcamp-1-e6b28.appspot.com",
    messagingSenderId: "1058328416959",
    appId: "1:1058328416959:web:737cad9d6b667bb651ec0a"
  };

  // Initialisation de config,auth et firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

// Exportation
export { auth, db };
