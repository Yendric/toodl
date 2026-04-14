# Toodl (Frontend)

Toodl is a React-based todo application designed for simplicity and task planning. It supports authentication via Google OAuth or traditional email/password and is built as a Progressive Web App (PWA).

## Tech Stack

- **Core:** React 19, Vite 8, TypeScript.
- **Styling:** Material UI (MUI) 9, Emotion, Sass.
- **API Client:** [Orval](https://orval.dev/) generated React Query hooks from `swagger.json`.
- **Data Fetching & State:** [TanStack Query (React Query)](https://tanstack.com/query/latest) v5 for server state management.
- **Networking:** Axios with a custom mutator in `src/api/api.ts`.
- **Forms & Validation:** [TanStack Form](https://tanstack.com/form/latest) + [Zod](https://zod.dev/) (with Dutch i18n support).
- **Routing:** React Router v7.
- **Authentication:** @react-oauth/google.
- **Utility:** date-fns, notistack (notifications).

## Architecture & Project Structure

- `api/`: 
  - `generated/`: Contains the Orval-generated API hooks and models. **Do not edit manually.**
  - `api.ts`: Custom Axios instance and mutator for Orval.
- `components/`: UI components organized by feature (e.g., `Todos`, `Sidebar`, `Settings`, `Login`).
- `context/`: React Context providers for global application state:
  - `AuthState`: Manages user authentication.
  - `AppState`: General application settings and UI state.
  - `CurrentListState`: Manages the currently selected todo list and its todos (fetched per list).
- `helpers/`: Utility functions like `dateTime`.
- `hooks/`: Custom React hooks (`useContextMenu`, `useZodForm`, etc.).
- `schemas/`: Zod validation schemas for forms.
- `types/`: TypeScript definitions and interfaces.

## Building and Running

Ensure you have a `.env` file based on `.env.example` with the following variables:
- `VITE_API_URL`: URL to the Toodl API.
- `VITE_GOOGLE_CLIENT_ID`: Client ID for Google OAuth.

### Scripts
- `pnpm dev`: Starts the development server.
- `pnpm exec orval`: Regenerates the API client from `swagger.json`.
- `pnpm build`: Compiles TypeScript and builds production assets.
- `pnpm lint`: Runs ESLint for code quality checks.
- `pnpm format:fix`: Formats all source files using Prettier.

## Development Conventions

- **API Interaction:** Always use the generated hooks from `src/api/generated/toodl`. If the API changes, update `swagger.json` and run `pnpm exec orval`.
- **Data Structure:** Todos are fetched per list. Avoid global todo fetching.
- **TypeScript:** Use the generated models from `src/api/generated/model`.
- **Forms:** Use `@tanstack/react-form` with `zod` validation via the `useZodForm` hook.
- **Styling:** Follow Material UI patterns.