import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
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

// Function to save product data to Firestore and Realtime Database
const saveData = async (user) => {
  const imageFile = document.getElementById("imageUpload").files[0];
  let PhotoURL = "";

  try {
    const productname = document.getElementById("name").value;
    const price = parseInt(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const length = parseInt(document.getElementById("length").value);
    const breadth = parseInt(document.getElementById("breadth").value);
    var depth = parseInt(document.getElementById("depth").value);
    // const position = parseInt(document.getElementById("position").value);
    const imageurl = document.getElementById("imageurl").value;

    //to make sure that depth is always is even
    if (depth % 2 != 0) {
      var depth = depth + 1;
    }

    if (length < 17 && breadth < 23 && depth < 9) {
      if (imageFile) {
        const storageReference = storageRef(
          storage,
          "product_img/" + imageFile.name
        );
        const snapshot = await uploadBytes(storageReference, imageFile);
        PhotoURL = await getDownloadURL(snapshot.ref);
      }

      //add each product depth to the belt length

      const totalLength = depth * quantity;

      const BeltLength = dbRef(database, "Belt");
      const Beltref = await get(BeltLength);

      var BELTLENGTH = Beltref.val(); //we get the value of belt
      var prevBeltLength = BELTLENGTH; //we store the prev value inside another variable

      BELTLENGTH = BELTLENGTH + totalLength; //we add the prev variable to the total length(depth of each product * quantity of product)

      await set(BeltLength, BELTLENGTH);

      // var position = `${prevBeltLength} - ${BELTLENGTH} `;

      // Save to Firestore
      await setDoc(doc(firestore, "products", productname), {
        productname: productname,
        price: price,
        quantity: quantity,
        length: length,
        breadth: breadth,
        depth: depth,
        startPost: prevBeltLength,
        endpost: BELTLENGTH,
        PhotoURL: PhotoURL,
        imageurl: imageurl,
      });

      alert("Data saved successfully to Firestore");

      // Save to Realtime Database
      // const ProductRef = push(dbRef(database, 'products/' + user.uid));
      const ProductRef = dbRef(
        database,
        "products/" + user.uid + "/" + productname
      );
      await set(ProductRef, {
        productname: productname,
        price: price,
        quantity: quantity,
        length: length,
        breadth: breadth,
        depth: depth,
        startPost: prevBeltLength,
        endpost: BELTLENGTH,
        PhotoURL: PhotoURL,
        imageurl: imageurl,
      });

      alert("Data saved successfully to Realtime Database");

      //  subtracting length from total length

      const len = dbRef(database, "Available-length");
      const lenref = await get(len);

      var LENGTH = lenref.val(); //total length from realtime database

      // LENGTH = LENGTH - length;

      // await set(len, LENGTH);

      fetchAndDisplayProducts();

      // Clear the input fields
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("quantity").value = "";
      document.getElementById("length").value = "";
      document.getElementById("breadth").value = "";
      document.getElementById("depth").value = "";
      // document.getElementById("position").value = "";
      document.getElementById("imageurl").value = "";
      document.getElementById("imageUpload").value = "";
    } else {
      alert("Enter the dimensions correctly!");
    }
  } catch (error) {
    alert(error.message);
    console.error("Error during saving", error.code, error.message);
  }
};

//only these user uid will be allowed to access admin page
const allowedAdminUIDs = [
  "AF6WNcaxMpfKFbyK9ms10j6wvm33",
  "nuPSOGc5Lbaq4e1whpP9F0Pjklu2",
  "RBSJiA7JiPN0ec3V7eK2H4C0NH83",
  "BDFdfVHjeDgvyDH08nCehJtT4IC2",
];

// Event listener for form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-info");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      onAuthStateChanged(auth, (user) => {
        if (allowedAdminUIDs.includes(user.uid)) {
          saveData(user);
        } else {
          alert("User is not not allowed to make changes");
          console.error("User is not not allowed to make changes");
        }
      });
    });
  }

  //FETCHING DISPLAYING DATA IN TABULAR FORM

  onAuthStateChanged(auth, (user) => {
    if (allowedAdminUIDs.includes(user.uid)) {
      fetchAndDisplayProducts();
    } else {
      alert("User is not not allowed to make changes");
      console.error("User is not not allowed to make changes");
    }
  });
});

// const fetchAndDisplayProducts = async () => {
//   //to display the total length
//   const len = dbRef(database, "Available-length");
//   const lenref = await get(len);

//   const LENGTH = lenref.val();
//   //  console.log(LENGTH)
//   document.getElementById(
//     "Belt-Length"
//   ).innerText = `Available Length:${LENGTH}`;

//   const tableBody = document
//     .getElementById("product-table")
//     .querySelector("tbody");
//   tableBody.innerHTML = ""; // Clear the table

//   const querySnapshot = await getDocs(collection(firestore, "products"));
//   let serialNumber = 1;

//   querySnapshot.forEach((doc) => {
//     const data = doc.data();
//     const imageUrl = data.imageurl || data.PhotoURL;

//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td>${serialNumber}</td>
//       <td>${data.productname}</td>
//       <td>${data.quantity}</td>
//       <td>${data.length} x ${data.breadth} x ${data.depth}</td>
//       <td>${data.price}</td>
//       <td>
//         <a href="${imageUrl}" target="_blank">Image</a>
//       </td>
//       <td>${data.position} </td>
//       <td>
//          <button class="remove-btn" onclick="removeProduct('${doc.id}')">Remove</button>
//       </td>
//     `;
//     tableBody.appendChild(row);
//     serialNumber++;
//   });
// };

// window.removeProduct = async (productId) => {
//   if (confirm("Are you sure you want to remove this product?")) {
//     await deleteDoc(doc(firestore, 'products', productId));
//     alert('Product removed successfully');
//     fetchAndDisplayProducts(); // Refresh the table after deletion
//   }
// };

const fetchAndDisplayProducts = async () => {
  // To display the total length
  const len = dbRef(database, "Available-length");
  const lenref = await get(len);

  const bellen = dbRef(database, "Belt");
  const bellenref = await get(bellen);

  const BELTLENGTH = bellenref.val();
  const LENGTH = lenref.val();
  const finalValue = LENGTH - BELTLENGTH;
  document.getElementById(
    "Belt-Length"
  ).innerText = `Available Length: ${finalValue}cm`;

  const tableBody = document
    .getElementById("product-table")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear the table

  const querySnapshot = await getDocs(collection(firestore, "products"));
  let serialNumber = 1;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const imageUrl = data.imageurl || data.PhotoURL;

    var startpos = data.startPost; //0

    var Endpos = data.endpost;
    var height = data.depth;

    var Spos = startpos;
    var Epos = Endpos;

    //for converting  the belt length to position
    var HEIGHT = height / 2;
    Spos = Spos / 2;
    Epos = Epos / 2;
    // console.log("Start pos", Spos);
    // console.log("endpos", Epos);

    // if (height == 2) {
    for (var i = 0; i < data.quantity; i++) {
      if (Spos != Epos) {
        var epos = Spos + HEIGHT;

        var Position = `${Spos + 1} - ${epos}`;
        var DispensePosition;

        // DispensePosition = Spos + epos;
        var EDPpos = startpos + height;

        DispensePosition = (startpos + EDPpos) / 2;

        // DispensePosition = DispensePosition - 0.5;

        console.log("startpos:", startpos);
        console.log("height:", height);
        console.log("EDPpos:", EDPpos);
        console.log(
          `Dispense Position: (${startpos} + 1 + ${EDPpos}) / 2}`,
          DispensePosition
        );

        startpos = EDPpos;

        // DispensePosition = DispensePosition * 2;
        // // console.log(DispensePosition);

        Spos = epos;

        const row = document.createElement("tr");
        row.innerHTML = `
              <td>${serialNumber}</td>
              <td>${data.productname}</td>
              <td>${data.length} x ${data.breadth} x ${data.depth}</td>
              <td>${data.price}</td>
              <td>
                <a href="${imageUrl}" target="_blank">Image</a>
              </td>
              <td>${Position}</td>
              <td>${DispensePosition} </td>
              <td>${data.depth} </td>
              <td>
                <button class="remove-btn" onclick="removeProduct('${doc.id}')">Remove</button>
              </td>
            `;

        tableBody.appendChild(row);
        serialNumber++;
      }
    }
    // }//end od
  });
};

// // Call the function to fetch and display products
// fetchAndDisplayProducts();

window.removeProduct = async (productId) => {
  if (confirm("Are you sure you want to remove this product?")) {
    try {
      const productDocRef = doc(firestore, "products", productId);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        const DATA = productDoc.data();
        const length = DATA.length;
        // console.log(length)

        const len = dbRef(database, "Available-length");
        const lenref = await get(len);
        var LENGTH = lenref.val(); //total length from realtime database

        LENGTH = LENGTH + length;

        // console.log(LENGTH)

        // await set(len, LENGTH);

        const totalLength = DATA.depth * DATA.quantity;
        const BeltLength = dbRef(database, "Belt");
        const Beltref = await get(BeltLength);

        var BELTLENGTH = Beltref.val();

        BELTLENGTH = BELTLENGTH - totalLength;

        await set(BeltLength, BELTLENGTH);
      } else {
        throw new Error(`LENGTH NOT CHANGED`);
      }

      //add each product depth to the belt length

      // Remove product from Firestore
      await deleteDoc(doc(firestore, "products", productId));
      // alert("Product removed successfully from firestore");

      const USER = auth.currentUser;
      const USERID = USER.uid; //real userid
      console.log(USERID);
      // Remove product from Realtime Database
      const productRef = dbRef(
        database,
        `products/` + USERID + "/" + productId
      );
      // console.log(userId)
      console.log(productId);
      console.log(productRef);
      await set(productRef, null);
      alert("Product removed successfully ");

      fetchAndDisplayProducts(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Failed to remove product");
    }
  }
};
