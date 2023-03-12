// Modules
const fs = require('fs');

// DOM nodes
// Reference to he items node
let items = document.getElementById('items');

// Get readerJS content
// We are NOT requiring the module. Instead we are using the native fs module to read/get the file content
let readerJS;

fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// NB: exports. is standard Node (ES6) syntax for making functions available on modules

// Track items in storage: Getting the items from localStorage, or an empty array
// For common JS to export INDIVIDUAL functions, use exports. and the function name
// Using JOSN.parse() to convert the string BACK to an array/object
// 'readit-items' is the key to get items from localStorage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Listen for "done" message from reader window
window.addEventListener('message', (e) => {
  // Check for correct message
  if (e.data.action === 'delete-reader-item') {
    // Delete item at given index
    this.delete(e.data.itemIndex);

    // Close the reader window
    e.source.close();
  }
});

// Get selected item index
exports.getSelectedItem = () => {
  // Get selected node
  let currentItem = document.getElementsByClassName('read-item selected')[0];

  // Get item index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;

  // Return selected item and index
  return { node: currentItem, index: itemIndex };
};

// Persist (store) items to storage
// For common JS to export INDIVIDUAL functions, use exports. and the function name
// 'readit-items' is the key to save items to localStorage
exports.save = () => {
  // Stringify JS objecft with JSON.stringify cos local storage can only store strings, NOT arrays/objects
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

// Set item as selected
exports.select = (e) => {
  // Remove currently selected item class
  document
    .getElementsByClassName('read-item selected')[0]
    .classList.remove('selected');

  // Add to clicked item
  e.currentTarget.classList.add('selected');
};

// Move to newly selected item
exports.changeSelection = (direction) => {
  // Get selected item
  let currentItem = document.getElementsByClassName('read-item selected')[0];

  // Handle up/down
  if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
    currentItem.classList.remove('selected');
    currentItem.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
    currentItem.classList.remove('selected');
    currentItem.nextElementSibling.classList.add('selected');
  }
};

// Open selected item
exports.open = () => {
  // Guard clause: Checking if we have items (in the case of menu open)
  if (!this.storage.length) return;

  // Get selected item
  let selectedItem = document.getElementsByClassName('read-item selected')[0];

  // Get item's url for reading
  // dataset is linking to the data attribute in main.html
  let contentURL = selectedItem.dataset.url;

  // Open item in proxy BrowserWindow
  // Will open target website in a separate window
  // Leaving window.open 2nd arg empty: it will then default to the URL title
  // Note we do NOT use Booleans in string form (cos we using backticks): instead we use 1 and 0
  // contextIsolation means JS is isolated within the context of the window i.e.has not access to any other JS
  let readerWin = window.open(
    contentURL,
    '',
    `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `
  );

  // Inject JavaScript
  readerWin.eval(readerJS);
};

// Add new item
// For common JS to export INDIVIDUAL functions, use exports. and the function name
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let itemNode = document.createElement('div');

  // Assign "read-item" class
  itemNode.setAttribute('class', 'read-item');

  // Set item url as data attribute
  itemNode.setAttribute('data-url', item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  // Append new node to "items"
  items.appendChild(itemNode);

  // Attach click handler to select
  // When this element is clicked: call the select function
  itemNode.addEventListener('click', this.select);

  // Attach double click handler to open

  itemNode.addEventListener('dblclick', this.open);

  // If this is the first item, select it
  // Preselecting the first item: when app loads, or when the first item is manually selected
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  // Add item to storage and persist
  // Will show up in Browser local storage as key/value
  // If isNew means if item is new
  // Using this.storage to target the storage function in the global scope of this file
  if (isNew) {
    this.storage.push(item);
    // Using this.save to target the save() function in the global scope of this file
    this.save();
  }
};

// Add items from storage when app loads
// Adding items to show when app loads
// Using this.storage to target the storage function in the global scope of this file
this.storage.forEach((item) => {
  // Using this.addItem to target the addItem function in the global scope of this file
  this.addItem(item);
});
