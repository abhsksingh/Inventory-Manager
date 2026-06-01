# Inventory & Order Management System

Full-stack containerized inventory management system built with **React**, **FastAPI**, and **PostgreSQL**.

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| React Hook Form | Form validation |
| Axios | HTTP client |
| Nginx | Production reverse-proxy |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11 | Runtime |
| FastAPI | REST API framework |
| SQLAlchemy 2.0 (async) | ORM with asyncpg driver |
| Alembic | Database migrations |
| Pydantic v2 | Request/response validation |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL 15 | Relational database |
| asyncpg | Async Python driver |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Service orchestration |
| Render | Backend hosting |
| Vercel | Frontend hosting |

## Features

- **Products** — CRUD with search, pagination, stock badges (green/amber/red)
- **Customers** — CRUD with pagination, duplicate email detection
- **Orders** — Multi-step creation wizard, auto stock deduction, atomic restock on cancel
- **Dashboard** — Stats cards + low-stock alerts table
- **Responsive** — Mobile sidebar collapse, adaptive grid layout
- **Containerized** — Single `docker-compose up --build` to run everything

## Getting Started

```bash
# 1. Clone
git clone https://github.com/abhsksingh/Inventory-Manager.git
cd Inventory-Manager

# 2. Environment
cp .env.example .env

# 3. Run
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/dashboard/summary` | Dashboard summary stats |
| **Products** | | |
| POST | `/api/v1/products` | Create product |
| GET | `/api/v1/products` | List products (paginated, searchable) |
| GET | `/api/v1/products/{id}` | Get product by ID |
| PUT | `/api/v1/products/{id}` | Update product |
| DELETE | `/api/v1/products/{id}` | Delete product |
| **Customers** | | |
| POST | `/api/v1/customers` | Create customer |
| GET | `/api/v1/customers` | List customers (paginated) |
| GET | `/api/v1/customers/{id}` | Get customer by ID |
| DELETE | `/api/v1/customers/{id}` | Delete customer |
| **Orders** | | |
| POST | `/api/v1/orders` | Create order |
| GET | `/api/v1/orders` | List orders (paginated) |
| GET | `/api/v1/orders/{id}` | Get order with line items |
| DELETE | `/api/v1/orders/{id}` | Cancel order (restores stock) |

## Business Logic

1. **SKU uniqueness** — 409 Conflict on duplicate
2. **Email uniqueness** — 409 Conflict on duplicate
3. **Stock validation** — 422 if insufficient stock
4. **Atomic order creation** — `SELECT ... FOR UPDATE` row locking
5. **Auto total** — `total_amount = SUM(price * qty)` server-side
6. **Order cancel** — restores inventory in a single transaction
7. **Price snapshot** — `unit_price` captured at order time

## Project Structure

```
Inventory-Manager/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── alembic/              # DB migrations
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models/            # SQLAlchemy models
│       ├── schemas/           # Pydantic schemas
│       ├── routers/           # API route handlers
│       └── services/          # Business logic layer
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── api/               # Axios client
        ├── pages/             # Route pages
        ├── components/        # Reusable components
        └── hooks/             # Custom React hooks
```

## Deployment

### Backend → Render
1. Push repo to GitHub
2. Create **Web Service** on Render, connect repo
3. **Root Directory:** `backend`
4. **Build:** `pip install -r requirements.txt`
5. **Start:** `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000`
6. Set env vars: `DATABASE_URL`, `CORS_ORIGINS`

### Frontend → Vercel
1. Import repo in Vercel
2. **Root Directory:** `frontend`
3. **Framework:** Vite
4. **Build:** `npm run build`
5. **Output:** `dist`
6. Set env var: `VITE_API_URL` (Render backend URL)
