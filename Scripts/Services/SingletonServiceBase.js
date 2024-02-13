const SingletonServiceBase = class {
    static singleton = undefined

    static getService(...params) {
        if (!this.singleton)
            this.singleton = new this(...params)
        return this.singleton
    }
}

module.exports = { SingletonServiceBase }