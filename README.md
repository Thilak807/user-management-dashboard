## Fullstack Task Manager

Mini full-stack web app that demonstrates a production-style workflow: JWT auth, dashboard UI, and task CRUD.

### Tech stack
- **Frontend:** React 19, Vite, React Router, React Query, Tailwind CSS, Zustand
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt
- **Tooling:** Postman collection for APIs, log file via Morgan, npm scripts for dev/build

### Getting started
1. Clone the repo & install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Configure environment variables (see `backend/README.md` & `frontend/README.md`)
3. Run the platforms in separate terminals
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```
4. Open `http://localhost:5173` and sign up to get started.

### Project layout
```
fullstack-app/
├── backend/    # REST API + MongoDB models
├── frontend/   # React dashboard
├── logs/       # Server log output
└── postman/    # API collection
```

### Deliverables
- ✅ Signup/login/logout with hashed passwords & JWT
- ✅ Dashboard with profile widget + responsive CRUD experience
- ✅ Search + filter over tasks
- ✅ Postman collection for quick verification
- ✅ Persistent server log
- ✅ README + setup docs
