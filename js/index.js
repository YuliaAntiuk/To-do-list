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

        //email and password validation

        if (!validateEmail(username)) {
            alert('Invalid email format!');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        createUserWithEmailAndPassword(auth, username, password)
            .then(userCredential => {
                // Redirect to the main app page
                window.location.href = 'main.html';
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    alert('Email is already registered. Please use another email or log in.');
                } else {
                    alert('Error registering user: ' + error.message);
                }
                registerForm.reset();
            });
    });

    //login
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        signInWithEmailAndPassword(auth, username, password)
            .then(userCredential => {
                // Redirect to the main app page
                window.location.href = 'main.html';
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    alert('No user found with this email. Please register first.');
                } else if (error.code === 'auth/wrong-password') {
                    alert('Incorrect password. Please try again.');
                } else if (error.code === 'auth/invalid-credential'){
                    alert('Invalid credentials: check email and password')
                }
                else {
                    alert('Error logging in user: ' + error.message);
                }
                loginForm.reset();
            });
    })

    function validateEmail(email){
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    function validatePassword(password){
        return password.length >= 8;
    }
});