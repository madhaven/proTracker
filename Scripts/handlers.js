const csv = require('fast-csv')
const fs = require('fs')
const { ipcMain, dialog } = require('electron')
const { FileService } = require('./Services/FileService')

const loadDataHandler = async (event, mainWindow) => {
    var { result, data } = await FileService.loadAFile(mainWindow)
    if (result){
        event.reply('DataPing', data)
    } else {
        ipcMain.emit('DataError', 'something went wrong')
    }
}

const saveDataHandler = async (event, data, mainWindow) => {
    // prompts user for file name and saves the data into the file

    const csvData = "date,project,task,status\n" + data.map(
        row => [row.data, row.project, row.task, row.status].join(',')
    ).join('\n')

    var result = await FileService.saveFile(mainWindow, csvData)
    console.log('handler: saveFile result received:', result)
    if (result){
        return true;
    } else {
        ipcMain.emit("DataError", "something went wrong, didn't save")
    }
}

const taskToggleHandler = (event, id) => {
    // marks a task as completed or incomplete
    // TODO: this method should be handled by UI state change mechanism
    console.log('toggle task', id)
    if (Math.random() >= 0.5)
        return true
    else 
        return false
}

/// STATE EVENTS

const stateEventHandler = async (event, data) => {
    // TODO
    console.log('main: state event notified', event, data)
}

const stateChangeRequestHandler = async (event, data) => {
    // TODO
    console.log('main: state change request recieved', event, data)
}

const registerHandlers = mainWindow => {
    // comms
    ipcMain.handle('taskClickChannel', taskToggleHandler)
    ipcMain.on('loadFileRequest', event => { loadDataHandler(event, mainWindow) })
    ipcMain.handle('saveDataRequest', (event, data) => { saveDataHandler(event, data, mainWindow) })
    console.log("save data registered")

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

module.exports = {
    registerHandlers,
}