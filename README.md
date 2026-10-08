# 🏠 EstateHub — Full-Stack Real Estate Application

A production-ready Real Estate Property Listing & Rental platform built with React, Node.js, Express, and MongoDB.

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Demo Accounts](#demo-accounts)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, React Router v6 |
| HTTP Client | Axios |
| Maps | Google Maps API (@react-google-maps/api) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |
| Icons | lucide-react |

---

## ✨ Features

### User Roles
- **Buyer** — Search properties, save favorites, send inquiries
- **Owner** — List properties, manage listings, reply to inquiries
- **Admin** — Full platform control: approve/reject listings, manage users

### Core Functionality
- JWT authentication with role-based access control
- Property listings with images, amenities, floor plans
- Advanced search & filters (city, type, price, bedrooms, furnishing)
- Dual view: Grid + Map view
- Favorites / saved properties
- Inquiry system with reply threading
- Admin dashboard with analytics
- Google Maps integration with property markers

---

## 📁 Project Structure

```
real-estate-app/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI (Spinner, Pagination)
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   └── property/        # PropertyCard, SearchFilters, PropertyMap, PropertyForm
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── admin/           # Dashboard, Users, Listings
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── buyer/           # Favorites, Inquiries
│   │   │   ├── owner/           # AddProperty, EditProperty, ManageListings
│   │   │   └── public/          # Home, Properties, PropertyDetail
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + all API calls
│   │   └── App.jsx              # Routes + layout
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                      # Node/Express Backend
    ├── controllers/             # Business logic
    │   ├── authController.js
    │   ├── propertyController.js
    │   ├── favoriteController.js
    │   ├── inquiryController.js
    │   └── adminController.js
    ├── middleware/
    │   └── auth.js              # JWT + role guard
    ├── models/                  # Mongoose schemas
    │   ├── User.js
    │   ├── Property.js
    │   ├── Favorite.js
    │   └── Inquiry.js
    ├── routes/                  # Express routers
    │   ├── auth.js
    │   ├── properties.js
    │   ├── favorites.js
    │   ├── inquiries.js
    │   ├── admin.js
    │   └── users.js
    ├── seed.js                  # Demo data seeder
    ├── server.js                # App entry point
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone / Extract the project
```bash
cd real-estate-app
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your values (see below)
npm install
```

### 3. Setup the Frontend

```bash
cd ../client
cp .env.example .env
# Add your Google Maps API key
npm install
```

### 4. Seed Demo Data (Optional)

```bash
cd server
node seed.js
```

### 5. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running at http://localhost:5173
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

> **Google Maps API Key:**
> 1. Go to [Google Cloud Console](https://console.cloud.google.com)
> 2. Create/select a project
> 3. Enable "Maps JavaScript API"
> 4. Create credentials → API Key
> 5. Add it to `client/.env`
>
> The app works without a Maps key — it shows a placeholder instead.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Properties
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/properties` | List/search properties | Public |
| GET | `/api/properties/:id` | Get property details | Public |
| GET | `/api/properties/my-listings` | Owner's listings | Owner/Admin |
| POST | `/api/properties` | Create property | Owner/Admin |
| PUT | `/api/properties/:id` | Update property | Owner/Admin |
| DELETE | `/api/properties/:id` | Delete property | Owner/Admin |

#### Query Parameters for GET `/api/properties`
```
?page=1&limit=12&category=rent&type=apartment&city=Mumbai
&minPrice=10000&maxPrice=100000&bedrooms=2&bathrooms=1
&furnishing=fully-furnished&search=keyword&status=approved&featured=true
```

### Favorites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/favorites` | Get saved properties | Protected |
| POST | `/api/favorites` | Toggle favorite | Protected |
| GET | `/api/favorites/check/:propertyId` | Check if favorited | Protected |

### Inquiries
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/inquiries` | Send inquiry | Protected |
| GET | `/api/inquiries` | Get inquiries (role-based) | Protected |
| PUT | `/api/inquiries/:id/reply` | Reply to inquiry | Owner/Admin |
| DELETE | `/api/inquiries/:id` | Delete inquiry | Protected |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/users` | List users | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/properties` | All properties | Admin |
| PUT | `/api/admin/properties/:id/status` | Approve/reject | Admin |

---

## 👤 Demo Accounts

After running `node seed.js`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Owner | owner@demo.com | password123 |
| Buyer | buyer@demo.com | password123 |

> These are also accessible via the "Demo Accounts" button on the Login page.

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
# Set environment variables in Vercel dashboard:
#   VITE_API_URL = https://your-backend.onrender.com
#   VITE_GOOGLE_MAPS_API_KEY = your_key
```

### Backend → Render
1. Push code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = strong random string
   - `CLIENT_URL` = your Vercel frontend URL
   - `NODE_ENV` = production

### Database → MongoDB Atlas
1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for Render)
4. Get connection string and set as `MONGO_URI`

---

## 🎨 UI Design

- **Font:** Playfair Display (headings) + DM Sans (body)
- **Color:** Deep navy + Sky blue primary + Slate grays
- **Style:** Clean, modern luxury real estate aesthetic
- **Responsive:** Mobile-first, works on all screen sizes

---

## 📝 Notes

- Properties are `pending` by default — Admin must approve before they appear publicly
- Map integration requires a valid Google Maps API key
- Image upload uses URL input (no file server needed) — use Cloudinary/S3 for production
- For production, use a strong `JWT_SECRET` and enable HTTPS

---

## 📄 License
MIT License — free to use and modify for personal or commercial projects.
