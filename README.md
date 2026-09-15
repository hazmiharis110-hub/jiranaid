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
