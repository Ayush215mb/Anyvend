// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  remove,
  set,
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

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);

// saving log in info to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Function to load cart items
function loadCartItems(userId) {
  const cartRef = ref(database, `Cart/${userId}/products`);
  get(cartRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const cartItems = snapshot.val();
        const cartContainer = document.getElementById("cart-items");
        cartContainer.innerHTML = ""; 

        let totalPrice = 0;

        Object.keys(cartItems).forEach((productId) => {
          const product = cartItems[productId];
          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.productName}">
                    <h2>${product.productName}</h2>
                    <p>Price: ${product.price}</p>
                    <button id="decrease-${productId}" class="qtybtn" >-</button>
                    <span id="inpqty-${productId}">Quantity: ${product.quantity}</span>
                    <button id="increase-${productId}" class="qtybtn" >+</button>
                    <button class="remove-btn" data-product-id="${productId}">Remove</button>
                `;
          cartContainer.appendChild(cartItem);

          totalPrice += product.price * product.quantity;

          // Attach event listeners for quantity buttons
          document
            .getElementById(`decrease-${productId}`)
            .addEventListener("click", function () {
              updateQuantity(userId, productId, -1);
            });

          document
            .getElementById(`increase-${productId}`)
            .addEventListener("click", function () {
              updateQuantity(userId, productId, 1);
            });
        });

        document.getElementById("total-price").innerText =
          totalPrice.toFixed(2);

        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            removeProduct(userId, productId);
          });
        });
      } else {
        console.log("No cart items found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching cart items:", error);
    });
}

// Function to update quantity of product in cart
function updateQuantity(userId, productId, change) {
  const productRef = ref(database, `Cart/${userId}/products/${productId}`);
  get(productRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const product = snapshot.val();
        let newQuantity = product.quantity + change;

        // Fetch max quantity from Firestore
        getDoc(doc(firestore, "products", productId))
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const maxQuantity = docSnapshot.data().quantity;

              if (newQuantity > 0 && newQuantity <= maxQuantity) {
                set(productRef, {
                  ...product,
                  quantity: newQuantity,
                })
                  .then(() => {
                    
                    loadCartItems(userId); 
                  })
                  .catch((error) => {
                    alert("Error updating quantity:", error);
                    console.error("Error updating quantity:", error);
                  });
              } else {
                alert("you have reached the maximum quantity limit");
               
              }
            } else {
              console.log(`Product ${productId} not found in Firestore.`);
            }
          })
          .catch((error) => {
            alert("Error fetching product:", error);
            console.error("Error fetching product from Firestore:", error);
          });
      } else {
        alert("Product ${productId} not found in cart");
        console.log(`Product ${productId} not found in cart.`);
      }
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
    });
}

// Function to remove product from cart
function removeProduct(userId, productId) {
  const productRef = ref(database, `Cart/${userId}/products/${productId}`);
  remove(productRef)
    .then(() => {
      console.log(`Product ${productId} removed successfully.`);
      loadCartItems(userId); 
    })
    .catch((error) => {
      console.error("Error removing product:", error);
    });
}

// Check authentication state and load cart items
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadCartItems(user.uid);
  } else {
    alert("You must be logged in to view your cart.");
    window.location.href = "./LogIn.html";
  }
});
