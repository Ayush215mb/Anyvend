import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword,  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


  // app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAWwgPVB4DvIRyLYU4vrL2MMotRR1O49mE",
    authDomain: "avt1-9a0bb.firebaseapp.com",
    databaseURL: "https://avt1-9a0bb-default-rtdb.firebaseio.com",
    projectId: "avt1-9a0bb",
    storageBucket: "avt1-9a0bb.appspot.com",
    messagingSenderId: "43172678025",
    appId: "1:43172678025:web:181a51f9c817ca143af958",
    measurementId: "G-GPWBHF1JFG"
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication
    const auth = getAuth(app);
    const database = getDatabase(app);
    const firestore = getFirestore(app);

    const logout = () => {
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log('User signed out');
          window.location.href = '../index.html';
        }).catch((error) => {
          // An error happened.
          console.error('Error signing out:', error);
        });
      };


      document.getElementById('logout-button').addEventListener('click', () => {
        logout();
      });