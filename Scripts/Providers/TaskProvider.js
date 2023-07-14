const { Task } = require('../Models/Task')
const { DatabaseService } = require('../Services/DatabaseService')

const TaskProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(task) {
        // task.dateTime = 
        var query = `INSERT INTO task (date_time, project_id, summary, status_id, parent_id) VALUES (${task.dateTime}, ${task.projectId}, '${task.summary}', ${task.status}, ${task.parent});`
        console.log('TaskProvider:creating', task)
        try {
            var res = await this.dbService.insertOne(query)
            task.id = res
            console.log('TaskProvider:created', task)
            return task
        } catch (err) {
            console.log("QUery Moonchi monoose", err)
        }
    }

    async get(id) {
        var query = `SELECT * FROM task WHERE id=${id};`
        try {
            var res = await this.dbService.getOne(query)
            console.log('TaskProvider:get', res)
            return res? res : false
        } catch (err) {
            console.info("DB error while getting task", err)
        }
    }

    async getAllTaskOfProject(projectId) {}

    async getAllTasks() {}

    async updateSummary(id, summary) {}

    async updateStatus(id, statusId) {}

    async delete(id) {}
}

module.exports = { TaskProvider }