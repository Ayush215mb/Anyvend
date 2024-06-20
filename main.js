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





db.collection("products").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      var data = doc.data();
      var product = document.createElement('div');
      product.className = 'card';
      product.innerHTML = `
          <img src="${data.imageurl}" alt="${data.name}">
          <h2>${data.name}</h2>
          <p>Price: ${data.price}</p>
          <button onclick="updatePosition('${data.position}')">Buy Now</button>
      `;
      document.getElementById('products').appendChild(product);
  });
});

function updatePosition(position) {
  firebase.database().ref('Position').set({
      position: position
  });
}
