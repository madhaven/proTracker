const { StatusLog } = require("../Models/StatusLog")
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
        var params = [statusLog.taskId, statusLog.statusId, statusLog.dateTime]
        console.debug('StatusLogProvider: creating')
        try {
            var id = await this.dbService.insertOne(query, params)
            statusLog.id = id
            console.debug('StatusLogProvider: created')
            return id ? statusLog : false
        } catch (err) {
            console.debug('StatusLogProvider: create', err) // TODO remove error logs
        }
    }

    async getAllLogs() {
        const query = `SELECT id, task_id, status_id, date_time FROM status_log;`
        console.debug('StatusLogProvider: getAllLogs')
        try {
            const res = await this.dbService.fetch(query)
            const result = res.map(log => new StatusLog(
                log.id,
                log.task_id,
                log.status_id,
                log.date_time
            ))
            return res ? result : false
        } catch (err) {
            console.error('StatusLogProvider: getAllLogs', err) // TODO remove error logs
        }
    }

    /* async getTaskTimeline(taskId) {
        const query = `SELECT sl.id, sl.task_id, sl.status_id, sl.date_time, s.status FROM status_log sl INNER JOIN status s ON sl.status_id=s.id WHERE task_id=?`
        const params = [taskId]
        console.debug('StatusLogProvider: getTaskTimeline')
        try {
            var res = await this.dbService.fetch(query)
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