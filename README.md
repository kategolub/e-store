# MEGASHOP

A full-stack e-commerce application built with Next.js, Nest.js, MongoDB and TypeScript in a monorepo structure.

![CI](https://github.com/kategolub/e-store/actions/workflows/ci.yml/badge.svg)

## Live Demo

- Frontend: https://megashop-client.onrender.com
- Backend API: https://megashop-server-e4ty.onrender.com/api

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) — SSR for SEO-critical pages
- **TypeScript**
- **Redux Toolkit** — cart and auth global state
- **TanStack Query** — server state and caching
- **Tailwind CSS** + **Shadcn/ui** — styling and components

### Backend
- **Nest.js** — REST API
- **MongoDB** + **Mongoose** — database
- **JWT** with httpOnly cookies — secure authentication
- **Passport.js** — JWT strategy
- **bcrypt** — password hashing
- **class-validator** + **class-transformer** — request validation

### DevOps
- **Docker** + **Docker Compose** — containerization
- **GitHub Actions** — CI/CD pipeline
- **Render** — cloud deployment

---

## Features

- Product catalog with search and pagination
- Real-time search with autocomplete dropdown
- Shopping cart persisted to localStorage
- User authentication — register and login
- Guest and authenticated checkout
- Order history for authenticated users
- Role-based access control — admin and user roles
- Admin-protected API routes
- Mobile responsive with burger menu navigation
- Response transformation and pagination interceptors
- Docker support for local and production environments
- Automated CI/CD pipeline

---

## Project Structure

```
store/
  apps/
    client/              Next.js 16 frontend
    server/              Nest.js backend
  docker-compose.yml     Orchestrates both services
  package.json           npm workspaces root
  .github/
    workflows/
      ci.yml             GitHub Actions CI/CD pipeline


## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- MongoDB Atlas account (free tier works)

---

### Option A — Docker (recommended)

1. Clone the repo
```bash
git clone https://github.com/kategolub/e-store.git
cd e-store
```

2. Copy environment files
```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local
```

3. Fill in your values in `.env` and `apps/server/.env`

4. Run
```bash
docker compose up --build
```

5. Open http://localhost:3000

---

### Option B — Local development

1. Clone and install
```bash
git clone https://github.com/kategolub/e-store.git
cd e-store
npm install
```

2. Copy environment files
```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local
```

3. Fill in your values

4. Run backend (Terminal 1)
```bash
cd apps/server
npm run start:dev
```

5. Run frontend (Terminal 2)
```bash
cd apps/client
npm run dev
```

6. Open http://localhost:3000

---

## Environment Variables

### Backend — `apps/server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5001` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing — use a long random string | `your-long-random-secret` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

### Frontend — `apps/client/.env.local`

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5001/api` |

---

## Create Admin User

After starting the backend run:

```bash
cd apps/server
npm run seed:admin
```

Default credentials:
- Email: `admin@store.com`
- Password: `admin123`

Change these immediately in production.

---

## Running Tests

```bash
cd apps/server
npm test
```

---

## Docker

Build and run both services:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

Build images individually:

```bash
# backend
docker build -f apps/server/Dockerfile -t megashop-server .

# frontend
docker build -f apps/client/Dockerfile -t megashop-client .
```
---

## CI/CD

GitHub Actions runs on every push to `main`:

1. **Test** — runs Jest test suite against the backend
2. **Build backend** — verifies TypeScript compiles
3. **Build frontend** — verifies Next.js production build
4. **Deploy** — triggers Render webhooks (on `main` branch only)

Required GitHub Secrets:

| Secret | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `NEXT_PUBLIC_API_URL` | Production backend URL |
| `RENDER_DEPLOY_HOOK_SERVER` | Render deploy hook for backend |
| `RENDER_DEPLOY_HOOK_CLIENT` | Render deploy hook for frontend |

---
