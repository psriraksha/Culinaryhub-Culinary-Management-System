# 🍳 CulinaryHub — Culinary Management System

A full-stack MERN application for sharing and managing recipes with an admin approval workflow, built with an orange-yellow theme.

---

## 🚀 Features

### User Features
- Register & Login with JWT authentication
- Submit recipes (Pending → Admin Review → Approved/Rejected)
- Edit & delete own recipes
- View recipe status from personal dashboard
- Rate & review approved recipes
- Bookmark favorite recipes
- Update profile & upload profile photo

### Admin Features
- Secure admin login (separate endpoint)
- Dashboard with live statistics & charts
- Approve or reject recipes with optional rejection reason
- Manage all users (activate / suspend / delete)
- Moderate comments & ratings
- View all recipes with filters

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt.js |
| File Uploads | Multer |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
culinary-management-system/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── middleware/       # Auth + upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── uploads/         # Uploaded images (auto-created)
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── admin/   # AdminSidebar
        │   ├── common/  # Navbar, Footer, ProtectedRoute, Spinner
        │   └── recipe/  # RecipeCard, RecipeForm
        ├── pages/
        │   ├── admin/   # Dashboard, Users, Recipes, Comments
        │   ├── auth/    # Login, Register, AdminLogin
        │   ├── recipe/  # List, Detail, Submit, Edit
        │   ├── user/    # Dashboard, Profile, Bookmarks
        │   └── Home.jsx
        ├── redux/
        │   ├── slices/  # authSlice, recipeSlice
        │   └── store.js
        └── utils/api.js
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/culinary_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Create Admin User

After starting the backend, use MongoDB shell or Compass to insert an admin user:

```js
// In MongoDB shell
use culinary_db

db.users.insertOne({
  name: "Admin User",
  email: "admin@culinaryhub.com",
  password: "$2a$10$rM5VUzJLVJrH5Q3JZFxPxeHqkKVtTR4EfMrfQUUxTSKpnhEm9P3Ai", // "admin123"
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or run the seed script:
```bash
cd backend
node scripts/seed.js
```

### 4. Start Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # uses nodemon
# or: npm start

# Terminal 2 — Frontend
cd frontend
npm start
```

### 5. Open in Browser

| URL | Page |
|-----|------|
| http://localhost:3000 | User App |
| http://localhost:3000/admin-login | Admin Login |
| http://localhost:5000/api/health | API Health Check |

---

## 🔐 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@culinaryhub.com |
| Password | admin123 |

> ⚠️ Change these immediately in production!

---

## 📋 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | User login |
| POST | /api/auth/admin-login | Admin login |
| GET | /api/auth/me | Get current user |

### Recipes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/recipes | Get approved recipes |
| GET | /api/recipes/:id | Get single recipe |
| POST | /api/recipes | Submit recipe |
| PUT | /api/recipes/:id | Update recipe |
| DELETE | /api/recipes/:id | Delete recipe |
| GET | /api/recipes/my-recipes | User's own recipes |
| POST | /api/recipes/:id/rate | Rate recipe |
| POST | /api/recipes/:id/bookmark | Toggle bookmark |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | All users |
| PUT | /api/admin/users/:id/status | Toggle user status |
| DELETE | /api/admin/users/:id | Delete user |
| GET | /api/admin/recipes | All recipes |
| PUT | /api/admin/recipes/:id/status | Approve/Reject recipe |
| GET | /api/admin/comments | All comments |
| DELETE | /api/admin/comments/:id | Delete comment |

---

## 🎨 Theme

Orange-Yellow warm palette:
- **Primary**: `#ff7510` (Orange)
- **Secondary**: `#f5a623` (Saffron)
- **Accent**: `#FFA500` (Amber)
- **Background**: `#fff8ed` (Cream)
- **Font**: Playfair Display (headings) + Inter (body)

---

## 📦 Deployment Notes

- Set `NODE_ENV=production` in backend `.env`
- Use a cloud MongoDB instance (MongoDB Atlas)
- Store uploaded images on cloud storage (AWS S3 / Cloudinary) for production
- Build frontend: `npm run build` inside `/frontend`
- Serve frontend build from Express static middleware or a CDN

---

## 📝 Recipe Workflow

```
User submits recipe
       ↓
  Status: PENDING
       ↓
Admin reviews recipe
  ↙         ↘
APPROVE     REJECT (with reason)
  ↓               ↓
Public         User notified
visible        via dashboard
```

---

Built with ❤️ using the MERN Stack
