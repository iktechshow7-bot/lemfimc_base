# LemfiMC - Minecraft YouTube Channel Hub

A full-stack website for the LemfiMC Minecraft YouTube channel with an admin panel, featuring a dynamic RSS video feed, community section, and MongoDB-backed content management.

## Features

- **Hero Section**: Full-viewport auto-playing Minecraft gameplay video background with animated title and subscribe CTA
- **Community & News**: Split-panel layout with Minecraft Wiki and community links
- **Latest Videos**: Dynamic grid pulling from YouTube RSS feed via CORS proxy
- **Sticky Footer**: Fixed bottom navigation with smooth scroll links
- **Admin Panel**: Protected dashboard with content editor, settings, and JWT authentication
- **Full Backend**: Express.js API with MongoDB persistence, bcrypt password hashing, JWT auth

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Router (HashRouter)
- **Backend**: Express.js + MongoDB + Mongoose + JWT + bcryptjs
- **Deployment**: Render (free tier)

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier available at [mongodb.com/atlas](https://mongodb.com/atlas))

### Local Development

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd lemfimc

# 2. Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret

# 3. Install frontend dependencies
npm install

# 4. Install backend dependencies
cd server && npm install && cd ..

# 5. Start the backend server
cd server && npm start
# Server runs on http://localhost:3000

# 6. In a new terminal, start the frontend dev server
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

Create a `.env` file in the `server/` directory:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string from Atlas |
| `JWT_SECRET` | Yes | Random secret string for JWT signing |
| `PORT` | No | Server port (defaults to 3000) |
| `ADMIN_USERNAME` | No | Default admin username (defaults to `admin`) |
| `ADMIN_PASSWORD` | No | Default admin password (defaults to `admin123`) |

### Default Admin Credentials

On first startup, the server seeds a default admin user:
- **Username**: `admin` (or value of `ADMIN_USERNAME`)
- **Password**: `admin123` (or value of `ADMIN_PASSWORD`)

**Change the default password in production!**

---

## Deployment to Render

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://mongodb.com/atlas) and create a free cluster
2. Create a database user with password
3. Add your IP to the allowlist (or use `0.0.0.0/0` for all IPs)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/lemfimc`)

### Step 2: Create Render Account

1. Go to [render.com](https://render.com) and sign up (free)
2. Create a new **Web Service**
3. Connect your GitHub repo or use **Deploy from Git** option

### Step 3: Configure Render Web Service

**Build Command:**
```bash
cd server && npm install && cd .. && npm install && npm run build
```

**Start Command:**
```bash
cd server && npm start
```

**Environment Variables:**

Add these in the Render dashboard under **Environment**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string (generate with `openssl rand -hex 32`) |
| `NODE_ENV` | `production` |
| `ADMIN_USERNAME` | Your chosen admin username |
| `ADMIN_PASSWORD` | Your chosen secure admin password |

### Step 4: Deploy

Click **Create Web Service**. Render will:
1. Install dependencies
2. Build the React frontend (output to `dist/`)
3. Start the Express server which serves the built frontend

Your site will be live at `https://your-service-name.onrender.com`

### Step 5: Access Admin Panel

Navigate to `https://your-service-name.onrender.com/#/admin/login`

Login with your admin credentials to manage content.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Login with username/password | Public |
| `GET` | `/api/auth/me` | Verify JWT and get user info | Bearer Token |

### Content Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/content` | Get all site content | Public |
| `GET` | `/api/content/:section` | Get content by section | Public |
| `PUT` | `/api/content/:section` | Update content for a section | Bearer Token |
| `DELETE` | `/api/content/:section/:key` | Delete a content entry | Bearer Token |

### Settings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/settings` | Get all settings | Public |
| `GET` | `/api/settings/:key` | Get a specific setting | Public |
| `PUT` | `/api/settings` | Update settings | Bearer Token |

### Video Feed

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/videos/rss` | Server-side YouTube RSS proxy | Public |
| `GET` | `/api/health` | Health check | Public |

---

## RSS Feed Notes

The YouTube RSS feed for LemfiMC is:
```
https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw
```

Since YouTube doesn't send CORS headers on RSS endpoints, the frontend uses a proxy service (`https://api.allorigins.win/raw?url=`). If this proxy stops working:

1. Use the server-side proxy at `/api/videos/rss`
2. Or update the proxy URL in the admin panel Settings page
3. Or replace the `PROXY_URL` constant in `src/sections/LatestVideos.tsx`

---

## Project Structure

```
lemfimc/
├── public/
│   └── videos/
│       └── hero-bg.mp4          # Hero background video
├── server/                      # Backend API
│   ├── models/
│   │   ├── AdminUser.js         # Admin user model
│   │   ├── SiteContent.js       # Site content model
│   │   └── Setting.js           # Settings model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── content.js           # Content CRUD routes
│   │   └── settings.js          # Settings routes
│   ├── middleware/
│   │   └── auth.js              # JWT auth middleware
│   ├── .env.example             # Environment variable template
│   ├── server.js                # Express server entry
│   └── package.json
├── src/
│   ├── sections/                # Main page sections
│   │   ├── HeroHeader.tsx       # Hero with video background
│   │   ├── CommunityNews.tsx    # Community & wiki section
│   │   ├── LatestVideos.tsx     # RSS video feed grid
│   │   └── StickyFooter.tsx     # Fixed bottom nav
│   ├── pages/                   # Route pages
│   │   ├── HomePage.tsx         # Main landing page
│   │   ├── LoginPage.tsx        # Admin login
│   │   ├── AdminPage.tsx        # Dashboard
│   │   ├── ContentEditorPage.tsx # Content management
│   │   └── SettingsPage.tsx     # RSS proxy settings
│   ├── components/
│   │   └── AdminLayout.tsx      # Admin sidebar layout
│   ├── App.tsx                  # Router setup
│   ├── main.tsx                 # App entry
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## License

MIT
