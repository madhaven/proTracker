const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { State } = require('./state')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv')
var mainWindow

const taskToggleHandler = (event, id) => {
    // marks a task as completed or incomplete
    // TODO: this method should be handled by UI state change mechanism
    console.log('toggle task', id)
    if (Math.random() >= 0.5)
        return true
    else 
        return false
}

const loadDataHandler = async (event) => {
    // prompts user to select a file and returns the data to the caller
    // TODO: verify if cSV is in prescribed format
    const options = {
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
      };
    const { cancelled, filePaths } = await dialog.showOpenDialog(mainWindow, options)
    if (cancelled) {
        return
    } else {
        let data = []  
        // Read the CSV file
        fs.createReadStream(filePaths[0])
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => { data.push(row) })
            .on('error', (error) => { console.error(error); ipcMain.emit('DataError', 'something Went wrong')})
            .on('end', () => { event.reply('DataPing', data) });
    }
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

const stateEventHandler = async (event, data) => {
    // TODO
    console.log('main: state event notified', event, data)
}

const stateChangeRequestHandler = async (event, data) => {
    // TODO
    console.log('main: state change request recieved', event, data)
}

const registerChannelHandlers = () => {
    // comms
    ipcMain.handle('taskClickChannel', taskToggleHandler)
    ipcMain.on('loadFileRequest', loadDataHandler)
    ipcMain.handle('saveDataRequest', saveDataHandler)

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

const setupInitialState = () => {
    // loads the data and creates the state instance that is sent to the UI
    var state = new State(
        menuVisible=true,
        dataProfile=''
    )
    console.log('main: Loading UI State', state)
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './preloadElectron.js')
        },
        show: false,
        autoHideMenuBar: true
    })
    registerChannelHandlers()
    win.loadFile('./Screens/log.html')
    win.maximize()
    win.webContents.on('did-finish-load', () => {
        win.webContents.openDevTools();
        state = setupInitialState()

        console.log('sending an update to state')
        mainWindow.webContents.send('updateUI', state)
    })
    win.once('ready-to-show', () => {
        win.show()
    })

    return win
}

app.whenReady().then(() => {
    mainWindow = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            mainWindow = createWindow()
    })
})

// quit the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})