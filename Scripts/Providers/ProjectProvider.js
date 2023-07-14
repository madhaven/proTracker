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
        console.log('ProjectProvider:creating', name)
        try {
            var res = await this.dbService.insertOne(query)
            var newProject = new Project(res, name)
            console.log('ProjectProvider:created', newProject)
            return newProject
        } catch (err) {
            console.log('QUERY ERROR MONUUUSE', err)
        }
    }

    async get(id) {
        var query = `SELECT * FROM project WHERE id=${id};`
        try { 
            var res = await this.dbService.getOne(query)
            console.log('ProjectProvider:get', res)
            return res? res : false
        } catch (err) {
            console.info("DB error while getting project", err)
        }
    }

    async getByName(name) {
        var query = `SELECT id, name FROM project WHERE name='${name}';`
        try {
            var res = await this.dbService.fetch(query)
            console.log('ProjectProvider:projects fetched', res)
            return res? res[0] : false
        } catch (err) {
            console.info("DB error while searching for project", err)
        }
    }

    async getByNameOrCreate(name) {
        var project = await this.getByName(name)
        if (project) {
            console.log('returning project from db', project)
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