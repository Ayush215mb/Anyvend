// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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

// saving log in info to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Function to handle adding product to cart
function addToCart(userId, productId, productData) {
  set(ref(database, `Cart/${userId}/products/${productId}`), productData)
    .then(() => {
      // console.log('Product added to cart successfully:', productData);
      // Update the button to show it's already added
      document.getElementById(`cartbtn-${productId}`).disabled = true;
      document.getElementById(`cartbtn-${productId}`).innerText =
        "Already in Cart";
    })
    .catch((error) => {
      console.error("Error adding product to cart:", error);
    });
}

// Function to check if product is already in cart
function checkProductInCart(userId, productId, callback) {
  const productRef = ref(database, `Cart/${userId}/products/${productId}`);
  get(productRef)
    .then((snapshot) => {
      callback(snapshot.exists());
    })
    .catch((error) => {
      console.error("Error checking product in cart:", error);
      callback(false);
    });
}

// Load products from Firestore
function loadProducts() {
  // Clear the current product listings
  const productContainer = document.getElementById("products");
  productContainer.innerHTML = "";

  getDocs(collection(firestore, "products")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const searchQuery = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();
      var data = doc.data();
      var productId = doc.id;

      var imageurl = data.imageurl;
      var PhotoURL = data.PhotoURL;
      var RealImageLink =
        imageurl !== "" ? imageurl : PhotoURL !== "" ? PhotoURL : "";
      var maxQuantity = data.quantity;

      if (data.productname.toLowerCase().includes(searchQuery)) {
        var product = document.createElement("div");
        product.className = "card";
        product.innerHTML = `
                    <img src="${RealImageLink}" alt="${data.productname}">
                    <h2>${data.productname}</h2>
                    <button id="decrease-${productId}">-</button>
                    <span id="inpqty-${productId}">Qty: 1</span>
                    <button id="increase-${productId}">+</button>
                    <p>Price: ${data.price}</p>
                    <button id="cartbtn-${productId}" class="cartbtn">Add to Cart</button>
                    <button id="buybtn-${productId}" class="buybtn">Buy Now</button>
                `;
        document.getElementById("products").appendChild(product);

        // Add event listeners for quantity buttons
        document
          .getElementById(`decrease-${productId}`)
          .addEventListener("click", function () {
            let qtySpan = document.getElementById(`inpqty-${productId}`);
            let currentQty = parseInt(qtySpan.innerText.replace("Qty: ", ""));
            if (currentQty > 1) {
              currentQty--;
              qtySpan.innerText = `Qty: ${currentQty}`;
            }
          });

        document
          .getElementById(`increase-${productId}`)
          .addEventListener("click", function () {
            let qtySpan = document.getElementById(`inpqty-${productId}`);
            let currentQty = parseInt(qtySpan.innerText.replace("Qty: ", ""));
            if (currentQty < maxQuantity) {
              currentQty++;
              qtySpan.innerText = `Qty: ${currentQty}`;
            }
          });

        // Add event listener for "Add to Cart" button
        document
          .getElementById(`cartbtn-${productId}`)
          .addEventListener("click", function () {
            // Check if the user is logged in
            const user = auth.currentUser;
            if (user) {
              const userId = user.uid;
              const productData = {
                productId: productId,
                productName: data.productname,
                price: data.price,
                quantity: parseInt(
                  document
                    .getElementById(`inpqty-${productId}`)
                    .innerText.replace("Qty: ", "")
                ),
                imageUrl: RealImageLink,
              };

              // Call function to add product data to Realtime Database
              addToCart(userId, productId, productData);
            } else {
              alert("You must be logged in to add items to the cart.");
            }
          });

        // Check if product is already in cart
        const user = auth.currentUser;
        if (user) {
          checkProductInCart(user.uid, productId, (exists) => {
            if (exists) {
              document.getElementById(`cartbtn-${productId}`).disabled = true;
              document.getElementById(`cartbtn-${productId}`).innerText =
                "Already in Cart";
            }
          });
        }
      }
    });
  });
}

document.getElementById("searchButton").addEventListener("click", function (e) {
  e.preventDefault();
  loadProducts();
});

// // Check authentication state
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log(`User ${user.uid} is signed in.`);
//     } else {
//         console.log("No user is signed in.");
//     }
// });
