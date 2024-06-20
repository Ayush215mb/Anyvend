import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get,push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, doc,addDoc,collection, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };


    const app = initializeApp(firebaseConfig);


    const auth = getAuth(app);
    const database = getDatabase(app);
    const firestore = getFirestore(app);


    const saveData = async (user,productname,price, quantity, Dimensions) => 
    {
        try{
        const ProductRef = push(ref(database, 'products/' + user.uid));
        await set(ProductRef, {
            productname: productname,
            price: price,
            quantity: quantity,
            Dimensions: Dimensions
        });

          console.log('User data saved to Realtime Database and Firestore');
        }catch (error) {
            console.error('Error during saving', error.code, error.message);
          }

    };

    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('product-info');
      if (form) {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
    
          const productname = document.getElementById('name').value;
          const price = document.getElementById('price').value;
          const quantity = document.getElementById('quantity').value;
          const dimensions = document.getElementById('Dimensions').value;
    
          console.log(productname, price, quantity, dimensions); 
    
          onAuthStateChanged(auth, (user) => {
            if (allowedAdminUIDs.includes(user.uid)) {
              saveData(user, productname, price, quantity, dimensions);
            } else {
              console.error('user is not allowed to make chnages');
            }
          });
        });
      }

             const allowedAdminUIDs = ['', '']; 


             const checkAdminAccess = (user) => {
               const adminLink = document.getElementById('admin-link');
               if (allowedAdminUIDs.includes(user.uid)) {
                 adminLink.style.display = 'block'; 
               } else {
                 adminLink.style.display = 'none'; 
               }
             };

      const adminLink = document.getElementById('admin-link');
      if (adminLink) {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            checkAdminAccess(user); 
          } else {
            adminLink.style.display = 'none';
          }
        });
      }
    });

