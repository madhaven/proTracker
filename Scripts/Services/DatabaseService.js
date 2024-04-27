const fs = require('fs')
const sql = require('sqlite3').verbose()
const path = require("path")
const { dialog, app } = require("electron")

const { FileService } = require("./FileService")
const { ConfigService } = require("./ConfigService")
const { DBVersionService } = require("./DBVersionService")
const { EncryptionService } = require("./EncryptionService")
const { SingletonServiceBase } = require("./SingletonServiceBase")


const DatabaseService = class extends SingletonServiceBase {
    dbPath = ''

    // TODO: arrange methods

    constructor (
        dbVersionService,
        configService,
        fileService
    ) {
        super()
        this.configService = configService ?? ConfigService.getService()
        this.dbVersionService = dbVersionService ?? DBVersionService.getService()
        this.fileService = fileService ?? FileService
        this.dbPath = this.configService.get('dbPath')

        if (!this.fileService.fileExists(this.dbPath)) {
            if (!this.tryRestore())
                this.initializeNewDB()
        } else {
            if (!this.tryBackup()) {
                console.trace("DatabaseService: Unable to backup DB on startup.")
                throw Error('DatabaseService: Unable to backup DB on startup.') // TODO: error handling mechanism
            }
        }

        if (!this.isConnectionValid()) {
            dialog.showErrorBox('Database Connectivity Error', 'proTracker is not able to connect with database')
            console.error('DatabaseService: connection invalid')
            app.exit()
        }
    }

    initializeNewDB () {
        const db = new sql.Database(this.dbPath) // TODO: change to common method
            , initScript = this.dbVersionService.getLatestInitScript()

        try {
            const query = this.fileService.readFile(initScript)
            db.exec(query, err => {
                if (err) {
                    console.error('DatabaseService: initialization error', err)
                } else {
                    console.debug("DatabaseService: DB initialized")
                }
            })
        } catch {
            console.trace('DatabaseService: error while DB initialization')
            dialog.showErrorBox('Fatal Database Error', 'proTracker was unable to setup a database on this machine')
            db.close()
            app.exit()
        } finally {
            db.close()
            return true
        }
    }

    isConnectionValid (testConString) {
        return true // TODO:
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

    tryBackup (filePath) {
        var backupPath = filePath ?? this._getBackupPath()
        if (!backupPath) return false
        
        try {
            this.fileService.copyOrReplace(this.dbPath, backupPath)
            console.debug('DatabaseService: DB backup completed')
            return backupPath
        } catch {
            console.error('DatabaseService: DB backup failed')
            return false
        }
    }

    tryRestore (filePath) {
        var backupPath = filePath ?? this._getLatestBackupFile()
        if (!backupPath) return false

        try {
            this.fileService.copyOrReplace(backupPath, this.dbPath)
            console.debug('DatabaseService: DB restore completed')
            return true
        } catch {
            console.error('DatabaseService: DB restore failed')
            return false
        }
    }

    tryMigrate (backupFilePath) {
        backupFilePath ??= this._getBackupPath()
        const db = new sql.Database(this.dbPath)
        var migrationResult = false
        
        new Promise((resolve, reject) => {
            // get current db
            const query = `SELECT version FROM master`
            db.get(query, (err, res)=> {
                if (err || !res || !res.version) {
                    console.error('DatabaseService: Unable to access core DB data')
                    reject('err/no version access')
                } else {
                    resolve(res.version)
                }
            })
        }).then((currentDBVersion) => {
            const migFiles = this.dbVersionService.getMigrationFiles(currentDBVersion)
            if (!migFiles) return false

            const upgradeQueries = migFiles.map(file => this.fileService.readFile(file))
            if (!upgradeQueries) return false

            return upgradeQueries.join('')
        }).then((migrationScript) => {
            if (!migrationScript) return false
            db.exec(migrationScript, (err) => {
                if (err) {
                    console.log('DatabaseService: Migration failed')
                    throw Error('migrationFailed')
                } else {
                    console.log('DatabaseService: Successfully Migrated to', this.dbVersionService.getLatestVersion())
                }
            })
        }).catch((err) => {
            console.log('DatabaseService: Migration failed')
            this.tryRestore() // TODO: causes clash with DB process ?
        }).finally(() => {
            db.close()
        })
    }

    _getBackupPath () {
        const date = new Date()
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