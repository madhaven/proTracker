const path = require('path')
const { app, BrowserWindow, dialog } = require('electron')
const { registerHandlers } = require('./handlers')
const { State } = require('./Models/State')
const { ConfigService } = require('./Services/ConfigService')

var mainWindow
const configService = ConfigService.getService()

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
            preload: path.join(__dirname, './ePreload.js')
        },
        show: false,
        autoHideMenuBar: true
    })
    registerHandlers(win)
    win.loadFile('./Screens/log.html')
    win.webContents.on('did-finish-load', () => {
        win.webContents.openDevTools(); // TODO: REMOVE ON PRODUCTION
        state = InitialState()
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