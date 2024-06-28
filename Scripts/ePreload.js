const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    editProject: (project, callback, err) => {
        return ipcRenderer.invoke('projectEditChannel', project); },
    newTask: (task) => {
        return ipcRenderer.invoke('newTaskChannel', task); },
    toggleTask: (taskId, statusId, time) => {
        return ipcRenderer.invoke('taskClickChannel', taskId, statusId, time); },
    editTask: (task) => {
        return ipcRenderer.invoke('taskEditChannel', task); },
    newHabit: (habit) => {
        return ipcRenderer.invoke('habitCreateChannel', habit); },
    editHabit: (newHabit) => {
        return ipcRenderer.invoke('habitEditChannel', newHabit); },
    habitDone: (habitId, time) => {
        return ipcRenderer.invoke('habitDoneChannel', habitId, time); },
    deleteHabit: (habitId, time, callback, err) => {
        ipcRenderer.invoke('deleteHabitChannel', habitId, time).then(callback, err) },
    loadData: () => {
        return ipcRenderer.invoke('loadDataRequest'); },
    exportData: (logTree) => {
        // passing the logTree could be network intensive
        // calculating it on the backend could load the backend as well
        // either way, processing need only be done on one end and the front end seems ideal
        return ipcRenderer.invoke('exportDataRequest', logTree);
    },
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