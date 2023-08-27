const uiState = new State()
const allowSuperpowers = false // for debugging

// #region Helpers

const setDefaultDate = () => {
    if (!allowSuperpowers) return
    // sets a default date client: recieved state change promptfor the input field
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}T${hour}:${minute}:${second}`

    document.getElementById('newLogDate').value = dateString
}

const clearAllLogs = () => {
    // clears all logs
    const allLogs = document.querySelectorAll('.logDay:not(.header)')
    for (const day of allLogs) {
        day.remove()
    }
}

const trimInput = (event, leftAndRight=false) => {
    event.srcElement.value = leftAndRight
        ? event.srcElement.value.trim()
        : event.srcElement.value.trimLeft()
}

const createDateTimeInput = () => {
    const inputDiv = document.querySelector('#inputs .logDate')
    const input = document.createElement('input')
    input.type = 'datetime-local'
    input.name = 'Date'
    input.id = 'newLogDate'
    input.required = true
    input.placeholder = 'yyyy-mm-dd'
    input.addEventListener('change', newLogInput)
    inputDiv.appendChild(input)
}

const createOrFindDay = (date) => {
    const [year, month, day] = date.split(',')
    const t = new Date(year, month, day)
    const itIsToday = new Date().toDateString() == t.toDateString()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const displayDate = (itIsToday) ? 'Today' : `${year} ${months[month]} ${day}`
    const allDays = document.querySelectorAll('.logDay:not(.header)')

    if (allDays.length > 0) {
        const latestDate = allDays[allDays.length - 1]
        if (latestDate.querySelector('.stickyDate').innerHTML.trim() == displayDate)
            return latestDate
    }

    const logDay = document.createElement('div')
    const logDate = document.createElement('div')
    const stickyDate = document.createElement('div')
    const daysTasks = document.createElement('div')

    if (itIsToday) logDay.classList.add('today')
    logDay.classList.add('logDay')
    logDay.id = t.getTime()
    logDate.classList.add('logDate')
    stickyDate.classList.add('stickyDate')
    daysTasks.classList.add('daysTasks')

    logDate.appendChild(stickyDate)
    logDay.appendChild(logDate)
    logDay.appendChild(daysTasks)
    document.getElementById('inputs').before(logDay)

    stickyDate.innerHTML = displayDate
    return logDay
}

const createRowOnDay = (logDay, task) => {
    const taskRow = document.createElement('div')
    const logProject = document.createElement('div')
    const logTask = document.createElement('div')
    const daysTasks = logDay.querySelector('.daysTasks')
    const stickyDate = logDay.querySelector('.stickyDate').innerHTML.replaceAll(' ', '')
    const displayId = stickyDate + '_' + task.id
    const tasksInDay = logDay.getElementsByClassName('taskRow')
    const project = uiState.projects[task.projectId]

    for (row of tasksInDay) {
        if (row.id == displayId)
            return row
    }

    taskRow.classList.add('taskRow')
    taskRow.id = displayId
    logProject.classList.add('logProject')
    logTask.classList.add('logTask')

    logProject.innerHTML = project.name
    taskRow.appendChild(logProject)
    taskRow.appendChild(logTask)
    daysTasks.appendChild(taskRow)
    return taskRow
}

const createTaskInRow = (logTask, task) => {
    const editIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>'
    const logTaskContent = document.createElement('div')
    const logTaskEditInput = document.createElement('input')
    const logTaskEditButton = document.createElement('span')

    logTaskContent.classList.add('logTaskContent')
    logTaskEditInput.classList.add('logTaskEditInput')
    logTaskEditButton.classList.add('logTaskEditButton')

    logTaskContent.innerHTML = task.summary
    logTaskEditInput.value = task.summary
    logTaskEditButton.innerHTML = editIconSVG
    logTaskEditButton.addEventListener('click', event => {
        makeTaskEditable(event, task, logTask)
    })
    logTaskEditInput.addEventListener('change', logTaskEditInput.blur)
    logTaskEditInput.addEventListener('blur', event => {
        taskEditHandler(event, task, logTaskEditInput.value, logTask)
    })

    logTask.appendChild(logTaskContent)
    logTask.appendChild(logTaskEditInput)
    logTask.appendChild(logTaskEditButton)

    return logTaskContent
}

const decorateTaskRow = (logTask, log) => {
    logTask.classList.remove(
        'pending'
        , 'in_progress'
        , 'need_info'
        , 'completed'
        , 'waiting'
        , 'wont_do'
    )
    switch (log.statusId) {
        case 1: //PENDING
            logTask.classList.add('pending')
            break
        case 2: //IN_PROGRESS
        case 3: //NEED_INFO
        case 4: //COMPLETED
            logTask.classList.add('completed')
            break
        case 4: //WAITING
        case 5: //WONT_DO
    }
    return logTask
}

const addListeners = (taskElement, log, task, day) => {
    var itIsToday
    if (day === false)
        itIsToday = true
    else {
        const [year, month, date] = day.split(',')
        itIsToday = new Date().toDateString() == new Date(year, month, date).toDateString()
    }
    if (allowSuperpowers || itIsToday ) {
        taskElement.addEventListener('click', event => {
            taskClick(event, task, log)
        }) // TODO: does this belong here?
    }
}

const renderProjects = () => {
    const projectList = document.getElementById('projectList')
    projectList.innerHTML = ""
    for (const projectId in uiState.projectTree) {
        const project = uiState.projects[projectId]
        const projectItem = document.createElement('li')
        const projectHeader = document.createElement('h3')
        const taskList = document.createElement('ul')

        for (const taskId in uiState.projectTree[projectId]) {
            const task = uiState.tasks[taskId]
            const statusId = uiState.projectTree[projectId][taskId]
            const taskItem = document.createElement('li')
            taskItem.classList.add('taskRow', 'logTask')
            const logTaskContent = createTaskInRow(taskItem, task)
            decorateTaskRow(taskItem, {'statusId': statusId}, task, true)
            addListeners(logTaskContent, {'statusId': statusId}, task, false)
            taskList.appendChild(taskItem)
        }
        
        taskList.classList.add('taskList')
        projectHeader.innerHTML = project.name
        projectHeader.addEventListener('click', event => {
            projectItemClick(event, projectItem, project)
        })
        
        projectItem.appendChild(projectHeader)
        projectItem.appendChild(taskList)
        projectList.appendChild(projectItem)
    }
}

// #endregion

// #region Actions

const toggleSideBar = (visible = undefined) => {
    // handles the open and close of the sidebar
    const sidebar = document.getElementById('sideBar')
    const handle = document.getElementById('sideHandle')
    if ((visible==undefined && !uiState.menuVisible) || visible==true) {
        // open side bar
        sidebar.classList.add("sideBar_open")
        uiState.menuVisible = true
        document.body.classList.add('scrollLock')
    } else if ((visible==undefined && uiState.menuVisible) || visible==false) {
        // close side bar
        sidebar.classList.remove("sideBar_open")
        uiState.menuVisible = false
        document.body.classList.remove('scrollLock')
    }
    stateComm.notifyUIEvent(uiState) // needed ?
}

const switchToTab = tabName => {
    const menuTabs = document.getElementsByClassName('menuTab')
    for (tab of menuTabs) {
        if (tab.classList.contains(tabName))
            tab.style.display = "block";
        else
            tab.style.display = "none";
    }
}

const exportData = event => {
    var x = event.srcElement.querySelector('svg')
        , source = x ? event.srcElement : event.srcElement.parentElement
    const defaultIcon = source.querySelector('.defaultButton')
        , loadingIcon = source.querySelector('.loadingButton')
        , completeIcon = source.querySelector('.doneButton')
        , failedIcon = source.querySelector('.cancelledButton')
        , resultShowDuration = 2000
    defaultIcon.classList.add('hidden')
    loadingIcon.classList.remove('hidden')
    toggleSideBar()

    const flashIcon = (selector, iconShowDuration, explanation=true) => {
        loadingIcon.classList.add('hidden')
        defaultIcon.classList.remove('hidden')
        defaultIcon.classList.add(selector)
        defaultIcon.parentElement.title = {
            true: "Export Complete",
            false: "the export action was cancelled",
            "noAccess": "proTracker doesn't have access to the file at the moment",
            "exportException": "an unhandled error occurred",
        }[explanation] ?? ""
        setTimeout(() => {
            defaultIcon.classList.remove('success', 'failure')
        }, iconShowDuration)
    }

    comms.exportData(
        uiState.logTree, uiState.tasks, uiState.projects, uiState.logs,
        res => {
            var selector = res == true ? 'success' : 'failure'
            flashIcon(selector, resultShowDuration, res)
        },
        err => {
            console.error('Unhandled Error occurred on Data Export') // TODO logs and error management
            flashIcon('failure', resultShowDuration)
        }
    )
}

const newLogInput = event => {
    // validation
    const UIsummary = document.getElementById('newLogTask')
    const UIproject = document.getElementById('newLogProject')
    const summary = UIsummary.value
    const project = UIproject.value
    const date = new Date()

    if (allowSuperpowers) {
    	const UIdate = document.getElementById('newLogDate')
	    const debugDate = new Date(UIdate.value)
	    date.setDate(debugDate.getDate())
	    date.setMonth(debugDate.getMonth())
	    date.setYear(debugDate.getFullYear())
    }
    
    if (!date) return false
    if (!summary) return false
    if (!project) return false
    
    const task = { dateTime: date.getTime(), project: project, summary: summary }
    comms.newTask(
        task,
        res => {
            if (!res) return
            uiState.addData(res.log, res.task, res.project)
            populatePageFromState()

            setDefaultDate()
            UIsummary.value = UIproject.value = ""
            UIproject.focus()
        },
        err => {
            console.error('server error while adding new task', err) // TODO remove error logs
        }
    )
}

const taskClick = (event, task, log) => {
    // TODO: setup more refined status change mechanism
    const newState = log.statusId == 1 ? 4 : 1
    const currentTime = Date.now()
    comms.toggleTask(
        task.id, newState, currentTime,
        res => {
            uiState.addLog(res)
            populatePageFromState()
        },
        err => {
            console.error('server error while updating task', err) // TODO remove error logs
        }
    )
}

const makeTaskEditable = (event, task, logTask) => {
    const logTaskEditInput = logTask.querySelector('.logTaskEditInput')
    logTaskEditInput.value = task.summary
    logTask.classList.add('editable')
    logTaskEditInput.focus()
}

const projectItemClick = (event, element, project) => {
    const taskList = element.querySelector('.taskList')
    if (taskList.classList.contains('hidden')) { 
        taskList.classList.remove('hidden')
        element.classList.remove('emptyProject')
    } else {
        taskList.classList.add('hidden')
        element.classList.add('emptyProject')
    }
}

const populatePageFromState = () => {
    clearAllLogs()
    for (const day in uiState.logTree) {
        const logDay = createOrFindDay(day)
        for (const taskId in uiState.logTree[day]) {
            const log = uiState.logTree[day][taskId]
            const task = uiState.tasks[taskId]
            const taskRow = createRowOnDay(logDay, task)
            const logTask = taskRow.querySelector('.logTask')
            const logTaskContent = createTaskInRow(logTask, task)
            decorateTaskRow(logTask, log)
            addListeners(logTaskContent, log, task, day)
        }
    }
    renderProjects()
}

const saveData = () => { // TODO ?
    comms.saveData(
        result => {
            console.log('saveData result', result)
        },
        err => {
            alert('ProTracker ran Into an Error while trying to save')
            console.error('ProTracker ran Into an Error while trying to save', err) // TODO: remove logs
        }
    )
}

// #endregion

// #region COMMS

const dataFromMainHandler = (event, logs) => {
    // handles the data received from Main process and adds it to the log page
    console.log('UI|DataPing ### REMOVE THIS THING')
    logs.forEach(log => {
        uiState.newLog(log)
        populatePageFromState()
    })
    toggleSideBar(false)
    document.getElementById('inputs').scrollIntoView()
}

const errFromMainHandler = (err, args) => {
    // handles any error from the main process on ...?
    console.error(args, err)
}

const taskEditHandler = (event, task, newSummary, taskElement) => {
    comms.editTask(
        task.id, newSummary,
        res => {
            taskElement.classList.remove('editable')
            if (!res) console.error('Unable to edit Task')
            uiState.tasks[task.id].summary = newSummary
            populatePageFromState()
        },
        err => {
            console.error('Unable to edit Task due to an internal error')
            taskElement.classList.remove('editable')
        }
    )
}

const requestDataFromDB = () => {
    comms.loadData(
        res => {
            if (res){
                uiState.replaceData(res.logs, res.tasks, res.projects)
                populatePageFromState()
            } else {
                console.error('corrupt logs received')
            }
        },
        err => console.error('server error while loading logs')
    )
}

const recieveStateChanges = (event, state) => {
    // TODO
    console.log('UI|updateUI: recieved state change prompt', event, state)
}

// #endregion

window.addEventListener('load', event => {
    document.getElementById('sideBar').addEventListener('click', e => toggleSideBar())
    document.getElementById("sideHandle").addEventListener('click', e => toggleSideBar())

    // Menu Buttons
    document.querySelector('#logChart.menuButton').addEventListener('click', event => { switchToTab('logChart') })
    document.querySelector('#projects.menuButton').addEventListener('click', event => { switchToTab('projectTab') })
    document.querySelector('#export.menuButton').addEventListener('click', exportData)
    // document.querySelector('#load.menuButton').addEventListener('click', requestDataFromDB)
    // document.querySelector('#save.menuButton').addEventListener('click', event => { saveData() })

    document.getElementById('inputs').scrollIntoView()
    document.getElementById('newLogProject').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogProject').addEventListener('change', event => { trimInput(event, true) })
    document.getElementById('newLogProject').addEventListener('change', newLogInput)
    document.getElementById('newLogTask').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogTask').addEventListener('change', event => { trimInput(event, true) })
    document.getElementById('newLogTask').addEventListener('change', newLogInput)
    if (allowSuperpowers) createDateTimeInput()
    
    // comm listeners
    stateComm.registerListener('updateUI', recieveStateChanges)
    comms.registerListener('DataPing', dataFromMainHandler)
    comms.registerListener('DataError', errFromMainHandler)

    setDefaultDate()
    requestDataFromDB()
    toggleSideBar(true)
})