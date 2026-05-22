# MegaShop

Full-stack e-commerce application built with Next.js, Nest.js, MongoDB and TypeScript.

## Tech Stack

**Frontend**
- Next.js 16 (App Router) — SSR for SEO
- TypeScript
- Redux Toolkit — cart and auth state
- TanStack Query — server state
- Tailwind CSS + Shadcn/ui

**Backend**
- Nest.js — REST API
- MongoDB + Mongoose
- JWT authentication with httpOnly cookies
- Role-based access control (admin/user)

## Project Structure

```
store/
  apps/
    client/   ← Next.js frontend
    server/   ← Nest.js backend
  docker-compose.yml
```

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- MongoDB Atlas account (free tier)

## Getting Started

### Option A — Docker (recommended)

1. Clone the repo:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

2. Copy environment files:
```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local
```

3. Fill in your values in `.env` and `apps/server/.env`

4. Run:
```bash
docker compose up --build
```

5. Open `http://localhost:3000`

### Option B — Local development

1. Clone and install:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

2. Copy environment files:
```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local
```

3. Fill in your values

4. Run backend:
```bash
cd apps/server
npm run start:dev
```

5. Run frontend (new terminal):
```bash
cd apps/client
npm run dev
```

6. Open `http://localhost:3000`

## Create Admin User

After starting the backend run:

```bash
cd apps/server
npm run seed:admin
```

Default admin credentials:
- Email: `admin@store.com`
- Password: `admin123`

**Change these immediately in production.**

## Environment Variables

### Backend (`apps/server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5001) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend (`apps/client/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Features

- Product catalog with search and pagination
- Shopping cart (persisted to localStorage)
- User authentication (register/login)
- Guest checkout
- Order management
- Admin panel
- Mobile responsive
- Docker support
