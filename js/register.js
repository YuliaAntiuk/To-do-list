import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgIFm7K-INX3R8qTrscGbWZvRIXVGcWME",
    authDomain: "to-do-list-1e962.firebaseapp.com",
    projectId: "to-do-list-1e962",
    storageBucket: "to-do-list-1e962.appspot.com",
    messagingSenderId: "291615971073",
    appId: "1:291615971073:web:ad88edf6c939205ffeed00",
    measurementId: "G-HY0RPDN27X"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function(){
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    //registration
    registerForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const repeatPassword = document.getElementById('repeat-password').value;

        if (password !== repeatPassword) {
            alert('Passwords do not match!');
            return;
        }

        createUserWithEmailAndPassword(auth, username, password)
            .then(userCredential => {
                console.log('User registered:', userCredential.user);
                // Redirect to the main app page
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });
    });

    //login
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        signInWithEmailAndPassword(auth, username, password)
            .then(userCredential => {
                console.log('User logged in:', userCredential.user);
                // Redirect to the main app page
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error logging in user:', error);
            });
    })
});