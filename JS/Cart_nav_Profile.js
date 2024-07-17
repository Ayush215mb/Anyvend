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


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

// saving log in info to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

//this funtion check if the user is signed in then it shows the user-name instead of the login/signup option
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

//only these user uid will be allowed to access admin page
const allowedAdminUIDs = [
  "",
  "",
  "",
  "",
];

//this function only allows selected people to access the admin section
const checkAdminAccess = (user) => {
  const adminLink = document.getElementById("admin-link");
  if (allowedAdminUIDs.includes(user.uid)) {
    adminLink.style.display = "block";
  } else {
    adminLink.style.display = "none"; 
  }
};


onAuthStateChanged(auth, (user) => {
  if (user) {
    checkAdminAccess(user);
    displayUserInfo(user);
  } else {
    const adminLink = document.getElementById("admin-link");
    console.log("No user is signed in");
    adminLink.style.display = "none";
  }
});
