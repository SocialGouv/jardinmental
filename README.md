![Mobile version](https://img.shields.io/badge/app-1.31.0-blue)
![API version](https://img.shields.io/badge/api-0.1.0-purple)

# Jardin Mental

(formerly known as: Mon Suivi Psy)

Empowering users to better understand their mental health and make informed treatment choices.

- Official website: https://jardinmental.fabrique.social.gouv.fr/
- Project intent: https://beta.gouv.fr/startups/monsuivipsy.html

---

## Monorepo Structure

This repository is a monorepo containing:

- **app/**: Mobile application (React Native + Expo)
- **api/**: Backend API (Node.js/TypeScript)
- Other folders for configuration, documentation, etc.

Each main component has its own `README.md` with detailed instructions.

---

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (see `package.json` for recommended version)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for the mobile app)
- [Docker](https://www.docker.com/) (optional, for the API)

### Install dependencies

```bash
pnpm install
```

### Run the mobile app

See [app/README.md](./app/README.md) for detailed instructions.

### Run the API

See [api/README-TypeScript.md](./api/README-TypeScript.md) for detailed instructions.

---

## Deployment & Release

Build, release, and publishing instructions are specific to each component:

- For the mobile app, see the "Release/Publish" section in [app/README.md](./app/README.md)
- For the API, see [api/README-TypeScript.md](./api/README-TypeScript.md)

---

## Debug

### Sentry Test Endpoint

Sentry runs in the API and cron containers.
To test Sentry error reporting:

1. Enable debug endpoints: `export DEBUG_ENDPOINTS_ENABLED=true`
2. Restart the API
3. Test: `curl http://localhost:3000/debug/test-sentry`

This will send a test error to Sentry with proper context and tags. Only enable in development/staging environments.

---

## Useful Links

- [app/README.md](./app/README.md) — Mobile app documentation
- [api/README-TypeScript.md](./api/README-TypeScript.md) — API documentation
