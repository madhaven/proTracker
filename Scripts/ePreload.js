const { contextBridge, ipcRenderer } = require('electron')
const { Channels } = require('./Utils/Channels')

contextBridge.exposeInMainWorld('comms', {
    editProject: (project, callback, err) => {
        return ipcRenderer.invoke(Channels.editProject, project); },
    newTask: (task) => {
        return ipcRenderer.invoke(Channels.newTask, task); },
    toggleTask: (taskId, statusId, time) => {
        return ipcRenderer.invoke(Channels.toggleTask, taskId, statusId, time); },
    editTask: (task) => {
        return ipcRenderer.invoke(Channels.editTask, task); },
    newHabit: (habit) => {
        return ipcRenderer.invoke(Channels.createHabit, habit); },
    editHabit: (newHabit) => {
        return ipcRenderer.invoke(Channels.editHabit, newHabit); },
    habitDone: (habitId, time) => {
        return ipcRenderer.invoke(Channels.habitDone, habitId, time); },
    deleteHabit: (habitId, time, callback, err) => {
        ipcRenderer.invoke(Channels.deleteHabit, habitId, time).then(callback, err) },
    loadData: () => {
        return ipcRenderer.invoke(Channels.loadDataRequest); },
    exportData: (logTree) => {
        // passing the logTree could be network intensive
        // calculating it on the backend could load the backend as well
        // either way, processing need only be done on one end and the front end seems ideal
        return ipcRenderer.invoke(Channels.exportDataRequest, logTree);
    },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) },
})

contextBridge.exposeInMainWorld('stateComm', {
    notifyUIEvent: state => {
        ipcRenderer.send(Channels.UIEventNotifications, state) },
    requestUIChange: (state, callback, err) => {
        ipcRenderer.invoke(Channels.UIEventRequests, state).then(callback, err) },
    registerListener: (channel, callback) => {
        ipcRenderer.on(channel, callback) }
})