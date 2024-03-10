const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ghLogin", {
  send: (channel, data) => {
    ipcRenderer.invoke("github-login");
  },
  receive: (callback) => {
    ipcRenderer.on("set-gh-access-token", (event, args) =>
      callback(event, args)
    );
  },
});
