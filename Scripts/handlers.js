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
const ExcelJS = require('exceljs')

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

const test = async (event, string) => {
    eval(string)
}


const exportDataHandler = async (event, mainWindow, logTree, tasks, projects) => {
    // prompts user for file name and saves the data into the file
    // TODO: fetch from backend instead of front

    const wb = new ExcelJS.Workbook()
        , ws = wb.addWorksheet('Logs')
        , COLUMN_DATE = 1
        , COLUMN_PROJECT = 2
        , COLUMN_PENDING = 3
        , COLUMN_DONE = 4
        , BORDER_TOP_THIN = { top: { style: 'thin', color: 'black' }}
        , BORDER_LEFT_THIN = { left: { style: 'thin', color: 'black' }}
        , BORDER_BOTTOM_THICC = { bottom: { style: 'thick', color: 'black' }}
        , FONT_RED = { color: {argb: 'FF990033' }}
        , FONT_GREEN = { color: {argb: 'FF006600' }}

    ws.getCell(1, 1).value = 'Date'
    ws.getCell(1, 2).value = 'Project'
    ws.getCell(1, 3).value = 'Blocker'
    ws.getCell(1, 4).value = 'Achievemnt'
    ws.getRow(1).border = BORDER_BOTTOM_THICC
    // ws.row(1).freeze()
    ws.views = [ {state: 'frozen', ySplit: 1} ]
    
    var currentRow = 2
    for (const day in logTree) {
        const [year, month, date] = day.split(',')
        ws.getCell(currentRow, COLUMN_DATE).value = `${year}-${month}-${date}`
        ws.getRow(currentRow).border = BORDER_TOP_THIN
        for (const taskId in logTree[day]) {
            const projectName = projects[tasks[taskId].projectId].name
            const summary = tasks[taskId].summary
            const log = logTree[day][taskId]
            ws.getCell(currentRow, COLUMN_PROJECT).value = projectName

            var column = 0, font = undefined
            if (log.statusId == 1) {
                column = COLUMN_PENDING
                font = FONT_RED
            } else if (log.statusId == 4) {
                column = COLUMN_DONE
                font = FONT_GREEN
            }
            const cell = ws.getCell(currentRow, column)
            cell.value = summary
            cell.font = font
            currentRow++
        }
    }
    
    const filename = await FileService.selectFileSaveName(mainWindow)
    if (!filename) return false
    await wb.xlsx.writeFile(filename);

    return true
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
    ipcMain.handle('exportDataRequest', (event, a, b, c) => { exportDataHandler(event, mainWindow, a, b, c) })
    ipcMain.handle('test', test)
    
    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
    
    console.debug("handlers registered")
}

module.exports = { registerHandlers }