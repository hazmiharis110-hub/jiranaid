# JiranAid - Hyper-Local Neighborhood Tool & Appliance Sharing Platform

JiranAid is a full-stack hyper-local neighborhood tool and appliance sharing platform designed to help residents share expensive, infrequently used equipment (like pressure washers, lawnmowers, and power drills), save money, reduce waste, and build stronger community trust within local residential zones.

---

## 🏗️ Architecture & Technology Stack

The application is containerized using **Docker Compose**, running a multi-container stack:

* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, and Zustand state management.
* **Backend**: Node.js, Express REST API, JWT Authentication, and `bcryptjs` password hashing.
* **Database & Caching**: 
  * **PostgreSQL (`supabase-postgres`)** running on port `54320` with complete relational schema (`neighborhoods`, `users`, `items`, `bookings`, `reviews`).
  * **Redis** for in-memory session and caching management.
* **Deployment & Containerization**: Docker & Docker Compose.

---

## 📁 Project Directory Structure

```text
├── backend
│   ├── src
│   │   ├── config
│   │   │   ├── auth.js
│   │   │   └── db.js
│   │   ├── controllers
│   │   │   ├── bookingController.js
│   │   │   ├── itemController.js
│   │   │   ├── neighborhoodController.js
│   │   │   ├── reviewController.js
│   │   │   └── userController.js
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   └── routes
│   │       ├── bookingRoute.js
│   │       ├── itemRoute.js
│   │       ├── neighborhoodRoute.js
│   │       ├── reviewRoute.js
│   │       └── userRoute.js
│   ├── supabase
│   │   ├── init.sql
│   │   └── seed.sql
│   ├── .env.example
│   ├── db-check.js
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── seed.js
│   └── supabase-docker.yml
├── frontend
│   ├── public
│   ├── src
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── items/
│   │   │   ├── layout/
│   │   │   ├── AddToolModal.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── BorrowRequestsView.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── ChatModal.tsx
│   │   │   ├── FeedbackView.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LenderDashboard.tsx
│   │   │   ├── NeighborhoodModal.tsx
│   │   │   ├── ReviewModal.tsx
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolDetailModal.tsx
│   │   │   └── UserProfileModal.tsx
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── Dockerfile
│   ├── index.html
│   ├── metadata.json
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── server.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── package-lock.json
└── README.md

🚀 Getting Started & Setup Guide
Prerequisites
Docker Desktop installed and running.

Node.js (v18+) if running scripts locally.

Git.

1. Clone & Initialize Environment
Clone the repository and make sure your Docker daemon is active.

2. Run with Docker Compose
To spin up the entire multi-container stack (frontend, backend, redis, and PostgreSQL supabase-postgres) in the background, **docker-compose up -d**

3. Initialize Database & Seed Data
If your database containers are fresh and need to be set up with the schema and test users, run the following commands in your PowerShell terminal:

**# 1. Create database tables and schema structure
Get-Content backend/supabase/init.sql | docker exec -i supabase-postgres psql -U postgres -d postgres

# 2. Populate neighborhood and user seed data
Get-Content backend/supabase/seed.sql | docker exec -i supabase-postgres psql -U postgres -d postgres
**

👥 Seeded Test AccountsThe following test users are pre-configured in the database seed data. All accounts use the standard password: password123.NameEmailNeighborhood / LocationPhone NumberHarisharis@jiranaid.test  Seksyen 14, Shah Alam  +60123456781  Khairilkhairil@jiranaid.test  Setia Alam / Seksyen U13  +60123456782  Shathishathi@jiranaid.test  Seksyen 7 (UiTM / Unisel Area)  +60123456783  Sufiyasufiya@jiranaid.test  Taman Puchong Prima  +60123456784  Coocoo@jiranaid.test  Subang Bestari / Seksyen U5  +60123456785[cite: 3]

