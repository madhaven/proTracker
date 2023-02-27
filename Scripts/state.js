class State {
    // Intended to keep track of the Webpage state
    // All UI should be loadable from an instance of this class

    constructor (menuVisible, dataProfile) {
        this.menuVisible = menuVisible
        this.dataProfile = dataProfile
        this.dailyTodo = [] // TODO: fetch from files
    }

    equals(state2) {
        if (
            this.menuView != state2.menuView ||
            this.dataProfile != state2.dataFile ||
            this.dailyTodo != state2.dailyTodo)
            return false;
        return true;
    }
}

module.exports = { State }