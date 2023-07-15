const csv = require('fast-csv')
const fs = require('fs')
const { ipcMain } = require('electron')

const { FileService } = require('./Services/FileService')
const { Task } = require('./Models/Task')
const { Status } = require('./Models/Status')
const { TaskStatusChange } = require('./Models/TaskStatusChange')
const { ProjectProvider } = require('./Providers/ProjectProvider')
const { TaskProvider } = require('./Providers/TaskProvider')
const { StatusLogProvider } = require('./Providers/StatusLogProvider')
var tp, pp, slp

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

const newTaskHandler = async (event, obj) => {
    console.info('newTaskRequest', obj)
    var project = await pp.getByNameOrCreate(obj.project)
    var dummy = new Task(-1, project.id, obj.summary, -1)
    var task = await tp.create(dummy)
    var taskLog = await slp.create(new TaskStatusChange(-1, task.id, Status.PENDING, obj.dateTime)) // TODO fetch status values from db ?
    var newTask = await task.toContract(taskLog)
    console.log('newTask', newTask)
    return newTask
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
    console.log('main: state event notified', data)
}

const stateChangeRequestHandler = async (event, data) => {
    // TODO
    console.log('main: state change request recieved', event, data)
}

const registerHandlers = mainWindow => {
    // TODO DI ?
    tp = new TaskProvider()
    pp = new ProjectProvider()
    slp = new StatusLogProvider()

    // comms
    ipcMain.handle('newTaskChannel', newTaskHandler)
    ipcMain.handle('taskClickChannel', taskToggleHandler)
    ipcMain.on('loadFileRequest', event => { loadDataHandler(event, mainWindow) })
    ipcMain.handle('saveDataRequest', (event, data) => { saveDataHandler(event, data, mainWindow) })
    console.log("save data registered")

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

module.exports = { registerHandlers };