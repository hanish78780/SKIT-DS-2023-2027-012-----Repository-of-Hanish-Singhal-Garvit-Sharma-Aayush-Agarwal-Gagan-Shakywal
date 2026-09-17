# Deployment

## Environments
Keep development, testing, and production/college-demo configuration separated.

## Principles
- Store credentials and API keys in environment/secret configuration, never in source control.
- Build and test each application independently before integration.
- Backend must be reachable from mobile/web clients through the configured API base URL.
- Production database access must be restricted and authenticated.

## Future deployment targets
The project can use a managed Node.js hosting platform for the backend, managed MongoDB for persistence, and a web hosting platform for the admin dashboard. Exact providers should be documented once selected by the team.
