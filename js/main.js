import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
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

    document.querySelector('.btn-add').addEventListener('click', async () => {
        const categoryName = document.getElementById('category-name').value;
        if(categoryName){
            const user = auth.currentUser;
            const newCategory = {
                name: categoryName,
                userId: user.uid,
                lists: []
            };
            const docRef = await addDoc(collection(db, "categories"), newCategory);
            newCategory.id = docRef.id;
            displayCategory(newCategory);
            document.getElementById('category-name').value = ''; //to clear the input field
            const modal = bootstrap.Modal.getInstance( document.getElementById('category-modal'));
            modal.hide();
        }
    })
});

async function loadCategories(uid) {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const category = doc.data();
        category.id = doc.id;
        displayCategory(category);
    });
}

function displayCategory(category) {
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'col-md-4';
    categoryContainer.innerHTML = `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title">${category.name}</h5>
                <button id="btn-more" class="btn btn-sm" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                <ul class="dropdown-menu">
                    <li><a id="delete-category-${category.id}" class="dropdown-item" href="#">Delete</a></li>
                    <li><a id="edit-name-category-${category.id}" class="dropdown-item" href="#">Edit name</a></li>
                </ul>
            </div>
            <div class="card-body">
                <!-- Lists or additional content will go here -->
            </div>
        </div>
    `;
    document.getElementById('categories-row').appendChild(categoryContainer);
    // Add event listeners for the dropdown items
    document.getElementById(`delete-category-${category.id}`).addEventListener('click', () => deleteCategory(category.id, categoryContainer));
    document.getElementById(`edit-name-category-${category.id}`).addEventListener('click', () => editCategoryName(category.id, categoryContainer));
}

async function deleteCategory(categoryId, categoryContainer) {
    if(confirm('Delete the category?')){
        await deleteDoc(doc(db, "categories", categoryId));
        categoryContainer.remove();
    } 
}

async function editCategoryName(categoryId, categoryContainer) {
    const newName = prompt('Enter the new name for the category:');
    if (newName) {
        // Update in Firestore
        const categoryRef = doc(db, "categories", categoryId);
        await updateDoc(categoryRef, { name: newName });

        // Update in DOM
        categoryContainer.querySelector('.card-title').textContent = newName;
    }
}
