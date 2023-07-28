const uiState = new State()

const clearAllLogs = () => {
    // clears all logs
    for (var day of document.querySelectorAll('.logDay:not(.header)')) {
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

const taskClick = async (event, element, task) => {
    // handles the event when a task in the log page is clicked
    task = element.getElementsByClassName('logTask')[0]
    console.log(element, task)
    taskid = 'x'
    state = 'x'
    const response = await comms.toggleTask(taskid)
    // TODO: complete server response with state mechanism
    console.log('response from server: ', typeof(response), response)
    if (response == true)
        task.classList.add('completed')
    else if (response == false)
        task.classList.remove('completed')
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
            if (result) {
                console.log('newloginput result', result)
                uiState.addLog(result)
                populatePageFromState()

                // clear inputs
                UIsummary.value = UIproject.value = ""
                setDefaultDate()
            }
        },
        err => {
            console.error('newtask error', err) // TODO remove error logs
        }
    )
    // todo notify state
}

const populatePageFromState = () => {
    clearAllLogs()
    for (var taskLog of uiState.logs) {
        const logDay = createOrFindDay(taskLog.dateTime)
        const taskRow = createTaskOnDay(logDay, taskLog)
        decorateTaskRow(taskRow, taskLog)
    }
}

const createOrFindDay = (date) => {
    const t = new Date(date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const displayDate = `${t.getFullYear()} ${months[t.getMonth()]} ${t.getDate()}`
    const allDays = document.querySelectorAll('.logDay:not(.header)')

    if (allDays.length > 0) {
        const latestDate = allDays[allDays.length - 1]
        if (latestDate.getElementsByClassName('stickyDate')[0].innerHTML.trim() == displayDate)
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
    const daysTasks = logDay.getElementsByClassName('daysTasks')[0]

    taskRow.classList.add('taskRow')
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
    const logTask = taskRow.getElementsByClassName('logTask')[0];
    [
        'pending',
        'in_progress',
        'need_info',
        'completed',
        'waiting',
        'wont_do'
    ].forEach(cls => { logTask.classList.remove(cls) })
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
    logTask.addEventListener('click', event => {
        taskClick(event, taskRow, task)
    }) // TODO: does this belong here?
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
            console.log('saveData ERROR', err)
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

const loadState = state => {
    uiState = state
    toggleSideBar(state.menuView)
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
        loadState(state)
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