const path = require('path')
const { app, BrowserWindow } = require('electron')
const { State } = require('./Models/State')
const { ConfigService } = require('./Services/ConfigService')
const { DatabaseService } = require('./Services/DatabaseService')
const { LogService } = require('./Services/LogService')
const { FileService } = require('./Services/FileService')
const { registerHandlers } = require('./handlers')

var mainWindow
const debugMode = process.argv.some(arg => arg.includes('--inspect'))
    , userDataPath = debugMode ? '.' : path.join(app.getPath('appData'), 'proTracker')
    , configFileName = debugMode ? 'appconfig.json' : path.join(userDataPath, 'appconfig.json')
    , config = debugMode ? { dbPath: 'proTracker.db' } : { dbPath: path.join(userDataPath, 'proTracker.db') }
    , logStream = FileService.openStream(path.join(userDataPath, 'proTracker.log'))

// Services
LogService.addStream(logStream)
ConfigService.getService(config, configFileName)
DatabaseService.getService()

const initialState = () => {
    // loads the data and creates the state instance that is sent to the UI
    console.debug('main: Loading UI State', state)
    var state = new State(
        menuVisible=true,
        dataProfile=''
    )
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
    win.loadFile('./Screens/index.html')
    win.webContents.on('did-finish-load', () => {
        state = initialState()
        mainWindow.webContents.send('updateUI', state)
        if (debugMode) win.webContents.openDevTools()
    })
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
    })
    return win
}

// App Lifecycle

if (!app.requestSingleInstanceLock()) {
    console.warn('Multiple proTracker instances blocked')
    app.quit()
} else app.whenReady().then(() => {
    if (BrowserWindow.getAllWindows().length === 0)
        mainWindow ??= createWindow()
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            mainWindow ??= createWindow()
    })

    app.on('second-instance', () => { console.error('Second instance was created') })
})

// quit the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
    console.logEnd()
    FileService.closeAllStreams()
    if (process.platform !== 'darwin') app.quit()
})