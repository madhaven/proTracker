const { Project } = require('../Models/Project')
const { DatabaseService } = require('../Services/DatabaseService')

const ProjectProvider = class {
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(name) {
        const query = `INSERT INTO project (name) VALUES (?);`
        const params = [name]
        console.debug('ProjectProvider: creating')
        try {
            const id = await this.dbService.insertOne(query, params)
            const newProject = new Project(id, name)
            console.debug('ProjectProvider: created')
            return newProject
        } catch (err) {
            console.trace('ProjectProvider: create', err)
        }
    }

    async getById(id) {
        const query = `SELECT id, name FROM project WHERE id=?;`
        const params = [id]
        console.debug('ProjectProvider: get')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Project(res.id, res.name) : false
        } catch (err) {
            console.trace("ProjectProvider: get", err)
        }
    }

    async getByName(name) {
        const query = `SELECT id, name FROM project WHERE name=?;`
        const params = [name]
        console.debug('ProjectProvider: getByName')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Project(res.id, res.name) : false
        } catch (err) {
            console.trace("ProjectProvider: getByName", err)
        }
    }

    async getByNameOrCreate(name) {
        // TODO: OPTIMIZE
        // const query = `INSERT OR IGNORE INTO project (name)
        // SELECT ? WHERE NOT EXISTS ( SELECT 1 FROM project WHERE name = ?);`
        // console.debug('ProjectProvider: get/create')
        const project = await this.getByName(name)
        if (project) {
            return project
        } else {
            const newProject = await this.create(name)
            return newProject
        }
    }

    async getAllProjects() {
        const query = `SELECT id, name FROM project;`
        console.debug('ProjectProvider: getAll')
        try {
            const res = await this.dbService.fetch(query)
            const result = res.map(project => new Project (
                project.id,
                project.name
            ))
            return res ? result : false
        } catch (err) {
            console.trace('ProjectProvider: get', err)
        }
    }

    async getProjectTree(logs, tasks) {
        var projectTree = {}, orderredLogs = []
        orderredLogs = [...logs];
        orderredLogs.sort((a, b) => a.dateTime-b.dateTime)

        orderredLogs.forEach((log) => {
            const taskId = log.taskId
                , projectId = tasks[taskId].projectId

            projectTree[projectId] ??= {}
            if (projectTree[projectId][taskId] == undefined)
                projectTree[projectId][taskId] = []
            if (projectTree[projectId][taskId].length == 0)
                projectTree[projectId][taskId].push(log)
            else if (projectTree[projectId][taskId].length == 1)
                projectTree[projectId][taskId].push(log)
            else if (projectTree[projectId][taskId].length == 2)
                projectTree[projectId][taskId][1] = log
        })
        return projectTree
    }

    async update(project) {
        const query = `UPDATE project SET name=? WHERE id=?;`
        const params = [project.name, project.id]
        console.debug('ProjectProvider: update')
        try {
            const res = await this.dbService.exec(query, params)
            return res==1 ? true : false
        } catch (err) {
            console.trace('ProjectProvider: update', err)
            return false
        }
    }

    async delete(project) {
        // TODO: make a deleted field vs actually delete
    }
}

module.exports = { ProjectProvider }