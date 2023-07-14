const { DatabaseService } = require("../Services/DatabaseService")

const StatusProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {}

    async get(id) {
        var query = `SELECT * FROM status WHERE id=${id};`
        try {
            var res = await this.dbService.getOne(query)
            console.log('StatusProvider:get', res)
            return res? res : false
        } catch (err) {
            console.info("DB error while getting status", err)
        }
    }

    async update(id, name) {}

    async delete(id) {}
}

module.exports = { StatusProvider }