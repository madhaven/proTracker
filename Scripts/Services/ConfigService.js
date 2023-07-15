const { dialog, app } = require('electron')
const fs = require('fs')
const path = require('path')

const userDataPath = app.getPath('appData')
const configFileName = path.join(userDataPath, 'proTracker', 'appconfig.json')
const debugConfigFileName = 'appconfig.json'
const defaultConfig = {
    dbPath: path.join(userDataPath, 'proTracker', 'proTracker.db'),
}

const ConfigService = class {
    static singleton = undefined
    config = undefined
    filename = ''

    constructor (filename, defaultConfig) {
        this.filename = filename
        try {
            const savedConfig = JSON.parse(fs.readFileSync(filename, 'utf8'))
            console.info('Config Read', savedConfig)
            this.config = savedConfig
        } catch (err) {
            if (err.code == 'ENOENT') {
                console.info('No Config File, creating new')
                this.config = defaultConfig
                this.save()
            } else {
                console.error('error reading config')
                dialog.showErrorBox('File Read Error', 'proTracker was not able to read important configuration.\nThe app will close now.')
                app.exit()
            }
        }
    }

    static getService(customConfig=undefined) {
        if (!this.singleton) {
            if (customConfig)
                this.singleton = new this(debugConfigFileName, customConfig)
            else
                this.singleton = new this(configFileName, defaultConfig)
        }
        return this.singleton
    }

    save () {
        try {
            fs.writeFileSync(this.filename, JSON.stringify(this.config))
            console.info('Default Configs saved to', this.filename)
        } catch (err) {
            dialog.showErrorBox('Critical Error', 'proTracker is not able to save important configuration.\nYou might loose the changes made in this session')
            console.error('error saving config')
        }
    }

    get (key) {
        return this.config[key]
    }

    set (key, value) {
        this.config[key] = value
    }
}

module.exports = { ConfigService }