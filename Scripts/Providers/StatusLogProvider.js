const { DatabaseService } = require("../Services/DatabaseService")

const StatusLogProvider = class {
    // TODO: implement methods
    // TODO: refactor
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }
    
    async create(taskLog) {
        var query = `INSERT INTO status_log (task_id, status_id, date_time) VALUES (${taskLog.taskId}, ${taskLog.statusId}, ${taskLog.dateTime});`
        console.log('StatusLogProvider:creating', taskLog)
        try {
            var res = await this.dbService.insertOne(query)
            taskLog.id = res
            console.log('StatusLogProvider:created', taskLog)
            return taskLog
        } catch (err) {
            console.log('Query paali man', err)
        }
    }

    async getTaskTimeline(taskId) {
        var query = `SELECT id, task_id, status_id, date_time FROM status_log WHERE task_id=${taskId}`
        try {
            var res = await this.dbService.fetch(query)
            console.log('StatusLogProvider:taskLogs', res)
            return res ? res : false
        } catch (err) {
            console.error('Query scene ayi man')
        }
    }

    async getLatest(taskId) {
        var logs = await this.getTaskTimeline(taskId)
        var latestLog = logs.reduce((max, obj) => obj.dateTime>max.dateTime ? obj : max)
        return latestLog
    }

    async delete(id) {}
}

module.exports = { StatusLogProvider }