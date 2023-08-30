const { dialog, app } = require('electron')
const fs = require('fs')

const ConfigService = class {
    static singleton = undefined
    config = undefined
    filename = ''

    constructor (filename, config) {
        this.filename = filename
        try {
            const savedConfig = JSON.parse(fs.readFileSync(filename, 'utf8')) // TODO: move to file service
            this.config = savedConfig
            console.debug('ConfigService():read', savedConfig)
        } catch (err) {
            if (err.code == 'ENOENT') {
                console.debug('ConfigService: no file, creating')
                this.config = config
                this.save()
            } else {
                console.error('ConfigService: error reading config')
                dialog.showErrorBox('File Read Error', 'proTracker was not able to read important configuration.\nThe app will close now.')
                app.exit()
            }
        }
    }

    static getService(config=undefined, configFileName=undefined) {
        if (!this.singleton)
            this.singleton = new this(configFileName, config)
        return this.singleton
    }

    save () {
        try {
            fs.writeFileSync(this.filename, JSON.stringify(this.config))
            console.debug('ConfigService: save', this.filename) // TODO: privacy violation!?
        } catch (err) {
            dialog.showErrorBox('Critical Error', 'proTracker is not able to save important configuration.\nYou might loose the changes made in this session')
            console.error('ConfigService: error saving config')
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