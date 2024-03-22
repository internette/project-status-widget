const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { CLIENT_ID } = require("../constants.js");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let githubAuthWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    focusable: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  ipcMain.handle("github-login", () => {
    const options = {
      client_id: CLIENT_ID,
      scopes: ["user:email", "notifications"] // Scopes limit access for OAuth tokens.
    };
    githubAuthWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js")
      },
      parent: mainWindow,
      modal: true
    });
    const state = require("crypto").randomBytes(16).toString("hex");
    const scopes = ["notifications"].join();
    const githubUrl = "https://github.com/login/oauth/authorize?";
    const authUrl =
      githubUrl +
      "client_id=" +
      options.client_id +
      "&state=" +
      state +
      "&scope=" +
      scopes +
      "&login";
    githubAuthWindow.loadURL(authUrl);
    githubAuthWindow.show();
    githubAuthWindow.webContents.openDevTools();

    const handleCallback = (url) => {
      // If there is a code, proceed to get token from github
      const queryString = url.split("callback")[1];
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get("code");
      const error = urlParams.get("error");
      if (code) {
        const { net } = require("electron");
        githubAuthWindow.destroy();
        const tokenUrl =
          "https://project-status-widget-api.vercel.app/api/github/get-token?authToken=" +
          code;
        const request = net.request(tokenUrl);
        let oAuthQuery = "";
        request.on("response", (response) => {
          response.on("data", (chunk) => {
            oAuthQuery += chunk;
          });
          response.on("end", () => {
            oAuthQuery = oAuthQuery.split(":")[0];
            const oauthResParams = new URLSearchParams(oAuthQuery);
            const accessToken = oauthResParams.get("access_token");
            mainWindow.webContents.send("set-gh-access-token", {
              access_token: accessToken
            });
          });
        });
        request.end();
      } else if (error) {
        alert(
          "Oops! Something went wrong and we couldn't" +
            "log you in using Github. Please try again."
        );
      }
    };

    githubAuthWindow.webContents.on("did-navigate", function (event, url) {
      handleCallback(url);
    });
    githubAuthWindow.webContents.on(
      "did-get-redirect-request",
      function (event, oldUrl, newUrl) {
        handleCallback(newUrl);
      }
    );
    // Reset the authWindow on close
    githubAuthWindow.on("closed", () => {
      githubAuthWindow = null;
    });
  });
  createWindow();
});
