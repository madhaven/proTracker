const path = require('path')
const { State } = require('./state')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const {
    loadDataHandler,
    saveDataHandler,
    taskToggleHandler,
    stateEventHandler,
    stateChangeRequestHandler,
} = require('./handlers')

var mainWindow

const registerHandlers = () => {
    // comms
    ipcMain.handle('taskClickChannel', taskToggleHandler)
    ipcMain.on('loadFileRequest', loadDataHandler)
    ipcMain.handle('saveDataRequest', saveDataHandler)

    // state info exchange
    ipcMain.on('UIEventNotifications', stateEventHandler)
    ipcMain.handle('UIEventRequests', stateChangeRequestHandler)
}

const InitialState = () => {
    // loads the data and creates the state instance that is sent to the UI
    var state = new State(
        menuVisible=true,
        dataProfile=''
    )
    console.log('main: Loading UI State', state)
    return state
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
    registerHandlers()
    win.loadFile('./Screens/log.html')
    win.webContents.on('did-finish-load', () => {
        win.webContents.openDevTools(); // TODO: REMOVE ON PRODUCTION
        state = InitialState()
        mainWindow.webContents.send('updateUI', state)
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    win.maximize()
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