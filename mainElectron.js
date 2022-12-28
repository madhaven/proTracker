const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv');

function taskToggler(event, id){
    console.log('toggle task', id)
    return 'pong from mainHandler'
}

async function loadFile(event){
    const { cancelled, filePaths } = await dialog.showOpenDialog()
    if (cancelled){
        return
    } else {      
        let data = []  
        // Read the CSV file
        fs.createReadStream(filePaths[0])
            .pipe(csv.parse({ headers: true }))
            .on('data', (row) => { data.push(row) })
            .on('error', (error) => { console.error(error); })
            .on('end', () => { event.reply('DataPing', data) });
    }
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
    ipcMain.on('loadFileChannel', loadFile)
    win.loadFile('./log.html')
    win.maximize()
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