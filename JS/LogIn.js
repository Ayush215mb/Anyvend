import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


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



    setPersistence(auth, browserLocalPersistence)
      .then(() => {
      
        console.log('Persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });



    const signin = async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in:', userCredential.user);
          window.location.href = '../index.html';

        } catch (error) {
          alert(error.message);
          console.error('Error during sign in:', error.code, error.message);
        }
      };



      const displayUserInfo = async (user) => {
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData.username;
            const signUpLink = document.getElementById('sign-up-link');
            signUpLink.textContent = `Hello, ${displayName}`;
            signUpLink.href = "./HTML/Profile.html"; 
          } else {
            console.log('No such document!');
          }
        }
      };


   
        const allowedAdminUIDs = ['', '','']; 



      const checkAdminAccess = (user) => {
        const adminLink = document.getElementById('admin-link');
        if (allowedAdminUIDs.includes(user.uid)) {
          adminLink.style.display = 'block'; 
        } else {
          adminLink.style.display = 'none'; 
        }
      };
    

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('LogInForm').addEventListener('submit', (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      signin( email, password);
    });
  });


   onAuthStateChanged(auth, (user) => {
    if (user) {
      checkAdminAccess(user);
      displayUserInfo(user);
      
    } else {
      const adminLink = document.getElementById('admin-link');
      console.log('No user is signed in');
      adminLink.style.display = 'none';
      
    }
  });
