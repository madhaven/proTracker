const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    editProject: (project, callback, err) => {
        return ipcRenderer.invoke('projectEditChannel', project) },
    newTask: (task) => {
        return ipcRenderer.invoke('newTaskChannel', task)},
    toggleTask: (taskId, statusId, time) => {
        return ipcRenderer.invoke('taskClickChannel', taskId, statusId, time) },
    editTask: (task) => {
        return ipcRenderer.invoke('taskEditChannel', task) },
    newHabit: (habit) => {
        return ipcRenderer.invoke('habitCreateChannel', habit) },
    habitDone: (habitId, time, callback, err) => {
        ipcRenderer.invoke('habitDoneChannel', habitId, time).then(callback, err) },
    deleteHabit: (habitId, time, callback, err) => {
        ipcRenderer.invoke('deleteHabitChannel', habitId, time).then(callback, err) },
    loadData: () => {
        return ipcRenderer.invoke('loadDataRequest') },
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