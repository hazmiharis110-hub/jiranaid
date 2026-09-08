# JiranAid - Architecture & Codebase Directory Guide

This document provides a comprehensive explanation of every file and folder in the **JiranAid** full-stack repository.

---

## 📁 Root Directory (`/`)

### Configuration & Entry Files

- **`package.json`**
  - Defines project metadata, npm dependencies, devDependencies, and build/runtime scripts.
  - Contains scripts:
    - `"dev": "tsx server.ts"`: Launches the Express backend in development mode with `tsx` (TypeScript executor) and Vite middleware.
    - `"build"`: Compiles the client with Vite (`vite build`) and bundles `server.ts` into a CommonJS production file `dist/server.cjs` via `esbuild`.
    - `"start": "node dist/server.cjs"`: Starts the standalone production server on port 3000.
    - `"lint": "tsc --noEmit"`: TypeScript compiler type-checking without emitting files.

- **`server.ts`**
  - The Node.js / Express backend server entry point.
  - Hosts RESTful API endpoints for:
    - **Authentication & Geofencing**: `/api/auth/me`, `/api/auth/login`, `/api/auth/signup`, `/api/auth/verify-location`, `/api/auth/switch-user`
    - **Tool Inventory (CRUD)**: `GET /api/tools`, `GET /api/tools/:id`, `POST /api/tools`, `PUT /api/tools/:id`, `DELETE /api/tools/:id`
    - **Borrowing & Requests Workflow**: `GET /api/borrow-requests`, `POST /api/borrow-requests`, `PATCH /api/borrow-requests/:id/status`
    - **Neighborhood Communities**: `GET /api/neighborhoods`
    - **In-App Messaging & Safe Chat**: `GET /api/messages`, `POST /api/messages`
    - **Trust & Reviews**: `GET /api/reviews`, `POST /api/reviews`
    - **Community Impact Metrics**: `GET /api/stats`
  - Mounts Vite as development middleware (`middlewareMode: true`) during local development and serves static assets (`dist/`) in production.

- **`index.html`**
  - Primary HTML entry point loaded by the browser.
  - Configures page title (`JiranAid - Neighborhood Tool & Appliance Library`), SEO meta tags, mobile viewport settings, and loads Google Fonts (_Plus Jakarta Sans_).
  - Mounts the root container `<div id="root"></div>` and imports `/src/main.tsx`.

- **`metadata.json`**
  - Application metadata file used by Google AI Studio.
  - Specifies the application name (`JiranAid`), description, requested frame permissions (`geolocation`), and platform capabilities.

- **`vite.config.ts`**
  - Vite configuration file integrating `@vitejs/plugin-react` and `@tailwindcss/vite`.
  - Configures path alias (`@/` to the project root) and development server settings.

- **`tsconfig.json`**
  - TypeScript compiler configuration.
  - Sets compilation target (`ES2022`), module resolution (`bundler`), JSX transform (`react-jsx`), and path aliases.

- **`.env.example`**
  - Documents environment variables required for deployment or external services (e.g., `GEMINI_API_KEY`, `APP_URL`).

- **`.gitignore`**
  - Specifies untracked files and directories to exclude from version control (such as `node_modules`, `dist`, `.env`).

---

## 📁 `/public`

- Static public assets directory served directly by the web server.
- Contains placeholder assets and platform configurations under `/public/assets/aistudio/`.

---

## 📁 `/src`

Source code directory for the frontend application.

### Top-Level Files in `/src`

- **`src/main.tsx`**
  - Client-side React 19 entry point.
  - Initializes `ReactDOM.createRoot` on the `#root` element, mounts `<App />` inside React's `<StrictMode>`, and imports `src/index.css`.

- **`src/App.tsx`**
  - Application entry point rendering `BrowserRouter` and `AppRoutes`.

- **`src/router/AppRoutes.tsx`**
  - Central client-side routing tree configuring React Router v7 routes (`/`, `/items`, `/items/:id`, `/items/create`, `/items/:id/edit`, `/login`, `/register`, `/dashboard`, `/borrowings`, `/profile`, `*`).

---

## 📁 `/src/layouts`

- **`MainLayout.tsx`**: Primary layout containing `Navbar`, active route `<Outlet />`, community `Footer`, mobile `BottomNav`, and root-level modals (Neighborhood verification, User profile, Safe chat, Review submission).
- **`AuthLayout.tsx`**: Focused split-screen layout for authentication pages (`/login` and `/register`) with community highlights, trust metrics, and safety covenants.

---

## 📁 `/src/pages`

- **`HomePage.tsx` (`/`)**: Neighborhood landing page with hero search, live community impact metrics (money saved, e-waste diverted, active tools), category exploration grid, "How Neighbor Sharing Works" 4-step walkthrough, and featured tools.
- **`ItemListingPage.tsx` (`/items`)**: Dedicated tool library catalog with keyword search (`SearchBar`), category pill filters, status & price sorting (`FilterBar`), and responsive tool grid.
- **`ItemDetailPage.tsx` (`/items/:id`)**: Comprehensive item view with high-res photo gallery, condition tag, manufacturer specs, safety rules, owner trust card, interactive date-range booking simulator, and neighbor reviews.
- **`CreateItemPage.tsx` (`/items/create`)**: Equipment listing form with 1-click household presets (drills, pressure washers, trimmers, ladders), real-time card preview, pricing, and safety guidelines.
- **`EditItemPage.tsx` (`/items/:id/edit`)**: Tool management page for owners to update specs, daily fees, deposit amounts, availability, or remove listings.
- **`LoginPage.tsx` (`/login`)**: Resident sign-in with quick 1-click demo personas (Aiman Zikri, Sarah Lim).
- **`RegisterPage.tsx` (`/register`)**: Neighborhood registration with residential pool selector and postcode validation.
- **`DashboardPage.tsx` (`/dashboard`)**: Lender hub for managing equipment queue, active loans, and maintenance.
- **`BorrowingPage.tsx` (`/borrowings`)**: Dual-tab view for tracking equipment borrowed and equipment lent to neighbors.
- **`ProfilePage.tsx` (`/profile`)**: Resident trust score, community badges, on-time return statistics, and activity ledger.
- **`NotFoundPage.tsx` (`*`)**: 404 error page with quick links back home or to the tool library.

---

## 📁 `/src/services` & `/src/store`

- **`src/services/api.ts`**: Standardized Axios HTTP client instance with base URL `/api` and request/response interceptors.
- **`src/services/itemService.ts`**: API service layer for tool items (listing, details, creation, updating, deletion, impact stats).
- **`src/services/authService.ts`**: API service layer for resident authentication, location verification, and pool switching.
- **`src/store/useAuthStore.ts`**: Zustand store managing current resident session, active neighborhood pool, and verification status.
- **`src/store/useItemStore.ts`**: Zustand store managing catalog tools, search query, category filters, sorting, and community stats.

---

## 📁 `/src/components/layout`, `/src/components/items`, & `/src/components/common`

- **`src/components/layout/Navbar.tsx`**: Sticky top navigation bar with active route highlighting, neighborhood selector pill, search shortcut, and user profile dropdown.
- **`src/components/layout/Footer.tsx`**: Community sharing footer with category navigation, security deposits info, and eco impact.
- **`src/components/items/ItemCard.tsx`**: Responsive item card featuring photo hover zoom, distance indicator, condition badge, owner rating, and direct borrow action.
- **`src/components/items/SearchBar.tsx`**: Instant keyword search bar with clear button.
- **`src/components/items/FilterBar.tsx`**: Category pills, status filters (Available/On Loan), price filter, and sorting options.
- **`src/components/items/ItemForm.tsx`**: Reusable form for creating and editing tools with live preview card and household equipment presets.
- **`src/components/common/Badge.tsx`**: Unified badge component for status (`available`, `borrowed`, `maintenance`), condition, and verification.
- **`src/components/common/LoadingSpinner.tsx`**: Loading spinner indicator.
- **`src/components/common/EmptyState.tsx`**: Empty state with illustration, message, and call-to-action buttons.


- **`src/types.ts`**
  - TypeScript definitions and interfaces used across the entire application:
    - `ToolCategory` & `ToolCondition`: Allowed category names and condition states.
    - `User`: User profile, verified status, postcode, trust score, and community badges.
    - `ToolItem`: Tool specifications, daily maintenance fee, deposit amount, and owner data.
    - `BorrowRequest`: Booking requests, date ranges, total payment hold, and approval statuses.
    - `ChatMessage`: Neighbor-to-neighbor messaging structures.
    - `Neighborhood`: Community pool metadata and stats.
    - `Review`: Community feedback, punctuality, and item care ratings.

- **`src/index.css`**
  - Global stylesheet configured with Tailwind CSS v4 (`@import "tailwindcss";`).
  - Sets typography base styles and custom minimalist flat scrollbars.

---

## 📁 `/src/components`

Reusable, modular React components for UI views and modals:

- **`Header.tsx`**
  - Sticky top navigation bar.
  - Displays the JiranAid logo, verified neighborhood location selector badge, navigation links with pending request counters, "+ List a Tool" button, and user trust score pill.

- **`ToolCard.tsx`**
  - Flat minimalist card displaying each tool item in the catalog.
  - Includes distance indicator (`300m away`), condition tag, category badge, owner rating, daily maintenance fee, deposit breakdown, and quick borrow/detail action buttons.

- **`ToolDetailModal.tsx`**
  - Comprehensive item detail view.
  - Features high-resolution photo preview, item specifications, owner profile card, guidelines for care/pickup, interactive date-range booking calendar, micro-transaction fee calculation, and direct request submission.

- **`AddToolModal.tsx`**
  - Listing creation form for tool owners.
  - Allows neighbors to specify tool title, brand, category, condition rating, photo (from presets or custom URL), daily maintenance fee, refundable deposit, and safety instructions.

- **`BorrowRequestsView.tsx`**
  - Dual-role workflow management screen.
  - Toggles between "My Borrowings" (as borrower) and "Equipment I am Lending" (as owner).
  - Handles status transitions: Pending Approval ➔ Approved ➔ In Use / Active ➔ Returned & Deposit Released.

- **`ChatModal.tsx`**
  - In-app neighbor messaging drawer.
  - Enables neighbors to coordinate pickup times, locations, and tool usage without disclosing private phone numbers.
  - Includes pre-composed quick coordination chips for fast mobile interaction.

- **`NeighborhoodModal.tsx`**
  - Neighborhood verification and residential pool switcher.
  - Provides simulated GPS geofence verification and postcode binding to ensure users only access tools in their immediate residential community pool.

- **`UserProfileModal.tsx`**
  - Community trust profile showcasing user ratings, on-time return percentages, and community badges (_Super Lender_, _Careful Handler_).
  - Allows switching active neighbor personas (for testing lending vs borrowing) or registering a new resident.

- **`ReviewModal.tsx`**
  - Post-return rating modal allowing neighbors to submit 5-star ratings for overall experience, item care, and punctuality.

- **`BottomNav.tsx`**
  - Persistent bottom navigation bar optimized for smartphone use during local meetups.
  - Provides quick one-tap access to Catalog, Borrow/Lend, Share Tool, Chat, and Profile.

---

## 📁 `/src/data`

- **`src/data/presets.ts`**
  - Curated high-resolution imagery and presets for standard household equipment (pressure washers, cordless drills, pole hedge trimmers, telescopic ladders, carpet cleaners, air fryer ovens, automotive jump starters) to streamline tool creation.
