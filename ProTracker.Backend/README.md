# ProTracker .NET Backend

This is the migrated .NET backend for the ProTracker project. It replaces the original Node.js/Electron main process logic with a robust ASP.NET Core Web API.

## Changes

- **Framework**: Migrated from Node.js (Electron Main Process) to **ASP.NET Core (Web API)**.
- **Data Access**: Replaced manual SQLite queries with **Entity Framework Core**.
- **Models**: Converted JavaScript models to strongly-typed **C# classes**.
- **Controllers**: IPC handlers in `handlers.js` are now mapped to `ProTrackerController` endpoints.
- **Export**: Excel export implemented using **ClosedXML**.

## Project Structure

- `Models/`: Data models for Tasks, Projects, Status, Habits, etc.
- `Data/`: DBContext configuration for EF Core.
- `Controllers/`: API endpoints mimicking the original IPC handlers.
- `Program.cs`: Application configuration and dependency injection.

## API Endpoints

- `GET /api/protracker/load-data`: Loads all tasks, projects, habits, and logs.
- `POST /api/protracker/new-task`: Creates a new task and associated project if needed.
- `PUT /api/protracker/edit-project`: Edits an existing project.
- `PUT /api/protracker/edit-task`: Edits an existing task.
- `POST /api/protracker/toggle-task`: Toggles a task's status and logs the change.
- `POST /api/protracker/create-habit`: Creates a new habit.
- `PUT /api/protracker/edit-habit`: Edits an existing habit.
- `POST /api/protracker/habit-done`: Logs a habit completion.
- `GET /api/protracker/export`: Generates and downloads an Excel report.

## How to Run

1.  Navigate to `ProTracker.Backend/ProTracker.Api`.
2.  Run `dotnet run`.
3.  The API will be available at `http://localhost:5000` (or similar, check console output).

## Note on Frontend Integration

The Angular frontend (`pUIng/`) currently uses Electron IPC (`electron.ipcRenderer`) to communicate with the backend. To use this .NET backend, the frontend services (e.g., `electron-com.service.ts`) should be updated to use Angular's `HttpClient` to communicate with the new API endpoints.
