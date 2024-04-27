const { Habit } = require("../Models/Habit")
const { DatabaseService } = require("../Services/DatabaseService")

const HabitProvider = class {
    dbService = undefined

    constructor (dbService) {
        this.dbService = dbService ? dbService : DatabaseService.getService()
    }

    async create(habit) {
        habit:Habit
        var query = `INSERT INTO habit (name, removed, start_time, end_time, days) VALUES (?, ?, ?, ?, ?);`
        var params = [habit.name, habit.removed, habit.startTime, habit.endTime, habit.days]
        console.debug('HabitProvider: creating')
        try {
            var id = await this.dbService.insertOne(query, params)
            habit.id = id
            console.debug('HabitProvider: created')
            return id ? habit : false
        } catch (err) {
            console.trace('HabitProvider: create', err)
        }
    }

    async get(id) {
        const query = `
        SELECT 
            habit.id
            , MAX(hlog.date_time) as latest_log_time
            , habit.name
            , habit.removed
            , habit.start_time
            , habit.end_time
            , habit.days
        FROM habit LEFT JOIN habit_log hlog
        ON habit.id=hlog.habit_id GROUP BY habit_id
        HAVING habit.id=?;`
        const params = [id]
        console.debug('HabitProvider: get')
        try {
            const res = await this.dbService.getOne(query, params)
            return res ? new Habit(
                res.id,
                res.name,
                res.removed,
                res.startTime,
                res.endTime,
                res.days,
                res.latest_log_time
            ) : false
        } catch (err) {
            console.trace("Habit: get", err)
        }
    }

    async update(id, habit) {
        const query = `UPDATE habit SET name=?, removed=?, start_time=?, end_time=?, days=?;`
        const params = [habit.name, habit.removed, habit.startTime, habit.endTime, habit.days]
        console.debug('HabitProvider: update')
        try {
            const res = await this.dbService.exec(query, params)
            return res==1 ? true : false
        } catch (err) {
            console.trace('HabitProvider: update', err)
            return false
        }
    }

    async delete(id) {
        // TODO: implement
    }

    async getAllHabits() {
        const query = `
        SELECT 
            habit.id
            , MAX(hlog.date_time) as latest_log_time
            , habit.name
            , habit.removed
            , habit.start_time
            , habit.end_time
            , habit.days
        FROM habit LEFT JOIN habit_log hlog ON habit.id=hlog.habit_id
        GROUP BY habit.id;`
        console.debug('HabitProvider: getAllHabits')
        try {
            const res = await this.dbService.fetch(query)
            return res ? res.map(habit => new Habit(
                habit.id,
                habit.name,
                habit.removed,
                habit.startTime,
                habit.endTime,
                habit.days,
                habit.latest_log_time
            )) : false
        } catch (err) {
            console.trace('HabitProvider: getAllHabits', err)
        }
    }
}

module.exports = { HabitProvider }