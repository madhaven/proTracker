const { ipcMain } = require('electron')

const { FileService } = require('./Services/FileService')
const { Task } = require('./Models/Task')
const { Status } = require('./Models/Status')
const { StatusLog } = require('./Models/StatusLog')
const { TaskLog } = require('./Contracts/TaskLog')
const { ProjectProvider } = require('./Providers/ProjectProvider')
const { TaskProvider } = require('./Providers/TaskProvider')
const { StatusProvider } = require('./Providers/StatusProvider')
const { StatusLogProvider } = require('./Providers/StatusLogProvider')
var tp, pp, slp, sp

const loadLogsHandler = async (event) => {
    alltasks = await tp.getAllTasks()
    allLogs = await slp.getAllLogs()
    allProjects = await pp.getAllProjects()
    return alltasks ? allLogs ? {
        "tasks": alltasks,
        "logs": allLogs,
        "projects": allProjects
    } : false : false
}

const saveDataHandler = async (event, mainWindow) => {
    // prompts user for file name and saves the data into the file

    const csvData = "date,project,task,status\n"

    const result = await FileService.saveFile(mainWindow, csvData)
    console.log('handler: saveFile result received:', result)
    return result 
        ? result 
        : ipcMain.emit("DataError", "something went wrong, didn't save")
}

const newTaskHandler = async (event, newTask) => {
    newTask.dateTime = new Date(newTask.dateTime).getTime()
    newTask.project = newTask.project.trim()
    newTask.summary = newTask.summary.trim()
    console.log('newTask', newTask)

    const project = await pp.getByNameOrCreate(newTask.project)
    const task = await tp.create(new Task(-1, project.id, newTask.summary, -1)) // TODO: remove object and replace with direct params
    const status = await sp.get(Status.PENDING)
    const log = await slp.create(new StatusLog(-1, task.id, status.id, newTask.dateTime))
    return (project && task && log) ? {
        "task": task,
        "log": log,
        "project": project
    } : false
}

const editTaskHandler = async (event, taskId, summary) => {
    const result = tp.update(taskId, summary)
    return result
}

const toggleTaskHandler = async (event, taskId, newStatusId, newTime) => {
    statusLog = await slp.create(new StatusLog(-1, taskId, newStatusId, newTime))
    return statusLog ? statusLog : false
}

/// STATE EVENTS

const stateEventHandler = async (event, data) => {
    // TODO
    // console.log('main: state event notified')
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
    sp = new StatusProvider()

    // comms
    ipcMain.handle('newTaskChannel', newTaskHandler)
    ipcMain.handle('taskEditChannel', editTaskHandler)
    ipcMain.handle('taskClickChannel', toggleTaskHandler)
    ipcMain.handle('loadLogsRequest', loadLogsHandler)
    ipcMain.handle('saveDataRequest', () => { saveDataHandler(mainWindow) })
    
    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
    
    console.debug("handlers registered")
}

module.exports = { registerHandlers }