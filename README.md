# SmartStock ERP — API

Backend for SmartStock ERP. See `/smartstock-docs` (shared separately) for the full design docs — BRD, SRS, Architecture, DB Schema, Coding Standards.

## Stack
Node.js · Express · TypeScript · MongoDB (Mongoose) · Redis · BullMQ · Socket.IO

## Prerequisites
- Node.js 20+ and npm
- Docker Desktop (for local MongoDB + Redis)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start local MongoDB + Redis** (Docker must be running)
   ```bash
   docker compose up -d
   ```
   This starts MongoDB on `localhost:27017` and Redis on `localhost:6379`, matching what's in `.env`.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   The defaults in `.env.example` already point at the Docker Compose services — you only need to change the JWT secrets (use any long random string for local dev).

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   MongoDB connected
   SmartStock API listening on port 4000 [development]
   ```

5. **Verify it's alive**
   ```bash
   curl http://localhost:4000/health
   curl http://localhost:4000/health/ready
   ```

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Type-check and compile to `dist/` |
| `npm start` | Run the compiled build (production) |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Project Structure
```
src/
  modules/       → one folder per business domain (routes → controller → service → model)
  common/        → shared middleware, validators, utils
  jobs/          → BullMQ queue/worker definitions
  sockets/       → Socket.IO gateway
  config/        → env validation, db, logger
```
See `06-Coding-Standards-Git-Workflow.md` for the full rationale behind this structure.

## Current Status
✅ Phase 3 — skeleton, health checks, config validation, Docker Compose
⏳ Phase 4 — Auth, RBAC, multi-tenancy (next)
# smartstock-backend
