// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

//Dom nodes
const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');

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
ipcRenderer.on('new-item-success', (e, item) => {
  // Disable buttons
  toggleModalButtons();

  //
  modal.style.display = 'none';
  gg;
  itemUrl.value = '';
});

// listen for keyboard event
itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
