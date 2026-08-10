# Eduflow Backend API

Clean, modular Node.js REST API server built with Express and Sequelize SQL Database.

## Folder Structure

```text
Eduflow_backend/
├── src/
│   ├── config/           # Database & Swagger configuration
│   │   ├── db.js         # Sequelize SQL database connection & auto-sync
│   │   └── swagger.js
│   ├── controllers/      # Route request/response logic
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── dashboardController.js
│   │   └── profileController.js
│   ├── middleware/       # Custom middlewares & rate limiting
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/           # Sequelize SQL Models
│   │   ├── Course.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   └── User.js
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── profileRoutes.js
│   ├── utils/            # Helper utilities & data access layer
│   │   ├── generateToken.js
│   │   └── userStore.js
│   └── index.js          # Express server entry point
├── .env.example
├── package.json
└── README.md
```

## Database Configuration

Eduflow Backend uses **Sequelize** ORM to connect to SQL databases.

### 1. SQLite (Default Zero-Configuration Mode)
By default, the application runs with an **SQLite** database (`./eduflow.sqlite`), requiring no external database installation.

```env
DB_DIALECT=sqlite
DB_STORAGE=./eduflow.sqlite
```

### 2. PostgreSQL or MySQL Mode
To use PostgreSQL or MySQL, update your `.env` file with your database credentials or `DATABASE_URL`:

```env
# Option A: Connection string
DATABASE_URL=postgres://user:password@localhost:5432/eduflow_db

# Option B: Individual environment variables
DB_DIALECT=postgres # or mysql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
```

---

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
Interactive Swagger API Documentation: `http://localhost:5000/api-docs`

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| `POST` | `/api/auth/register` | Register a new user | `{ "fullName": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | User login | `{ "email": "...", "password": "..." }` |

### 📚 Courses (`/api/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | Fetch all courses |
| `GET` | `/api/courses/:id` | Fetch a single course by ID |
| `POST` | `/api/courses` | Create a new course |
