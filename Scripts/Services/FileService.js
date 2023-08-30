const { dialog } = require("electron")
const csv = require('fast-csv')
const fs = require('fs')

const FileService = class {
    static csv_options = [{ name: 'CSV Files', extensions: ['csv']}]
    static csv_filters = { filters: this.csv_options }
    static xl_options = [{ name: 'Excel Files', extensions: ['xlsx']}]
    static xl_filters = { filters: this.xl_options}
    static streams = []

    static fileExists = filePath => {
        return fs.existsSync(filePath)
    }

    static loadAFile = async win => { // deprecated
        // TODO: verify if cSV is in prescribed format
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog(win, this.csv_options)
                .then((cancelled, filePaths) => {
                    if (cancelled)
                        resolve([false, undefined])
                    const data = []
                    fs.createReadStream(filePaths[0])
                        .pipe(csv.parse({ headers: true }))
                        .on('data', row => { data.push(row) })
                        .on('end', () => { resolve([true, data])})
                        .on('error', error => {
                            console.trace("FileService: fileLoad", error)
                            resolve([false, undefined])
                        })
                })
                .catch(error => {
                    console.trace("FileService: fileLoadDialogue", error)
                    resolve([false, undefined])
                })
        })
    }

    static selectFileSaveName = async win => {
        return new Promise((resolve, reject) => {
            dialog.showSaveDialog(win, this.xl_filters)
                .then(({canceled, filePath}) => {
                    console.debug('FileService save canceled:', canceled)
                    resolve(canceled ? false : filePath)
                })
                .catch(error => {
                    console.trace('FileService: fileSaveDialog', error)
                    reject(false)
                })
        })
    }

    static openStream = (target) => {
        const stream = fs.createWriteStream(target, { flags: 'a' })
        this.streams.push(stream)
        return stream
    }

    static closeAllStreams = () => {
        this.streams.forEach(stream => stream.close())
        this.streams = []
    }
}

module.exports = { FileService }