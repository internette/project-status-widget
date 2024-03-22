const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { GITHUB_CLIENT_ID, GITLAB_CLIENT_ID } = require("../constants.js");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let githubAuthWindow;
let gitlabAuthWindow;

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

const getAuthCode = (url) => {
  const queryString = url.split("callback")[1];
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  const error = urlParams.get("error");
  return {
    code,
    error
  };
};

app.whenReady().then(() => {
  ipcMain.handle("github-login", () => {
    const options = {
      client_id: GITHUB_CLIENT_ID,
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

    const handleGithubCallback = (url) => {
      // If there is a code, proceed to get token from github
      const { code, error } = getAuthCode(url);
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
      handleGithubCallback(url);
    });
    githubAuthWindow.webContents.on(
      "did-get-redirect-request",
      function (event, oldUrl, newUrl) {
        handleGithubCallback(newUrl);
      }
    );
    // Reset the authWindow on close
    githubAuthWindow.on("closed", () => {
      githubAuthWindow = null;
    });
  });
  ipcMain.handle("gitlab-login", () => {
    gitlabAuthWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js")
      },
      parent: mainWindow,
      modal: true
    });
    const redirect_uri = "http://localhost:3000/callback";
    const gitlabOAuthURL = `https://gitlab.com/oauth/authorize?client_id=${GITLAB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent("read_api read_user read_repository")}`;
    gitlabAuthWindow.loadURL(gitlabOAuthURL);
    gitlabAuthWindow.show();
    gitlabAuthWindow.webContents.openDevTools();

    const handleGitlabCallback = (url) => {
      const { code, error } = getAuthCode(url);
      if (code) {
        const { net } = require("electron");
        gitlabAuthWindow.destroy();
        const tokenUrl =
          "https://project-status-widget-api.vercel.app/api/gitlab/get-token?authToken=" +
          code;
        const request = net.request(tokenUrl);
        let oAuthQuery = "";
        request.on("response", (response) => {
          response.on("data", (chunk) => {
            oAuthQuery += chunk;
          });
          response.on("end", () => {
            const { access_token, refresh_token } = JSON.parse(oAuthQuery);
            mainWindow.webContents.send("set-gl-access-token", {
              access_token,
              refresh_token
            });
          });
        });
        request.end();
      } else if (error) {
        alert(
          "Oops! Something went wrong and we couldn't" +
            "log you in using Gitlab. Please try again."
        );
      }
    };
    gitlabAuthWindow.webContents.on("did-navigate", function (event, url) {
      handleGitlabCallback(url);
    });
    gitlabAuthWindow.webContents.on(
      "did-get-redirect-request",
      function (event, oldUrl, newUrl) {
        handleGitlabCallback(newUrl);
      }
    );
    // Reset the authWindow on close
    gitlabAuthWindow.on("closed", () => {
      gitlabAuthWindow = null;
    });
  });

  createWindow();
});
