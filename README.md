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

See [api/README.md](./api/README.md) for detailed instructions.

---

## Deployment & Release

Build, release, and publishing instructions are specific to each component:

- For the mobile app, see the "Release/Publish" section in [app/README.md](./app/README.md)
- For the API, see [api/README.md](./api/README.md)

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
- [api/README.md](./api/README.md) — API documentation

---

## Resource, ResourceExternal, and toolsData: Specification & Contribution Guide

### 1. Where to Find the Definitions

- **Resource**

  - **Type/interface:** `Resource`
  - **File:** `app/src/scenes/resources/data/resources.ts`
  - **Data array:** `RESOURCES_DATA` in the same file

- **ResourceExternal**

  - **Type/interface:** `ExternalResource`
  - **File:** `app/src/scenes/resources/data/resourcesExternal.ts`
  - **Data array:** `EXTERNAL_RESOURCES_DATA` in the same file

- **toolsData**
  - **Type/interface:** `ToolItemEntity`
  - **File:** `app/src/scenes/tools/toolsData.tsx`
  - **Data array:** `TOOLS_DATA` in the same file

---

### 2. Getting Information from the Product Team

- Contact the product team via your usual communication channel (Slack, Teams, email, etc.).
- Provide a draft of the new resource/tool (title, description, type, audience, etc.) and ask for validation or additional details.
- If you are unsure about the content, request examples or reference materials.
- Keep a record of the product team's feedback for traceability.

---

### 3. Generating a UUID

- **Command line:** Run `uuidgen` in your terminal to generate a new UUID.
- **Online:** Use a trusted UUID generator website (e.g., https://www.uuidgenerator.net/).
- **JavaScript:** Use the `uuid` npm package:
  ```js
  import { v4 as uuidv4 } from "uuid";
  const id = uuidv4();
  ```
- **Note:** Each item in the data arrays must have a unique `id` field (UUID format).

---

### 4. How to Add an Item to the List

#### Resource

Edit `app/src/scenes/resources/data/resources.ts` and add a new object to the `RESOURCES_DATA` array:

```js
{
  id: "your-uuid-here",
  matomoId: 999, // next available number
  title: "Your resource title",
  image: require("path/to/image.png"),
  category: CATEGORIES.YOUR_CATEGORY,
  content: "Resource content in markdown or plain text",
  externalResources: ["external-resource-uuid-1", "external-resource-uuid-2"], // optional
  subCategory: SUB_CATEGORIES.YOUR_SUBCATEGORY, // optional
}
```

#### ResourceExternal

Edit `app/src/scenes/resources/data/resourcesExternal.ts` and add a new object to the `EXTERNAL_RESOURCES_DATA` array:

```js
{
  id: "your-uuid-here",
  matomoId: 999, // next available number
  title: "External resource title",
  url: "https://example.com",
  type: "Article", // or "Vidéo", "Podcast", etc.
  category: "P1 - A lire dans ce dossier", // or "P2 - Explorer d'autres ressources"
  author: "Author name",
}
```

#### toolsData

Edit `app/src/scenes/tools/toolsData.tsx` and add a new object to the `TOOLS_DATA` array:

```js
{
  id: "your-uuid-here",
  matomoId: 999, // next available number
  title: "Tool title",
  description: "Tool description",
  type: ["Exercice"], // or other types
  themes: ["Theme1", "Theme2"],
  audience: ["child", "parent", "student"],
  source: "Source name",
  // Optional fields: url, innerPath, embed, video
}
```

##### Optional Properties for Navigation and Content

- **`url`** (string): External URL to the resource (website, PDF, YouTube video, online questionnaire, etc.)
  ```js
  url: "https://www.example.com/resource.pdf"
  ```

- **`innerPath`** (object): Navigate to an **internal** feature within the Jardin Mental app
  - `text`: Action button text
  - `path`: Navigation path in the app
  ```js
  innerPath: {
    text: "Créer mon plan de crise",
    path: "crisis-plan"
  }
  ```

- **`embed`** (string): Identifier for a special embed type integrated in the app
  ```js
  embed: "breath-exercice"
  ```

- **`video`** (string): Identifier for a locally hosted video or specific video integration
  ```js
  video: "coherence-cardiaque-video"
  ```

**Usage logic:**
- Use **`innerPath`** to open an internal app feature (e.g., crisis plan creator)
- Use **`url`** to open an external link (browser or webview)
- Use **`embed`/`video`** for special multimedia content integrated in the app
- These properties can be combined (e.g., a tool can have both `url` and `embed`)

---

### 5. Example Workflow

1. **Get requirements** from the product team (title, description, type, etc.).
2. **Generate a UUID** for the new item.
3. **Add the item** to the appropriate data array in the correct file.
4. **Test** the application to ensure the new item appears as expected.

---
