const { Project } = require('../Models/Project')
const { DatabaseService } = require('../Services/DatabaseService')

const ProjectProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {
        var query = `INSERT INTO project (name) VALUES ('${name}');`
        console.debug('ProjectProvider:creating')
        try {
            var id = await this.dbService.insertOne(query)
            var newProject = new Project(id, name)
            console.debug('ProjectProvider:created')
            return newProject
        } catch (err) {
            console.error('ProjectProvider:create', err) // TODO remove error logs
        }
    }

    async get(id) {
        var query = `SELECT id, name FROM project WHERE id=${id};`
        try { 
            var res = await this.dbService.getOne(query)
            var project = new Project(res.id, res.name)
            console.debug('ProjectProvider:get')
            return project ? project : false
        } catch (err) {
            console.debug("ProjectProvider:get", err) // TODO remove error logs
        }
    }

    async getByName(name) {
        var query = `SELECT id, name FROM project WHERE name='${name}';`
        try {
            var res = await this.dbService.getOne(query)
            var project = new Project(res.id, res.name)
            console.debug('ProjectProvider:getByName')
            return project ? project : false
        } catch (err) {
            console.error("ProjectProvider:getByName", err) // TODO remove error logs
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