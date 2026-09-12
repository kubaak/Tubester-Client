# Tubester Client

[🚀 Live app](https://tubester.app) · [▶️ Architecture video](https://youtu.be/juMRLnXjOgI) · [🌐 Portfolio Jakub Heidtke](https://jakubheidtke.com) · [💻 Backend repository](https://github.com/kubaak/Tubester)

Tubester helps YouTube creators review AI-generated comment replies, reuse video details, and improve video metadata with AI. This repository contains the React frontend; the backend handles authentication, AI operations, and YouTube integration.

## Features

- **Dashboard** - Find videos with pending improvements and continue editing them.
- **Suggested replies** - Browse comment and reply cards, apply filters, load more results, edit replies, and approve or ignore them individually or in bulk.
- **Copy video details** - Choose a source and target video, then copy selected title, description, tags, playlists, category, and default language settings. Continue to the Improve page to review the target video.
- **Improve with AI** - Generate title, description, tags, and playlist suggestions with optional prompt instructions. Review and edit details, save a draft, submit changes to YouTube, or resync from YouTube.
- **Credits** - View the current balance and credit costs for supported AI and YouTube actions.
- **Account settings** - Save preferences, view subscription details, and delete an account.
- **Channel settings** - Configure the comment assistant, reply language, comment age limits, suggestions per sync, and handling of non-text comments.
- **Application configuration** - Manage configuration entries through a navigation item shown to administrators.
- **Public pages** - Landing page, login, help, FAQ, about, contact, privacy policy, and terms of service.

The application includes desktop and mobile navigation. YouTube-dependent features require a connected channel and the appropriate access permissions.

## Tech stack

The project uses ES modules, declared by `"type": "module"` in `package.json`. JavaScript tooling uses `.js` with `import` and `export`; Jest's CommonJS configuration keeps the explicit `.cjs` extension.

| Area          | Tools                                                          |
| ------------- | -------------------------------------------------------------- |
| Application   | React 19, TypeScript 5.8, React Router 7                       |
| Build         | Vite 7 with React SWC                                          |
| API and state | Axios, TanStack Query 5, Orval 8 generated API hooks and types |
| Forms and UI  | React Hook Form, Tailwind CSS 4, Radix UI, Lucide icons        |
| Quality       | ESLint 9, Prettier 3, Jest 30, Testing Library, ts-jest        |
| Deployment    | Docker, unprivileged Nginx, GitHub Actions, GHCR, Kubernetes   |

## Local development

### Prerequisites

- **Node.js 22.18+ on the Node 22 line** and npm. The Docker build uses Node 22.19; Orval requires Node 22.18 or newer.
- The Tubester backend running at `http://localhost:5094` for authenticated features and API calls.
- Backend Google / YouTube OAuth configuration for sign-in and channel access. Configure credentials and backend services in the backend project.

### Get started

```bash
git clone https://github.com/kubaak/Tubester-Client.git
cd Tubester-Client
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Start the backend separately before signing in or using API-backed features.

The frontend uses relative `/api` URLs. During development, Vite proxies these requests to `http://localhost:5094` and forwards the original host and protocol so the backend can generate OAuth callbacks using the frontend origin. No frontend `.env` file is required by the current configuration.

For local Google OAuth, register the frontend callback URLs (normally `http://localhost:5173/api/auth/google/callback` and `http://localhost:5173/api/auth/google/write/callback`) in the backend's Google OAuth client. Use the actual frontend origin if you change its host, port, or protocol.

Generated API files are committed, so ordinary development and production builds do not need a running Swagger endpoint. Regeneration does.

### Changing the backend address

Copy [.env.development.example](.env.development.example) to `.env.development.local` and set the backend address:

```dotenv
BACKEND_URL=http://localhost:5094
```

The local file is ignored by Git. Restart Vite after changing it; generation commands read the value on each run.

[scripts/backend-config.js](scripts/backend-config.js) loads this setting for the Vite API proxy, Orval, and the write-access generator. Both generators append `/swagger/v1/swagger.json` to the backend address and use development mode. Vite uses its selected mode (development by default for `npm run dev`). Without an override, the address defaults to `http://localhost:5094`.

The helper uses Vite's environment loading rules, so an existing `BACKEND_URL` process environment variable takes precedence over environment files. This tooling-only variable needs no `VITE_` prefix and is not exposed to browser code. Production API routing remains configured separately.

## Commands

| Command                     | Behavior                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`               | Start the Vite development server.                                                          |
| `npm run build`             | Build static assets into `dist/`; does not run TypeScript checking or regenerate API files. |
| `npm run preview`           | Serve the production build locally after building.                                          |
| `npm run dist`              | Regenerate write-access metadata, then start the Vite development server.                   |
| `npm run genbuild`          | Regenerate write-access metadata, run `tsc -b`, then build with Vite.                       |
| `npm run orval:gen`         | Regenerate API hooks and DTOs from backend Swagger.                                         |
| `npm run gen:requiresWrite` | Regenerate the YouTube write-access endpoint map from backend Swagger.                      |
| `npm run lint`              | Run ESLint.                                                                                 |
| `npm run lint:fix`          | Run ESLint with automatic fixes.                                                            |
| `npm run format`            | Format the repository with Prettier.                                                        |
| `npm test`                  | Run Jest tests.                                                                             |

`dist`, `genbuild`, `orval:gen`, and `gen:requiresWrite` require the backend Swagger endpoint to be reachable. Neither `dist` nor `genbuild` regenerates the Orval API client.

## API generation and authentication

### Generated code

[orval.config.ts](orval.config.ts) generates Axios-backed TanStack Query hooks grouped by API tag, plus DTOs, under `src/api/`. The configured target is `src/api/index.ts`, with `tags-split` output and cleaning enabled.

[scripts/gen-requires-write.js](scripts/gen-requires-write.js) reads the Swagger extension `x-requires-youtube-write` and writes `src/auth/requiresWrite.generated.ts` as a set of `METHOD /path` entries.

After a backend API change, run both generators and review the resulting diff:

```bash
npm run orval:gen
npm run gen:requiresWrite
```

Make changes to the API contract in the backend and regenerate rather than editing generated files manually.

### Sign-in and YouTube consent

- Google sign-in starts at `/api/auth/login/google`, optionally with a `returnUrl`.
- Protected routes load the current session through `/api/auth/me`. Public routes render without mounting the authentication provider.
- Authentication uses backend session cookies. The provider also syncs the current channel once when the user has YouTube access.
- Axios interceptors check write access for endpoints in the generated map. When additional consent is needed, the app redirects to `/api/auth/login/google/write`.
- A pending write action is stored in session storage and can resume after consent; relevant query caches are then invalidated.
- Logout clears authentication and query state, cached write access, and any pending write action before navigating to `/api/auth/logout`.

## Routes and project structure

| Route                                                       | Page                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| `/`                                                         | Public landing page                                      |
| `/login`                                                    | Google sign-in                                           |
| `/dashboard`                                                | Videos with pending improvements                         |
| `/replies`                                                  | Suggested reply review                                   |
| `/copy`                                                     | Copy video details                                       |
| `/improve`                                                  | Edit and improve video metadata; supports `?videoId=...` |
| `/settings/account`                                         | Account preferences and subscription                     |
| `/settings/channel`                                         | Comment assistant settings                               |
| `/settings/configuration`                                   | Application configuration                                |
| `/help`, `/faq`, `/about`, `/contact`, `/privacy`, `/terms` | Public information pages                                 |

Dashboard, reply, video, and settings routes are wrapped in `AuthProvider` and `AuthGuard`.

```text
src/
  main.tsx          React entry point and Axios interceptor setup
  App.tsx           Routes and QueryClientProvider
  api/              Generated API hooks and DTOs
  auth/             Write consent, pending action replay, and cache invalidation
  components/       Shared UI, dialogs, and connection prompts
  contexts/         AuthProvider, useAuth, and YouTube access helpers
  features/
    credits/        Credit balance UI
    playlists/      Playlist selection components
    replies/        Reply cards, filters, selection, and search
    videos/         Video selection and metadata improvement workflows
  guards/           Route authentication guard
  layout/           Public layout, sidebar, headers, and mobile navigation
  lib/              Shared utility functions
  pages/            Route pages and page tests
  services/         Authentication service
  test/             Shared Jest setup
scripts/            Swagger-based write-access generator
.github/workflows/  CI and production deployment
```

The `@` import alias points to `src` and is configured for Vite, TypeScript, and Jest.

## Validation

Run the same checks as the CI workflow:

```bash
npm run lint
npm test -- --runInBand
npm run build
```

Tests use Jest with jsdom, Testing Library, and ts-jest. Existing page tests cover Copy, Improve, and Replies. Configuration lives in [jest.config.cjs](jest.config.cjs), with shared setup in [src/test/setup.ts](src/test/setup.ts).

For an explicit TypeScript check without Swagger regeneration:

```bash
npx tsc -b
```

[CI](.github/workflows/CI.yml) runs on pull requests and pushes to `main`, using Node 22 and `npm ci` before linting, testing, and building.

## Production and Docker

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`. Vite preview is for local inspection; deployed assets are served by Nginx in the Docker image.

```bash
docker build -t tubester-client .
docker run --rm -p 8080:8080 tubester-client
```

Open `http://localhost:8080`. The multi-stage [Dockerfile](Dockerfile) builds with Node 22.19 and serves the output using `nginxinc/nginx-unprivileged:alpine` on port 8080. [default.conf](default.conf) provides SPA fallback to `index.html` and long-lived caching for `/assets/`.

**Production API routing must be supplied separately.** The bundled Nginx configuration serves static files and does not proxy `/api`. Configure an ingress or reverse proxy to route `/api` (including OAuth and logout endpoints) to the backend on the same public origin, and other requests to this frontend. Vite's development proxy is not included in the built assets.

### Deployment workflow

[Deploy frontend](.github/workflows/deploy-frontend.yml) runs on pushes to `main` or manual dispatch. It builds and pushes `ghcr.io/<repository-owner>/tubester-client` with `sha-<commit>` and `latest` tags, then connects over SSH to update the Kubernetes deployment and wait for rollout.

The workflow uses the `production` environment and requires:

- `PROD_HOST`, `PROD_USER`, and `PROD_SSH_KEY` secrets for SSH access.
- The workflow's `GITHUB_TOKEN` with package write permission for GHCR publishing.
- A remote host with configured `kubectl` access to namespace `tubester`, deployment `tubester-client`, and container `client`.
- An existing cluster setup with image pull access and frontend/backend routing.

## License

[MIT](LICENSE) © 2026 kubaak.

---

[🚀 Live app](https://tubester.app) · [▶️ Architecture video](https://youtu.be/juMRLnXjOgI) · [🌐 Portfolio Jakub Heidtke](https://jakubheidtke.com) · [💻 Backend repository](https://github.com/kubaak/Tubester)
