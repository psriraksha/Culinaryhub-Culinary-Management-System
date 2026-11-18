# CulinaryHub: Culinary Management System

A full-stack recipe platform built with the MERN stack. Users can browse, share, rate and bookmark recipes, and admins review and manage everything from a dashboard.

**Live demo:** [culinaryhub-culinary-management-sys-five.vercel.app](https://culinaryhub-culinary-management-sys-five.vercel.app)

> The backend runs on a free plan, so the first page can take up to a minute to load. Please wait and refresh once.

## Screenshots

| Home | Recipe details |
|---|---|
| ![Home](screenshots/home.png) | ![Recipe details](screenshots/recipe-detail.png) |

| Admin dashboard | Recipe approval |
|---|---|
| ![Admin dashboard](screenshots/admin-dashboard.png) | ![Recipe approval](screenshots/admin-recipes.png) |

## Features

**For users**
- Register and log in securely (JWT authentication)
- Browse and search recipes, and see the top-rated ones on the home page
- Submit new recipes with ingredients, steps, cooking time, servings and difficulty
- Rate recipes, comment on them, and bookmark favourites

**For admins**
- Separate admin login and dashboard
- Approve or reject submitted recipes before they go public
- Manage users, recipes and comments
- Role-based access: admin pages are blocked for normal users

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt password hashing |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Project Structure

```
culinaryhub/
├── backend/            Express API (server.js), models, routes, controllers
└── frontend/
    └── src/
        ├── components/   shared and recipe components
        ├── pages/        home, auth, recipe, user and admin pages
        ├── redux/        store and slices
        └── utils/api.js  Axios setup
```

## How It Works

1. A user registers and logs in. The server returns a JWT, which the frontend sends with every request.
2. The user submits a recipe. It is saved as **pending**.
3. An admin reviews it and approves or rejects it. Only approved recipes show on the public pages.
4. Other users can then view, rate, comment on and bookmark the recipe.

## Getting Started

**You need:** Node.js 18 or newer and a MongoDB database (local or MongoDB Atlas).

**1. Clone the project**
```bash
git clone https://github.com/psriraksha/CulinaryHub-Culinary-Management-System.git
cd CulinaryHub-Culinary-Management-System
```

**2. Backend**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```
Start it:
```bash
npm run dev
```

**3. Frontend**
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```
Start it:
```bash
npm start
```
Open `http://localhost:3000`. Register an account to try the user features.

## Deployment

- **Database:** MongoDB Atlas
- **Backend:** Render, with `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV` and `CLIENT_URL` (the Vercel link) as environment variables
- **Frontend:** Vercel, with `REACT_APP_API_URL` set to the Render link ending in `/api`

## Author

**P Sriraksha**
GitHub: [github.com/psriraksha](https://github.com/psriraksha)
LinkedIn: [linkedin.com/in/p-sriraksha-2a5758379](https://linkedin.com/in/p-sriraksha-2a5758379)
