// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import ujs from "@rails/ujs";

// require("@rails/ujs").start()
// require("turbolinks").start()
// require("@rails/activestorage").start()
// require("channels")

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../video/App';

import "../css/App.css";
import "../css/app.scss";

ujs.start();

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
require.context('../images', true)
// const imagePath = (name) => images(name, true)

window.addEventListener('DOMContentLoaded', () => {
  function initFirebase() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyCjrfQe_g1ZBHT5Jl2y-TMQku-Spm_pydU",
      authDomain: "videopong-ad5c1.firebaseapp.com",
      databaseURL: "https://videopong-ad5c1.firebaseio.com",
      projectId: "videopong-ad5c1",
      storageBucket: "videopong-ad5c1.appspot.com",
      messagingSenderId: "576207421492",
      appId: "1:576207421492:web:32e2ed9d71650009b3ca61",
      measurementId: "G-RB990BFPCC"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
  initFirebase();
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
    // document.body.appendChild(document.createElement('div')),
  );
});

console.log('application.js loaded');

// document.addEventListener("DOMContentLoaded", function(event){
//   initFirebase();
//   ReactDOM.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>,
//     document.getElementById('root')
//     // document.body.appendChild(document.createElement('div')),
//   );
// });

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

