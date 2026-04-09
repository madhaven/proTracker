  ## Goal 1: Host Backend with Frontend running through it
  The infrastructure is 90% there, but it needs to be made "production-ready" for single-origin hosting.

  Next Steps:
   1. Relative API Paths: Update frontend/src/services/api.service.ts to use a relative path (/api) instead of a hardcoded localhost URL. This ensures that when the app is hosted on a
      server (e.g., protracker.com), it correctly calls its own API.
   2. Environment Configurations: Utilize Angular environments to switch between the local dev server (port 4200) and the production hosted version.
   3. Secure CORS: Currently, the backend has an "AllowAll" CORS policy for development. This should be restricted or disabled in production since the frontend and backend will share the
      same origin.
   4. Unified Build Pipeline: Refine the MSBuild targets in ProTracker.Web.csproj to ensure that a dotnet publish command creates a single, deployable folder containing both the executable
      and the web assets.

  ## Goal 2: Lite Version (Browser Cache Backend)
  This requires decoupling the frontend services from the HttpClient and creating a "Local-Only" data provider.

  Next Steps:
   1. Data Abstraction: Create a DataService interface in Angular that defines methods like getTasks(), saveTask(), etc.
   2. Implementation Swap: 
       * Keep ApiService as the implementation for the full version.
       * Create a BrowserStorageService implementation that uses LocalStorage or IndexedDB (via a library like Dexie.js).
   3. Dependency Injection: Update app.config.ts to provide the appropriate implementation based on a build flag (e.g., ng build --configuration=lite).
   4. No-API Profile: Create a specific Angular build configuration that excludes the HttpClient logic and relies entirely on client-side state.