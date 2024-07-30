import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Check user authentication state
onAuthStateChanged(auth, async user => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        document.getElementById('user-email').textContent = user.email;
        // Load existing categories for the user
        loadCategories(uid);
    } else {
        // User is signed out
        window.location.href = 'index.html';
    }
});

async function loadCategories(uid) {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const category = doc.data();
        displayCategory(category);
    });
}

function displayCategory(category) {
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'card mb-3';
    categoryContainer.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${category.name}</h5>
            <p class="card-text">Category content goes here...</p>
        </div>
    `;
    document.getElementById('main').appendChild(categoryContainer);
}

document.getElementById('add-category-btn').addEventListener('click', async () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
        const user = auth.currentUser;
        const newCategory = {
            name: categoryName,
            userId: user.uid
        };
        const docRef = await addDoc(collection(db, "categories"), newCategory);
        newCategory.id = docRef.id;
        displayCategory(newCategory);
    }
});
