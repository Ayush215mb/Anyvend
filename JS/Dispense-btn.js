// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  remove,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
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
const firestore = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);

// onlineStatus.js

async function checkOnlineStatus() {
  const onlineRef = ref(database, "Online");

  const snapshot = await get(onlineRef);

  return snapshot.val();
}

// productService.js

async function getProductData(productId) {
  const productDocRef = doc(firestore, "products", productId);
  const productDoc = await getDoc(productDocRef);
  if (productDoc.exists()) {
    return productDoc.data();
  } else {
    throw new Error(`Product ${productId} does not exist in Firestore`);
  }
}

async function checkProcess() {
  const Process = ref(database, "Processing");
  const processing = await get(Process);

  const processval = processing.val();
  // console.log(processval);

  if (processval != true) {
    const posref = ref(database, "Position");
    const depref = ref(database, "depth");
    await set(posref, null);
    await set(depref, null);
  }
}

export async function updateRealtimeDatabase(database, productsArray, userId) {
  try {
    const updates = {};
    productsArray.forEach((product) => {
      updates[`Position/${userId}/${product.productId}`] = product.position;
      updates[`depth/${userId}/${product.productId}`] = product.depth;
      // updates[`Orders/${userId}/${product.productId}/position`] = product.position;
      // updates[`Orders/${userId}/${product.productId}/depth`] = product.depth;
    });

    // console.log(updates);

    const updatesRef = ref(database);
    await update(updatesRef, updates);

    const Processing = ref(database, "Processing");
    await set(Processing, "true");

    //to delete the data of position and depth

    checkProcess();
  } catch (error) {
    console.error("Error updating Realtime Database:", error);
  }
}

async function getCartItems(userId) {
  const cartRef = ref(database, `Cart/${userId}/products`);
  const snapshot = await get(cartRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}

// main.js

document
  .getElementById("dispense-btn")
  .addEventListener("click", async function () {
    try {
      const user = auth.currentUser;
      const userId = user.uid; // Replace this with the actual user ID

      const cartItems = await getCartItems(userId);

      if (!cartItems) {
        alert("No items in the cart");
        console.error("No items in the cart");
        return;
      }

      const onlineStatus = await checkOnlineStatus();

      if (onlineStatus === true) {
        const productsArray = [];

        for (const productId in cartItems) {
          const productData = await getProductData(productId);

          productsArray.push({
            productId: productId,
            position: productData.position,
            depth: productData.depth,
          });

          await updateRealtimeDatabase(database, productsArray, userId);
        }
        alert("order successful!");
      } else {
        console.error("System is offline");
        alert("System is offline");
      }
    } catch (error) {
      console.error("Error updating the position and depth:", error);
    }
  });
