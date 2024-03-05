const fs = require('fs')
const { dialog, app } = require('electron')

const { SingletonServiceBase } = require('./SingletonServiceBase')


const ConfigService = class extends SingletonServiceBase {
    config = undefined
    filename = ''

    constructor (defaultConfig, filename) {
        super()
        this.filename = filename
        try {
            const savedConfig = JSON.parse(fs.readFileSync(filename, 'utf8')) // TODO: move to file service
            this.config = savedConfig
            console.debug('ConfigService():read', savedConfig)
        } catch (err) {
            if (err.code == 'ENOENT') {
                console.debug('ConfigService: no file, creating')
                this.config = defaultConfig
                this.save()
            } else {
                console.error('ConfigService: error reading config', err)
                dialog.showErrorBox('File Read Error', 'proTracker was not able to read important configuration.\nThe app will close now.')
                app.exit()
            }
        }
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