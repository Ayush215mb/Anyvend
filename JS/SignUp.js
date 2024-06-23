import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
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



    const signup = async (name,phone, email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed up:', user);
    

        await set(ref(database, 'users/' + user.uid), {
          username: name,
          email: email,
          number:phone,
        });
    

        await setDoc(doc(firestore, 'users', user.uid), {
          username: name,
          email: email,
          number:phone,
        });
    
        console.log('User data saved to Realtime Database and Firestore');
        window.location.href = '../index.html';
      } catch (error) {
        alert(error.message);
        console.error('Error during sign up:', error.code, error.message);
       
      }
    };


  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('SignUpForm').addEventListener('submit', (event) => {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
  
      signup(name,phone, email, password);
    });
  });
