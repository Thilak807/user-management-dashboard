# Backend (Express + MongoDB)

## Tech stack
- Node.js 20+
- Express 5
- MongoDB via Mongoose
- JWT authentication + bcrypt password hashing

## Getting started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env` (not committed) from the example below
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fullstack_app
   JWT_SECRET=super-secret-key
   JWT_EXPIRES_IN=2d
   CLIENT_URL=http://localhost:5173
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```

## Available scripts
- `npm run dev` – start with Nodemon & hot reload
- `npm start` – production start

## API surface
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Exchange credentials for JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/logout` | Stateless logout acknowledgment |
| GET | `/api/profile/me` | Profile data + task stats |
| GET | `/api/tasks` | List tasks (supports `q` + `status` filters) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Remove a task |

All `/api/tasks` and `/api/profile` endpoints require the `Authorization: Bearer <token>` header.

## Project structure
```
backend/
├── server.js
├── src
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validators/
```

Server logs are appended to `../logs/server.log` via Morgan. Adjust `CLIENT_URL` to include additional origins (comma‑separated) if you deploy multiple frontends.