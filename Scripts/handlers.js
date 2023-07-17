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

const loadLogsHandler = async (event) => {
    alltasks = await tp.getAllTasks()
    return alltasks ? alltasks : false
}

const saveDataHandler = async (event, data, mainWindow) => {
    // prompts user for file name and saves the data into the file

    const csvData = "date,project,task,status\n" + data.map(
        row => [row.data, row.project, row.task, row.status].join(',')
    ).join('\n')

    var result = await FileService.saveFile(mainWindow, csvData)
    console.log('handler: saveFile result received:', result)
    if (result){
        return true
    } else {
        ipcMain.emit("DataError", "something went wrong, didn't save")
    }
}

const newTaskHandler = async (event, newTask) => {
    console.info('newTaskRequest', newTask)
    newTask.dateTime = new Date(newTask.dateTime).getTime()
    var project = await pp.getByNameOrCreate(newTask.project)
    var dummy = new Task(-1, project.id, newTask.summary, -1)
    var task = await tp.create(dummy)
    var taskLog = await slp.create(new TaskStatusChange(-1, task.id, Status.PENDING, newTask.dateTime)) // TODO fetch status values from db ?
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
    ipcMain.handle('loadLogsRequest', loadLogsHandler)
    ipcMain.handle('saveDataRequest', (event, data) => { saveDataHandler(event, data, mainWindow) })
    console.log("save data registered")

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

module.exports = { registerHandlers }