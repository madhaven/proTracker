const path = require('path')
const { app, BrowserWindow, dialog } = require('electron')
const { registerHandlers } = require('./handlers')
const { State } = require('./Models/State')
const { ConfigService } = require('./Services/ConfigService')
const { DatabaseService } = require('./Services/DatabaseService')

const debugMode = process.argv.some(arg => arg.includes('--inspect'))
const configService = ConfigService.getService(
    debugMode ? { dbPath: 'proTracker.db' } : undefined
)
const dbService = DatabaseService.getService()
var mainWindow

const initialState = () => {
    // loads the data and creates the state instance that is sent to the UI
    var state = new State(
        menuVisible=true,
        dataProfile=''
    )
    console.debug('main: Loading UI State', state)
    return state
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './ePreload.js')
        },
        show: false,
        autoHideMenuBar: true
    })
    registerHandlers(win)
    win.removeMenu()
    win.loadFile('./Screens/log.html')
    win.webContents.on('did-finish-load', () => {
        if (debugMode) win.webContents.openDevTools()
        state = initialState()
        mainWindow.webContents.send('updateUI', state)
    })
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
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