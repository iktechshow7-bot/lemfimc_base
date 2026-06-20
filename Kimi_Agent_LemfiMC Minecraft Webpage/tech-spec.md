# Tech Spec - LemfiMC Website

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| react-router-dom | ^7.0.0 | Client-side routing (home page + admin panel routes) |
| bcryptjs | ^2.4.3 | Admin password hashing |
| jsonwebtoken | ^9.0.2 | JWT token generation/verification for admin auth |
| mongoose | ^8.0.0 | MongoDB ODM for Node.js |
| express | ^4.21.0 | Backend API server |
| cors | ^2.8.5 | CORS middleware for API |
| dotenv | ^16.0.0 | Environment variable loading |
| @types/react | ^19.0.0 | TypeScript types |
| @types/react-dom | ^19.0.0 | TypeScript types |
| @types/bcryptjs | ^2.4.6 | TypeScript types |
| @types/jsonwebtoken | ^9.0.0 | TypeScript types |
| @types/express | ^4.17.0 | TypeScript types |
| @types/cors | ^2.8.0 | TypeScript types |
| @types/node | ^22.0.0 | TypeScript types |
| typescript | ^5.7.0 | TypeScript compiler |
| vite | ^6.0.0 | Build tool / dev server |
| @vitejs/plugin-react | ^4.4.0 | Vite React plugin |
| tailwindcss | ^4.0.0 | Utility CSS framework |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite integration |

### Dev Dependencies (Build Only)

All @types/* packages are dev dependencies. mongoose, express, cors are server runtime dependencies but will be bundled or run separately depending on deployment strategy.

---

## Component Inventory

### Layout

| Component | Source | Reuse |
|-----------|--------|-------|
| AdminLayout | Custom | Reused across all admin pages (sidebar + main content wrapper) |
| StickyFooter | Custom | Once on main page |

### Sections — Main Page

| Component | Source | Notes |
|-----------|--------|-------|
| HeroHeader | Custom | Full-viewport with video background, staggered CSS animations |
| CommunityNews | Custom | Two-column grid, single-column on mobile |
| LatestVideos | Custom | RSS fetch, grid of video cards, loading/error states |

### Sections — Admin

| Component | Source | Notes |
|-----------|--------|-------|
| LoginPage | Custom | Standalone page, no AdminLayout wrapper |
| DashboardPage | Custom | Stats cards, quick actions, inside AdminLayout |
| ContentEditorPage | Custom | Sectioned forms for hero/community/footer content, inside AdminLayout |
| SettingsPage | Custom | RSS proxy configuration form, inside AdminLayout |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| VideoCard | Custom | LatestVideos section |
| StatsCard | Custom | DashboardPage |
| SectionCard | Custom | ContentEditorPage (form card wrapper) |
| Sidebar | Custom | AdminLayout |

No shadcn/ui components used. The Minecraft blocky aesthetic (sharp 0px corners, colored borders, pixel font) conflicts with shadcn's default rounded, subtle styling. All components are custom-built.

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero title/tagline/button fade-slide-in sequence | CSS @keyframes | Single `fadeSlideUp` keyframe, applied with staggered `animation-delay` values (0s, 0.3s, 0.6s). `animation-fill-mode: forwards` to hold end state. | Low |
| Loading spinner | CSS @keyframes | `@keyframes spin { to { transform: rotate(360deg) } }` applied to SVG element, `1s linear infinite` | Low |
| Video card hover lift + thumbnail zoom | CSS transitions | `transition: all 0.3s ease` on card; card `transform: translateY(-4px)` + border-color change on hover. Thumbnail `transform: scale(1.05)` on card hover via CSS selector. | Low |
| Smooth scroll to sections | CSS | `scroll-behavior: smooth` on `html` element | Low |
| Button/link hover opacity | CSS transitions | `transition: all 0.3s ease` + `opacity` or `color` change on hover | Low |

**Total animation complexity: Low** — No animation library needed. All effects are achievable with CSS keyframes and transitions.

---

## State & Logic Plan

### 1. RSS Feed Fetching (LatestVideos)

The YouTube RSS feed (`https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw`) requires a CORS proxy because YouTube does not send CORS headers on RSS endpoints.

**Fetch logic:**
- Client-side fetch via `fetch()` to `https://api.allorigins.win/raw?url=<encoded-rss-url>`
- Response is raw XML string, parsed with `DOMParser`
- Extract entries from `<entry>` elements within Atom namespace
- Parse `media:group/media:title` (title), `media:group/media:thumbnail/@url` (thumbnail - replace quality suffix with `hqdefault.jpg`), `published` (date), `link/@href` (video URL)
- Display latest 6 entries
- Loading state during fetch, error state on failure
- `useEffect` with empty dependency array runs once on mount
- No caching — fresh fetch on every page load

**RSS Proxy Configurability:**
- Proxy URL stored in MongoDB, fetched from `/api/settings` on app init
- Falls back to `https://api.allorigins.win/raw?url=` if no custom proxy set
- Admin can update proxy via Settings page

### 2. Admin Authentication

**JWT-based auth flow:**
- Login form posts `{ username, password }` to `POST /api/auth/login`
- Server verifies credentials against MongoDB (bcrypt compare), returns JWT token
- Token stored in `localStorage` as `admin_token`
- All subsequent admin API requests include `Authorization: Bearer <token>` header
- `GET /api/auth/me` verifies token validity, returns user info
- On page load/refresh, admin routes check token via `/api/auth/me`; redirect to `/admin/login` if invalid
- Logout clears `localStorage` token and redirects

**Protected Route logic:**
- Custom wrapper component that checks auth state before rendering
- Redirects unauthenticated users to `/admin/login`
- `/admin/login` redirects already-authenticated users to `/admin`

### 3. Content Management (MongoDB)

**Data model:**
- `SiteContent` collection: `{ section: string, key: string, value: mixed, updatedAt: Date }`
- `AdminUser` collection: `{ username: string, passwordHash: string, role: string, createdAt: Date }`
- `Setting` collection: `{ key: string, value: mixed, updatedAt: Date }` (for RSS proxy URL)

**API flow:**
- Main site fetches content from `GET /api/content` on load
- Admin fetches same endpoint for edit forms (pre-population)
- Admin saves via `PUT /api/content/:section` with updated fields
- Admin fetches/settings via `GET /api/settings` and `PUT /api/settings`

### 4. Routing

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | Home page (Hero + Community + Videos + Footer) | No |
| `/admin` | DashboardPage | Yes |
| `/admin/login` | LoginPage | No (redirects if already logged in) |
| `/admin/content` | ContentEditorPage | Yes |
| `/admin/settings` | SettingsPage | Yes |

### 5. Server Architecture

Express server with these route groups:
- `/api/auth` — login, me (verify)
- `/api/content` — get all, update by section
- `/api/settings` — get, update
- `/api/videos/proxy` — optional server-side RSS proxy endpoint (alternative to client-side CORS proxy)

MongoDB connection via Mongoose. Environment variables for `MONGODB_URI`, `JWT_SECRET`, `PORT`.

---

## Other Key Decisions

### No shadcn/ui Usage

The Minecraft design language (0px border-radius everywhere, heavy `#32CD32` green borders, pixel font headings, solid dark backgrounds) fundamentally conflicts with shadcn/ui's default rounded, subtle, minimal aesthetic. Custom components are simpler and produce the correct visual result without fighting against defaults.

### No Framer Motion / GSAP

All animations are simple CSS keyframes and transitions (fade-slide, spin, hover transforms). Adding an animation library would be unnecessary overhead. Pure CSS handles everything.

### Font Loading

"Press Start 2P" from Google Fonts, loaded via `<link>` in `index.html`. This is a display/decorative font used only for headings — acceptable to load from CDN. System font stack for body text.

### Video Asset

The hero background video is a generated 5-second loop. It should be compressed to target < 3MB. Stored as a static asset in `public/` directory and referenced directly.
