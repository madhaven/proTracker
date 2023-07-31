# proTracker

a simple way of tracking progress

## Architecture

The [Electron framework](https://www.electronjs.org/) as I understand works with 3 components  

* The main: handles all the local components of the program  
* The preload: handles the bridge and permissions between the main world and the front render
* The renderer: normal frontend script that handles logic on the front end

In this project

* The renderer makes use of a state data object to handle data processing before rendering.  
  This is just a Work in Progress and not a fully fledged state mechanism
* The Electron / backend section has been modularized into a layered architecture format.

```text
eMain.js <--ePreload_APIBridge--|--> log.html
|                               |--> renderer.js <---> state.js
|
|
handlers.js  - handles IPC with renderer and delegates tasks
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
* Next a Layered Architecture was implemented  
  Data now flowed from DB to providers to Services/handlers from where it is passed to front-end  
  The Electron Preload script helped restrict the access that front-end had to native nodeJS functionality.
  The renderer script coordinated all processes on the front end with the help of State.js which handled the data
* Thinking of setting up tests https://www.electronjs.org/docs/latest/tutorial/automated-testing
  Feel free to contribute
