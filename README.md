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
# 🚀 Fullstack Authentication Dashboard

A scalable full-stack web application built with **React (Vite) + Node.js + Express + MongoDB**, featuring secure authentication, protected routes, and a CRUD-enabled dashboard.

This project is created for the **Frontend Developer Intern Assignment**.

---

## 📌 Project Overview

This application demonstrates:

- Modern UI with React + TailwindCSS  
- Secure user authentication using JWT  
- Full frontend–backend integration  
- CRUD operations (Tasks / Notes)  
- Scalable folder structure for production  
- Search & filter functionality  
- Fully responsive UI  

---

## 🧰 Tech Stack

### **Frontend**
- React.js (Vite)
- TailwindCSS
- React Router
- Axios
- Zustand (Authentication store)
- LocalStorage (Token handling)

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- express-validator (validation)
- CORS middleware
- dotenv

### **Tools**
- Postman (API Testing)
- GitHub
- VS Code

---

## 📂 Folder Structure

```
d:\user-management-dashboard\
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── shared/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router.jsx
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── postman/
│   └── api_collection.json
│
├── logs/
│   └── server.log
│
└── README.md
```

---

## 🔐 Features

### ✔ Authentication (JWT)
- User Signup  
- Login  
- Logout  
- Password hashing (bcryptjs)  
- Protected routes  

### ✔ Dashboard
- Display user profile  
- CRUD operations (Create, Read, Update, Delete tasks/notes)  
- Search & filter items  
- Fully responsive layout  

### ✔ Backend APIs
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/profile` (Protected)
- `GET /api/tasks`  
- `POST /api/tasks`  
- `PUT /api/tasks/:id`  
- `DELETE /api/tasks/:id`  

---

## ⚙️ How to Run the Project

### **1️⃣ Clone this repository**
```bash
git clone <your-repo-url>
cd d:/user-management-dashboard
```

---

## **2️⃣ Setup Backend**

```bash
cd backend
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:
```bash
npm start
```

---

## **3️⃣ Setup Frontend**

```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

---

## 📬 API Documentation

Import the Postman collection from:

```
postman/api_collection.json
```

It contains:
- Signup API  
- Login API  
- Profile API  
- CRUD APIs  

---

## 📈 Scalability Notes

For production, the app can be scaled by:

- Moving environment variables to secure vault  
- Adding refresh tokens  
- Deploying:  
   - Frontend → Vercel  
   - Backend → Render / Railway  
   - Database → MongoDB Atlas  
- Adding role-based access control  
- Using Redis caching for performance  
- Implementing load balancing and microservices (future)

---

## 📸 Screenshots
(Add screenshots of Login, Signup, Dashboard here)

## 🙌 Author

**Your Name**  
Frontend Developer Intern Candidate  
GitHub: [https://github.com/Thilak807/user-management-dashboard](https://github.com/Thilak807/user-management-dashboard)  
Email: thilakrajp1234@gmail.com

---
