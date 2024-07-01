const LogService = class {

    static formattedTime(time = new Date()) {
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(time.getDate()).padStart(2, '0');
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static addStream(stream) {

        // save default logging
        const debug = console.debug
            , error = console.error
            , info = console.info
            , log = console.log
            , warn = console.warn

        // add stream to default implementation
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