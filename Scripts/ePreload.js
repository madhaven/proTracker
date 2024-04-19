const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('comms', {
    editProject: (project, callback, err) => {
        ipcRenderer.invoke('projectEditChannel', project).then(callback, err) },
    newTask: (task) => {
        return ipcRenderer.invoke('newTaskChannel', task)},
    toggleTask: (taskId, statusId, time) => {
        return ipcRenderer.invoke('taskClickChannel', taskId, statusId, time) },
    editTask: (task, callback, err) => {
        ipcRenderer.invoke('taskEditChannel', task).then(callback, err) },
    createHabit: (title, startTime, endTime, frequency, callback, err) => {
        ipcRenderer.invoke('habitCreateChannel', title, startTime, endTime, frequency).then(callback, err) },
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