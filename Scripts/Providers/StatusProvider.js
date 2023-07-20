const { Status } = require("../Models/Status")
const { DatabaseService } = require("../Services/DatabaseService")

const StatusProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {}

    async get(id) {
        var query = `SELECT id, status FROM status WHERE id=${id};`
        try {
            var res = await this.dbService.getOne(query)
            var status = new Status(res.id, res.status)
            console.debug('StatusProvider:get')
            return status ? status : false
        } catch (err) {
            console.error("StatusProvider:get", err) // TODO remove error logs
        }
    }

    async update(id, name) {}

    async delete(id) {}
}

module.exports = { StatusProvider }