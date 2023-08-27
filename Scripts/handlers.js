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

const COLUMN_DATE = 1
    , COLUMN_PROJECT = 2
    , COLUMN_PENDING = 3
    , COLUMN_DONE = 4
    , BORDER_TOP_THIN = { top: { style: 'thin', color: 'black' }}
    , BORDER_BOTTOM_THICC = { bottom: { style: 'thick', color: { argb: 'FF000000' } }}
    , FONT_RED = { color: { argb: 'FF990033' }}
    , FONT_GREEN = { color: { argb: 'FF006600' }}
    , FONT_BOLD = { bold: true }
    , FILL_HEAD_RED = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'FFFFC7CE' }
    }
    , FILL_HEAD_GREEN = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'FFC6EFCE' }
    };
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

const exportDataHandler = async (event, mainWindow, logTree, tasks, projects, logs) => {
    // prompts user for file name and saves the data into the file
    // TODO: fetch from backend instead of front: shift logTree gen methods from front to back?

    try {
        const workBook = new ExcelJS.Workbook()
            , logSheet = workBook.addWorksheet('Logs')
            , projectsSheet = workBook.addWorksheet('Project Overview')
        renderExportLogSheet(logSheet, logTree, tasks, projects)
        renderProjectsLogSheet(projectsSheet, projects, tasks, logs)
        
        const filename = await FileService.selectFileSaveName(mainWindow)
        if (!filename) return false
        await workBook.xlsx.writeFile(filename);
        return true
    } catch (err) {
        console.log('export error', err)
        if (err.code == 'EBUSY')
            return 'noAccess'
        else
            return 'exportException' // TODO: logging
    }
}

const renderExportLogSheet = async (ws, logTree, tasks, projects) => {
    ws.getCell(1, 1).value = 'Date'
    ws.getCell(1, 2).value = 'Project'
    ws.getCell(1, 3).value = 'To-Do'
    ws.getCell(1, 4).value = 'Done'
    ws.getCell(1, 3).fill = FILL_HEAD_RED
    ws.getCell(1, 4).fill = FILL_HEAD_GREEN
    ws.getColumn(3).font = FONT_RED // TODO: set bgcolor
    ws.getColumn(4).font = FONT_GREEN // TODO: set bgcolor
    ws.getRow(1).font = FONT_BOLD
    ws.getRow(1).border = BORDER_BOTTOM_THICC

    var currentRow = 2
    for (const day in logTree) {
        const [year, month, date] = day.split(',')
        ws.getCell(currentRow, COLUMN_DATE).value = `${year}-${month}-${date}`
        if (currentRow != 2) ws.getRow(currentRow).border = BORDER_TOP_THIN
        for (const taskId in logTree[day]) {
            const projectName = projects[tasks[taskId].projectId].name
            const summary = tasks[taskId].summary
            const log = logTree[day][taskId]
            ws.getCell(currentRow, COLUMN_PROJECT).value = projectName

            var column = 0, style = undefined
            if (log.statusId == 1) {
                column = COLUMN_PENDING
            } else if (log.statusId == 4) {
                column = COLUMN_DONE
            }
            const cell = ws.getCell(currentRow, column)
            cell.value = summary
            currentRow++
        }
    }
    const focus = ws.getRow(currentRow).getCell(3).fullAddress.address
    ws.views = [ {state: 'frozen', ySplit: 1, activeCell: focus} ]
    return ws
}

const renderProjectsLogSheet = async (ws, projects, tasks, logs) => { // is it better to process data on the back or on the front ?
    ws.getCell(1, 1).value = 'Sl. no.'
    ws.getCell(1, 2).value = 'Project'
    ws.getCell(1, 3).value = 'Start Date'
    ws.getCell(1, 4).value = 'End Date'
    ws.getCell(1, 5).value = 'Time Spent'
    ws.getRow(1).font = FONT_BOLD
    ws.getRow(1).border = BORDER_BOTTOM_THICC
    // const tasks = tp.getAllTasks()
    // const logs = slp.getAllLogs()
    const projectTree = await pp.getProjectTree(logs, tasks) // project > task > statusLog

    var sl = 1
    for (const projectId in projectTree) {
        const project = projectTree[projectId]
        var startDate = Infinity
            , endDate = -Infinity
            , complete = true
        for (const taskId in project) {
            if (project[taskId][0].dateTime < startDate)
                startDate = project[taskId][0].dateTime
            if ((project[taskId][1] == undefined) || (project[taskId][1].statusId != 4))
                complete = false
            else if (project[taskId][1].dateTime > endDate)
                endDate = project[taskId][1].dateTime
        }
        startDate = new Date(startDate)
        endDate = (complete) ? new Date(endDate) : new Date()
        const diff = Math.floor((endDate - startDate)/(24*60*60*1000)) + ' days'

        const currentRow = sl + 1
        ws.getCell(currentRow, 1).value = sl
        ws.getCell(currentRow, 2).value = projects[projectId].name
        ws.getCell(currentRow, 3).value = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`
        ws.getCell(currentRow, 5).value = diff
        if (complete) {
            ws.getCell(currentRow, 2).fill = FILL_HEAD_GREEN
            ws.getCell(currentRow, 4).value = `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`
        }
        sl++
    }
    const focus = ws.getRow(sl+1).getCell(3).fullAddress.address
    ws.views = [ {state: 'frozen', ySplit: 1, activeCell: focus} ]
    return ws
}

const newTaskHandler = async (event, newTask) => {
    newTask.dateTime = new Date(newTask.dateTime).getTime()
    newTask.project = newTask.project.trim()
    newTask.summary = newTask.summary.trim()

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
    ipcMain.handle('exportDataRequest', (event, a, b, c, d) => { return exportDataHandler(event, mainWindow, a, b, c, d) })
    
    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
    
    console.debug("handlers registered")
}

module.exports = { registerHandlers }