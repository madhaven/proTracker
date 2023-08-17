const { TaskLog } = require('../Contracts/TaskLog')
const { Task } = require('../Models/Task')
const { DatabaseService } = require('../Services/DatabaseService')

const TaskProvider = class {
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(task) {
        const query = `INSERT INTO task (project_id, summary, parent_id) VALUES (?, ?, ?);`
        const params = [task.projectId, task.summary, task.parentId]
        console.debug('TaskProvider: creating')
        try {
            const id = await this.dbService.insertOne(query, params)
            task.id = id
            console.debug('TaskProvider: created')
            return id ? task : false
        } catch (err) {
            console.error("TaskProvider: create", err) // TODO remove error logs
        }
    }

    async get(id) {
        const query = `SELECT id, project_id, summary, parent_id FROM task WHERE id=?;`
        const params = [id]
        console.debug('TaskProvider: get')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Task(res.id, res.project_id, res.summary, res.parent_id) : false
        } catch (err) {
            console.error("TaskProvider: get", err) // TODO remove error logs
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
            console.error('TaskProvider: tasksOfProject', err) // TODO remove error logs
        }
    }

    async getAllTasks() {
        const query = `SELECT t.id as id, t.summary, t.project_id as project_id, t.parent_id, p.name as project_name, sl.date_time as date_time, s.id as status_id, s.status as status_name FROM task t INNER JOIN project p ON t.project_id=p.id INNER JOIN (SELECT task_id, MAX(date_time) AS date_time, status_id FROM status_log GROUP BY task_id) sl ON t.id=sl.task_id INNER JOIN status s ON s.id=sl.status_id`
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
            console.error("TaskProvider: getAllTasks", err) // TODO remove error logs
        }
    }

    async getAllTaskLogs() { // deprecated
        const query = `SELECT t.id as id, t.summary, t.project_id as project_id, t.parent_id, p.name as project_name, sl.date_time as date_time, s.id as status_id, s.status as status_name, sl.task_id, sl.date_time FROM task t INNER JOIN project p ON t.project_id=p.id INNER JOIN status_log sl ON t.id=sl.task_id INNER JOIN status s ON s.id=sl.status_id ORDER BY sl.date_time`
        console.debug('TaskProvider: allTaskLogs')
        try {
            const res = await this.dbService.fetch(query)
            const result = res.map(task => new TaskLog(
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
            return res ? result : false
        } catch (err) {
            console.error('TaskProvider: getAllTaskLogs', err) // TODO remove error logs
        }
    }

    async update(id, summary) {
        const query = `UPDATE task SET summary=? WHERE id=?;`
        const params = [summary, id]
        console.debug('TaskProvider: update')
        try {
            const res = await this.dbService.exec(query, params)
            return res==1 ? true : false
        } catch (err) {
            console.error('TaskProvider: update', err) // TODO remove error logs
            return false
        }
    }

    async delete(id) {
        // TODO: make a delted field vs actually delete
    }
}

module.exports = { TaskProvider }