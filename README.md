# Expense Tracker

A full-stack MERN Expense Tracker application that allows users to manage and track daily expenses with secure JWT authentication.

## Features

* User authentication (Register/Login)
* JWT-based authorization
* Add, update, and delete expenses
* Expense history tracking
* User profile management
* Responsive UI
* Cloud-hosted MongoDB database

---

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Live Demo

### Frontend

https://expense-tracker-u7ud.vercel.app

### Backend API

https://expense-tracker-e3kk.onrender.com

---

## Project Structure

```bash
Expense-Tracker/
│
├── frontend/
├── backend/
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/coderXdevelop/Expense-Tracker.git
cd Expense-Tracker
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env` inside `backend/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` inside `frontend/`

```env
VITE_API_URL=https://expense-tracker-e3kk.onrender.com
```

Start frontend:

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/users/profile |
| POST   | /api/expenses      |
| GET    | /api/expenses      |
| PUT    | /api/expenses/:id  |
| DELETE | /api/expenses/:id  |

---

## Future Improvements

* Expense analytics dashboard
* Charts and visual reports
* Advanced filtering
* Monthly summaries
* Export to PDF/Excel
* Dark mode

---

## Author

GitHub: https://github.com/coderXdevelop
