const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('login', {
    ghLogin: () => ipcRenderer.invoke('github-login')
});