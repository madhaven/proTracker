const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv');

function taskToggler(event, id){
    console.log('toggle task', id)
    return 'pong from mainHandler'
}

async function loadData(event){
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
            .on('end', () => {
                console.log(data)
                event.sendReply(data)
            }).then(
                () => console.log('ddone'),
                () => console.log('error')
            )
        return event
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
    ipcMain.handle('DataRequest', loadData)
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