var sideBarState = false
var data = []

function clearAllLogs(){
    for (var day of document.querySelectorAll('.logDay:not(.header)')){
        day.remove()
    }
}

function populatePage(dataset){
    for (var data of dataset){
        addLogToUI(...data)
    }
}

function setDefaultDate(){
    now = new Date()
    date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()
    document.getElementById('newLogDate').value = date
}

async function taskClick(event, element){
    task = element.getElementsByClassName('logTask')[0]
    console.log(element, task)
    taskid = 'x'
    state = 'x'
    const response = await comms.toggleTask(taskid)
    if (Math.random() >= 0.5) // TODO: complete server response
        task.classList.add('completed')
    else 
        task.classList.remove('completed')
}

function toggleSideBar(){
    const sidebar = document.getElementById('sideBar')
    const handle = document.getElementById('sideHandle')
    if (!sideBarState){
        // open side bar
        sidebar.style.left = "0%";
        handle.style.left = "0%";
        handle.style.transform = "translate(0%, -50%) rotate(90deg)"
        sideBarState = true
        document.body.classList.add('scrollLock')
    } else {
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

function newLogInput(){
    UItask = document.getElementById('newLogTask')
    task = UItask.value
    if (task == "") return
    UIproject = document.getElementById('newLogProject')
    project = UIproject.value
    if (project == "") return
    UIdate = document.getElementById('newLogDate')
    date = UIdate.value
    if (date == "") return
    
    allGood = confirm('Add task: ' + task + '\nProject: ' + project + '\ndate: ' + date)
    if (!allGood) return
    
    // add to db
    if (true && allGood) {
        // add stuff to log UI
        addLogToUI(date, project, task)
        
        // clear input fields
        UItask.value = UIproject.value = ""
        setDefaultDate()
    }
}

function addLogToUI(date, project, task, progress){
    latestDates = document.getElementsByClassName('stickyDate')
    if (latestDates.length > 0){
        latestDate = latestDates[latestDates.length - 1].innerHTML.trim()
    } else {
        latestDate = 0
    }
    
    // TODO: compares current date with only the latest date
    if (latestDate != date){
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

function dataFromMainHandler(event, logs){
    console.log(logs)
    logs.forEach(log => {
        data.push(log)
        addLogToUI(log.date, log.project, log.task, log.status)
    });
}

window.addEventListener('load', (event) => {
    setDefaultDate()
    populatePage(data)
    toggleSideBar()
    comms.registerMainDataCallback(dataFromMainHandler)
    document.getElementById('inputs').scrollIntoView()
    document.getElementById('newLogTask').addEventListener('change', (event) => {
        newLogInput()
    })
    document.getElementById('loadButton').addEventListener('click', async () => {
        result = await comms.loadFile()
        console.log(typeof(result), result)
        // TODO: load results into work log
    })
})