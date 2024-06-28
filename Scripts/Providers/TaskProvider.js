const { TaskLog } = require('../Contracts/TaskLog')
const { Task } = require('../Models/Task')
const { DatabaseService } = require('../Services/DatabaseService')

const TaskProvider = class {
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(summary, projectId, parentId) {
        const query = `INSERT INTO task (project_id, summary, parent_id) VALUES (?, ?, ?);`
        const params = [projectId, summary, parentId]
        console.debug('TaskProvider: creating')
        try {
            const id = await this.dbService.insertOne(query, params)
            var task = new Task(id, projectId, summary, parentId);
            console.debug('TaskProvider: created')
            return id ? task : false
        } catch (err) {
            console.trace("TaskProvider: create", err)
        }
    }

    async getById(id) {
        const query = `SELECT id, project_id, summary, parent_id FROM task WHERE id=?;`
        const params = [id]
        console.debug('TaskProvider: get')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Task(res.id, res.project_id, res.summary, res.parent_id) : false
        } catch (err) {
            console.trace("TaskProvider: get", err)
        }
    }

    async getAllTaskOfProject(projectId) {
        const query = `SELECT id, project_id, summary, parent_id FROM task WHERE project_id=?;`;
        const params = [projectId]
        console.debug('TaskProvider: tasksOfProject')
        try { 
            const res = await this.dbService.fetch(query, params)
            const result = res.map(task => new Task(
                task.id, task.project_id, task.summary, task.parent_id
            ))
            return res ? result : false
        } catch (err) {
            console.trace('TaskProvider: tasksOfProject', err)
        }
    }

    async getAllTasks() {
        const query = `SELECT * FROM task`;
        console.debug('TaskProvider: getallTasks')
        try {
            const res = await this.dbService.fetch(query)
            const result = res.map(task => new Task(
                task.id,
                task.project_id,
                task.summary,
                task.parent_id
            ))
            return result ? result : false
        } catch (err) {
            console.trace("TaskProvider: getAllTasks", err)
        }
    }

    async update(task) {
        const query = `UPDATE task SET summary=? WHERE id=?;`
        const params = [task.summary, task.id]
        console.debug('TaskProvider: update')
        try {
            const res = await this.dbService.exec(query, params)
            return res==1 ? true : false
        } catch (err) {
            console.trace('TaskProvider: update', err)
            return false
        }
    }

    async delete(task) {
        // TODO: make a delted field vs actually delete
    }
}

module.exports = { TaskProvider }