
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAWwgPVB4DvIRyLYU4vrL2MMotRR1O49mE",
    authDomain: "avt1-9a0bb.firebaseapp.com",
    databaseURL: "https://avt1-9a0bb-default-rtdb.firebaseio.com",
    projectId: "avt1-9a0bb",
    storageBucket: "avt1-9a0bb.appspot.com",
    messagingSenderId: "43172678025",
    appId: "1:43172678025:web:181a51f9c817ca143af958",
    measurementId: "G-GPWBHF1JFG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication, Database, and Firestore
  const auth = getAuth(app);
  const database = getDatabase(app);
  const firestore = getFirestore(app);

  // Sign up new users
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
    } catch (error) {
      console.error('Error during sign up:', error.code, error.message);
    }
  };

  // Sign in existing users
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
    } catch (error) {
      console.error('Error during sign in:', error.code, error.message);
    }
  };

  // Write data to Realtime Database
  const writeUserData = async (userId, name, email, imageUrl) => {
    try {
      await set(ref(database, 'users/' + userId), {
        username: name,
        email: email,
        profile_picture: imageUrl
      });
      console.log('User data written to Realtime Database');
    } catch (error) {
      console.error('Error writing user data to Realtime Database:', error);
    }
  };

  // Read data from Realtime Database
  const readUserData = async (userId) => {
    try {
      const snapshot = await get(ref(database, 'users/' + userId));
      if (snapshot.exists()) {
        console.log('User data:', snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading user data from Realtime Database:', error);
    }
  };

  // Add user to Firestore
  const addUser = async (userId, name, email) => {
    try {
      await setDoc(doc(firestore, 'users', userId), {
        username: name,
        email: email
      });
      console.log('User added to Firestore');
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
    }
  };

  // Get user data from Firestore
  const getUser = async (userId) => {
    try {
      const docSnap = await getDoc(doc(firestore, 'users', userId));
      if (docSnap.exists()) {
        console.log('User data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  };

  // Example usage
  // signup('user@example.com', 'password123');
  // signin('user@example.com', 'password123');
  // writeUserData('userId123', 'John Doe', 'johndoe@example.com', 'http://example.com/johndoe.jpg');
  // readUserData('userId123');
  // addUser('userId123', 'John Doe', 'johndoe@example.com');
  // getUser('userId123');
// </script>

