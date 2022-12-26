const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    toggleTask: (id) => ipcRenderer.invoke('taskClickChannel', id)
    // we can also expose variables, not just functions
})