// select items
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = "";

// event listeners
// submit form
form.addEventListener('submit', addItem);
// clear item
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// functions
function addItem(event) {
    event.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        createListItem(id, value);
        // display alert
        displayAlert("item added to the list", "success");
        // container
        container.classList.add('show-container');
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        // display alert
        displayAlert("item edited", "success");
        // local storage
        editLocalStorage(editID, value);
        // set back to default
        setBackToDefault();
    }
    else {
        displayAlert("Please enter value", "danger");
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}

// clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item);
        })
    }
    // container
    container.classList.remove('show-container');
    // display alert
    displayAlert("Empty list", "danger");
    // add to local storage
    localStorage.removeItem('list');
    // set back to default
    setBackToDefault();
}

// delete function
function deleteItem(event) {
    const element = event.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    // container
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }
    // display alert
    displayAlert("Item removed", "danger");
    // local storage
    removeFromLocalStorage(id);
    // set back to default
    setBackToDefault();
}

// edit function
function editItem(event) {
    const element = event.currentTarget.parentElement.parentElement;
    // select edit item - p tag
    editElement = event.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// local storage
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getLocalStorage();

    items.push(grocery);

    localStorage.setItem('list', JSON.stringify(items));
};

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem('list', JSON.stringify(items));
};

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem('list', JSON.stringify(items));
};

function getLocalStorage() {
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// setup items
function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        })
        container.classList.add('show-container');
    }
}

// creating article
function createListItem(id, value) {
    const element = document.createElement("article");

    element.classList.add('grocery-item');

    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    // append child
    list.appendChild(element);
}