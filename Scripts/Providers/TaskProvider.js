const { Task } = require('../Models/Task')
const { DatabaseService } = require('../Services/DatabaseService')

const TaskProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(task) {
        var query = `INSERT INTO task (project_id, summary, parent_id) VALUES (${task.projectId}, '${task.summary}', ${task.parentId});`
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
            console.error("DB error while getting task", err)
        }
    }

    async getAllTaskOfProject(projectId) {}

    async getAllTasks() {
        var query = `SELECT t.id, t.summary, t.project_id as project_id, t.parent_id, p.name as project_name, sl.date_time as date_time, s.id as status_id, s.status as status_name FROM task t INNER JOIN project p ON t.project_id=p.id INNER JOIN (SELECT task_id, MAX(date_time) AS date_time, status_id FROM status_log GROUP BY task_id) sl ON t.id=sl.task_id INNER JOIN status s ON s.id=sl.status_id`

        try {
            var res = await this.dbService.fetch(query)
            console.log('TaskProvider:getall', res)
            var result = res.map(task => new Task( // TODO std contracts
                id=task.id,
                summary=task.summary
            ))
            return res? res : false
        } catch (err) {
            console.error("DB error while getting all tasks", err)
        }
    }

    async updateSummary(id, summary) {}

    async delete(id) {}
}

module.exports = { TaskProvider }