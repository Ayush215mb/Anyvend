import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

// Function to Sign up new users
const signup = async (name, phone, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed up:", user);

    // Save additional user information to Realtime Database
    await set(ref(database, "users/" + user.uid), {
      username: name,
      email: email,
      number: phone,
    });

    // Save additional user information to Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      username: name,
      email: email,
      number: phone,
    });

    console.log("User data saved to Realtime Database and Firestore");
    window.location.href = "../index.html";
  } catch (error) {
    alert(error.message);
    console.error("Error during sign up:", error.code, error.message);
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("SignUpForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    signup(name, phone, email, password);
  });
});
