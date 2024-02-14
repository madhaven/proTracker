const { FileService } = require("./FileService")
const { SingletonServiceBase } = require("./SingletonServiceBase")
const path = require('path')

const DBVersionService = class extends SingletonServiceBase {
    LATEST = undefined
    ALL_VERSIONS = []

    constructor (fileService) {
        super()
        this.fileService = fileService ?? FileService
        
        const baseDir = "./Scripts/DB/inits/"
            , initFiles = this.fileService.getFilesInDir(baseDir)
        
        this.ALL_VERSIONS = initFiles
            .filter(file => file.endsWith('.sql'))
            .map(file => path.join(baseDir, file))
        this.LATEST = this.ALL_VERSIONS[this.ALL_VERSIONS.length - 1]
    }

    getLatestInitScript = () => {
        return this.LATEST
    }
}

module.exports = { DBVersionService }