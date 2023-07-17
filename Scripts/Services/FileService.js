const { dialog } = require("electron")
const csv = require('fast-csv')
const fs = require('fs')

const FileService = class {
    static options = [{ name: 'CSV Files', extensions: ['csv']}]
    static filters = { filters: this.options }

    static loadAFile = async win => {
        // TODO: verify if cSV is in prescribed format
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog(win, this.options)
                .then((cancelled, filePaths) => {
                    if (cancelled)
                        resolve([false, undefined])
                    const data = []
                    fs.createReadStream(filePaths[0])
                        .pipe(csv.parse({ headers: true }))
                        .on('data', row => { data.push(row) })
                        .on('end', () => { resolve([true, data])})
                        .on('error', error => {
                            console.log("loadAFileError", error)
                            // TODO logging
                            resolve([false, undefined])
                        })
                })
                .catch(error => {
                    console.log("loadAFileDialogError", error)
                    // TODO logging
                    resolve([false, undefined])
                })
        })
    }

    static saveFile = async (win, data) => {
        return new Promise((resolve, reject) => {
            dialog.showSaveDialog(win, this.filters)
                .catch(error => {
                    console.log("saveFileDialogError", error)
                    // TODO logging
                    reject(false)
                })
                .then(({canceled, filePath}) => {
                    console.table({'canceled': canceled, 'filePath': filePath})
                    if (canceled) {
                        resolve(false)
                    } else {
                        fs.writeFileSync(filePath, data)
                        resolve(true)
                    }
                })
        })
    }

    static fileExists = filePath => {
        return fs.existsSync(filePath)
    }
}

module.exports = { FileService }