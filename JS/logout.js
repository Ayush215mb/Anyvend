import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword,  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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


    const app = initializeApp(firebaseConfig);


    const auth = getAuth(app);
    const database = getDatabase(app);
    const firestore = getFirestore(app);

    const logout = () => {
        signOut(auth).then(() => {
 
          console.log('User signed out');
        }).catch((error) => {
          
          console.error('Error signing out:', error);
        });
      };


      document.getElementById('logout-button').addEventListener('click', () => {
        logout();
      });
