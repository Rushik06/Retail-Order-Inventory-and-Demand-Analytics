# Retail Order, Inventory & Demand Analytics

A full-stack, microservices-based platform for managing retail operations — covering authentication, product & order management, inventory tracking, real-time stock alerts, and analytics reporting.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running Locally (Dev Mode)](#running-locally-dev-mode)
- [Database Migrations & Seeding](#database-migrations--seeding)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Overview

This system provides a scalable backend and frontend for retail businesses to:

- Manage user authentication with role-based access control (RBAC)
- Track products, categories, and customer orders
- Monitor inventory levels across multiple warehouses with real-time stock alerts
- Generate and export business reports as PDF or Excel files

---

## Architecture

The application is a **pnpm + Turborepo monorepo** composed of independently deployable microservices, all routed through a single **Nginx reverse proxy**.

```
                        ┌──────────────────────────────────┐
                        │         Nginx (Port 80)          │
                        └──────────┬───────────────────────┘
                ┌──────────────────┼──────────────────────────────────┐
                │                  │                │                  │
        ┌───────▼──────┐  ┌────────▼────────┐  ┌───▼────────┐  ┌─────▼────────────┐
        │ auth-service │  │ product-service │  │ inventory  │  │ reporting-service│
        │  :3000       │  │   :3001         │  │ service    │  │  :3003           │
        └──────────────┘  └─────────────────┘  │  :3002     │  └──────────────────┘
                                                └────────────┘
                ┌──────────────────────────────────────────────┐
                │          Shared Infrastructure               │
                │   PostgreSQL  |  Redis  |  RabbitMQ          │
                └──────────────────────────────────────────────┘
```



<img width="818" height="1280" alt="image" src="https://github.com/user-attachments/assets/b1c553c3-c322-4ca7-aea8-57455ed41dbd" />



**Inter-service communication:**
- **REST** for synchronous API calls between the frontend and services via Nginx
- **RabbitMQ** for asynchronous event streaming (e.g. product-service publishes order events consumed by inventory-service)
- **Socket.IO** for real-time stock alert push notifications to the frontend

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| `auth-service` | 3000 | User auth (JWT), RBAC, password reset via OTP email, Redis session cache |
| `product-service` | 3001 | Product catalogue, categories, and order management |
| `inventory-service` | 3002 | Warehouse management, stock tracking, real-time alerts via Socket.IO |
| `reporting-service` | 3003 | Demand analytics reports — exportable as PDF or Excel, with email delivery |
| `web-app` | 80 (via Nginx) | React frontend — dashboard, charts, forms |

---

## Tech Stack

**Backend**
- Node.js + TypeScript (ESM)
- Express 5
- Sequelize ORM + PostgreSQL 15
- Redis 7 (session/token caching)
- RabbitMQ 3 (message broker)
- Socket.IO (real-time WebSocket events)
- Zod (request validation)
- Nodemailer (email delivery)
- PDFKit + ExcelJS (report generation)
- Swagger / OpenAPI (per-service API docs)

**Frontend**
- React + React Router
- TailwindCSS + shadcn/ui (Radix UI)
- Zustand (state management)
- TanStack React Query
- Recharts (data visualisation)
- React Hook Form + Zod
- Socket.IO Client

**Tooling**
- pnpm workspaces + Turborepo
- Vitest (unit & integration testing)
- ESLint + Prettier
- Husky + commitlint (conventional commits enforced on pre-commit)
- Docker + Docker Compose

---


**Database schema**
<img width="1436" height="1528" alt="MY DBSCHEMA FOR RECENT PROJECT" src="https://github.com/user-attachments/assets/32be0093-611d-46ce-9db4-78ef2d2b9919" />




## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10.29.3
- [Docker](https://www.docker.com/) & Docker Compose

### Environment Variables

Each service requires its own `.env` file. Create one inside the service directory (e.g. `apps/auth-service/.env`).

**auth-service** — required variables:
```env
PORT=3000
DATABASE_URL=postgres://admin:password@localhost:5432/retaildb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_smtp_password
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**product-service / inventory-service** — add:
```env
RABBITMQ_URL=amqp://localhost:5672
```

**reporting-service** — add:
```env
PDFKIT_FONT_PATH=...   # optional custom font
```

**docker-compose.yml** — also requires these two host-volume variables in a `.env` file at the root:
```env
POSTGRES_DATA_PATH=/your/local/path/postgres-data
REDIS_DATA_PATH=/your/local/path/redis-data
```

---

### Running with Docker

The easiest way to run the full stack is via Docker Compose, which spins up all services, databases, and Nginx together.

```bash
# 1. Clone the repository
git clone <repo-url>
cd retail-order-inventory-and-demand-analytics

# 2. Create .env files for each service (see above)

# 3. Build and start all containers
docker-compose up --build

# The app will be available at http://localhost
```

---

### Running Locally (Dev Mode)

```bash
# Install dependencies
pnpm install

# Start all services in parallel with hot reload
pnpm dev
```

Each service runs on its designated port. The frontend dev server proxies API requests — check each service's config for the correct `FRONTEND_URL` and port.

---

## Database Migrations & Seeding

Run migrations and seed data for all services from the root:

```bash
# Run all migrations
pnpm migrate

# Undo migrations
pnpm migrate:undo

# Seed the database (auth-service roles, permissions)
pnpm seed

# Undo seed
pnpm seed:undo
```

---

## API Documentation

Each service exposes its own Swagger UI, proxied through Nginx:

| Service | Swagger URL |
|---|---|
| Auth Service | `http://localhost/docs/` |
| Product Service | `http://localhost/product/docs/` |
| Inventory Service | `http://localhost/inventory/docs/` |
| Reporting Service | `http://localhost/reporting/docs/` |

In dev mode, access each service directly at `http://localhost:<PORT>/docs/`.

---

## Project Structure

```
.
├── apps/
│   ├── auth-service/          # JWT auth, RBAC, OTP password reset
│   ├── product-service/       # Products, categories, orders
│   ├── inventory-service/     # Warehouses, stock, real-time alerts
│   ├── reporting-service/     # Analytics, PDF/Excel export
│   └── web-app/               # React frontend
├── packages/
│   └── shared/                # Shared utilities, error handlers, middleware
├── infra/
│   └── nginx.conf             # Nginx reverse proxy config
├── documents/                 # FRS, SDS, and Scope documents
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Each service follows the same internal structure:

```
src/
├── config/        # DB, environment config
├── constants/     # Enums, error/message constants
├── controllers/   # Route handlers
├── middleware/    # Auth, RBAC, validation
├── migrations/    # Sequelize migrations
├── models/        # Sequelize models
├── repository/    # Data access layer
├── routes/        # Express routers + Swagger JSDoc
├── services/      # Business logic
├── swagger/       # Swagger setup
├── types/         # TypeScript type definitions
├── utils/         # Helpers
└── validations/   # Zod schemas
```


---

## Scripts

Run from the monorepo root:

| Command | Description |
|---|---|
| `pnpm dev` | Start all services in development mode (parallel, with hot reload) |
| `pnpm build` | Build all packages and services via Turborepo |
| `pnpm start` | Start all backend services in production mode |
| `pnpm migrate` | Run Sequelize migrations for all services |
| `pnpm migrate:undo` | Undo migrations for all services |
| `pnpm seed` | Seed the database with initial roles and permissions |
| `pnpm test` | Run all Vitest test suites |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Lint all TypeScript files |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm format` | Format all files with Prettier |

---

## Testing

Tests are written with [Vitest](https://vitest.dev/) and [Supertest](https://github.com/ladjs/supertest). Test files live in each service's `tests/` directory.

```bash
# Run all tests once
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

---

## Contributing

This project enforces **Conventional Commits** via Husky and commitlint. All commits must follow the format:

```
<type>(scope): <description>

# Examples:
feat(inventory): add low-stock alert webhook
fix(auth): resolve token refresh race condition
chore: update dependencies
```

Pre-commit hooks also run Prettier and ESLint automatically via `lint-staged`.




## APPLICATION DEMO
**LOGIN PAGE**:
![WhatsApp Image 2026-03-22 at 23 12 54](https://github.com/user-attachments/assets/9f029b7d-d6f2-4ef2-b9eb-a58867f264ef)


**DASHBOARD PAGE AND OTHER NAVIGATION PAGES**:
**PRODUCT MANAGEMENT PAGE**
![WhatsApp Image 2026-03-22 at 23 09 36](https://github.com/user-attachments/assets/c7168bff-655b-40e4-9f09-f81ad9cf4a88)

**ORDER MANAGEMENT PAGE**
![WhatsApp Image 2026-03-22 at 23 10 01](https://github.com/user-attachments/assets/d688d14a-078d-4956-8e5d-5cad4cfa780e)

**INVENTORY MANAGEMENT PAGE**
![WhatsApp Image 2026-03-22 at 23 11 06](https://github.com/user-attachments/assets/6e5a35d0-8cbb-4292-a6a1-d1363845caf7)

**WAREHOUSE MANAGEMENT PAGE**
![WhatsApp Image 2026-03-22 at 23 11 51](https://github.com/user-attachments/assets/0d1f1bd0-3671-416c-ad55-227c98eb4df6)

**USER PROFILE AND SECURITY PAGE FOR PASSWORD**
![WhatsApp Image 2026-03-22 at 23 12 09](https://github.com/user-attachments/assets/8b9c3f14-7c2e-4791-96fc-9e9f25f78412)
![WhatsApp Image 2026-03-22 at 23 12 27](https://github.com/user-attachments/assets/efd81045-9220-49e7-8aa5-e19266359008)



## Project-Estimation time taken
https://docs.google.com/spreadsheets/d/1KVbjLXil5rsKg5r8pJKmODHYAuHDScktzhYrXWptJI8/edit?gid=0#gid=0

















