var uiState = new State()
var data = []

const clearAllLogs = () => {
    // clears all logs
    for (var day of document.querySelectorAll('.logDay:not(.header)')) {
        day.remove()
    }
}

const populatePage = dataset => {
    // populates the log page with items from the dataset
    for (var log of dataset) {
        addTaskToUI(...log)
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
    const dateString = `${year}-${month}-${day}T${hour}:${minute}`

    document.getElementById('newLogDate').value = dateString
}

const taskClick = async (event, element) => {
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

const inputTrimmer = (event, leftAndRight=false) => {
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
                console.log(result)
                addTaskToUI(result)

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

const loadState = state => {
    uiState = state
    toggleSideBar(state.menuView)
}

// adds a log to the log page UI
const addTaskToUI = (task) => {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var date = new Date(task.dateTime)
    displayDate = `${date.getFullYear()} ${months[date.getMonth()]} ${date.getDate()}`
    latestDates = document.getElementsByClassName('stickyDate')
    if (latestDates.length > 0) {
        latestDate = latestDates[latestDates.length - 1].innerHTML.trim()
    } else {
        latestDate = 0
    }
    
    // TODO: compares current date with only the latest date
    // add new date section
    if (latestDate != displayDate) {
        var logDay = document.createElement('div')
        logDay.classList = 'logDay'
        
        var logDate = document.createElement('div')
        logDate.classList = 'logDate'
        
        var stickyDate = document.createElement('div')
        stickyDate.classList.add("stickyDate")
        stickyDate.innerHTML = displayDate
        
        var daysTasks = document.createElement('div')
        daysTasks.classList = "daysTasks"
        
        var taskRow = document.createElement('div')
        taskRow.classList = "taskRow"
        
        var logProject = document.createElement('div')
        logProject.classList = "logProject"
        logProject.innerHTML = task.projectName
        
        var logTask = document.createElement('div')
        logTask.classList = "logTask"
        logTask.innerHTML = task.summary
        
        logDate.appendChild(stickyDate)
        logDay.appendChild(logDate)
        logDay.appendChild(daysTasks)
        daysTasks.append(taskRow)
        taskRow.append(logProject)
        taskRow.append(logTask)
        
        var chart = document.getElementsByClassName('logChart')[0]
        inputs = document.getElementById('inputs')
        inputs.remove()
        chart.appendChild(logDay)
        chart.appendChild(inputs)
    } else {
        // add new task row
        var days = document.getElementsByClassName('logDay')
        targetDay = days[days.length-2]
        targetContainer = targetDay.getElementsByClassName('daysTasks')[0]

        var taskRow = document.createElement('div')
        taskRow.classList = "taskRow"
        
        var logProject = document.createElement('div')
        logProject.classList = "logProject"
        logProject.innerHTML = task.projectName
        
        var logTask = document.createElement('div')
        logTask.classList = "logTask"
        logTask.innerHTML = task.summary
        
        taskRow.appendChild(logProject)
        taskRow.appendChild(logTask)
        targetContainer.appendChild(taskRow)
    }
    
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
        taskClick(event, taskRow)
    })
}

const saveData = data => {
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

const loadLogs = () => {
    clearAllLogs()
    comms.loadLogs(
        res => {
            if (res){
                console.log('logs', res)
                res.forEach(task => { addTaskToUI(task) })
            } else
                console.error('corrupt logs received')
        },
        err => console.log('error loading logs', err)
    )
}

// COMMS

const dataFromMainHandler = (event, logs) => {
    // handles the data received from Main process and adds it to the log page
    console.log('UI|DataPing ### REMOVE THIS THING')
    logs.forEach(log => {
        data.push(log)
        addTaskToUI(log.date, log.project, log.task, log.status)
    })
    toggleSideBar(false)
    document.getElementById('inputs').scrollIntoView()
}

const errFromMainHandler = (err, args) => {
    // handles any error from the main process on ...?
    console.log(args, err)
    alert(args)
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
    loadLogs()
    // document.getElementById('sideBar').addEventListener('click', e => toggleSideBar())
    // document.getElementById("sideHandle").addEventListener('click', e => toggleSideBar())
    // document.querySelectorAll('#sideBar li').forEach((item) => {
    //     item.addEventListener('click', e => toggleSideBar())
    // })
    // toggleSideBar(true)

    document.getElementById('inputs').scrollIntoView()
    // document.getElementById('loadButton').addEventListener('click', loadLogs)
    // document.getElementById('saveButton').addEventListener('click', event => { saveData(data) })
    document.getElementById('newLogProject').addEventListener('input', event => { inputTrimmer(event, false) })
    document.getElementById('newLogTask').addEventListener('input', event => { inputTrimmer(event, false) })
    document.getElementById('newLogProject').addEventListener('change', event => { inputTrimmer(event, true)})
    document.getElementById('newLogTask').addEventListener('change', event => { inputTrimmer(event, true)})
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