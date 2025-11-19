# Frontend (React + Vite)

## Stack
- React 19 + Vite
- React Router, React Query, Zustand
- Tailwind CSS for styling

## Setup
```bash
npm install
echo VITE_API_URL=http://localhost:5000/api > .env
npm run dev
```
By default the dev server runs on `http://localhost:5173` and expects the API at `http://localhost:5000/api`.

## Scripts
- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built assets
- `npm run lint` – lint JS/JSX files

## Environment variables
| Name | Description |
| --- | --- |
| `VITE_API_URL` | Base URL for the backend (e.g. `http://localhost:5000/api`) |

## Features
- Signup, login, logout flows with form validation
- Protected dashboard with profile widget
- Task CRUD with search + status filter
- React Query for caching + optimistic UI
- Mobile-first responsive layout with Tailwind CSS utility classes