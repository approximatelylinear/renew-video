import React from 'react';
import ReactDOM from 'react-dom';

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

import '../video/index.css';
import App from '../video/App';

import * as serviceWorker from '../video/serviceWorker';


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


document.addEventListener("DOMContentLoaded", function(event){
  initFirebase();
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    // document.getElementById('video-root')
    document.body.appendChild(document.createElement('div')),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
