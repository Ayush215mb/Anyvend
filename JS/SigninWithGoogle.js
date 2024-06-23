
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup , setPersistence, browserLocalPersistence} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

    
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });



 function SaveUserData(user){

        const username= user.displayName;
        const email = user.email;
        const profileURL= user.photoURL;
        console.log(username,email,profileURL)


         set(ref(database, 'users/' + user.uid), {
          username: username,
          email: email,
          number: ' ' ,
          ProfileURL:profileURL
        });
        
    
         setDoc(doc(firestore, 'users', user.uid), {
          username: username,
          email: email,
          number: ' ' ,
          ProfileURL:profileURL
        });

 }
      

  

      

const googleSignInBtn = document.getElementById('googleSignInBtn');
const provider = new GoogleAuthProvider();

googleSignInBtn.addEventListener('click', function(){

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        const username = user.Displayname
        SaveUserData(user);

        window.location.href= '../index.html';
       
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Google sign-in failed: ' + errorMessage);
      });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user is signed in: ",user.email);
      
    } else {
      const adminLink = document.getElementById('admin-link');
      console.log('No user is signed in');
      adminLink.style.display = 'none';
      
    }
  });
