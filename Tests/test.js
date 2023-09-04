const webDriver = require('selenium-webdriver')
    , driver = new webDriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({
        'goog:chromeOptions': {
            // path to the electron Binary
            binary: 'D:\\Works\\Programming\\Electron\\proTracker\\node_modules\\electron\\dist\\electron.exe'
        }
    })
    .forBrowser('chrome') // use 'electron' for for selenium-webdriver <= 3.6.0
    .build()

driver.get