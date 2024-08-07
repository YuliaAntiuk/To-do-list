import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { doc, deleteDoc, updateDoc, getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

    document.getElementById('btn-add-category-modal').addEventListener('click', async () => {
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

    document.getElementById('btn-add-list-modal').addEventListener('click', async () => {
        const categoryName = document.getElementById('cat-name').value;
        const listName = document.getElementById('list-name').value;
        const listPriority = document.getElementById('list-priority').value;
        if(categoryName && listName && listPriority){
            const user = auth.currentUser;

            //get the name of category
            const categoriesRef = collection(db, "categories");
            const q = query(categoriesRef, where("userId", "==", user.uid), where("name", "==", categoryName));
            const querySnapshot = await getDocs(q);

            if(!querySnapshot.empty){
                querySnapshot.forEach(async (doc) => {
                    const categoryData = doc.data();
                    categoryData.lists.push({
                        name: listName,
                        priority: listPriority,
                        tasks: []
                    });

                    //update the category
                    const categoryDocRef = doc(db, "categories", docSnap.id);
                    await updateDoc(categoryDocRef, {
                        lists: categoryData.lists
                    });
                    displayCategory(categoryData);
                });
                document.getElementById('cat-name').value = ''; 
                document.getElementById('list-name').value = ''; 
                document.getElementById('list-priority').value = ''; 
                const modal = bootstrap.Modal.getInstance( document.getElementById('list-modal'));
                modal.hide();
            } else {
                alert("Category not found!");
            }
        } else{
            alert("Please fill in all fields");
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
                <div id="lists-container-${category.id}">
                    ${category.lists.map(list => `
                        <div class="list">
                            <h6>${list.name}</h6>
                            <!-- Add list tasks display here -->
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('categories-row').appendChild(categoryContainer);
    // Add event listeners for the dropdown items
    document.getElementById(`delete-category-${category.id}`).addEventListener('click', () => showDeleteModal(category.id, categoryContainer));
    document.getElementById(`edit-name-category-${category.id}`).addEventListener('click', () => showEditModal(category.id, categoryContainer));
}

// Function to show the delete confirmation modal
function showDeleteModal(categoryId, categoryContainer) {
    const deleteModal = new bootstrap.Modal(document.getElementById('delete-category-modal'));
    deleteModal.show();
    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
        await deleteCategory(categoryId, categoryContainer);
        deleteModal.hide();
    }, { once: true });
}

// Function to show the edit modal
function showEditModal(categoryId, categoryContainer) {
    const editModal = new bootstrap.Modal(document.getElementById('edit-category-modal'));
    editModal.show();
    document.getElementById('edit-category-name').value = categoryContainer.querySelector('.card-title').textContent;
    document.getElementById('btn-save-changes').addEventListener('click', async () => {
        const newName = document.getElementById('edit-category-name').value;
        if (newName) {
            await editCategoryName(categoryId, categoryContainer, newName);
            editModal.hide();
        }
    }, { once: true });
}

// Function to delete a category
async function deleteCategory(categoryId, categoryContainer) {
    // Remove from Firestore
    await deleteDoc(doc(db, "categories", categoryId));
    // Remove from DOM
    categoryContainer.remove();
}

// Function to edit category name
async function editCategoryName(categoryId, categoryContainer, newName) {
    // Update in Firestore
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, { name: newName });

    // Update in DOM
    categoryContainer.querySelector('.card-title').textContent = newName;
}

