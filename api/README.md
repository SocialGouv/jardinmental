# API – Jardin Mental

## Overview

This folder contains the backend API for Jardin Mental, built with Node.js, Express, and TypeScript. It provides endpoints and services for the application.

---

## Local Development Setup

### Prerequisites

- **Node.js** (version 14 or higher)
- **pnpm** (version 8 or higher) – _Only pnpm is supported_
- **Docker** (for database and maildev services)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database and Maildev

From the `api` directory, run:

```bash
docker-compose up -d
```

This will start:

- **Postgres** (database) on port 5432
- **Maildev** (email testing) on ports 1080 (web UI) and 1025 (SMTP)

### 3. Environment Variables

- For local development, copy `.env.staging` to `.env` if not already present:
  ```bash
  cp .env.staging .env
  ```
- Adjust values as needed for your environment.

### 4. Run the API

- **Development mode (with hot reload):**
  ```bash
  pnpm dev
  ```
  The API will be available at http://localhost:3000 by default.
- **Production mode:**
  ```bash
  pnpm build
  pnpm start
  ```

### 5. Run Tests

```bash
pnpm test
```

---

## Docker Usage

- The provided `Dockerfile` is intended for production builds and deployment.
- For local development, use Docker only for the database and maildev via `docker-compose.yaml`.
- The API itself should be run locally with pnpm as described above.

---

## Deployment

- **Deployment is managed by [Kontinuous](https://github.com/socialgouv/kontinuous) via the `.kontinuous` directory.**
- The `Dockerfile` is used in the CI/CD pipeline for building and deploying the API.
- See `.kontinuous/` for environment-specific configuration.

---

## Additional Resources

- **TypeScript migration and advanced usage:** See [`README-TypeScript.md`](./README-TypeScript.md)
- **Sentry integration:** See [`SENTRY-INTEGRATION.md`](./SENTRY-INTEGRATION.md)
- **Jest setup:** See [`JEST-SETUP-COMPLETE.md`](./JEST-SETUP-COMPLETE.md)
- **Migrations:** See [`MIGRATION-INDEX-COMPLETE.md`](./MIGRATION-INDEX-COMPLETE.md)
- **TypeScript setup:** See [`TYPESCRIPT-SETUP-COMPLETE.md`](./TYPESCRIPT-SETUP-COMPLETE.md)

---

## Notes

- Only **pnpm** is supported for dependency management and scripts (see `package.json`).
- For any issues, check the documentation above or open an issue in the repository.
