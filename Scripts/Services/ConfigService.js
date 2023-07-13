const { dialog, app } = require('electron')
const fs = require('fs')
const path = require('path')

const userDataPath = app.getPath('appData')
const configFileName = path.join(userDataPath, 'proTracker', 'appconfig.json')
const defaultConfig = {
    dbPath: path.join(userDataPath, 'proTracker', 'proTracker.db'),
    defaultScreen: 'log'
}

const ConfigService = class {
    static singleton = undefined
    static defaultConfig = {
        dbPath: path.join(userDataPath, 'proTracker', 'proTracker.db'),
        defaultScreen: 'log'
    }
    config = undefined
    filename = ''

    constructor (filename, defaultConfig) {
        this.filename = filename
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    console.info('No Config File, creating new')
                    this.config = defaultConfig
                    this.save()
                } else {
                    console.error('error reading config')
                    dialog.showErrorBox('File Read Error', 'proTracker was not able to read important configuration.\nThe app will close now.')
                    app.exit()
                }
            } else {
                console.info('Config Read', data)
            }
        })
    }

    static getService() {
        if (!this.singleton)
            this.singleton = new this(configFileName, defaultConfig)
        return this.singleton
    }

    save () {
        fs.writeFile(this.filename, JSON.stringify(this.config), err => {
            if (err) {
                dialog.showErrorBox('Critical Error', 'proTracker is not able to save important configuration.\nYou might loose the changes made in this session')
                console.error('error saving config')
            } else {
                console.info('Default Configs saved to', this.filename)
            }
        })
    }

    get (key) {
        return this.config[key]
    }

    set (key, value) {
        this.config[key] = value
    }
}

module.exports = { ConfigService }