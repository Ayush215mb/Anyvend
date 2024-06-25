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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();





firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

var inpqty = 1;

const arr=[];

firestore.collection("products").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {


      var data = doc.data();

      var productId = doc.id;
      var decrementId = `decrement-${productId}`;
      var incrementId = `increment-${productId}`;
      var qtyId = `qty-${productId}`;
      var buyBtnId = `buybtn-${productId}`;

      arr.push({data:data,buyBtnId:buyBtnId});
      
      var product = document.createElement('div');
      product.className = 'card';
      product.innerHTML = `
          <img src="${data.imageurl}" alt="${data.productname}">
          <h2>${data.productname}</h2>
          <span id="inpqty"> Qty: ${inpqty}</span>
          <p>Price: ${data.price}</p>
          <button  class="cartbtn" id="cartbtn-${productId}">Add to Cart</button>
          <button class="buybtn" id="buyBtnId">Buy Now</button>
      `;
      console.log("hello")
      document.getElementById('products').appendChild(product);


  });

});


document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        arr.forEach(element=>{
            document.getElementById(element.buyBtnId).addEventListener('click', (event) => {
 
                event.preventDefault();
                console.log("hello")
          
                  console.log(element.data,element.data.productname);
       
              });
         })
    
     
    }, 5000);
   });





document.getElementById('searchButton').addEventListener('click', function(e) {
    e.preventDefault(); 

    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();

    
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = '';

    firestore.collection("products").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            
            if (data.productname.toLowerCase().includes(searchQuery)) {
                var product = document.createElement('div');
                product.className = 'card';
                product.innerHTML = `
                     <img src="${data.imageurl}" alt="${data.productname}">
                    <h2>${data.productname}</h2>
                    <span id="inpqty"> Qty: ${inpqty}</span>
                    <p>Price: ${data.price}</p>
                    <button id="cartbtn">Add to Cart</button>
                    <button id="buybtn">Buy Now</button>
                `;
                productContainer.appendChild(product);
            }
        });
    });
});


