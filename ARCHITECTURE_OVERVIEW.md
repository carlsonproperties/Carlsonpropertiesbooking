# 🏗️ Architecture Overview
## How Everything Connects

This document shows how all the pieces of your Carlson Properties website work together.

---

## 🌐 Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                           │
│                   carlsonproperties.co.nz                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ 1. Request page
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend Host)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  React App (Vite)                                       │    │
│  │  - Homepage (/)                                         │    │
│  │  - Booking Calendar (/book)                            │    │
│  │  - Checkout (/checkout)                                │    │
│  │  - Owner Dashboard (/dashboard)                        │    │
│  │  - About, Meet Hosts, Guest Info pages                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Environment Variables:                                          │
│  - SUPABASE_URL                                                  │
│  - SUPABASE_ANON_KEY                                            │
│  - STRIPE_SECRET_KEY                                            │
│  - RESEND_API_KEY                                               │
│  - AIRTABLE_PAT                                                 │
│  - ICAL_FEED_URL                                                │
└───────┬───────────────────┬───────────────────┬─────────────────┘
        │                   │                   │
        │ 2a. API Calls     │ 2b. Images        │ 2c. Payments
        ↓                   ↓                   ↓
┌──────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│   SUPABASE       │ │   SUPABASE      │ │     STRIPE       │
│  Edge Function   │ │    STORAGE      │ │   Payment API    │
│                  │ │                 │ │                  │
│ /make-server-    │ │ Bucket:         │ │ Payment Intents  │
│  edef7798/       │ │ "Website Media" │ │ Charges          │
│                  │ │                 │ │ Refunds          │
│ Routes:          │ │ Images:         │ └──────────────────┘
│ - /properties    │ │ - Hero photos   │
│ - /blocked-dates │ │ - Gallery       │
│ - /bookings      │ │ - Family pics   │
│ - /create-       │ │ - Ensuite       │
│   payment-intent │ │ - Logos         │
│ - /send-email    │ │ - Drone video   │
└────────┬─────────┘ └─────────────────┘
         │
         │ 3. Backend calls
         ↓
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRES DB                       │
│                                                                │
│  Table: kv_store_edef7798                                     │
│  - Stores bookings                                            │
│  - Stores property data                                       │
│  - Stores blocked dates                                       │
│                                                                │
│  Auth: users                                                  │
│  - Owner accounts for dashboard login                         │
└────────┬──────────────────────────────────────────────────────┘
         │
         │ 4. External integrations
         ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   RESEND     │  │   AIRTABLE   │  │   GOOGLE     │      │
│  │              │  │              │  │   CALENDAR   │      │
│  │ Email API    │  │ Guest Data   │  │              │      │
│  │ - Booking    │  │ Storage      │  │ iCal Feed    │      │
│  │   confirms   │  │              │  │ (Blocked     │      │
│  │ - Pre-arrival│  │ Table:       │  │  dates)      │      │
│  │   codes      │  │ "Bookings"   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow: Making a Booking

```
1. User visits carlsonproperties.co.nz
   ↓
2. Clicks "Book Now"
   ↓
3. Selects dates in calendar
   │
   ├→ Frontend calls: /blocked-dates
   │  - Gets dates from Google Calendar (iCal)
   │  - Gets existing bookings from database
   │  - Merges and shows unavailable dates
   ↓
4. Selects number of guests
   ↓
5. Sees price calculation ($1275/night)
   ↓
6. Clicks "Continue to Checkout"
   ↓
7. Fills in guest details:
   - Name, Email, Phone, Special Requests
   ↓
8. Enters payment details
   │
   ├→ Frontend calls: /create-payment-intent
   │  - Creates Stripe Payment Intent
   │  - Returns client_secret
   ↓
9. Submits payment
   │
   ├→ Stripe processes card
   │  - Charges $1275 × nights
   │  - Returns success/failure
   ↓
10. On success:
    │
    ├→ Frontend calls: /bookings (POST)
    │  - Saves booking to database
    │  - Calls Airtable API (saves guest data)
    │  - Calls Resend API (sends confirmation email)
    │
    ↓
11. Redirects to confirmation page
    - Shows booking details
    - Shows door code (in email)
    - Calendar invite attached
    ↓
12. User receives email:
    - Booking confirmation
    - Check-in instructions
    - Door access code
    - House manual link
```

---

## 🔐 Authentication Flow

### Owner Dashboard Login

```
1. Owner visits /owner-login
   ↓
2. Enters email & password
   ↓
3. Frontend calls Supabase Auth:
   supabase.auth.signInWithPassword()
   ↓
4. Supabase verifies credentials
   │
   ├→ Success: Returns access_token
   │
   └→ Failure: Returns error
   ↓
5. On success:
   - Stores access_token in localStorage
   - Redirects to /dashboard
   ↓
6. Dashboard loads:
   │
   ├→ Calls /bookings with access_token
   │  - Backend verifies token
   │  - Returns booking data
   ↓
7. Shows:
   - Revenue charts
   - Upcoming bookings
   - Guest directory
   - Occupancy rates
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   FRONTEND  │
│   (React)   │
└──────┬──────┘
       │
       │ HTTP Requests with Authorization: Bearer <anon_key>
       │
       ↓
┌──────────────────────────────────────────────────┐
│         SUPABASE EDGE FUNCTION (Hono)            │
│                                                   │
│  Middleware:                                      │
│  1. CORS (allows carlsonproperties.co.nz)       │
│  2. Logger (logs all requests)                   │
│                                                   │
│  Routes:                                          │
│  ┌──────────────────────────────────────────┐   │
│  │ GET  /properties                          │   │
│  │      → Returns property details           │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ GET  /blocked-dates                       │   │
│  │      → Fetches Google Calendar iCal       │   │
│  │      → Parses .ics file                   │   │
│  │      → Returns blocked dates array        │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ POST /bookings                            │   │
│  │      → Validates booking data             │   │
│  │      → Saves to database                  │   │
│  │      → Calls Airtable API                 │   │
│  │      → Calls Resend API                   │   │
│  │      → Returns confirmation               │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ POST /create-payment-intent               │   │
│  │      → Calls Stripe API                   │   │
│  │      → Creates payment intent             │   │
│  │      → Returns client_secret              │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ GET  /bookings (with auth)                │   │
│  │      → Verifies access_token              │   │
│  │      → Queries database                   │   │
│  │      → Returns booking list               │   │
│  └──────────────────────────────────────────┘   │
└────────┬──────────────┬──────────────┬──────────┘
         │              │              │
         ↓              ↓              ↓
    ┌────────┐    ┌─────────┐    ┌─────────┐
    │DATABASE│    │ STRIPE  │    │ RESEND  │
    │(Postgres)   │   API   │    │   API   │
    └────────┘    └─────────┘    └─────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────┐
│     Table: kv_store_edef7798            │
├─────────────────────────────────────────┤
│ key          TEXT PRIMARY KEY           │
│ value        JSONB                      │
│ created_at   TIMESTAMPTZ                │
│ updated_at   TIMESTAMPTZ                │
└─────────────────────────────────────────┘

Key Structure:
- property:one-eleven → Property details
- booking:[uuid] → Individual booking
- blocked_dates → Array of blocked dates
- settings:* → Various settings

Example Booking Value (JSONB):
{
  "id": "uuid-here",
  "checkIn": "2025-06-01",
  "checkOut": "2025-06-05",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+64...",
  "guests": 4,
  "totalPrice": 5100,
  "stripePaymentId": "pi_...",
  "status": "confirmed",
  "doorCode": "1234",
  "notes": "Early check-in requested"
}
```

---

## 🖼️ Image Storage Structure

```
Supabase Storage
└── Website Media/ (PUBLIC bucket)
    ├── 029_Open2view_ID584542-111_Jarden_Mile.jpg (Hero)
    ├── poolview.jpg (Wellness)
    ├── One eleven drone (1).mp4 (Video)
    ├── AirBnB_Profile_Photo_9.png (Logo)
    │
    ├── Open2View Photos/
    │   ├── 043_Open2view_ID584542-111_Jarden_Mile.jpg
    │   ├── 032_Open2view_ID584542-111_Jarden_Mile.jpg
    │   └── ...
    │
    ├── Ensuite Photos/ (.avif files)
    │   ├── 2fe3f719-ec39-4375-bac8-1d4a9fc86ef5 (1).avif
    │   └── ...
    │
    └── Family Photos/
        ├── IMG_6316_1.jpg
        ├── IMG_6261_2.jpg
        └── IMG_6591_1.jpg

Access Pattern:
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/[filename]
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
└─────────────────────────────────────────────────────────┘

Layer 1: HTTPS/SSL
├─ All traffic encrypted (TLS 1.3)
├─ Enforced by Vercel
└─ Certificate: Let's Encrypt (auto-renewed)

Layer 2: CORS
├─ Edge Function only accepts requests from:
│  - https://carlsonproperties.co.nz
│  - https://www.carlsonproperties.co.nz
│  - https://*.vercel.app (for preview deployments)
└─ Blocks all other origins

Layer 3: API Keys
├─ Frontend: Uses SUPABASE_ANON_KEY (limited permissions)
├─ Backend: Uses SUPABASE_SERVICE_ROLE_KEY (full access)
└─ Keys rotatable in Supabase dashboard

Layer 4: Row Level Security (RLS)
├─ Database table: kv_store_edef7798
├─ Policy: Only service_role can read/write
└─ Prevents direct database access from frontend

Layer 5: Authentication
├─ Owner dashboard requires login
├─ JWT tokens for session management
├─ Tokens verified on every request
└─ Auto-logout after expiration

Layer 6: Payment Security
├─ Stripe handles card data (PCI compliant)
├─ Frontend never sees full card numbers
├─ Secret keys only in backend environment
└─ 3D Secure supported

Layer 7: Rate Limiting (Future)
├─ Prevent API abuse
├─ Limit requests per IP
└─ DDoS protection via Vercel
```

---

## ⚡ Performance Optimizations

```
┌─────────────────────────────────────────────────────────┐
│                  PERFORMANCE STACK                       │
└─────────────────────────────────────────────────────────┘

Frontend (Vercel):
├─ Static Site Generation (SSG) where possible
├─ Code splitting (React lazy loading)
├─ Image optimization (Supabase Storage)
├─ CDN distribution (Vercel Edge Network)
├─ Brotli compression
└─ HTTP/2 & HTTP/3

Backend (Supabase Edge Functions):
├─ Deno runtime (fast startup)
├─ Regional deployment (Sydney)
├─ Connection pooling (Postgres)
├─ Cached calendar feeds
└─ Minimal dependencies

Database (Supabase Postgres):
├─ Indexed queries (key column)
├─ JSONB for flexible schema
├─ Connection pooling
└─ Read replicas (Supabase Pro)

Caching Strategy:
├─ Browser cache: Images (1 year)
├─ CDN cache: Static assets (immutable)
├─ API cache: Property data (5 min)
└─ No cache: Booking availability (real-time)
```

---

## 🔄 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────┐
│              CONTINUOUS DEPLOYMENT FLOW                  │
└─────────────────────────────────────────────────────────┘

1. Developer writes code locally
   ↓
2. Commits to Git
   $ git add .
   $ git commit -m "Feature: ..."
   ↓
3. Pushes to GitHub
   $ git push origin main
   ↓
4. GitHub webhook triggers Vercel
   ↓
5. Vercel Build Process:
   ├─ Clone repository
   ├─ Install dependencies (npm install)
   ├─ Load environment variables
   ├─ Run build (npm run build)
   ├─ Optimize assets
   └─ Generate dist/ folder
   ↓
6. Vercel Deploy:
   ├─ Upload to CDN
   ├─ Update DNS routing
   ├─ Health check
   └─ Atomic swap (zero downtime)
   ↓
7. Post-Deploy:
   ├─ Invalidate old cache
   ├─ Send deployment notification
   └─ Site live at carlsonproperties.co.nz

Deployment Time: ~1-2 minutes
Rollback Time: <30 seconds (instant rollback in Vercel UI)
```

---

## 📱 Responsive Design Strategy

```
┌─────────────────────────────────────────────────────────┐
│                 RESPONSIVE BREAKPOINTS                   │
└─────────────────────────────────────────────────────────┘

Mobile First Approach:

Base (Mobile): 320px - 639px
├─ Single column layout
├─ Hamburger menu
├─ Stacked booking form
└─ Touch-optimized buttons

Tablet: 640px - 1023px  (sm: & md:)
├─ Two column layout
├─ Expanded navigation
├─ Side-by-side forms
└─ Larger touch targets

Desktop: 1024px - 1279px  (lg:)
├─ Full navigation bar
├─ Multi-column grids
├─ Hover effects enabled
└─ Desktop booking flow

Large: 1280px+  (xl: & 2xl:)
├─ Max-width containers
├─ Spacious layouts
├─ High-res images
└─ Enhanced animations
```

---

## 🧩 Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                COMPONENT HIERARCHY                       │
└─────────────────────────────────────────────────────────┘

App.tsx (Root)
├─ RouterProvider
│  └─ Root Layout
│     ├─ Navigation (sticky)
│     ├─ MobileMenu (drawer)
│     │
│     ├─ Pages (Routes)
│     │  ├─ Home
│     │  │  ├─ Hero (video/image)
│     │  │  ├─ Features
│     │  │  ├─ Testimonials (carousel)
│     │  │  └─ BookingEngine (widget)
│     │  │
│     │  ├─ About
│     │  │  ├─ Gallery (carousel)
│     │  │  ├─ Amenities
│     │  │  └─ Location
│     │  │
│     │  ├─ Book
│     │  │  └─ BookingEngine (full)
│     │  │     ├─ DayPicker (calendar)
│     │  │     ├─ GuestSelector
│     │  │     └─ PriceCalculator
│     │  │
│     │  ├─ Checkout
│     │  │  ├─ GuestForm
│     │  │  ├─ StripeElements
│     │  │  └─ BookingSummary
│     │  │
│     │  ├─ Dashboard (Protected)
│     │  │  ├─ RevenueChart
│     │  │  ├─ BookingList
│     │  │  ├─ GuestDirectory
│     │  │  └─ OccupancyCalendar
│     │  │
│     │  └─ Guest Info
│     │     ├─ AccordionSections
│     │     ├─ HouseManual
│     │     └─ LocalGuide
│     │
│     └─ Footer
│        ├─ SocialLinks
│        └─ LegalLinks
│
└─ Global Components
   ├─ SEO (Helmet)
   ├─ Toaster (Sonner)
   └─ ScrollToTop
```

---

## 🎯 Environment-Specific Configs

```
┌─────────────────────────────────────────────────────────┐
│            ENVIRONMENT CONFIGURATIONS                    │
└─────────────────────────────────────────────────────────┘

Development (localhost:3000)
├─ Stripe: Test keys (sk_test_...)
├─ Emails: Test mode (logged, not sent)
├─ Payments: Test cards only
├─ Database: Development data
└─ Analytics: Disabled

Preview (*.vercel.app)
├─ Stripe: Test keys
├─ Emails: Test mode or real (low volume)
├─ Payments: Test cards
├─ Database: Staging/Production
└─ Analytics: Limited

Production (carlsonproperties.co.nz)
├─ Stripe: Live keys (sk_live_...)
├─ Emails: Real (Resend production)
├─ Payments: Real credit cards
├─ Database: Production
└─ Analytics: Full tracking (GA4)

How to switch:
- Environment variables set per environment in Vercel
- Code automatically uses correct keys based on environment
- No code changes needed to go live
```

---

## 🔍 Monitoring & Observability

```
┌─────────────────────────────────────────────────────────┐
│              MONITORING & LOGGING                        │
└─────────────────────────────────────────────────────────┘

Frontend Monitoring:
├─ Google Analytics 4
│  - Page views
│  - Booking funnel
│  - Conversion tracking
│
├─ Vercel Analytics
│  - Core Web Vitals
│  - Performance metrics
│  - Geographic data
│
└─ Browser Console
   - Client-side errors
   - API call logging

Backend Monitoring:
├─ Supabase Logs
│  - Edge Function logs
│  - Database queries
│  - Error traces
│
├─ Stripe Dashboard
│  - Payment success/failure
│  - Dispute tracking
│  - Revenue charts
│
└─ Resend Logs
   - Email delivery
   - Bounce tracking
   - Click tracking

Custom Logging:
├─ All API calls logged with:
│  - Timestamp
│  - Endpoint
│  - Response time
│  - Success/failure
│
└─ Error tracking:
   - Stack traces
   - User context
   - Environment info
```

---

## 🚀 Scaling Considerations

```
┌─────────────────────────────────────────────────────────┐
│              CURRENT vs SCALED ARCHITECTURE              │
└─────────────────────────────────────────────────────────┘

Current Setup (MVP):
└─ Single property
   ├─ ~100 bookings/year
   ├─ Low traffic
   ├─ Manual pricing
   └─ Single owner

Future Scaling (Multiple Properties):
├─ Multi-property support
│  - Property table instead of single record
│  - Dynamic routing: /properties/[id]
│  - Separate calendars per property
│
├─ Higher volume
│  - Caching layer (Redis)
│  - Rate limiting
│  - Load balancing
│
├─ Dynamic pricing
│  - Seasonal rates
│  - Weekend premiums
│  - Last-minute discounts
│
└─ Multi-user
   - Role-based access (owner, cleaner, guest)
   - Team dashboard
   - Notification system

Database Scaling:
├─ Current: KV store (JSONB)
├─ Future: Normalized tables
│  - properties
│  - bookings
│  - users
│  - payments
│  - reviews
└─ Indexes on frequently queried columns
```

---

## 📖 Key Files & Their Purpose

```
Project Root
│
├── /src/app/
│   ├── App.tsx              → Main React component
│   ├── routes.ts            → React Router configuration
│   │
│   ├── /pages/
│   │   ├── Home.tsx         → Homepage with hero
│   │   ├── Book.tsx         → Booking calendar page
│   │   ├── Checkout.tsx     → Payment page
│   │   ├── Dashboard.tsx    → Owner analytics
│   │   └── ...
│   │
│   ├── /components/
│   │   ├── BookingEngine.tsx → Calendar & booking widget
│   │   ├── Footer.tsx        → Site footer
│   │   ├── SEO.tsx           → Meta tags & SEO
│   │   └── /ui/              → Reusable UI components
│   │
│   └── /lib/
│       ├── images.ts         → Image URL constants
│       ├── analytics.ts      → GA4 tracking
│       └── schemas.ts        → Structured data schemas
│
├── /supabase/functions/server/
│   ├── index.tsx            → Hono web server (Edge Function)
│   └── kv_store.tsx         → Database utilities (PROTECTED)
│
├── /utils/supabase/
│   └── info.tsx             → Supabase config (PROTECTED)
│
├── /public/
│   ├── robots.txt           → SEO crawler rules
│   └── sitemap.xml          → SEO sitemap
│
├── index.html               → HTML entry point
├── package.json             → Dependencies & scripts
├── vite.config.ts           → Vite build config
└── vercel.json              → Vercel deployment config
```

---

## 🎓 Learning Resources

**Understanding the Stack:**

- **React:** https://react.dev
- **Vite:** https://vite.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Stripe:** https://stripe.com/docs

---

**This architecture is designed to be:**
- ✅ Scalable (easy to add properties)
- ✅ Secure (multiple security layers)
- ✅ Fast (CDN + edge functions)
- ✅ Maintainable (clean separation of concerns)
- ✅ Cost-effective (serverless, pay-per-use)

---

Ready to dive into configuration? Start with `/COMPLETE_SETUP_CHECKLIST.md`!
