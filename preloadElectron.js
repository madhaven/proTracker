const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    toggleTask: (id) => { ipcRenderer.invoke('taskClickChannel', id) },
    loadFile: () => { ipcRenderer.send('loadFileRequest') },
    saveData: (data, callback, err) => { ipcRenderer.invoke('saveDataRequest', data).then(callback, err) },
    registerMainDataCallback: (callback) => ipcRenderer.on('DataPing', callback),
    registerMainDataErrorHandler: (errHandler) => ipcRenderer.on('DataError', errHandler)
    // we can also expose variables, not just functions
})