const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    editProject: (id, projectName, callback, err) => {
        ipcRenderer.invoke('projectEditChannel', id, projectName).then(callback, err) },
    newTask: (obj, callback, err) => {
        ipcRenderer.invoke('newTaskChannel', obj).then(callback, err) },
    toggleTask: (taskId, statusId, time, callback, err) => {
        ipcRenderer.invoke('taskClickChannel', taskId, statusId, time).then(callback, err) },
    editTask: (id, task, callback, err) => {
        ipcRenderer.invoke('taskEditChannel', id, task).then(callback, err) },
    loadData: (callback, err) => {
        ipcRenderer.invoke('loadLogsRequest').then(callback, err) },
    exportData: (logTree, tasks, projects, logs, callback, err) => {
        ipcRenderer.invoke('exportDataRequest', logTree, tasks, projects, logs).then(callback, err) },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) },
})

contextBridge.exposeInMainWorld('stateComm', {
    notifyUIEvent: state => {
        ipcRenderer.send('UIEventNotifications', state) },
    requestUIChange: (state, callback, err) => {
        ipcRenderer.invoke('UIEventRequests', state).then(callback, err) },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) }
})