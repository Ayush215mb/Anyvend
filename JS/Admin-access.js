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

// app's Firebase configuration
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

//only these user uid will be allowed to access admin page
const allowedAdminUIDs = [
  "AF6WNcaxMpfKFbyK9ms10j6wvm33",
  "nuPSOGc5Lbaq4e1whpP9F0Pjklu2",
  "RBSJiA7JiPN0ec3V7eK2H4C0NH83",
  "BDFdfVHjeDgvyDH08nCehJtT4IC2",
];

const checkAdminAccess = (user) => {
  const adminLink = document.getElementById("admin-link");
  if (allowedAdminUIDs.includes(user.uid)) {
    adminLink.style.display = "block"; // Show admin link
  } else {
    adminLink.style.display = "none"; // Hide admin link
  }
};

const displayUserInfo = async (user) => {
  if (user) {
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const displayName = userData.username; // Assuming 'name' is the field in Firestore
      const signUpLink = document.getElementById("sign-up-link");
      signUpLink.textContent = `Hello, ${displayName}`;
      signUpLink.href = "./Profile.html"; // Optionally, you can remove the link if it's not needed anymore
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
    adminLink.style.display = "none"; // Hide admin link if no user is signed in
  }
});
