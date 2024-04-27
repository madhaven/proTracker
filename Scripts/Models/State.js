const State = class {
    // Intended to keep track of the Webpage state
    // All UI should be loadable from an instance of this class

    constructor (
        menuVisible=true
        , dataProfile=true
    ) {
        this.menuVisible = menuVisible
        this.dataProfile = dataProfile
        this.logs = [] // TODO: UI requests for logs vs backend prompts UI with logs?
        this.logTree = {}
    }

    equals(state2) {
        if (
            this.menuView != state2.menuView ||
            this.dataProfile != state2.dataFile ||
            this.logs != state2.logs)
            return false
        return true
    }
}

module.exports = { State }