const LogService = class {

    static addStream(stream) {
        const debug = console.debug
            , error = console.error
            , info = console.info
            , log = console.log
            , warn = console.warn

        console.debug = (...args) => {
            debug(...args)
            stream.write(`${new Date().toISOString()} DEBUG: ${args.join(' ')}\n`)
        }
        console.error = (...args) => {
            error(...args)
            stream.write(`${new Date().toISOString()} ERROR: ${args.join(' ')}\n`)
        }
        console.info = (...args) => {
            info(...args)
            stream.write(`${new Date().toISOString()} INFO: ${args.join(' ')}\n`)
        }
        console.log = (...args) => {
            log(...args)
            stream.write(`${new Date().toISOString()} LOG: ${args.join(' ')}\n`)
        }
        console.warn = (...args) => {
            warn(...args)
            stream.write(`${new Date().toISOString()} WARN: ${args.join(' ')}\n`)
        }
        console.logEnd = () => {
            stream.write('\n')
        }
    }
}

module.exports = { LogService }