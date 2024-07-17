import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getFirestore,
  doc,
  addDoc,
  collection,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage();

// saving log in info to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

async function GetData(user) {
  try {
    const userId = user.uid;

    const userref = doc(firestore, "users", userId);
    const userdoc = await getDoc(userref);
    const userdata = userdoc.data();

    //  console.log(userdata);
    const Name = userdata.username;
    const email = userdata.email;
    const number = userdata.number;

    //  console.log(Name,email,number)

    writeData(Name, email, number);
  } catch (error) {
    console.error(error.code, error.message);
  }
}

async function writeData(Name, email, number) {
  var Data = document.createElement("div");
  Data.className = "info";
  Data.innerHTML = `
            <h1>User Data</h1>
            <span>Name: ${Name}</span>
            <br>
            <span>Email: ${email}</span>
            <br>
            <span>Phone Number: ${number}</span>
            <br>
            <button type="button" id="logout-button" onclick='logout()'>Logout</button>
       
    `;
  document.getElementById("user-data").appendChild(Data);
}

window.logout = async () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
};

//   document.getElementById('logout-button').addEventListener('click', () => {
//     logout();
//   });

onAuthStateChanged(auth, (user) => {
  if (user) {
    GetData(user);
  } else {
    console.error("NO user signed in");
  }
});
