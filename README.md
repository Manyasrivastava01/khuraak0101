# Khuraak Multi Cuisine Restaurant — Website

Red-and-white fine dining website built with **React + Vite + Tailwind CSS + Supabase**.

## Quick Start

### 1. Install Node.js
Download from https://nodejs.org (LTS version). Restart your terminal after installing.

### 2. Install dependencies
```bash
cd khuraak
npm install
```

### 3. Set up Supabase
1. Create a free project at https://supabase.com
2. Go to SQL Editor → paste the contents of `supabase/schema.sql` → Run
3. Go to Project Settings → API → copy your URL and anon key

### 4. Create your .env file
Copy `.env.example` to `.env` and fill in your Supabase keys:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run locally
```bash
npm run dev
```
Open http://localhost:5173

### 6. Create Admin user
In Supabase Dashboard → Authentication → Users → Add User
Use that email/password to log in at `/admin/login`

---

## Project Structure

```
khuraak/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive nav with mobile drawer
│   │   ├── Footer.jsx          # Footer with CTA, links, social
│   │   ├── ProtectedRoute.jsx  # Admin auth guard
│   │   └── ScrollToTop.jsx
│   ├── data/
│   │   └── menuData.js         # Placeholder menu (replace with Supabase)
│   ├── hooks/
│   │   └── useAuth.js          # Supabase auth hook
│   ├── lib/
│   │   └── supabase.js         # Supabase client
│   ├── pages/
│   │   ├── Home.jsx            # Hero, featured dishes, reviews
│   │   ├── Menu.jsx            # Search, filter, categories
│   │   ├── Reservations.jsx    # Booking form → Supabase
│   │   ├── Events.jsx          # Event enquiry form → Supabase
│   │   ├── About.jsx           # Story, values, team
│   │   ├── Gallery.jsx         # Photo grid with filters
│   │   ├── Contact.jsx         # Map, contact info, form
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       └── AdminDashboard.jsx  # Reservations, events, stats
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind + global styles
├── supabase/
│   └── schema.sql              # Run this in Supabase SQL Editor
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Pages
| Route | Page |
|---|---|
| `/` | Home |
| `/menu` | Menu with filters |
| `/reservations` | Table booking form |
| `/events` | Events & celebrations enquiry |
| `/about` | About us |
| `/gallery` | Photo gallery |
| `/contact` | Contact & map |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/bookings` | Manage reservations |
| `/admin/events` | Manage event enquiries |

## Next Steps
- [ ] Install Node.js and run `npm install`
- [ ] Create Supabase project and run `schema.sql`
- [ ] Add `.env` with Supabase keys
- [ ] Create admin user in Supabase Auth
- [ ] Replace placeholder phone/address/email in Navbar and Footer
- [ ] Add real food and restaurant photos (upload to Cloudinary)
- [ ] Embed Google Maps in Contact page
- [ ] Set up WhatsApp Business API and Supabase Edge Functions
- [ ] Deploy to Vercel or Netlify
