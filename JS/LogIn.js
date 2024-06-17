import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


  // app's Firebase configuration
  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication
    const auth = getAuth(app);
    const database = getDatabase(app);
    const firestore = getFirestore(app);


    const signin = async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in:', userCredential.user);
        } catch (error) {
          console.error('Error during sign in:', error.code, error.message);
        }
      };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('LogInForm').addEventListener('submit', (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      console.log(email, password,"Signed in successfully"); // Ensure the values are correctly captured
      signin( email, password);
    });
  });
