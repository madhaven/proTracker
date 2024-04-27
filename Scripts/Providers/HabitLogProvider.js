const { HabitLog } = require("../Models/HabitLog")
const { DatabaseService } = require("../Services/DatabaseService")

const HabitLogProvider = class {
    // TODO: implement methods
    // TODO: refactor
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }
    
    async create(habitLog) {
        var query = `INSERT INTO habit_log (habit_id, date_time) VALUES (?, ?);`
        var params = [habitLog.habitId, habitLog.dateTime]
        console.debug('HabitLogProvider: creating')
        try {
            var id = await this.dbService.insertOne(query, params)
            habitLog.id = id
            console.debug('HabitLogProvider: created')
            return id ? habitLog : false
        } catch (err) {
            console.trace('HabitLogProvider: create', err)
        }
    }

    async getAllLogs() {
        const query = `SELECT id, habit_id, date_time FROM habit_log;`
        console.debug('HabitLogProvider: getAllLogs')
        try {
            const res = await this.dbService.fetch(query)
                , result = res.map(log => new HabitLog(
                log.id,
                log.habit_id,
                log.date_time
            ))
            return res ? result : false
        } catch (err) {
            console.trace('HabitLogProvider: getAllLogs', err)
        }
    }
}

module.exports = { HabitLogProvider }