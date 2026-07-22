# Eduflow Backend API

Clean, modular Node.js REST API server built with Express.

## Folder Structure

```text
Eduflow_backend/
├── src/
│   ├── controllers/      # Route request/response logic
│   │   ├── authController.js
│   │   └── courseController.js
│   ├── middleware/       # Custom middlewares & error handling
│   │   └── errorHandler.js
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   └── courseRoutes.js
│   └── index.js          # Express server entry point
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The server runs locally at `http://localhost:5000`.

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| `POST` | `/api/auth/register` | Register a new user | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | User login | `{ "email": "...", "password": "..." }` |

### 📚 Courses (`/api/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | Fetch all courses |
| `GET` | `/api/courses/:id` | Fetch a single course by ID (e.g. `/api/courses/c1`) |
| `POST` | `/api/courses` | Create a new course (`{ "title": "...", "instructor": "..." }`) |
