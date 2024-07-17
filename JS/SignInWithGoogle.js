// import { getAuth, signInWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWwgPVB4DvIRyLYU4vrL2MMotRR1O49mE",
  authDomain: "avt1-9a0bb.firebaseapp.com",
  databaseURL: "https://avt1-9a0bb-default-rtdb.firebaseio.com",
  projectId: "avt1-9a0bb",
  storageBucket: "avt1-9a0bb.appspot.com",
  messagingSenderId: "43172678025",
  appId: "1:43172678025:web:181a51f9c817ca143af958",
  measurementId: "G-GPWBHF1JFG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

function SaveUserData(user) {
  const username = user.displayName;
  const email = user.email;
  const profileURL = user.photoURL;
  console.log(username, email, profileURL);

  // Save additional user information to Realtime Database
  set(ref(database, "users/" + user.uid), {
    username: username,
    email: email,
    number: " ",
    ProfileURL: profileURL,
  });

  // Save additional user information to Firestore
  setDoc(doc(firestore, "users", user.uid), {
    username: username,
    email: email,
    number: " ",
    ProfileURL: profileURL,
  });
}

const googleSignInBtn = document.getElementById("googleSignInBtn");
const provider = new GoogleAuthProvider();

googleSignInBtn.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      const username = user.Displayname;
      SaveUserData(user);

      window.location.href = "../index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Google sign-in failed: " + errorMessage);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user is signed in: ", user.email);
  } else {
    const adminLink = document.getElementById("admin-link");
    console.log("No user is signed in");
    adminLink.style.display = "none";
  }
});
