# TodoRTK

A full-featured todo application built with React 19, TypeScript, RTK Query, Zod, Material UI, and `dnd-kit`.

The project works with the [SamuraiJS social-network API](https://social-network.samuraijs.com/) and is configured for deployment to GitHub Pages with the base path `/TodoRTK/`.

## Features

- Authentication with `login`, `logout`, session restore via `me`, and protected routes
- Login form built on `react-hook-form` + `zod`
- reCAPTCHA flow after repeated failed login attempts
- Create, edit, delete, and filter todolists
- Create, edit, delete, paginate, and update tasks
- Drag-and-drop reordering of todolists with server sync
- Optimistic updates for part of todolist/task mutations
- Global app status and API error snackbar
- Theme switching with Material UI

## Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- React Router 7
- React Hook Form
- Zod
- Material UI
- dnd-kit
- Vitest

## Architecture

The codebase is split into `app`, `common`, and `features`.

- `src/app`
  Application bootstrap, store, base API, global app slice, main page shell.
- `src/common`
  Shared UI components, hooks, constants, theme, routing helpers, utility functions, and shared types.
- `src/features/auth`
  Authentication API, schemas, and login UI.
- `src/features/captcha`
  Captcha API and captcha input block.
- `src/features/todolists`
  Todolist/task API layer and UI for lists, tasks, filters, pagination, and drag-and-drop.

## Data layer

The project uses a single RTK Query API instance in [src/app/baseApi.ts](/Users/annablinova/Documents/Projects/TodoRTK/src/app/baseApi.ts).

Notable implementation details:

- `fetchBaseQuery` uses `credentials: "include"`
- `API-KEY` and `Authorization` headers are attached in `prepareHeaders`
- Zod validation is applied through `baseQueryWithZodValidation`
- reconnect refetching is enabled via `refetchOnReconnect`
- cache invalidation is tag-based with `Todolist` and `Task`

## Routing

Routing is defined in [src/common/routing/Routing.tsx](/Users/annablinova/Documents/Projects/TodoRTK/src/common/routing/Routing.tsx).

- `/` is protected and renders the main todolist screen
- `/login` is available only for unauthenticated users
- `/dashboard` exists as a protected placeholder route
- `*` renders the 404 page

The app is mounted with:

```tsx
<BrowserRouter basename="/TodoRTK">
```

This matters for local links and GitHub Pages deployment.

## Environment variables

The app expects the following variables:

```env
VITE_BASE_URL=https://social-network.samuraijs.com/api/1.1
VITE_API_KEY=your_api_key
```

You can place them in `.env` or `.env.local`.

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure env variables

Create `.env.local` and set:

```env
VITE_BASE_URL=https://social-network.samuraijs.com/api/1.1
VITE_API_KEY=your_api_key
```

### 3. Start the dev server

```bash
pnpm dev
```

The Vite dev server runs on `http://localhost:3000`.

## Available scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm deploy
```

What they do:

- `pnpm dev` starts the development server on port `3000`
- `pnpm build` runs TypeScript build and Vite production build
- `pnpm preview` serves the production build locally
- `pnpm test` runs Vitest
- `pnpm deploy` publishes `dist` to GitHub Pages via `gh-pages`

## Authentication notes

The login screen uses the SamuraiJS test account:

- `Email: free@samuraijs.com`
- `Password: free`

The form also supports:

- password visibility toggle
- captcha refresh
- full form reset after captcha-triggered auth failure

## Drag and drop

Todolists can be reordered with `dnd-kit`.

Implementation details:

- `DndContext` and `SortableContext` wrap the todolist list
- each list is rendered through a sortable wrapper with a drag handle
- reordering is synced through `PUT /todo-lists/{id}/reorder`
- UI is updated optimistically in RTK Query cache before server confirmation

Relevant files:

- [src/features/todolists/ui/Todolists/Todolists.tsx](/Users/annablinova/Documents/Projects/TodoRTK/src/features/todolists/ui/Todolists/Todolists.tsx)
- [src/features/todolists/ui/Todolists/SortableTodolistItem.tsx](/Users/annablinova/Documents/Projects/TodoRTK/src/features/todolists/ui/Todolists/SortableTodolistItem.tsx)
- [src/features/todolists/api/todolistsApi.ts](/Users/annablinova/Documents/Projects/TodoRTK/src/features/todolists/api/todolistsApi.ts)

## Current limitations

- No automated tests are present in the repository yet, although a `vitest` script exists
- `/dashboard` is still a placeholder
- API availability and auth behavior depend on the external SamuraiJS backend
- Some production bundles are large enough for Vite chunk-size warnings during build

## Build status

The project currently builds successfully with:

```bash
pnpm build
```
