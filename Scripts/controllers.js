const csv = require('fast-csv')
const fs = require('fs')
const { ipcMain, dialog } = require('electron')

const loadDataHandler = async (event, mainWindow) => {
    // prompts user to select a file and returns the data to the caller
    // TODO: verify if cSV is in prescribed format
    const options = {
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    };
    const { cancelled, filePaths } = await dialog.showOpenDialog(mainWindow, options)
    if (!cancelled) {
        let data = []  
        // Read the CSV file
        fs.createReadStream(filePaths[0])
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => { data.push(row) })
            .on('error', (error) => { console.error(error); ipcMain.emit('DataError', 'something Went wrong')})
            .on('end', () => { event.reply('DataPing', data) });
        // TODO: read shit man
    }
    return
}

const saveDataHandler = async (event, data) => {
    // prompts user for file name and saves the data into the file
    const {cancelled, filePath} = await dialog.showSaveDialog({
        filters: [
            { name: 'CSV files', extensions: ['csv'] }
        ]
    });
    if (cancelled) return false;
    
    const csvData = "date,project,task,status\n" + data.map((row) => [row.date, row.project, row.task, row.status].join(',')).join('\n')
    fs.writeFileSync(filePath, csvData)
    return true
}

const taskToggleHandler = (event, id) => {
    // marks a task as completed or incomplete
    // TODO: this method should be handled by UI state change mechanism
    console.log('toggle task', id)
    if (Math.random() >= 0.5)
        return true
    else 
        return false
}

/// STATE EVENTS

const stateEventHandler = async (event, data) => {
    // TODO
    console.log('main: state event notified', event, data)
}

const stateChangeRequestHandler = async (event, data) => {
    // TODO
    console.log('main: state change request recieved', event, data)
}

const registerHandlers = (mainWindow) => {
    // comms
    ipcMain.handle('taskClickChannel', taskToggleHandler)
    ipcMain.on('loadFileRequest', (event) => { loadDataHandler(event, mainWindow) })
    ipcMain.handle('saveDataRequest', saveDataHandler)

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

module.exports = {
    registerHandlers,
}