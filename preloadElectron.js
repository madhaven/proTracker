const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    toggleTask: (id) => ipcRenderer.invoke('taskClickChannel', id),
    requestData: () => ipcRenderer.invoke('DataRequest')
    // we can also expose variables, not just functions
})