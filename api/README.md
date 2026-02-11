# API – Jardin Mental

## Overview

This folder contains the backend API for Jardin Mental, built with Node.js, Express, and TypeScript. It provides endpoints and services for the application.

---

## Local Development Setup

> **Important:** In local development, only **Postgres** and **Maildev** run in Docker containers. The Node.js API runs directly on your machine (not in a container).

### Prerequisites

- **Node.js** (version 14 or higher)
- **pnpm** (version 8 or higher) – _Only pnpm is supported_
- **Docker** (for database and maildev services)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database and Maildev

> **Note:** Make sure Docker is installed and running before executing this command.

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

### 6. Run Cron Jobs (Optional)

The cron job sends scheduled notifications. To run it manually:

From the `api` directory, run:

```bash
node reminderCronJobRunner.js
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

## Accessing Kubernetes (k9s)

### Installation of k9s

[k9s](https://k9scli.io/) is a terminal UI to interact with your Kubernetes clusters.

**macOS:**
```bash
brew install derailed/k9s/k9s
```

**Linux:**
```bash
# Via snap
sudo snap install k9s

# Or download binary from GitHub releases
# https://github.com/derailed/k9s/releases
```

**Windows:**
```bash
# Via Chocolatey
choco install k9s

# Via Scoop
scoop install k9s
```

### Configuration

1. **Obtain kubeconfig files:**
   - Request the `ovh-prod` and `ovh-dev` kubeconfig files from a team member with access
   - These files contain the credentials and configuration to access OVH Kubernetes clusters

2. **Copy kubeconfig files:**
   ```bash
   # Copy the files to your .kube directory
   cp ovh-prod ~/.kube/ovh-prod
   cp ovh-dev ~/.kube/ovh-dev
   ```

3. **Launch k9s with multiple contexts:**
   ```bash
   KUBECONFIG=~/.kube/ovh-dev:~/.kube/ovh-prod k9s
   ```

   This command loads both development and production contexts simultaneously.

### Usage

#### Switch Between Contexts

1. Press `:` to enter command mode
2. Type `ctx` and press Enter
3. Select the desired context (dev or prod) from the list

#### Access Secrets

1. Press `:` and type `ns` to switch to namespace view
2. Navigate to the desired namespace
3. Press Enter to view resources
4. Scroll to `secrets` and press Enter
5. Select your application's secret
6. Press `x` to decode and view the secret content

#### Access Review Database

Review environments are created automatically for each pull request. To access a review database:

1. **Open k9s in dev context:**
   ```bash
   KUBECONFIG=~/.kube/ovh-dev k9s
   ```

2. **Navigate to review namespace:**
   - Press `:` and type `ns`
   - Find and select your review namespace (format: `jardinmental-task-<description>-<id>`)
   - Example: `jardinmental-task-add-specific-message-4xyoo13t`

3. **Access PostgreSQL pod:**
   - Navigate to the `PG` pod (PostgreSQL)
   - Press `s` to open a shell in the pod

4. **Connect to PostgreSQL:**
   ```bash
   psql -U postgresql
   ```

5. **List databases:**
   ```sql
   \l
   ```
   This displays all available databases.

6. **Connect to your review database:**
   ```sql
   \c <database-name>
   ```
   The database name typically matches your GitHub PR branch or title.

**Useful PostgreSQL commands:**
- `\l` - List all databases
- `\c <db>` - Connect to a database
- `\dt` - List all tables in current database
- `\d <table>` - Describe a table structure
- `\q` - Quit psql

#### Access Production Database

⚠️ **CRITICAL: Production database access requires extreme caution. Always verify you're in the correct context before executing any commands.**

1. **Open k9s in prod context:**
   ```bash
   KUBECONFIG=~/.kube/ovh-prod k9s
   ```

2. **Navigate to production namespace:**
   - Press `:` and type `ns`
   - Select the `jardinmental` production namespace

3. **Access the PRIMARY PostgreSQL pod:**
   - Locate the `PG` pods
   - **IMPORTANT:** Select the **oldest** PG pod (the two others are read replicas)
   - You can identify the primary by checking the pod age
   - Press `s` to open a shell in the pod

4. **Connect to PostgreSQL:**
   ```bash
   psql -U postgresql
   ```

5. **List databases:**
   ```sql
   \l
   ```
   You should see two databases:
   - `postgres` (system database)
   - `jardinmental` (application database)

6. **Connect to the application database:**
   ```sql
   \c jardinmental
   ```

7. **Execute your SQL queries:**
   ```sql
   -- Example: View tables
   \dt

   -- Example: Query data
   SELECT * FROM users LIMIT 10;
   ```

⚠️ **Production Safety Rules:**
- **NEVER** run `UPDATE`, `DELETE`, or `DROP` commands without explicit approval
- **ALWAYS** use transactions (`BEGIN;` ... `ROLLBACK;` or `COMMIT;`) for any write operations
- **TEST** queries on review environments first
- **BACKUP** data before any destructive operations
- **VERIFY** the context indicator in k9s shows `ovh-prod` before connecting
- Only connect to the **primary** pod (oldest PG pod), not the replicas

⚠️ **Security Warning:**
- Never commit kubeconfig files to version control
- Keep production credentials secure
- Always verify which context you're in before making changes

---

## Notes

- Only **pnpm** is supported for dependency management and scripts (see `package.json`).
- For any issues, check the documentation above or open an issue in the repository.
