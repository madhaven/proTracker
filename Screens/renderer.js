const uiState = new State()

const clearAllLogs = () => {
    // clears all logs
    const allLogs = document.querySelectorAll('.logDay:not(.header)')
    for (var day of allLogs) {
        day.remove()
    }
}

const setDefaultDate = () => {
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

const toggleSideBar = (visible = undefined) => {
    // // handles the open and close of the sidebar
    // const sidebar = document.getElementById('sideBar')
    // const handle = document.getElementById('sideHandle')
    // if ((visible==undefined && !sideBarState) || visible==true) {
    //     // open side bar
    //     sidebar.classList.add("sideBar_open")
    //     sideBarState = true
    //     document.body.classList.add('scrollLock')
    //     uiState.menuVisible = true
    // } else if ((visible==undefined && sideBarState) || visible==false) {
    //     // close side bar
    //     sidebar.classList.remove("sideBar_open")
    //     sideBarState = false
    //     document.body.classList.remove('scrollLock')
    //     uiState.menuVisible = false
    // }
    // state.notifyUIEvent(uiState)
}

const trimInput = (event, leftAndRight=false) => {
    event.srcElement.value = leftAndRight
        ? event.srcElement.value.trim()
        : event.srcElement.value.trimLeft()
}

const newLogInput = event => {
    // handles new entry made in the log page
    
    // validation
    var UIsummary = document.getElementById('newLogTask')
    var UIproject = document.getElementById('newLogProject')
    var UIdate = document.getElementById('newLogDate')
    summary = UIsummary.value
    project = UIproject.value
    date = UIdate.value
    if (!summary) return false
    if (!project) return false
    if (!date) return false
    
    task = { dateTime: date, project: project, summary: summary }
    comms.newTask(
        task,
        result => {
            if (!result) return
            uiState.addLog(result)
            populatePageFromState()

            UIsummary.value = UIproject.value = ""
            setDefaultDate()
        },
        err => {
            console.error('server error while adding new task', err) // TODO remove error logs
        }
    )
}

const taskClick = (event, element, taskLog) => {
    const taskElement = element.querySelector('.logTask')
    // TODO: setup more refined status change mechanism
    const newState = taskLog.statusId == 1 ? 4 : 1
    const currentTime = Date.now()
    console.log('taskClick', element, taskLog)

    comms.toggleTask(
        taskLog.id, newState, currentTime,
        res => {
            const newTaskLog = { ...taskLog }
            newTaskLog.dateTime = res.dateTime
            newTaskLog.statusId = res.statusId
            newTaskLog.statusName = res.statusName

            uiState.addLog(newTaskLog)
            populatePageFromState()
        },
        err => {
            console.error('server error while updating task', err) // TODO remove error logs
        }
    )
}

const populatePageFromState = () => {
    clearAllLogs()
    for (const day in uiState.logTree) {
        const logDay = createOrFindDay(day)
        for (const task in uiState.logTree[day]) {
            const taskRow = createTaskOnDay(logDay, uiState.logTree[day][task])
            decorateTaskRow(taskRow, uiState.logTree[day][task])
        }
    }
}

const createOrFindDay = (date) => {
    const t = new Date(date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const displayDate = `${t.getFullYear()} ${months[t.getMonth() + 1]} ${t.getDate()}`
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

    for (log of allTasks) {
        if (log.id == displayId)
            return log
    }

    taskRow.classList.add('taskRow')
    taskRow.id = displayId
    logProject.classList.add('logProject')
    logTask.classList.add('logTask')

    logProject.innerHTML = task.projectName
    logTask.innerHTML = task.summary

    taskRow.append(logProject)
    taskRow.append(logTask)
    daysTasks.append(taskRow)
    return taskRow
}

const decorateTaskRow = (taskRow, task) => {
    const logTask = taskRow.querySelector('.logTask');
    logTask.classList.remove(
        'pending'
        , 'in_progress'
        , 'need_info'
        , 'completed'
        , 'waiting'
        , 'wont_do'
    )
    switch (task.statusName) {
        case "PENDING":
            logTask.classList.add('pending')
            break
        case "IN_PROGRESS": break
        case "NEED_INFO": break
        case "COMPLETED":
            logTask.classList.add('completed')
            break
        case "WAITING": break
        case "WONT_DO": break
    }
    if (new Date().toDateString() == new Date(task.dateTime).toDateString()) {
        logTask.addEventListener('click', event => {
            taskClick(event, taskRow, task)
        }) // TODO: does this belong here?
    }
}

const saveData = data => { // TODO ?
    comms.saveData(
        data,
        result => {
            console.log('saveData result', result)
            if (result === true) {
                console.log('TODO: BUILD UI FOR SUCCESFUL SAVE')
            } else {
                console.log('TODO: BUILD UI FOR FAILED SAVE')
            }
        },
        err => {
            console.log('saveData ERROR', err) // TODO: remove logs
        }
    )
}

// loads logs from db
const requestLogs = () => {
    comms.loadLogs(
        res => {
            if (res){
                uiState.replaceLogs(res)
                populatePageFromState()
            } else
                console.error('corrupt logs received')
        },
        err => console.log('server error while loading logs')
    )
}

// COMMS

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

const recieveStateChanges = (event, state) => {
    // TODO
    console.log('UI|updateUI: recieved state change prompt', event, state)
    if (typeof(state) != State){
        console.log("state isn't of type State though", state)
    } else {
        // TODO
    }
}

// event Listeners
window.addEventListener('load', event => {
    setDefaultDate()
    requestLogs()
    // document.getElementById('sideBar').addEventListener('click', e => toggleSideBar())
    // document.getElementById("sideHandle").addEventListener('click', e => toggleSideBar())
    // document.querySelectorAll('#sideBar li').forEach((item) => {
    //     item.addEventListener('click', e => toggleSideBar())
    // })
    // toggleSideBar(true)

    document.getElementById('inputs').scrollIntoView()
    // document.getElementById('loadButton').addEventListener('click', requestLogs)
    // document.getElementById('saveButton').addEventListener('click', event => { saveData(data) })
    document.getElementById('newLogProject').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogTask').addEventListener('input', event => { trimInput(event, false) })
    document.getElementById('newLogProject').addEventListener('change', event => { trimInput(event, true)})
    document.getElementById('newLogTask').addEventListener('change', event => { trimInput(event, true)})
    document.getElementById('newLogProject').addEventListener('change', newLogInput)
    document.getElementById('newLogTask').addEventListener('change', newLogInput)
    document.getElementById('newLogDate').addEventListener('change', newLogInput)
    /* ['newLogTask', 'newLogDate', 'newLogProject'].forEach(function (id) {
        document.getElementById(id).addEventListener('change', newLogInput)
    }) // not working for some reason */

    // comm listeners
    state.registerListener('updateUI', recieveStateChanges)
    comms.registerListener('DataPing', dataFromMainHandler)
    comms.registerListener('DataError', errFromMainHandler)
})