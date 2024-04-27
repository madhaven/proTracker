const path = require('path')

const { FileService } = require("./FileService")
const { SingletonServiceBase } = require("./SingletonServiceBase")


const DBVersionService = class extends SingletonServiceBase {
    LATEST = undefined
    ALL_VERSIONS = []
    ALL_VERSION_INIT_FILES = []
    ALL_VERSION_MIG_FILES = []

    constructor (fileService) {
        super()
        this.fileService = fileService ?? FileService
        
        const initDir = "./Scripts/DB/inits/"
            , migDir = "./Scripts/DB/migrations/"
            , initFiles = this.fileService.getFilesInDir(initDir)
            , migFiles = this.fileService.getFilesInDir(migDir)
        this.ALL_VERSIONS = initFiles
            .filter(file => file.endsWith('.sql'))
            .map(file => file.slice(0, -4))
        this.ALL_VERSION_INIT_FILES = initFiles
            .filter(file => file.endsWith('.sql'))
            .map(file => path.join(initDir, file))
        this.ALL_VERSION_MIG_FILES = migFiles
            .filter(file => file.endsWith('.sql'))
            .map(file => path.join(migDir, file))
        
        this.LATEST = this.ALL_VERSIONS[this.ALL_VERSIONS.length - 1]
    }

    getLatestInitScript () {
        return this.ALL_VERSION_INIT_FILES[this.ALL_VERSIONS.indexOf(this.LATEST)]
    }

    getLatestVersion () {
        return this.LATEST
    }

    getMigrationFiles (currentDBVersion) {
        // returns a list of migration script files if a newer DB version exists

        if (!currentDBVersion) return false
        const index = this.ALL_VERSIONS.indexOf(currentDBVersion)
        if (index == -1) {
            // TODO: notify user ?
            // throw Error('Unknown DB version found')
            console.error('DBVersionService: Unknown DB version found', currentDBVersion)
            return false
        } else if (index >= (this.ALL_VERSIONS.length - 1)) {
            // no migration required
            return false
        } else {
            return this.ALL_VERSION_MIG_FILES.slice(index)
        }
    }
}

module.exports = { DBVersionService }