const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const { CLIENT_ID } = require("../constants.js");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }});

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.whenReady().then(() => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    ipcMain.handle('github-login', ()=> {
        console.log('triggered');
        const options = {
            client_id: CLIENT_ID,
            scopes: ['user:email', 'notifications'], // Scopes limit access for OAuth tokens.
          };
        const authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            'node-integration': false,
          });
          const githubUrl = 'https://github.com/login/oauth/authorize?';
          const authUrl =
            githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
          authWindow.loadURL(authUrl);
          authWindow.show();
    });
    createWindow();
});