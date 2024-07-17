import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, set, get, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, doc, addDoc, collection, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

// Initialize Firebase Authentication
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage();



document.addEventListener('DOMContentLoaded', () => {
  const image = document.getElementById('product-info')

  document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();

    const imageFile = document.getElementById('imageUpload').files[0];

    var PhotoURL = '';


    try {


      if (imageFile) {
        // Create a storage reference
        const storageRef = ref(storage, 'images/' + imageFile.name);

        // Uploading the image
        const snapshot = await uploadBytes(storageRef, imageFile);

        PhotoURL = await getDownloadURL(snapshot.ref);//storing the url

        console.log("Product added successfully!");

      }




      const productname = document.getElementById('name').value;
      const price = document.getElementById('price').value;
      const quantity = document.getElementById('quantity').value;
      const length = document.getElementById('length').value;
      const breadth = document.getElementById('breadth').value;
      const depth = document.getElementById('depth').value;
      const imageurl = document.getElementById('imageurl').value;




      if (length < 17 && breadth < 23 && depth < 9) {

        await setDoc(doc(firestore, 'products', productname), {
          productname: productname,
          price: price,
          quantity: quantity,
          length: length,
          breadth: breadth,
          depth: depth,
          PhotoURL: PhotoURL,
          imageurl: imageurl
        });

        document.getElementById('imageurl').value= PhotoURL;

        console.log('product data saved to Firestore');
        alert('Data saved succesfully to the firestore');

      }
      else {
        alert('Enter the dimension correctly!');
      }


    }
    catch (error) {
      console.error("Error saving product information:", error);
      alert("Failed to add product. Please try again.");
    }
  });//end of document.get element by submit button

})


console.log(PhotoURL)



const saveData = async (user) => 
  {
    //storing uploaded image file
    const imageFile = document.getElementById('imageUpload').files[0];

    var PhotoURL = '';

      try{

        const productname = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const length= document.getElementById('length').value;  
        const breadth= document.getElementById('breadth').value;
       const depth=  document.getElementById('depth').value;
        const imageurl = document.getElementById('imageurl').value;



        
        const collectionName = 'products';
        const docId = productname;

        const docRef = doc(db, collectionName, docId);

        

        if (length < 17 && breadth < 23 && depth < 9) 
          {
              // Generate a unique key for the product in Realtime Database

              const ProductRef = push(ref(database, 'products/' + user.uid));
              await set(ProductRef,
                {
                  productname: productname,
                  price: price,
                  quantity: quantity,
                  length:length,
                  breadth:breadth,
                  depth:depth,
                  PhotoURL: PhotoURL,
                  imageurl: imageurl
          
                });//end of await

            console.log('User data saved to Realtime Database');

            alert('Data saved succesfully in the realtime database');
          } 
          else 
          {
            alert('Enter the dimension correctly!');
          }

      }catch (error) {
        alert(error.message)
          console.error('Error during saving', error.code, error.message);
          // document.getElementById('productname').value='';
          // document.getElementById('price').value='';
          // document.getElementById('quantity').value='';
          // document.getElementById('length').value='';  
          // document.getElementById('breadth').value='';
          // document.getElementById('depth').value='';
          // document.getElementById('imageurl').value='';
        }

  };



//only these user uid will be allowed to access admin page
const allowedAdminUIDs = ['AF6WNcaxMpfKFbyK9ms10j6wvm33', 'nuPSOGc5Lbaq4e1whpP9F0Pjklu2','RBSJiA7JiPN0ec3V7eK2H4C0NH83']; 

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-info');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

         onAuthStateChanged(auth, (user) =>
           {
              if (allowedAdminUIDs.includes(user.uid)) {
                saveData(user);
              } else {
                console.error('user is not allowed to make chnages');
              }
          });
       
        
        
      });
    }


  });
