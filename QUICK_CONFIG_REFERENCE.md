# ⚡ Quick Configuration Reference
## Copy-Paste Values for Supabase, Vercel, GitHub

Use this as a quick lookup while working through the checklist.

---

## 🔧 Supabase Configuration

### Project Details
```
Project ID: hxprmevheigajzqehjgf
Project URL: https://hxprmevheigajzqehjgf.supabase.co
Region: ap-southeast-2 (Sydney)
```

### API Endpoints
```
Properties API:
https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/properties

Blocked Dates API:
https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/blocked-dates

Bookings API:
https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/bookings

Stripe Payment API:
https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/create-payment-intent
```

### Storage Configuration
```
Bucket Name: Website Media
Bucket Type: PUBLIC
Base URL: https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/
```

### Database Table
```
Table Name: kv_store_edef7798
Schema: public
RLS: Enabled
Columns:
  - key (TEXT, PRIMARY KEY)
  - value (JSONB)
  - created_at (TIMESTAMPTZ)
  - updated_at (TIMESTAMPTZ)
```

---

## 🚀 Vercel Configuration

### Build Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x
Development Command: npm run dev
```

### Root Directory
```
Root Directory: ./
(Leave blank or set to root)
```

### Environment Variables Required

**Format for Vercel:**
Each variable should be set for: ✅ Production ✅ Preview ✅ Development

```bash
# Supabase
SUPABASE_URL=https://hxprmevheigajzqehjgf.supabase.co
SUPABASE_ANON_KEY=eyJhbG... (get from Supabase Settings → API)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (get from Supabase Settings → API, different from anon)
SUPABASE_DB_URL=postgresql://postgres.hxprmevheigajzqehjgf:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres

# Stripe (use test keys for development)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)

# Resend (email service)
RESEND_API_KEY=re_...

# Airtable
AIRTABLE_PAT=pat...

# Google Calendar
ICAL_FEED_URL=https://calendar.google.com/calendar/ical/.../basic.ics
```

### Domain Settings
```
Primary Domain: carlsonproperties.co.nz
WWW Redirect: www.carlsonproperties.co.nz → carlsonproperties.co.nz
Vercel Domain: your-project.vercel.app (keep active)
```

### Git Integration
```
Repository: yourusername/your-repo-name
Production Branch: main
Deploy Hooks: Enabled
Auto-deploy on push: Enabled
```

---

## 🐙 GitHub Configuration

### Repository Settings
```
Repository Name: your-repo-name (NOT carlsonpropertieswebsite if taken)
Visibility: Private (recommended)
Default Branch: main
```

### Branch Protection (Optional but Recommended)
```
Protected Branch: main
Require pull request reviews: Optional
Require status checks: Optional
```

### .gitignore (Already in your repo)
```
node_modules/
dist/
.env
.env.local
.vercel
.DS_Store
*.log
```

---

## 🌐 DNS Configuration

### DNS Records for carlsonproperties.co.nz

**Option 1: Using A Record (Most registrars)**
```
Type: A
Name: @
Value: 76.76.19.19
TTL: 3600 (or Auto)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**Option 2: Using CNAME (Cloudflare, some registrars)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto
Proxy: OFF (click grey cloud, not orange)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
Proxy: OFF
```

---

## 📧 Email Configuration (Resend)

### Sender Settings
```
From Email: noreply@carlsonproperties.co.nz (or your verified domain)
From Name: Carlson Properties
Reply-To: hello@carlsonproperties.co.nz (optional)
```

### Domain Verification (if using custom domain)
```
You need to add these DNS records (from Resend dashboard):

Type: TXT
Name: resend._domainkey
Value: [Get from Resend dashboard]

Type: TXT  
Name: @
Value: v=spf1 include:resend.com ~all
```

---

## 💳 Stripe Configuration

### Webhook Endpoint (if using webhooks)
```
Endpoint URL: https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/stripe-webhook

Events to listen for:
  ✅ payment_intent.succeeded
  ✅ payment_intent.payment_failed
  ✅ charge.refunded
```

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

---

## 📅 Google Calendar iCal Setup

### How to Get iCal Feed URL

1. Go to Google Calendar
2. Click Settings (gear icon) → Settings
3. Click on your calendar in the left sidebar
4. Scroll to "Integrate calendar"
5. Copy "Secret address in iCal format"

**URL Format:**
```
https://calendar.google.com/calendar/ical/[CALENDAR_ID]/basic.ics
```

**⚠️ Make sure:**
- Calendar is not set to private (or use secret URL)
- URL ends with `.ics`
- URL is accessible (test in browser - should download file)

---

## 📊 Airtable Configuration

### Base Setup
```
Base Name: Carlson Properties Bookings (or your base name)
Table Name: Bookings
```

### Required Fields
```
Fields your code expects:
- Guest Name (Single line text)
- Guest Email (Email)
- Guest Phone (Phone number)
- Check In (Date)
- Check Out (Date)
- Guests (Number)
- Total Price (Currency)
- Booking Date (Date)
- Notes (Long text)
```

### Getting Personal Access Token (PAT)

1. Go to: https://airtable.com/create/tokens
2. Click "Create new token"
3. Name: "Carlson Properties Website"
4. Scopes needed:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
5. Access: Select your base
6. Create token
7. Copy the `pat...` value

---

## 🔐 Security Keys Checklist

### Where Each Key Lives

**PUBLIC (can be in frontend):**
- ✅ `SUPABASE_URL` - In code at `/utils/supabase/info.tsx`
- ✅ `SUPABASE_ANON_KEY` - In code at `/utils/supabase/info.tsx`

**PRIVATE (Vercel env vars ONLY):**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Never in frontend!
- ❌ `SUPABASE_DB_URL` - Never in frontend!
- ❌ `STRIPE_SECRET_KEY` - Never in frontend!
- ❌ `RESEND_API_KEY` - Never in frontend!
- ❌ `AIRTABLE_PAT` - Never in frontend!
- ⚠️ `ICAL_FEED_URL` - Can be in frontend but contains secret URL

---

## 🧪 Testing URLs

### Local Development
```
http://localhost:3000
```

### Staging/Preview (Vercel)
```
https://your-project-git-main-username.vercel.app
```

### Production
```
https://carlsonproperties.co.nz
https://www.carlsonproperties.co.nz (redirects to above)
```

---

## 📱 Diagnostic Pages

### Image Testing
```
https://carlsonproperties.co.nz/image-test
Purpose: Check if all images load from Supabase Storage
```

### Image Mapper (Legacy)
```
https://carlsonproperties.co.nz/image-mapper
Purpose: Visual mapping tool (can be removed if not needed)
```

### Owner Dashboard
```
https://carlsonproperties.co.nz/owner-login
Purpose: Admin panel for viewing bookings
```

---

## 🔄 Deployment Commands

### GitHub
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub (triggers Vercel deploy)
git push origin main

# View git history
git log --oneline
```

### Supabase CLI
```bash
# Login
supabase login

# Link project
supabase link --project-ref hxprmevheigajzqehjgf

# Deploy Edge Function
supabase functions deploy make-server-edef7798

# View function logs
supabase functions logs make-server-edef7798

# List all functions
supabase functions list
```

### Vercel CLI (Optional)
```bash
# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls
```

---

## 🆘 Quick Troubleshooting

### Site shows blank page
```bash
# 1. Check deployment logs in Vercel
# 2. Check browser console (F12)
# 3. Verify all imports use "motion/react" not "framer-motion"
# 4. Clear browser cache and retry
```

### Images not loading
```bash
# 1. Visit /image-test page
# 2. Check Supabase Storage bucket is PUBLIC
# 3. Upload missing images
# 4. Verify bucket name is exactly: "Website Media"
```

### Backend API errors
```bash
# 1. Check Supabase Edge Function is deployed
# 2. Verify environment variables in Vercel
# 3. Check function logs: supabase functions logs make-server-edef7798
# 4. Test API endpoint directly with curl
```

### Payment not working
```bash
# 1. Verify STRIPE_SECRET_KEY in Vercel env vars
# 2. Check if using test vs live keys correctly
# 3. Look at Stripe dashboard for payment logs
# 4. Test with card: 4242 4242 4242 4242
```

---

## 📞 Support Links

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Status: https://www.vercel-status.com

**Stripe:**
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- Status: https://status.stripe.com

**Resend:**
- Dashboard: https://resend.com/emails
- Docs: https://resend.com/docs

**Airtable:**
- Bases: https://airtable.com
- API Docs: https://airtable.com/developers/web/api

---

## ✅ Quick Checklist

Use this for rapid verification:

- [ ] Supabase Edge Function deployed
- [ ] Supabase Storage bucket PUBLIC
- [ ] All 8 Vercel env vars set (Production, Preview, Development)
- [ ] Domain DNS configured with A or CNAME records
- [ ] SSL certificate active (green lock in Vercel)
- [ ] GitHub repository connected to Vercel
- [ ] Latest code pushed to main branch
- [ ] Latest deployment successful (green check)
- [ ] Test booking works end-to-end
- [ ] Images load correctly
- [ ] Owner dashboard login works

---

**Last Updated:** Current session
**Purpose:** Quick reference for configuration values
**Keep this handy:** Bookmark for easy access

---

Need help with any specific configuration? Let me know which section you're working on!
