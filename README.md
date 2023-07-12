# proTracker

a simple way of tracking progress

## Architecture

The [Electron framework](https://www.electronjs.org/) as I understand works with 3 components  

* The main: handles all the local components of the program  
* The preload: handles the bridge and permissions between the main world and the front render
* The renderer: normal frontend script that handles logic on the front end

```text
                                |--> log.html
eMain.js <--ePreload_APIBridge--|--> renderer.js
|                               |--> pageListeners.js
|
|
handlers.js  - handles IPC with renderer
Services     - handles Logic
Providers    - provides Data connectivity
DB
```

## Motivation

* The motivation behind proTracker is the need to track my progress.  
* Logging what I achieved in a day and what was pending helped a lot and Excel was getting too clumsy.  
* I wanted something that looked sexy and attractive to use, to encourage the logging process.  
* Felt this could be a learning experience, front-end, layered architecture, building a complete product.  

## History

* It started out as an excel sheet which had two tabs for tasks that were pending and those that were completed  
* The UI was next built and basic functionality added with the help of the [Electron framework](https://www.electronjs.org/)  
* IPC calls were established and it all worked like a monolith
* Thinking of setting up a
  * layered architecture to handle the data flow
  * db and tables to save stuff better
  * Tests https://www.electronjs.org/docs/latest/tutorial/automated-testing
