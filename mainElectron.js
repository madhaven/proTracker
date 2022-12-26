const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function taskToggler(event, id){
    console.log('toggle task', id)
    return 'pong from mainHandler'
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preloadElectron.js')
        },
        show: false,
        autoHideMenuBar: true
    })
    ipcMain.handle('taskClickChannel', taskToggler)
    win.loadFile('./log.html')
    win.once('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

// quitting the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})