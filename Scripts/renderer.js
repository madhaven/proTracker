const uiState = new State()
    , allowSuperpowers = false // for debugging
    , editIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>'
    , trashIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>'
    , doneIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg>'
uiState.inactiveDuration = 0
uiState.inactivityTolerance = 60 // TODO: user preference. -1 for disabled

// #region Helpers

const setDefaultDate = () => {
    if (!allowSuperpowers) return
    // sets a default date client: recieved state change promptfor the input field
    const now = new Date()
        , year = now.getFullYear()
        , month = (now.getMonth() + 1).toString().padStart(2, '0')
        , day = now.getDate().toString().padStart(2, '0')
        , hour = now.getHours().toString().padStart(2, '0')
        , minute = now.getMinutes().toString().padStart(2, '0')
        , second = now.getSeconds().toString().padStart(2, '0')
        , dateString = `${year}-${month}-${day}T${hour}:${minute}:${second}`

    document.getElementById('newLogDate').value = dateString
}

const clearAllLogs = () => {
    // clears all logs
    const allLogs = document.querySelectorAll('.logDay:not(.header, .inputs)')
    for (const day of allLogs) {
        day.remove()
    }
}

const createDateTimeInput = () => {
    const inputDiv = document.querySelector('#inputs .logDate')
        , input = document.createElement('input')
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
        , t = new Date(year, month, day)
        , itIsToday = new Date().toDateString() == t.toDateString()
        , allDays = document.querySelectorAll('.logDay:not(.header)')
        , months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        , displayDate = itIsToday ? 'Today' : `${year} ${months[month]} ${day}`

    if (allDays.length > 0) {
        const latestDate = allDays[allDays.length - 1]
        if (latestDate.querySelector('.stickyDate').innerHTML.trim() == displayDate)
            return latestDate
    }

    const logDay = document.createElement('div')
        , logDate = document.createElement('div')
        , stickyDate = document.createElement('div')
        , daysProjects = document.createElement('div')

    if (itIsToday) logDay.classList.add('today')
    logDay.classList.add('logDay')
    logDay.id = t.getTime()
    logDate.classList.add('logDate')
    stickyDate.classList.add('stickyDate')
    daysProjects.classList.add('daysProjects')

    logDate.appendChild(stickyDate)
    logDay.appendChild(logDate)
    logDay.appendChild(daysProjects)
    document.getElementById('inputs').before(logDay)

    stickyDate.innerHTML = displayDate
    return logDay
}

const createProjectOnDay = (logDay, project) => {
    const projectRow = document.createElement('div')
        , projectColumn = document.createElement('div')
        , tasksColumn = document.createElement('div')
        , newProjectInput = document.querySelector('#newLogProject')
        , logInput = document.querySelector('#newLogTask')
        , stickyProjectStuff = makeEditableInput({
            value: project.name,
            editButtonFirst: true,
            itemClasses: ["stickyProjectStuff"],
            itemContentClasses: ["logProjectContent"],
            itemInputClasses: ["logProjectEditInput"],
            itemButtonClasses: ["logProjectEditButton"],
            eventListeners: {
                // autoType projectName for new Log entry
                'click': event => {
                    logInput.focus()
                    newProjectInput.value = ""
                    setTimeout(() => { autoTypeProject(project.name, newProjectInput) }, 250);
                }
            },
            editHandler: (event, input, uiUpdater) => {
                projectEditHandler(event, project, input, uiUpdater)
            }
        })
    
    projectRow.classList.add('projectRow')
    projectColumn.classList.add('projectColumn')
    tasksColumn.classList.add('projectsTasks')

    projectRow.appendChild(projectColumn)
    projectColumn.appendChild(stickyProjectStuff)
    projectRow.appendChild(tasksColumn)
    logDay.querySelector('.daysProjects').appendChild(projectRow)
    return projectRow
}

const createTaskInElement = (element, task) => {
    const logTask = makeEditableInput({
        value: task.summary,
        itemClasses: ['logTask', 'logTask_'+task.id],
        itemContentClasses: ['logTaskContent'],
        itemInputClasses: ['logTaskEditInput'],
        itemButtonClasses: ['logTaskEditButton'],
        editHandler: (event, input, UiUpdater) => {
            taskEditHandler(event, task, input, UiUpdater)
        }
    })

    element.appendChild(logTask)
    return logTask
}

const decorateTaskContent = (logTask, log) => {
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

const autoTypeProject = (characters, inputField, index=0) => {
    if (index >= characters.length) return
    inputField.value += characters[index]
    setTimeout(() => { autoTypeProject(characters, inputField, index+1) }, 25);
}

const addTaskListeners = (taskElement, log, task, day) => {
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

const addTaskLocatorsOnProjectPage = (taskElement, task) => {
    taskElement.addEventListener('click', event => {
        const logs = document.querySelector('.logChart')
            , tasksOnLog = logs.querySelectorAll('.logTask_' + task.id)
            , taskLogToFocus = tasksOnLog[tasksOnLog.length - 1]

        switchToTab('logChart')
        highlightTask(task.id)
        setTimeout(() => { deHighlightTask(task.id) }, 5000);
        taskLogToFocus.scrollIntoView({ behavior: 'smooth'})
    })
}

const highlightTask = (taskId) => {
    tasks = document.querySelectorAll(`.logChart .logTask_${taskId}`)
    tasks.forEach(task => {
        task.classList.add('flashedTask')
    })
}

const deHighlightTask = (taskId) => {
    tasks = document.querySelectorAll(`.logChart .logTask_${taskId}`)
    tasks.forEach(task => {
        task.classList.remove('flashedTask')
    })
}

const makeEditableInput = (config={
    value: 'editable stuff',
    itemType: 'div',
    itemClasses: [],
    itemContentType: 'div',
    itemContentClasses: [],
    itemInputClasses: [],
    itemButtonClasses: [],
    editButtonFirst: false,
    eventListeners: {},
    editHandler: (event, newValue, uiUpdater) => { return false }
}) => {
    const editableItem = document.createElement(config.itemType ?? 'div')
        , editableItemContent = document.createElement(config.itemContentType ?? 'div')
        , editableItemInput = document.createElement('input')
        , editableItemEditButton = document.createElement('span')
        , uiUpdater = () => { editableItem.classList.remove('editable') }
        , makeItemEditable = () => {
            editableItemInput.value = editableItemContent.innerHTML
            editableItem.classList.add('editable')
            editableItemInput.focus()
        }
    
    config.itemClasses ??= []
    config.itemContentClasses ??= []
    config.itemInputClasses ??= []
    config.itemButtonClasses ??= []
    config.eventListeners ??= {}
    
    editableItem.classList.add('editableItem')
    config.itemClasses.forEach(x => { editableItem.classList.add(x) })
    editableItemContent.classList.add('editableItemContent')
    config.itemContentClasses.forEach(x => { editableItemContent.classList.add(x) })
    editableItemInput.classList.add('editableItemInput')
    config.itemInputClasses.forEach(x => { editableItemInput.classList.add(x) })
    editableItemEditButton.classList.add('editableItemEditButton')
    config.itemButtonClasses.forEach(x => { editableItemEditButton.classList.add(x) });

    editableItemContent.innerHTML = config.value
    editableItemInput.value = config.value
    editableItemInput.type = "text"
    editableItemEditButton.innerHTML = editIconSVG
    editableItemEditButton.addEventListener('click', event => {
        makeItemEditable()
    })
    editableItemInput.addEventListener('change', editableItemInput.blur)
    editableItemInput.addEventListener('blur', event => {
        config.editHandler(event, editableItemInput.value, uiUpdater)
    })
    for (var event in config.eventListeners) {
        editableItemContent.addEventListener(event, config.eventListeners[event])
    }

    editableItem.appendChild(editableItemContent)
    editableItem.appendChild(editableItemInput)
    config.editButtonFirst ?? false
        ? editableItem.insertBefore(editableItemEditButton, editableItemContent)
        : editableItem.appendChild(editableItemEditButton)

    return editableItem
}

const addHabitListeners = (newHabitItem) => {
    const habitTitle = newHabitItem.querySelector('input.newHabitTitle')
        , habitFreq = newHabitItem.querySelector('input.newHabitFrequency')
        , arr = [habitTitle, habitFreq]
    
    arr.forEach(item => {
        item.addEventListener('change', (event) => {
            if (habitTitle.value && habitFreq.value && habitFreq.value>=1 && habitFreq.value<=7) {
                newHabit(habitTitle.value, habitFreq.value)
            }
        })
    })
}

const renderLogTab = async () => {
    const projectField = document.querySelector('#newLogProject')
        , taskField = document.querySelector('#newLogTask')
    
    clearAllLogs()
    if (Object.keys(uiState.logTree).length == 0) {
        projectField.placeholder = "Add a New Project"
        taskField.placeholder = "or a new task"
    } else {
        projectField.placeholder = taskField.placeholder = ""
        for (const day in uiState.logTree) {
            const logDay = createOrFindDay(day)
            for (const projectId in uiState.logTree[day]) {
                const project = uiState.projects[projectId]
                    , projectRow = createProjectOnDay(logDay, project)
                    , taskContainer = projectRow.querySelector('.projectsTasks')
                for (const taskId in uiState.logTree[day][projectId]) {
                    const log = uiState.logTree[day][projectId][taskId]
                        , task = uiState.tasks[taskId]
                        , taskRow = createTaskInElement(taskContainer, task)
                        , taskRowContent = taskRow.querySelector('.editableItemContent')
                    decorateTaskContent(taskRowContent, log)
                    addTaskListeners(taskRowContent, log, task, day)
                }
            }
        }
    }
}

const renderProjectTab = async () => {
    const projectList = document.getElementById('projectList')
        , foldedProjects = JSON.parse(localStorage.getItem('foldedProjects')) ?? {}
    // TODO handle saved data loads in OO strategy
    
    projectList.innerHTML = ""
    for (const projectId in uiState.projectTree) {
        const project = uiState.projects[projectId]
            , projectItem = document.createElement('li')
            , taskList = document.createElement('ul')

        for (const taskId in uiState.projectTree[projectId]) {
            const task = uiState.tasks[taskId]
                , statusId = uiState.projectTree[projectId][taskId]
                , taskItem = document.createElement('li')
                , logTask = createTaskInElement(taskItem, task)
                , logTaskContent = logTask.querySelector('.editableItemContent')
            decorateTaskContent(logTaskContent, {'statusId': statusId})
            addTaskLocatorsOnProjectPage(logTaskContent, task)
            taskList.appendChild(taskItem)
        }
        
        foldedProjects[projectId] ??= false
        if (foldedProjects[projectId]) {
            projectItem.classList.add('emptyProject')
            taskList.classList.add('hidden')
        }
        taskList.classList.add('taskList')
        const projectHeader = makeEditableInput({
            value: project.name,
            itemType: 'h3',
            itemClasses: ['projectHeader'],
            itemContentType: 'div',
            itemContentClasses: ['projectHeaderContent'],
            editButtonFirst: false,
            eventListeners: {
                'click': event => { projectItemClick(event, projectItem, project) }
            },
            editHandler: (event, input, UiUpdater) => {
                projectEditHandler(event, project, input, UiUpdater)
            }
        })
        projectItem.appendChild(projectHeader)
        projectItem.appendChild(taskList)
        projectList.appendChild(projectItem)
    }
    uiState.foldedProjects = foldedProjects
    localStorage.setItem('foldedProjects', JSON.stringify(foldedProjects))
    return projectList
}

const renderHabitsTab = (now = new Date()) => {
    const habitList = document.querySelector('.habitList')
        , pendingHabitList = document.querySelector('.pendingHabits')
        , today = [now.getFullYear(), now.getMonth(), now.getDate()]
    
    habitList.innerHTML = ""
    pendingHabitList.innerHTML = ""

    for (const habitId in uiState.habits) {
        // create Habit item
        const habit = uiState.habits[habitId]
            , lastLog = new Date(habit.lastLogTime ?? 0)
            , lastLogDate = [lastLog.getFullYear(), lastLog.getMonth(), lastLog.getDate()]
            , habitItem = document.createElement('li')
            , habitTitle = document.createElement('div')
            , habitControls = document.createElement('div')
            , editButton = document.createElement('button')
            , trashButton = document.createElement('button')
        
        // add design classes
        habitItem.classList.add('habitItem')
        habitTitle.classList.add('habitTitle')
        habitControls.classList.add('habitControls')

        // fill content
        editButton.innerHTML = editIconSVG
        trashButton.innerHTML = trashIconSVG
        habitTitle.innerHTML = habit.name
        // TODO: add graphs

        // give life
        trashButton.addEventListener('click', event => {
            console.log('habitdeleteClicked') // TODO remove
            deleteHabit(habit.id, Date.now())
        })
        
        // add to UI
        habitList.appendChild(habitItem)
        habitItem.appendChild(habitTitle)
        // habitItem.appendChild(habitControls)
        habitControls.appendChild(editButton)
        habitControls.appendChild(trashButton)

        // populate pending list
        if (today[0]!=lastLogDate[0] || today[1]!=lastLogDate[1] || today[2]!=lastLogDate[2]) {
            const habitItem = document.createElement('li')
                , habitTitle = document.createElement('div')
                , habitControls = document.createElement('div')
                // , doneButton = document.createElement('button')
            habitItem.classList.add('pendingHabitItem')
            habitTitle.classList.add('habitTitle')
            habitControls.classList.add('habitControls')
            habitTitle.innerHTML = habit.name
            // doneButton.innerHTML = doneIconSVG
            habitItem.addEventListener('click', event => {
                markHabitDone(habit.id, Date.now())
            })
            pendingHabitList.appendChild(habitItem)
            habitItem.appendChild(habitTitle)
            habitItem.appendChild(habitControls)
            // habitControls.appendChild(doneButton)
        }

        if (pendingHabitList.length > 0)
            pendingHabitList.appendChild(document.createElement('hr'))
    }

    // options for adding habit
    const newHabitItem = document.createElement('li')
        , newHabitTitle = document.createElement('input')
        , newHabitFrequencyContainer = document.createElement('div')
        , newHabitFrequency = document.createElement('input')
    
    newHabitItem.classList.add('newHabitItem', 'habitItem')
    newHabitTitle.classList.add('newHabitTitle')
    newHabitFrequencyContainer.classList.add('newHabitFrequencyContainer')
    newHabitFrequency.classList.add('newHabitFrequency')

    newHabitTitle.placeholder = "I want to ... ?"
    newHabitFrequency.type = "number"
    newHabitFrequency.min = 1
    newHabitFrequency.max = 7
    newHabitFrequency.placeholder = "x"

    newHabitItem.appendChild(newHabitTitle)
    newHabitItem.appendChild(newHabitFrequencyContainer)
    newHabitFrequencyContainer.appendChild(newHabitFrequency)
    newHabitFrequencyContainer.innerHTML += "days a week"
    
    habitList.appendChild(newHabitItem)
    addHabitListeners(newHabitItem)
}

const render = async () => {
    renderLogTab()
    renderProjectTab()
    renderHabitsTab()
}

// #endregion

// #region Actions

const toggleMenuBar = (visible = undefined) => {
    // handles the open and close of the sidebar
    const sidebar = document.getElementById('sideBar')
        , handle = document.getElementById('sideHandle')
    if ((visible==undefined && !uiState.menuVisible) || visible==true) {
        // open side bar
        sidebar.classList.add("sideBar_open")
        uiState.menuVisible = true
    } else if ((visible==undefined && uiState.menuVisible) || visible==false) {
        // close side bar
        sidebar.classList.remove("sideBar_open")
        uiState.menuVisible = false
    }
    render()
    stateComm.notifyUIEvent(uiState) // needed ?
}

const switchToTab = tabName => {
    const menuTabs = document.getElementsByClassName('menuTab')
    for (const tab of menuTabs) {
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
    toggleMenuBar()

    const flashIcon = (iconShowDuration, response='exportException') => {
        const selector = response == true ? 'success' : 'failure'
        loadingIcon.classList.add('hidden')
        defaultIcon.classList.remove('hidden')
        defaultIcon.classList.add(selector)
        defaultIcon.parentElement.title = {
            true: "Export Complete",
            false: "the previous export action was cancelled",
            "noAccess": "proTracker doesn't have access to the file at the moment",
            "exportException": "an unhandled error occurred",
        }[response] ?? ""
        setTimeout(() => {
            defaultIcon.classList.remove('success', 'failure')
        }, iconShowDuration)
    }

    comms.exportData (
        uiState.logTree, uiState.tasks, uiState.projects, uiState.logs,
        res => {
            flashIcon(resultShowDuration, res)
        },
        err => {
            console.error('Unhandled Error occurred on Data Export', err) // TODO logs and error management
            flashIcon(resultShowDuration)
        }
    )
}

const newLogInput = event => {
    // validation
    const UIsummary = document.getElementById('newLogTask')
        , UIproject = document.getElementById('newLogProject')
        , summary = UIsummary.value
        , project = UIproject.value
        , date = new Date()

    if (allowSuperpowers) {
    	const UIdate = document.getElementById('newLogDate')
	        , debugDate = new Date(UIdate.value)
	    date.setDate(debugDate.getDate())
	    date.setMonth(debugDate.getMonth())
	    date.setYear(debugDate.getFullYear())
    }
    
    if (!date) return false
    if (!summary) return false
    if (!project) return false
    
    const task = { dateTime: date.getTime(), project: project, summary: summary }
    comms.newTask (
        task,
        res => {
            if (!res) return
            uiState.taskLog(res.log, res.task, res.project)
            render()

            setDefaultDate()
            UIsummary.value = UIproject.value = ""
            UIproject.focus()
        },
        err => {
            console.error('server error while adding new task') // TODO notification
        }
    )
}

const taskClick = (event, task, log) => {
    // TODO: setup more refined status change mechanism
    const newState = log.statusId == 1 ? 4 : 1
        , currentTime = Date.now()
    comms.toggleTask (
        task.id, newState, currentTime,
        res => {
            uiState.addLog(res)
            render()
        },
        err => {
            console.error('server error while updating task') // TODO remove error logs
        }
    )
}

const newHabit = (title, frequency) => {
    comms.createHabit(
        title, Date.now(), Infinity, frequency,
        res => {
            uiState.addHabit(res)
            render()
        },
        err => {
            console.error('servor errored while adding habit') // TODO notification
        }
    )
}

const markHabitDone = (habitId, time) => {
    comms.habitDone (
        habitId, time,
        res => {
            uiState.addHabitLog(res)
            console.log('reading last log tiem')
            uiState.habits[res.habitId].lastLogTime = res.dateTime
            console.log('reading last log tiem complete')
            render()
        },
        err => {
            console.error('server error while updating habit', err) // TODO notification
        }
    )
}

const deleteHabit = (habitId, time) => {
    comms.deleteHabit (
        habitId, time,
        res => {
            console.log('logdeletehabitresult', res)
            // TODO
        },
        err => {
            console.error('server error while updating habit') // TODO notification
        }
    )
}

const projectItemClick = (event, element, project) => {
    const taskList = element.querySelector('.taskList')
    if (taskList.classList.contains('hidden')) { 
        taskList.classList.remove('hidden')
        element.classList.remove('emptyProject')
        uiState.foldedProjects[project.id] = false
    } else {
        taskList.classList.add('hidden')
        element.classList.add('emptyProject')
        uiState.foldedProjects[project.id] = true
    }
    localStorage.setItem('foldedProjects', JSON.stringify(uiState.foldedProjects))
}

const trackIdle = () => {
    ['mousemove', 'mousedown', 'drag', 'keypress', 'scroll'].forEach(event => {
        document.addEventListener(event, () => { uiState.inactiveDuration = 0 })
    });
    setInterval(() => {
        uiState.inactiveDuration = ++uiState.inactiveDuration ?? 0 // TODO: ensure state is initialized
        if (uiState.inactiveDuration >= uiState.inactivityTolerance
            && uiState.inactivityTolerance >= -1
            && !uiState.menuVisible) {
            toggleMenuBar(true)
            console.info('MenuBar on idle')
        }
    }, 1000);
    console.info('Idle tracking enabled')
}

// #endregion

// #region COMMS

const projectEditHandler = (event, project, newName, uiUpdater) => {
    comms.editProject(
        {id:project.id, name:newName},
        res => {
            if (res) {
                uiState.projects[project.id].name = newName
            } else {
                // TODO: create structured responses, false values limits the reasons for failure
                // console.warn('Yo wtf, that name already exists!')
                alert(`Something went wrong.`) // TODO: CREATE APP NOTIFICATION
            }
            uiUpdater()
            render()
        },
        err => {
            console.error('Unable to edit Project due to an internal error')
            uiUpdater()
        }
    )
}

const taskEditHandler = (event, task, newSummary, uiUpdater) => {
    comms.editTask(
        {id: task.id, summary: newSummary},
        res => { // TODO: document responses
            if (res) {
                uiState.tasks[task.id].summary = newSummary
            } else {
                console.error('Something went wrong.') // TODO notification
            }
            uiUpdater()
            render()
        },
        err => {
            console.error('Unable to edit Task due to an internal error') // TODO notification
            uiUpdater()
        }
    )
}

const requestDataFromDB = () => {
    comms.loadData(
        res => {
            if (res){
                console.log('data recieved from db', res)
                uiState.replaceData(res.tasks, res.taskLogs, res.projects, res.habits, res.habitLogs)
                render()
            } else {
                console.error('corrupt data received', res)
                // TODO: notification ?
            }
        },
        err => console.error('server error while loading data') // TODO notification
    )
}

const recieveStateChanges = (event, state) => {
    // TODO
    console.log('UI|updateUI: recieved state change prompt', event, state)
}

// #endregion

window.addEventListener('load', event => {

    // Sidebar
    document.getElementById('sideBar').addEventListener('click', e => toggleMenuBar())
    document.getElementById("sideHandle").addEventListener('click', e => toggleMenuBar())

    // Menu Buttons
    document.querySelector('#projects.menuButton').addEventListener('click', event => { switchToTab('projectTab') })
    document.querySelector('#export.menuButton').addEventListener('click', exportData)
    document.querySelector('#habits.menuButton').addEventListener('click', event => { switchToTab('habitTab')})
    document.querySelector('#logChart.menuButton').addEventListener('click', event => {
        switchToTab('logChart')
        document.getElementById('inputs').scrollIntoView({ behavior: 'smooth' })
    })

    // logs page inputs
    document.getElementById('newLogProject').addEventListener('change', newLogInput)
    document.getElementById('newLogTask').addEventListener('change', newLogInput)
    if (allowSuperpowers) createDateTimeInput()

    // window listeners
    window.addEventListener('pageshow', event => { render(); toggleMenuBar(true) })
    
    // comm listeners
    stateComm.registerListener('updateUI', recieveStateChanges)

    setDefaultDate()
    requestDataFromDB()
    switchToTab('logChart')
    toggleMenuBar(true)
    if (!allowSuperpowers) trackIdle()
})