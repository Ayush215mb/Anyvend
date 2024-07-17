import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
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

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

//only these user uid will be allowed to access admin page
const allowedAdminUIDs = [
  "",
  "",
  "",
  "",
];

const checkAdminAccess = (user) => {
  const adminLink = document.getElementById("admin-link");
  if (allowedAdminUIDs.includes(user.uid)) {
    adminLink.style.display = "block"; 
  } else {
    adminLink.style.display = "none"; 
  }
};

const displayUserInfo = async (user) => {
  if (user) {
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const displayName = userData.username; 
      const signUpLink = document.getElementById("sign-up-link");
      signUpLink.textContent = `Hello, ${displayName}`;
      signUpLink.href = "./Profile.html";
    } else {
      console.log("No such document!");
    }
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    checkAdminAccess(user);
    displayUserInfo(user);
  } else {
    const adminLink = document.getElementById("admin-link");
    adminLink.style.display = "none"; 
  }
});
