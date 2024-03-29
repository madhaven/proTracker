const { Status } = require("../Models/Status")
const { DatabaseService } = require("../Services/DatabaseService")

const StatusProvider = class {
    dbService = undefined

    constructor (dbService=undefined) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {
        const query = `INSERT INTO status (status) VALUES (?);`
        const params = [name]
        console.debug('StatusProvider: creating')
        try {
            const id = await this.dbService.insertOne(query, params)
            const status = new Status(id, name)
            console.debug('StatusProvider: created')
            return id ? status : false
        } catch (err) {
            console.trace('StatusProvider: create', err)
        }
    }

    async getById(id) {
        const query = `SELECT id, status FROM status WHERE id=?;`
        const params = [id]
        console.debug('StatusProvider: get')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Status(res.id, res.status) : false
        } catch (err) {
            console.trace("StatusProvider: get", err)
        }
    }

    async update(status) {
        const query = `UPDATE status SET status=? WHERE id=?;`;
        const params = [status.name, status.id]
        console.debug('StatusProvider: update')
        try {
            const res = await this.dbService.exec(query, params)
            return res==1 ? true : false
        } catch (err) {
            console.trace('StatusProvider: update', err)
            return false
        }
    }

    async delete(status) {
        // TODO: make a delted field vs actually delete
    }
}

module.exports = { StatusProvider }