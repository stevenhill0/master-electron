// Modules
const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // config window state
  // No need to set x and y coords because the window defaults to the center of the screen
  let state = windowStateKeeper({ defaultWidth: 500, defaultHeight: 650 });

  mainWindow = new BrowserWindow({
    // Setting the state bounds (position) for the window here, for when the window position changes
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    // Setting maxWidth cos we don't want it to get too wide: list of links wont look good in a wide format
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html');

  // Tell the window keeper state instance, which window to manage
  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
