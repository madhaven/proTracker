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

const createTaskOnDay = (logDay, task) => {
    const taskRow = document.createElement('div')
    const logProject = document.createElement('div')
    const logTask = document.createElement('div')
    const daysTasks = logDay.querySelector('.daysTasks')
    const stickyDate = logDay.querySelector('.stickyDate').innerHTML.replaceAll(' ', '')
    const displayId = stickyDate + '_' + task.id
    const allTasks = logDay.getElementsByClassName('taskRow')
    const project = uiState.projects[task.projectId]

    for (row of allTasks) {
        if (row.id == displayId)
            return row
    }

    taskRow.classList.add('taskRow')
    taskRow.id = displayId
    logProject.classList.add('logProject')
    logTask.classList.add('logTask')

    logProject.innerHTML = project.name
    logTask.innerHTML = task.summary

    taskRow.append(logProject)
    taskRow.append(logTask)
    daysTasks.append(taskRow)
    return taskRow
}

const decorateTaskRow = (taskRow, log) => {
    const logTask = taskRow.querySelector('.logTask');
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
}

const addListeners = (day, taskRow, log, task) => {
    const logTask = taskRow.querySelector('.logTask');
    const [year, month, date] = day.split(',')
    const itIsToday = new Date().toDateString() == new Date(year, month, date).toDateString()
    if (itIsToday || allowSuperpowers) {
        logTask.addEventListener('click', event => {
            taskClick(event, taskRow, task, log)
        }) // TODO: does this belong here?
    }
}

const loadProjects = () => {
    const projectList = document.getElementById('projectList')
    projectList.innerHTML = ""
    for (const projectId in uiState.projects) {
        const project = uiState.projects[projectId]
        const projectNode = document.createElement('li')
        projectNode.addEventListener('click', event => {
            projectClick(event, projectNode, project)
        })
        projectNode.innerHTML = project.name
        projectList.appendChild(projectNode)
        console.log(uiState.projects)
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

const switchToTab = (tabName) => {
    const menuTabs = document.getElementsByClassName('menuTab')
    for (tab of menuTabs) {
        if (tab.classList.contains(tabName))
            tab.style.display = "block";
        else
            tab.style.display = "none";
    }
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
    
    const task = { dateTime: date.getSeconds(), project: project, summary: summary }
    comms.newTask(
        task,
        res => {
            if (!res) return
            console.log('newTaskresult', res)
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

const taskClick = (event, element, task, log) => {
    const taskElement = element.querySelector('.logTask')
    // TODO: setup more refined status change mechanism
    const newState = log.statusId == 1 ? 4 : 1
    const currentTime = Date.now()

    comms.toggleTask(
        task.id, newState, currentTime,
        res => {
            console.log('task click result', res)
            uiState.addLog(res)
            populatePageFromState()
        },
        err => {
            console.error('server error while updating task', err) // TODO remove error logs
        }
    )
}

const projectClick = (event, element, project) => {
    console.log(event, element, project)
    // TODO
}

const populatePageFromState = () => {
    clearAllLogs()
    for (const day in uiState.logTree) {
        const logDay = createOrFindDay(day)
        for (const taskId in uiState.logTree[day]) {
            const log = uiState.logTree[day][taskId]
            const task = uiState.tasks[taskId]
            const taskRow = createTaskOnDay(logDay, task)
            decorateTaskRow(taskRow, log)
            addListeners(day, taskRow, log, task)
        }
    }
    loadProjects()
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

    // document.getElementById('load_menuButton').addEventListener('click', requestDataFromDB)
    // document.getElementById('save_menuButton').addEventListener('click', event => { saveData() })
    document.getElementById('logChart_menuButton').addEventListener('click', event => { switchToTab('logChart') })
    document.getElementById('projects_menuButton').addEventListener('click', event => { switchToTab('projectTab') })

    document.getElementById('inputs').scrollIntoView()
    document.getElementById('newLogProject').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogProject').addEventListener('change', event => { trimInput(event, true) })
    document.getElementById('newLogProject').addEventListener('change', newLogInput)
    document.getElementById('newLogTask').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogTask').addEventListener('change', event => { trimInput(event, true) })
    document.getElementById('newLogTask').addEventListener('change', newLogInput)
    if (allowSuperpowers) {
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
    
    // comm listeners
    stateComm.registerListener('updateUI', recieveStateChanges)
    comms.registerListener('DataPing', dataFromMainHandler)
    comms.registerListener('DataError', errFromMainHandler)

    setDefaultDate()
    requestDataFromDB()
    toggleSideBar(true)
})