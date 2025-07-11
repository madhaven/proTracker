const path = require('path')
const { app, BrowserWindow } = require('electron')
const { State } = require('./Scripts/Models/State')
const { ConfigService } = require('./Scripts/Services/ConfigService')
const { DatabaseService } = require('./Scripts/Services/DatabaseService')
const { LogService } = require('./Scripts/Services/LogService')
const { FileService } = require('./Scripts/Services/FileService')
const { registerHandlers } = require('./Scripts/handlers')
const { DBVersionService } = require('./Scripts/Services/DBVersionService')

var mainWindow
const debugMode = process.argv.some(arg => arg.includes('--inspect'))
const userDataPath = debugMode ? '.' : path.join(app.getPath('appData'), 'proTracker')
const configFileName = debugMode ? 'appconfig.json' : path.join(userDataPath, 'appconfig.json')
const config = debugMode ? { dbPath: 'proTracker.db' } : { dbPath: path.join(userDataPath, 'proTracker.db') }
const logFile = FileService.openStream(path.join(userDataPath, 'proTracker.log'))

const setupServices = () => {
    // PS: order of services does matter
    LogService.addStream(logFile)
    ConfigService.getService(config, configFileName)
    DBVersionService.getService(FileService)
    var dbService = DatabaseService.getService()
    console.debug('Services initialized')
    dbService.tryMigrate()
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, './Scripts/ePreload.js'),
            webSecurity: false
        },
        show: false,
        autoHideMenuBar: true
    })
    
    setupServices()
    registerHandlers(win)
    win.removeMenu() // hide default app toolbar
    if (debugMode)
        win.loadURL("http://localhost:4200")
    else
        win.loadFile("./pUIng/dist/pUIng/browser/index.html")

    win.webContents.on('did-finish-load', () => {
        if (debugMode)
            win.webContents.openDevTools();
    })
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
    })
    return win
}

// App Lifecycle

if (!app.requestSingleInstanceLock() && !debugMode) {
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