const State = class {
    // Intended to keep track of the Webpage state
    // All UI should be loadable from an instance of this class

    constructor (
        menuVisible=true,
        dataProfile=true,
        logs=[],
    ) {
        this.menuVisible = menuVisible
        this.dataProfile = dataProfile
        this.logs = logs
    }

    equals(state2) {
        if (typeof(state2) != typeof(this))
            return false
        
        if (this.menuView != state2.menuView 
            || this.dataProfile != state2.dataFile)
            return false

        if (this.logs.length != state2.logs.length)
            return false
        for (var i=0; i<this.logs.length; i++) {
            if (this.logs[i] != state2.logs[i])
                return false
        }

        return true
    }

    sortLogs () { return this.logs.sort((a, b) => a.dateTime - b.dateTime) }
    replaceLogs (logs) {
        this.logs = logs
        this.sortLogs()
    }
    addLog (taskLog) {
        this.logs.push(taskLog)
        this.sortLogs()
    }
}