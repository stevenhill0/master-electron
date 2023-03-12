const { BrowserWindow } = require('electron');

// Offscreen BrowserWindow
let offscreenWindow;

// Exported readItem function
module.exports = (url, callback) => {
  // Offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: { offscreen: true },
  });

  // load item url
  offscreenWindow.loadURL(url);

  // Wait for content to finish loading
  offscreenWindow.webContents.on('did-finish-load', (event) => {
    // get page title
    let title = offscreenWindow.getTitle();

    // Get screenshot (thumbnail)
    // capturePage() returns a Promise
    offscreenWindow.webContents.capturePage().then((image) => {
      // get image as a dataUrl
      let screenshot = image.toDataURL();

      // Execute callback with new item object
      callback({ title, screenshot, url });

      // Cleanup
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
