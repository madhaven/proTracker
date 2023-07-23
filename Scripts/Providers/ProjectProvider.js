const { Project } = require('../Models/Project')
const { DatabaseService } = require('../Services/DatabaseService')

const ProjectProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {
        var query = `INSERT INTO project (name) VALUES (?);`
        console.debug('ProjectProvider: creating')
        try {
            var params = [name]
            var id = await this.dbService.insertOne(query, params)
            var newProject = new Project(id, name)
            console.debug('ProjectProvider: created')
            return newProject
        } catch (err) {
            console.error('ProjectProvider: create', err) // TODO remove error logs
        }
    }

    async get(id) {
        var query = `SELECT id, name FROM project WHERE id=?;`
        try {
            var params = [id]
            var res = await this.dbService.getOne(query, params)
            console.debug('ProjectProvider: get')
            return res ? new Project(res.id, res.name) : false
        } catch (err) {
            console.debug("ProjectProvider: get", err) // TODO remove error logs
        }
    }

    async getByName(name) {
        var query = `SELECT id, name FROM project WHERE name=?;`
        try {
            var params = [name]
            var res = await this.dbService.getOne(query, params)
            console.debug('ProjectProvider: getByName')
            return res ? new Project(res.id, res.name) : false
        } catch (err) {
            console.error("ProjectProvider: getByName", err) // TODO remove error logs
        }
    }

    async getByNameOrCreate(name) { // TODO change the query in create() to handle this case
        var project = await this.getByName(name)
        if (project) {
            return project
        } else {
            var newProject = await this.create(name)
            return newProject
        }
    }

    async getAllProjects() {}

    async getActiveProjectsInTime(startTime, endTime) {}

    async updateName(id, name) {}

    async delete(id) {}
}

module.exports = { ProjectProvider }