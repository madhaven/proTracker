const allowSuperpowers = false // for debugging
    , doneIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg>'

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
            console.error('Unhandled Error occurred on Data Export', err)
            // TODO: logs and error management
            flashIcon(resultShowDuration)
        }
    )
}

const deleteHabit = (habitId, time) => {
    comms.deleteHabit (
        habitId, time,
        res => {
            console.log('logdeletehabitresult', res)
            // TODO:
        },
        err => {
            console.error('server error while updating habit') // TODO: notification
        }
    )
}

const recieveStateChanges = (event, state) => {
    // TODO:
    console.log('UI|updateUI: recieved state change prompt', event, state)
}

window.addEventListener('load', event => {
    if (allowSuperpowers) createDateTimeInput()
    stateComm.registerListener('updateUI', recieveStateChanges)
})