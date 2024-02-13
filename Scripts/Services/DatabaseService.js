const { dialog, app } = require("electron")
const { ConfigService } = require("./ConfigService")
const { EncryptionService } = require("./EncryptionService")
const { FileService } = require("./FileService")
const { SingletonServiceBase } = require("./SingletonServiceBase")
const sql = require('sqlite3').verbose()
const fs = require('fs')
const path = require("path")

const DatabaseService = class extends SingletonServiceBase {
    dbPath = ''

    constructor () {
        super()
        var configs = ConfigService.getService()
        this.dbPath = configs.get('dbPath')

        // try to restore if no DB file is found otherwise setup new
        if (FileService.fileExists(this.dbPath)) {
            this.tryMigrate()
        } else {
            const restoreFile = this._getLatestBackupFile()
            if (restoreFile) {
                console.log("DatabaseService: DB missing, restoring from backup")
                this.restore(restoreFile)
            } else {
                this.initializeDB()
            }
        }

        if (!this.isConnectionValid()) {
            dialog.showErrorBox('Database Connectivity Error', 'proTracker is not able to connect with database')
            console.error('DatabaseService: connection invalid')
            app.exit()
        }
    }

    initializeDB () {
        console.debug("DatabaseService: initializing DB", this.dbPath) // TODO: privacy violation?
        const db = new sql.Database(this.dbPath)

        try {
            const query = FileService.readFile('./Scripts/DB/init.sql')
            const dataQuery = FileService.readFile('./Scripts/DB/defaultData.sql')
            db.exec(query, err => {
                if (err) {
                    console.trace('DB init error', err)
                } else console.debug("DatabaseService: init complete")
            })
            db.exec(dataQuery, err => {
                if (err) {
                    console.trace('DB data error', err)
                } else console.debug("DatabaseService: default data loaded")
            })
        } catch (err) {
            console.trace('DatabaseService: error reading sql scripts', err)
            dialog.showErrorBox('Fatal Database Error', 'proTracker was unable to setup a database on the machine')
            app.exit()
        } finally {
            db.close()
            return true
        }
    }

    isConnectionValid (testConString) {
        // TODO
        return true
    }

    async insertOne(command, params=[]) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.run (command, params, function (err) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(this.lastID)
            })
            db.close()
        })
    }

    async exec (command, params=[]) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.run (command, params, function (err) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(this.changes)
            })
            db.close()
        })
    }

    async getOne (query, params=[]) { 
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.get(query, params, function (err, res) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(res)
            })
            db.close()
        })
    }
    
    async fetch (query, params=[]) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath) // TODO: move db objects into class-avoid re-instantiation
            db.all(query, params, function (err, res) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(res)
            })
            db.close()
        })
    }

    backup (filePath) {
        var backupPath = filePath ?? this._getBackupPath()
        if (!backupPath) return false
        
        try {
            FileService.copyOrReplace(this.dbPath, backupPath)
            console.debug('DatabaseService: DB backup completed')
            return backupPath
        } catch {
            console.error('DatabaseService: DB backup failed')
            return false
        }
    }

    restore (filePath) {
        var backupPath = filePath ?? this._getLatestBackupFile()
        if (!backupPath) return false

        try {
            FileService.copyOrReplace(backupPath, this.dbPath)
            console.debug('DatabaseService: DB restore completed')
            return true
        } catch {
            console.error('DatabaseService: DB restore failed')
            return false
        }
    }

    tryMigrate () {
        const backupFilePath = this.backup()
        if (!backupFilePath) {
            console.trace("DatabaseService: Unable to backup DB on startup.")
            throw Error('DatabaseService: Unable to backup DB on startup.', backupFilePath) // TODO: error handling mechanism
        }

        // TODO: check db version and migrations
        const query = `SELECT version FROM master`
        
        // GET DB VERSION
        const db = new sql.Database(this.dbPath)
        db.get(query, (err, res) => {
            if (err) {
                console.error('DatabaseService: Migration failed, Restoring DB')
                this.restore(backupFilePath)
                return false
            }
            if (!res) { console.error('DatabaseService: Unable to access core DB values') }

            const dbVersion = res.version
            console.debug(`DatabaseService: master DB version found: ${dbVersion}`)
            // TODO
            console.log('DatabaseService: Migration checks complete')
            return true
        })
        db.close()
    }

    _getBackupPath () {
        const configs = ConfigService.getService()
            , date = new Date()
            , year = date.getFullYear()
            , month = (date.getMonth() + 1).toString().padStart(2, '0')
            , day = date.getDate().toString().padStart(2, '0' )
            , hour = date.getHours().toString().padStart(2, '0')
            , minute = date.getMinutes().toString().padStart(2, '0')
            , fileName = `proTrackerBackup_${year}${month}${day}${hour}${minute}.db` // TODO: remove hardcoded values
            , backupPath = path.join(path.dirname(this.dbPath), fileName)
        return backupPath
    }

    _getLatestBackupFile () {
        var dirName = path.dirname(this.dbPath)
            , backupFiles = FileService.getFilesInDir(dirName)
            , filteredFiles = backupFiles.filter( x => x.endsWith('.db') && x.startsWith('proTrackerBackup_'))
            , latestFile = filteredFiles[filteredFiles.length-1]
        return latestFile
    }
}

module.exports = { DatabaseService }