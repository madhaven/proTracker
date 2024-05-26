const { ipcMain } = require('electron')
const { dialog, app } = require('electron')
const ExcelJS = require('exceljs')

const { StatusLogProvider } = require('./Providers/StatusLogProvider')
const { HabitLogProvider } = require('./Providers/HabitLogProvider')
const { ProjectProvider } = require('./Providers/ProjectProvider')
const { StatusProvider } = require('./Providers/StatusProvider')
const { HabitProvider } = require('./Providers/HabitProvider')
const { TaskProvider } = require('./Providers/TaskProvider')
const { FileService } = require('./Services/FileService')
const { StatusLog } = require('./Models/StatusLog')
const { HabitLog } = require('./Models/HabitLog')
const { Project } = require('./Models/Project')
const { Status } = require('./Models/Status')
const { Habit } = require('./Models/Habit')
const { Task } = require('./Models/Task')


// TODO: move export colors to seperate class / Service
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
var TP, PP, SLP, SP, HP, HLP

const DataRequestHandler = async (event) => {
    const alltasks = await TP.getAllTasks() ?? false
        , allTaskLogs = await SLP.getAllLogs() ?? false
        , allProjects = await PP.getAllProjects() ?? false
        , allHabits = await HP.getAllHabits() ?? false
        , allHabitLogs = await HLP.getAllLogs() ?? false
        
    // TODO: convertModelToContract

    if (!alltasks || !allTaskLogs || !allProjects  || !allHabits || !allHabitLogs)
        return false

    return {
        "tasks": alltasks,
        "taskLogs": allTaskLogs,
        "projects": allProjects,
        "habits": allHabits,
        "habitLogs": allHabitLogs,
        "appVersion": app.getVersion(),
    }
}

const exportDataHandler = async (event, mainWindow, logTree) => {
    // prompts user for file name and saves the data into the file
    // TODO: fetch from backend instead of front: shift logTree gen methods from front to back?

    try {
        const filename = await FileService.selectFileSaveName(mainWindow)
        if (!filename) return false

        const workBook = new ExcelJS.Workbook()
            , logSheet = workBook.addWorksheet('Logs')
            , projectsSheet = workBook.addWorksheet('Project Overview')
            , tasks_array = await TP.getAllTasks()
            , project_array = await PP.getAllProjects()
            , logs = await SLP.getAllLogs()
            , projects = {}
            , tasks = {}
        for (const project of project_array) {
            projects[project.id] = project
        }
        for (const task of tasks_array) {
            tasks[task.id] = task
        }


        await renderExportLogSheet(logSheet, logTree, tasks, projects)
        await renderProjectsLogSheet(projectsSheet, projects, tasks, logs)
        await workBook.xlsx.writeFile(filename);
        return true
    } catch (err) {
        if (err.code == 'EBUSY') {
            console.trace('export error handled: resource busy', err)
            return 'noAccess'
        } else {
            console.trace('export error unhandled', err) // TODO: report to server
            return 'exportException'
        }
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
    for (const [day, pros] of logTree) {
        var [year, month, date] = day.split(',')
        year = year.padStart(4, '0')
        month = (parseInt(month)+1).toString().padStart(2, '0')
        date = date.padStart(2, '0')
        ws.getCell(currentRow, COLUMN_DATE).value = `${year}-${month}-${date}`
        if (currentRow != 2) ws.getRow(currentRow).border = BORDER_TOP_THIN
        for (const [projectId, tas] of pros) {
            for (const [taskId, log] of tas) {
                const projectName = projects[projectId].name
                const summary = tasks[taskId].summary
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
    const projectTree = await PP.getProjectTree(logs, tasks) // project > task > statusLog

    var sl = 1
    for (const projectId in projectTree) {
        const project = projectTree[projectId]
        var startDay = Infinity
            , endDay = -Infinity
            , complete = true
        for (const taskId in project) {
            if (project[taskId][0].dateTime < startDay)
                startDay = project[taskId][0].dateTime
            if ((project[taskId][1] == undefined) || (project[taskId][1].statusId != 4))
                complete = false
            else if (project[taskId][1].dateTime > endDay)
                endDay = project[taskId][1].dateTime
        }
        startDay = new Date(startDay)
        endDay = (complete) ? new Date(endDay) : new Date()
        const diff = Math.floor((endDay - startDay)/(24*60*60*1000)) + ' days'
        var [startYear, startMonth, startDate, endYear, endMonth, endDate] = [
            startDay.getFullYear().toString().padStart(4, '0'),
            (startDay.getMonth()+1).toString().padStart(2, '0'),
            startDay.getDate().toString().padStart(2, '0'),
            endDay.getFullYear().toString().padStart(4, '0'),
            (endDay.getMonth()+1).toString().padStart(2, '0'),
            endDay.getDate().toString().padStart(2, '0'),
        ]

        const currentRow = sl + 1
        ws.getCell(currentRow, 1).value = sl
        ws.getCell(currentRow, 2).value = projects[projectId].name
        ws.getCell(currentRow, 3).value = `${startYear}-${startMonth}-${startDate}`
        ws.getCell(currentRow, 5).value = diff
        if (complete) {
            ws.getCell(currentRow, 2).fill = FILL_HEAD_GREEN
            ws.getCell(currentRow, 4).value = `${endYear}-${endMonth}-${endDate}`
        }
        sl++
    }
    const focus = ws.getRow(sl+1).getCell(3).fullAddress.address
    ws.views = [ {state: 'frozen', ySplit: 1, activeCell: focus} ]
    return ws
}

const editProjectHandler = async (event, project) => {
    projectModel = new Project(project.id, project.name)
    var projectInDB = await PP.getByName(projectModel.name)
    if (projectInDB) {
        // TODO: create structured responses, false values limits the reasons for failure
        return false
    }
    const result = PP.update(projectModel)
    return result
}

const newTaskHandler = async (event, newTask) => {
    newTask.dateTime = new Date(newTask.dateTime).getTime()
    newTask.project = newTask.project.trim()
    newTask.summary = newTask.summary.trim()

    const project = await PP.getByNameOrCreate(newTask.project)
    const task = await TP.create(newTask.summary, project.id, -1)
    const status = await SP.getById(Status.PENDING)
    const log = await SLP.create(new StatusLog(-1, task.id, status.id, newTask.dateTime))
    return (project && task && log) ? {
        "task": task,
        "log": log,
        "project": project
    } : false
}

const editTaskHandler = async (event, task) => {
    const result = TP.update(task)
    return result
}

const toggleTaskHandler = async (event, taskId, newStatusId, newTime) => {
    statusLog = await SLP.create(new StatusLog(-1, taskId, newStatusId, newTime))
    return statusLog ?? false
}

const createHabitHandler = async (event, newHabit) => {
    if (newHabit.days > 7
        || newHabit.days < 1
        || newHabit.name.length <= 0
    ) res(false);
    newHabit.endTime = new Date(newHabit.endTime).getTime();
    newHabit.lastLogTime = new Date(newHabit.lastLogTime).getTime();
    newHabit.startTime = new Date(newHabit.startTime).getTime();

    habit = await HP.create(newHabit)
    return newHabit ?? false
}

const editHabitHandler = async (event, newHabit) => {
    newHabit = await HP.update(newHabit.id, newHabit)
    return newHabit ?? false
}

const habitDoneHandler = async (event, habitId, time) => {
    const habit = await HP.get(habitId)
        , lastDayLogged = new Date(habit.lastLogTime)
        , today = new Date()

    if (today.getFullYear() == lastDayLogged.getFullYear()
        && today.getMonth() == lastDayLogged.getMonth()
        && today.getDate() == lastDayLogged.getDate()
    ) {
        throw Error("Already Logged Habit for the day") // TODO: Notification
    } else {
        habitLog = await HLP.create(new HabitLog(-1, habitId, time))
        return habitLog ?? false
    }
}

const deleteHabitHandler = async (event, habitId, time) => {
    // TODO:
}

/// STATE EVENTS

const stateEventHandler = async (event, data) => {
    // TODO:
    // console.log('main: state event notified')
}

const stateChangeRequestHandler = async (event, data) => {
    // TODO:
    console.log('main: state change request recieved', event, data)
}

const registerHandlers = mainWindow => {
    // TODO: Dependency Injection ?
    TP = new TaskProvider()
    PP = new ProjectProvider()
    SLP = new StatusLogProvider()
    SP = new StatusProvider()
    HP = new HabitProvider()
    HLP = new HabitLogProvider

    // comms
    ipcMain.handle('projectEditChannel', editProjectHandler)
    ipcMain.handle('newTaskChannel', newTaskHandler)
    ipcMain.handle('taskEditChannel', editTaskHandler)
    ipcMain.handle('taskClickChannel', toggleTaskHandler)
    ipcMain.handle('habitCreateChannel', createHabitHandler)
    ipcMain.handle('habitEditChannel', editHabitHandler)
    ipcMain.handle('habitDoneChannel', habitDoneHandler)
    ipcMain.handle('deleteHabitChannel', deleteHabitHandler)
    ipcMain.handle('loadDataRequest', DataRequestHandler)
    ipcMain.handle('exportDataRequest', (event, logTree) => { return exportDataHandler(event, mainWindow, logTree) })
    
    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)

    console.debug("backend event handlers registered")
}

module.exports = { registerHandlers }