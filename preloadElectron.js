const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    toggleTask: (id) => ipcRenderer.invoke('taskClickChannel', id),
    loadFile: () => ipcRenderer.send('loadFileChannel'),
    registerMainDataCallback: (callback) => ipcRenderer.on('DataPing', (event, arg) => {
        callback(event, arg)
    })
    // we can also expose variables, not just functions
})