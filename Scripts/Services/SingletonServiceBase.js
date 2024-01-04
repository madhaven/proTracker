const SingletonServiceBase = class {
    static singleton = undefined

    static getService() {
        if (!this.singleton)
            this.singleton = new this()
        return this.singleton
    }
}

module.exports = { SingletonServiceBase }