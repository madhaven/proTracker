const dataFromMainHandler = (event, logs) => {
    // handles the data received from Main process and adds it to the log page
    console.log('client|DataPing ### REMOVE THIS THING')
    logs.forEach(log => {
        data.push(log)
        addLogToUI(log.date, log.project, log.task, log.status)
    });
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
    console.log('client|updateUI: recieved state change prompt', event, state)
    if (typeof(state) != State){
        console.log("state isn't of type State though")
    } else {
        loadState(state)
    }
}

// register listeners
state.registerListener('updateUI', recieveStateChanges)
comms.registerListener('DataPing', dataFromMainHandler)
comms.registerListener('DataError', errFromMainHandler)