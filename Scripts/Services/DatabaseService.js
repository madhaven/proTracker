const { dialog, app } = require("electron")
const { ConfigService } = require("./ConfigService")
const { EncryptionService } = require("./EncryptionService")
const { FileService } = require("./FileService")
const sql = require('sqlite3').verbose()
const fs = require('fs')

const DatabaseService = class {
    static singleton = undefined
    dbPath = ''
    connectionString = ''

    constructor () {
        var configs = ConfigService.getService()

        this.dbPath = configs.get('dbPath')
        if (!FileService.fileExists(this.dbPath)) {
            this.initializeDB()
        } else {
            // TODO: check db version and migrations
            console.warn('DatabaseService: db version check || migrations')
        }

        this.connectionString = EncryptionService.decrypt(configs.get('connectionString'))

        if (!this.isConnectionValid(this.connectionString)) {
            dialog.showErrorBox('Database Connectivity Error', 'proTracker is not able to connect with database')
            console.error('DatabaseService: connection invalid')
            app.exit()
        }
    }
    
    static getService () {
        if (!this.singleton)
            this.singleton = new this()
        return this.singleton
    }

    initializeDB () {
        console.debug("DatabaseService: initializing DB", this.dbPath)
        const db = new sql.Database(this.dbPath)

        try {
            var query = fs.readFileSync('./Scripts/DB/init.sql', 'utf8')
            var dataQuery = fs.readFileSync('./Scripts/DB/defaultData.sql', 'utf8')
            db.exec(query, err => {
                if (err) console.error('DB init error', err) // TODO remove error logs
                else console.debug("DatabaseService: init complete")
            })
            db.exec(dataQuery, err => {
                if (err) console.error('DB data error', err) // TODO remove error logs
                else console.debug("DatabaseService: default data loaded")
            })
        } catch (err) {
            console.error('DatabaseService: error reading sql scripts', err) // TODO remove error logs
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

    insertOne(command) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.run (command, function (err) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(this.lastID)
            })
            db.close()
        })
    }

    exec (command) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.exec (command, function (err) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(this.changes)
            })
            db.close()
        })
    }

    getOne (query) { 
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.get(query, function (err, res) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(res)
            })
            db.close()
        })
    }
    
    fetch (query) {
        return new Promise((resolve, reject) => {
            const db = new sql.Database(this.dbPath)
            db.all(query, function (err, res) { // this syntax of function definition is necessary
                if (err) reject(err)
                else resolve(res)
            })
            db.close()
        })
    }
}

module.exports = { DatabaseService }