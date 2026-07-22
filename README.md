# Eduflow Backend API

Node.js REST API server built with Express.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

The API server will run at `http://localhost:5000`.

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/v1/courses` | Fetch sample courses |
