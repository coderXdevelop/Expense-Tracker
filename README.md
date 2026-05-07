# Expense Tracker

A full-stack MERN Expense Tracker application with user authentication and expense management.

## Features

* User registration and login
* JWT-based authentication
* Add expenses
* View expenses
* Update expenses
* Delete expenses
* Update user profile
* Responsive frontend
* Cloud database using MongoDB Atlas

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# Project Structure

```bash
Expense-Tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
│
└── README.md
```

---

# Live Demo

## Frontend

[https://expense-tracker-u7ud.vercel.app](https://expense-tracker-u7ud.vercel.app)

## Backend API

[https://expense-tracker-e3kk.onrender.com](https://expense-tracker-e3kk.onrender.com)

---

# Installation

## Clone Repository

```bash
git clone https://github.com/coderXdevelop/Expense-Tracker.git
```

```bash
cd Expense-Tracker
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder.

```env
VITE_API_URL=https://expense-tracker-e3kk.onrender.com
```

Run frontend:

```bash
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/logout   |

## User

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /api/users/profile |
| PUT    | /api/users/profile |

## Expenses

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/expenses     |
| POST   | /api/expenses     |
| GET    | /api/expenses/:id |
| PUT    | /api/expenses/:id |
| DELETE | /api/expenses/:id |

---

# Deployment

## Frontend Deployment

Frontend deployed using Vercel.

## Backend Deployment

Backend deployed using Render.

## Database

MongoDB Atlas used for cloud database hosting.

---

# Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

## Frontend

```env
VITE_API_URL=your_backend_url
```

---

# Future Improvements

* Expense categories
* Charts and analytics
* Monthly reports
* Export expenses
* Dark mode
* Pagination
* Advanced filtering

---

# Author

GitHub: [https://github.com/coderXdevelop](https://github.com/coderXdevelop)

---

# License

This project is for learning and educational purposes.
