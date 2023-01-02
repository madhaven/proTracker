var sideBarState = undefined
var data = []

function clearAllLogs() {
    // clears all logs
    for (var day of document.querySelectorAll('.logDay:not(.header)')) {
        day.remove()
    }
}

function populatePage(dataset) {
    // populates the log page with items from the dataset
    for (var log of dataset) {
        addLogToUI(...log)
    }
}

function setDefaultDate() {
    // sets a default date for the input field
    now = new Date()
    date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()
    document.getElementById('newLogDate').value = date
}

async function taskClick(event, element) {
    // handles the event when a task in the log page is clicked
    task = element.getElementsByClassName('logTask')[0]
    console.log(element, task)
    taskid = 'x'
    state = 'x'
    const response = await comms.toggleTask(taskid)
    // TODO: complete server response
    if (Math.random() >= 0.5)
        task.classList.add('completed')
    else 
        task.classList.remove('completed')
}

function toggleSideBar(setState = undefined) {
    // handles the open and close of the sidebar
    const sidebar = document.getElementById('sideBar')
    const handle = document.getElementById('sideHandle')
    if ((setState==undefined && !sideBarState) || setState==true) {
        // open side bar
        sidebar.style.left = "0%";
        handle.style.left = "0%";
        handle.style.transform = "translate(0%, -50%) rotate(90deg)"
        sideBarState = true
        document.body.classList.add('scrollLock')
    } else if ((setState==undefined && sideBarState) || setState==false) {
        // close side bar
        sidebar.style.left = "-100vw";
        handle.style.left = "100%";
        handle.style.transform = "translate(0%, -50%) rotate(90deg)"
        sideBarState = false
        document.body.classList.remove('scrollLock')
    }
}
document.getElementById('sideBar').addEventListener('click', () => {
    toggleSideBar()
})
document.querySelectorAll('#sideBar li').forEach((item) => {
    item.addEventListener('click', () => {
        toggleSideBar()
    })
})

function newLogInput() {
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
    
    // TODO: add to db
    if (true) {
        // add stuff to log UI
        addLogToUI(date, project, task)
        
        // clear input fields
        UItask.value = UIproject.value = ""
        setDefaultDate()
    }
}

function addLogToUI(date, project, task, progress) {
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
    logTask.addEventListener('click', (event) => {
        taskClick(event, taskRow)
    })
}

function dataFromMainHandler(event, logs) {
    // handles the data received from Main process and adds it to the log page
    logs.forEach(log => {
        data.push(log)
        addLogToUI(log.date, log.project, log.task, log.status)
    });
    toggleSideBar(false)
    document.getElementById('inputs').scrollIntoView()
}

function errFromMainHandler(err, args) {
    // handles any error from the main process on ...?
    console.log(args, err)
    alert(args)
}

window.addEventListener('load', (event) => {
    setDefaultDate()
    toggleSideBar(true)
    comms.registerMainDataCallback(dataFromMainHandler)
    comms.registerMainDataErrorHandler(errFromMainHandler)
    document.getElementById('inputs').scrollIntoView()
    document.getElementById('newLogTask').addEventListener('change', (event) => {
        newLogInput()
    })
    document.getElementById('loadButton').addEventListener('click', () => {
        clearAllLogs()
        comms.loadFile()
    })
    document.getElementById('saveButton').addEventListener('click', async () => {
        comms.saveData(
            data,
            result => {
                console.log(result)
                if (result === true) {
                    console.log('TODO: BUILD UI FOR SUCCESFUL SAVE')
                } else {
                    console.log('TODO: BUILD UI FOR FAILED SAVE')
                }
            },
            (err, data) => {
                console.log('ERROR', err, data)
            }
        )
    })
})