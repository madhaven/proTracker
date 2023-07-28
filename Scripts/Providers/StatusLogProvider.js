const { DatabaseService } = require("../Services/DatabaseService")

const StatusLogProvider = class {
    // TODO: implement methods
    // TODO: refactor
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }
    
    async create(statusLog) {
        var query = `INSERT INTO status_log (task_id, status_id, date_time) VALUES (?, ?, ?);`
        console.debug('StatusLogProvider: creating')
        try {
            var params = [statusLog.taskId, statusLog.statusId, statusLog.dateTime]
            var id = await this.dbService.insertOne(query, params)
            statusLog.id = id
            console.debug('StatusLogProvider: created')
            return id ? statusLog : false
        } catch (err) {
            console.debug('StatusLogProvider: create', err) // TODO remove error logs
        }
    }

    /* async getTaskTimeline(taskId) {
        var query = `SELECT sl.id, sl.task_id, sl.status_id, sl.date_time, s.status FROM status_log sl INNER JOIN status s ON sl.status_id=s.id WHERE task_id=?`
        try {
            var params = [taskId]
            var res = await this.dbService.fetch(query)
            console.debug('StatusLogProvider: getTaskTimeline', res.length)
            return res ? res : false
        } catch (err) {
            console.error('StatusLogProvider: getTaskTimeline', err) // TODO remove error logs
        }
    } */

    /* async getLatest(taskId) { // TODO: implement query
        var logs = await this.getTaskTimeline(taskId)
        var latestLog = logs.reduce((max, obj) => obj.dateTime>max.dateTime ? obj : max)
        return latestLog ? latestLog : false
    } */
}

module.exports = { StatusLogProvider }