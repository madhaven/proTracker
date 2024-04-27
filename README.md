# proTracker

a simple way to track task and habit progress

## Architecture

The [Electron framework](https://www.electronjs.org/) as I understand works with 3 components  

* The main: handles all the local components of the program  
* The preload: handles the bridge and permissions between the main world and the front render
* The renderer: normal frontend script that handles logic on the front end

In this project

* The renderer is actually angular scripts that are loaded from the Angular distributables created.  
  During debug, the app accesses `localhost:4200` so changes are dynamically reflected.
* The Electron / backend section has been modularized into a layered architecture format.

```text
eMain.js <--ePreload_APIBridge--|--> Angular frontend
|
|
handlers.js  - handles IPC with renderer and delegates tasks
Services     - handles Logic
Providers    - provides Data connectivity
DB
```

The [Angular framework](https://angular.io/) helps render the UI.  
While debugging, the electron backend fetches the site hosted by Angular CLI at `localhost:4200`.  
While running the app, the UI needs to be built and is fetched from the distributables generated.  
The pUIng folder contains all things angular.  
The folder structure is nested at the moment. I'm still debating the advantages of having all the components in the component folder altogether.  

## Usage

* To debug,  
  `cd pUIng && ng serve` loads the angular UI  
  `npm run debug` runs Electron to render the UI in the app environment  
  While you should be able to access the app from a browser through `localhost:4200`, much of the native services that electron provides for File access are not available.  
  PR's that setup DB services in `localStorage` are welcome.  
  
  `npm run clean` cleans all debug configs and db data  
  `npm run cleandebug` debugs from a clean slate  
* To run from code,  
  `npm run buildnstart` builds the UI and starts the app  
  `npm run build` builds the frontend UI alone and creates the distributables  
  `npm run start` relies on the Angular distributables created  
* To build the project, run `npm run buildnstart` followed by `npm run make`  
  A number of issues have come to notice: [#54](https://github.com/madhaven/proTracker/issues/54)  
  * Sqlite db having access  
  * electron and npm version mismatches  

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
* Other perfection updates included
  * editing tasks
  * clicking on project names to autofill the project input, this keeps you up to speed
  * a timeout that pulls up the Menu page after a minute
  * Export to excel functionality
* Logging was implemented to track issues across devices  
* Migration Services were added to automatically handle DB versions  
  Migrations became a necassity when Habit tracking features were planned and it required the db to be automatically updated  
  with a lack of test cases, the efficacy of this logic can be glitchy  
* The UI migration to Angular was a learning experience.  
  A lot of time for migration without any project progress was hard to tolerate, but hey I learnt something new.  

## Future

* Checkout the issues tab to see imperfections, features and their statuses.  
* Thinking of setting up tests  
  [Here's a document](https://www.electronjs.org/docs/latest/tutorial/automated-testing) on electron testing  
  Feel free to contribute
* Setup a better migration strategy  
  The one in use currently works within the DBService and the DBVersionService  

## My Takeaway

* The Layered Architecture Pattern.  
  While I've worked in huge projects that follow the Layered pattern, I feel setting things up from the start gives you a better understanding of how things work and why.  
  Making updates and changes on a daily basis required components to be easily editable.  
  I could not afford to edit every inch of code for a small api fix.  
  The layered architecture, together with the Object Oriented approaches to data transfer helps minimize the change surface required for product updates.  
* The Importance of Frameworks.  
  Frameworks did not appeal to me as a noob.
  The need for frameworks only struck me until I made ProTracker, my first deployable app.  
  [Electron](https://www.electronjs.org/) helped me realize aspects of the product lifecycle  
  [Angular](https://angular.io/) standardized my frontend faster.

  ProTracker helped me realize the need for frameworks to help bootstrap the nitty-gritties and focus on fast product development.  
  In a fast moving industry, it really mattered to stay ahead and frameworks helped you get there.  
  It also helped me overcome my fear of investing time in technology that could later speed you up. After all, frameworks didn't come up in a day.  

  _If you are working to make stuff fast, don't reinvent the wheel. Use frameworks._  
  _If you are trying to learn. Build your own wheel._
