const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    newTask: (obj, callback, err) => { ipcRenderer.invoke('newTaskChannel', obj).then(callback, err) },
    toggleTask: id => { ipcRenderer.invoke('taskClickChannel', id) },
    loadFile: () => { ipcRenderer.send('loadFileRequest') },
    saveData: (data, callback, err) => { ipcRenderer.invoke('saveDataRequest', data).then(callback, err) },
    registerListener: (channel, callback) => { ipcRenderer.on(channel, callback) },
    // variables be also exposed, not just functions
})

contextBridge.exposeInMainWorld('state', {
    notifyUIEvent: state => { ipcRenderer.send('UIEventNotifications', state) },
    requestUIChange: (state, callback, err) => { ipcRenderer.invoke('UIEventRequests', state).then(callback, err) },
    registerListener: (channel, callback) => { ipcRenderer.on(channel, callback) }
})