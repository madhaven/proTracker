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

// #endregion

// #region Actions

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

const recieveStateChanges = (event, state) => {
    // TODO
    console.log('UI|updateUI: recieved state change prompt', event, state)
}

// #endregion

window.addEventListener('load', event => {

    if (allowSuperpowers) createDateTimeInput()

    // window listeners
    window.addEventListener('pageshow', event => { render(); toggleMenuBar(true) })
    
    // comm listeners
    stateComm.registerListener('updateUI', recieveStateChanges)

    setDefaultDate()
    switchToTab('logChart')
    toggleMenuBar(true)
    if (!allowSuperpowers) trackIdle()
})