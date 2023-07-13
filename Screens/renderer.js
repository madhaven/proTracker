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
        addLogToUI(...log)
    }
}

const setDefaultDate = () => {
    // sets a default date client: recieved state change promptfor the input field
    const now = new Date()
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

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
    // handles the open and close of the sidebar
    const sidebar = document.getElementById('sideBar')
    const handle = document.getElementById('sideHandle')
    if ((visible==undefined && !sideBarState) || visible==true) {
        // open side bar
        sidebar.classList.add("sideBar_open");
        sideBarState = true
        document.body.classList.add('scrollLock')
        uiState.menuVisible = true
    } else if ((visible==undefined && sideBarState) || visible==false) {
        // close side bar
        sidebar.classList.remove("sideBar_open");
        sideBarState = false
        document.body.classList.remove('scrollLock')
        uiState.menuVisible = false
    }
    state.notifyUIEvent(uiState)
}

const newLogInput = event => {
    // handles new entry made in the log page
    UItask = document.getElementById('newLogTask')
    task = UItask.value
    if (task == "") return
    UIproject = document.getElementById('newLogProject')
    project = UIproject.value
    if (project == "") return
    UIdate = document.getElementById('newLogDate')
    date = UIdate.value
    if (date == "") return
    
    // TODO: notify state change
    if (true) {
        // add stuff to log UI
        addLogToUI(date, project, task)
        
        // clear input fields
        UItask.value = UIproject.value = ""
        setDefaultDate()
    }
}

const loadState = state => {
    uiState = state
    toggleSideBar(state.menuView)
}

const addLogToUI = (date, project, task, progress) => {
    // adds a log to the log page UI
    latestDates = document.getElementsByClassName('stickyDate')
    if (latestDates.length > 0) {
        latestDate = latestDates[latestDates.length - 1].innerHTML.trim()
    } else {
        latestDate = 0
    }
    
    // TODO: compares current date with only the latest date
    if (latestDate != date) {
        // add new date section
        var logDay = document.createElement('div')
        logDay.classList = 'logDay'
        
        var logDate = document.createElement('div')
        logDate.classList = 'logDate'
        
        var stickyDate = document.createElement('div')
        stickyDate.classList = "stickyDate"
        stickyDate.innerHTML = date
        
        var daysTasks = document.createElement('div')
        daysTasks.classList = "daysTasks"
        
        var taskRow = document.createElement('div')
        taskRow.classList = "taskRow"
        
        var logProject = document.createElement('div')
        logProject.classList = "logProject"
        logProject.innerHTML = project
        
        var logTask = document.createElement('div')
        logTask.classList = "logTask"
        logTask.innerHTML = task
        
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
        logProject.innerHTML = project
        
        var logTask = document.createElement('div')
        logTask.classList = "logTask"
        logTask.innerHTML = task
        
        taskRow.appendChild(logProject)
        taskRow.appendChild(logTask)
        targetContainer.appendChild(taskRow)
    }
    
    if (progress == 'done')
        logTask.classList.add('completed')
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

const loadData = () => {
    clearAllLogs()
    comms.loadFile()
}

// connect UI functionality
window.addEventListener('load', event => {
    setDefaultDate()
    document.getElementById('sideBar').addEventListener('click', e => toggleSideBar())
    document.getElementById("sideHandle").addEventListener('click', e => toggleSideBar())
    document.querySelectorAll('#sideBar li').forEach(item => {
        item.addEventListener('click', e => toggleSideBar())
    })
    toggleSideBar(true)

    document.getElementById('inputs').scrollIntoView()
    document.getElementById('newLogTask').addEventListener('change', newLogInput)
    document.getElementById('loadButton').addEventListener('click', loadData)
    document.getElementById('saveButton').addEventListener('click', event => { saveData(data) })
})