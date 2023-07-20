const { TaskLog } = require('../Contracts/TaskLog')
const { Task } = require('../Models/Task')
const { DatabaseService } = require('../Services/DatabaseService')

const TaskProvider = class {
    // TODO: implement methods
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(task) {
        var query = `INSERT INTO task (project_id, summary, parent_id) VALUES (?, ?, ?);`
        var params = [task.projectId, task.summary, task.parentId]
        console.debug('TaskProvider:creating')
        try {
            var id = await this.dbService.insertOne(query, params)
            task.id = id
            console.debug('TaskProvider:created')
            return id ? task : false
        } catch (err) {
            console.error("TaskProvider:create", err) // TODO remove error logs
        }
    }

    async get(id) {
        var query = `SELECT id, project_id, summary, parent_id FROM task WHERE id=${id};`
        try {
            var res = await this.dbService.getOne(query)
            var task = new Task(res.id, res.project_id, res.summary, res.parent_id)
            console.debug('TaskProvider:get')
            return task ? task : false
        } catch (err) {
            console.error("TaskProvider:get", err) // TODO remove error logs
        }
    }

    async getAllTaskOfProject(projectId) {}

    async getAllTasks() {
        var query = `SELECT t.id as id, t.summary, t.project_id as project_id, t.parent_id, p.name as project_name, sl.date_time as date_time, s.id as status_id, s.status as status_name FROM task t INNER JOIN project p ON t.project_id=p.id INNER JOIN (SELECT task_id, MAX(date_time) AS date_time, status_id FROM status_log GROUP BY task_id) sl ON t.id=sl.task_id INNER JOIN status s ON s.id=sl.status_id`
        try {
            var res = await this.dbService.fetch(query)
            console.debug('TaskProvider:getallTasks', res.length)
            var result = res.map(task => new Task( // TODO std contracts
                task.id,
                task.project_id,
                task.summary,
                task.parent_id
            ))
            return result ? result : false
        } catch (err) {
            console.error("TaskProvider:getAllTasks", err) // TODO remove error logs
        }
    }

    async getAllTaskLogs() {
        var query = `SELECT t.id as id, t.summary, t.project_id as project_id, t.parent_id, p.name as project_name, sl.date_time as date_time, s.id as status_id, s.status as status_name, sl.task_id, sl.date_time FROM task t INNER JOIN project p ON t.project_id=p.id INNER JOIN status_log sl ON t.id=sl.task_id INNER JOIN status s ON s.id=sl.status_id`
        try {
            var res = await this.dbService.fetch(query)
            console.debug('TaskProvider:allLogs', res.length)
            var result = res.map(task => new TaskLog(
                    task.id,
                    task.date_time,
                    task.summary,
                    task.parent_id,
                    task.project_id,
                    task.project_name,
                    task.status_id,
                    task.status_name
                )
            )
            return result ? result : false
        } catch (err) {
            console.error('TaskProvider:getAllTaskLogs', err) // TODO remove error logs
        }
    }

    async updateSummary(id, summary) {}

    async delete(id) {}
}

module.exports = { TaskProvider }