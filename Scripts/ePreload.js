const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    newTask: (obj, callback, err) => {
        ipcRenderer.invoke('newTaskChannel', obj).then(callback, err) },
    toggleTask: (taskId, statusId, time, callback, err) => {
        ipcRenderer.invoke('taskClickChannel', taskId, statusId, time).then(callback, err) },
    loadData: (callback, err) => {
        ipcRenderer.invoke('loadLogsRequest').then(callback, err) },
    saveData: (callback, err) => {
        ipcRenderer.invoke('saveDataRequest').then(callback, err) },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) },
    // variables be also exposed, not just functions
})

contextBridge.exposeInMainWorld('stateComm', {
    notifyUIEvent: state => {
        ipcRenderer.send('UIEventNotifications', state) },
    requestUIChange: (state, callback, err) => {
        ipcRenderer.invoke('UIEventRequests', state).then(callback, err) },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) }
})