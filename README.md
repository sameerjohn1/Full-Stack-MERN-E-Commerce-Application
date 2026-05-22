# ShopNow - Full MERN Stack E-Commerce App

A modern, feature-rich e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Advanced Filtering** — filter by category, price range, rating
- **Sorting** — price, rating, newest, most popular
- **Debouncing** — smooth search input (400ms debounce)
- **Throttling** — message sending throttled (500ms)
- **Lazy Loading** — React.lazy + Suspense for all pages
- **Error Boundaries** — catches and displays errors gracefully
- **Cart System** — persistent cart with localStorage
- **Wishlist** — save favorite products
- **Comment / Review System** — star ratings + text reviews per product
- **Message System** — real-time-style messaging between users and admin
- **Categories Page** — browse by product category
- **Protected Routes** — client-side route protection (user + admin)
- **Admin Panel** — manage products, orders, users, messages
- **Order Tracking** — full order lifecycle with status tracking
- **Framer Motion** — page transitions, card animations, modal animations
- **JWT Authentication** — secure login/register
- **Responsive Design** — works on mobile and desktop

## Project Structure

```
ecommerce-app/
├── client/           # React frontend (Vite + Tailwind)
│   └── src/
│       ├── api/          # Axios API functions
│       ├── components/   # Reusable components
│       ├── context/      # Auth, Cart, Wishlist context
│       ├── hooks/        # useDebounce, useThrottle, etc.
│       └── pages/        # All pages including admin
└── server/           # Node.js + Express backend
    ├── config/       # DB seed
    ├── controllers/  # Business logic
    ├── middleware/   # Auth, upload middleware
    ├── models/       # Mongoose schemas
    └── routes/       # API routes
```

## Setup & Run

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Server Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET
npm run dev
```

Server runs on **http://localhost:4000**

### Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs on **http://localhost:5173**

### Demo Accounts (auto-seeded)

| Role  | Email          | Password |
| ----- | -------------- | -------- |
| Admin | admin@shop.com | admin123 |
| User  | user@shop.com  | user123  |

## API Endpoints

| Method | Route                       | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | /api/auth/register          | Register user          |
| POST   | /api/auth/login             | Login user             |
| GET    | /api/auth/me                | Get current user       |
| GET    | /api/products               | List products (filter) |
| GET    | /api/products/featured      | Featured products      |
| GET    | /api/products/categories    | All categories         |
| GET    | /api/products/:id           | Single product         |
| POST   | /api/products (admin)       | Create product         |
| PUT    | /api/products/:id (admin)   | Update product         |
| DELETE | /api/products/:id (admin)   | Delete product         |
| POST   | /api/products/:id/reviews   | Add review             |
| POST   | /api/orders                 | Create order           |
| GET    | /api/orders/my              | My orders              |
| GET    | /api/orders/:id             | Order detail           |
| GET    | /api/messages/conversations | Conversations          |
| POST   | /api/messages               | Send message           |
| GET    | /api/admin/stats            | Dashboard stats        |
| GET    | /api/admin/users            | All users              |

## Tech Stack

**Frontend:**

- React 18, Vite, React Router v6
- TanStack React Query (data fetching + caching)
- Framer Motion (animations)
- Tailwind CSS (styling)
- React Hot Toast (notifications)
- Zustand (optional state)

**Backend:**

- Node.js, Express 4
- MongoDB, Mongoose
- JWT + bcryptjs (auth)
- Multer (file uploads)
- Helmet, CORS, Rate Limiting (security)
