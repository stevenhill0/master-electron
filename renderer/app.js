// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');
const items = require('../items');

//Dom nodes
const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

// Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
  showModal.click();
});

// Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
  items.open();
});

// Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});

// Open item in native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
  items.openNative();
});

// Focus the search input from the menu
ipcRenderer.on('menu-focus-search', () => {
  search.focus();
});

// Filter items with "search"
search.addEventListener('keyup', (e) => {
  // Loop items
  // getElementsByClassName returns an HTML collection object (similar to a JS array but not quite: why we using Array.from() so we can access forEach() )
  Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
    // Hide items that don't match search value
    // search.value is the text value of the input
    // hasMatch will return a Boolean value cos of the includes() function
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  });
});

// Navigate item selection with up/down arrows
// Using a global listener cos we are NOT listening on a specific element
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    // changeSelection is function in the items.js file
    items.changeSelection(e.key);
  }
});

// Disable & Enable modal buttons
const toggleModalButtons = () => {
  // Check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

// show modal
showModal.addEventListener('click', (e) => {
  // we have flex before hiding the modal i.e. display: none
  // The js will override any styles as it will be set inline
  modal.style.display = 'flex';
  itemUrl.focus();
});

// close/hide modal
closeModal.addEventListener('click', (e) => {
  modal.style.display = 'none';
});

// add item
addItem.addEventListener('click', (e) => {
  if (itemUrl.value) {
    // Send new itemUrl to main process
    ipcRenderer.send('new-item', itemUrl.value);

    // Disable buttons
    toggleModalButtons();
  }
});

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // addItem is a function in the items file
  items.addItem(newItem, true);
  // Disable buttons
  toggleModalButtons();

  //
  modal.style.display = 'none';

  itemUrl.value = '';
});

// listen for keyboard event
itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
