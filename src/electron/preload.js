const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ghLogin", {
  send: (channel, data) => {
    ipcRenderer.invoke("github-login");
  },
  receive: (callback) => {
    ipcRenderer.on("set-gh-access-token", (event, args) =>
      callback(event, args)
    );
  }
});

contextBridge.exposeInMainWorld("glLogin", {
  send: (channel, data) => {
    ipcRenderer.invoke("gitlab-login");
  },
  receive: (callback) => {
    ipcRenderer.on("set-gl-access-token", (event, args) =>
      callback(event, args)
    );
  }
});
