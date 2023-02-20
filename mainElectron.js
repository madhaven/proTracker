const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')
const csv = require('fast-csv');
var mainWindow

function taskToggler(event, id) {
    console.log('toggle task', id)
    return 'pong from mainHandler'
}

async function loadData(event) {
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

async function saveData(event, data) {
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
    ipcMain.on('loadFileRequest', loadData)
    ipcMain.handle('saveDataRequest', saveData)
    win.loadFile('./Screens/log.html')
    win.maximize()
    win.once('ready-to-show', () => {
        win.show()
    })
    return win
}

app.whenReady().then(() => {
    mainWindow = createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

// quitting the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})