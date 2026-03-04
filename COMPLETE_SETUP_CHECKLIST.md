# 🔧 Complete Configuration Checklist
## Supabase + Vercel + GitHub Setup Guide

Let's verify every setting is correct. Work through this **step-by-step**.

---

## 📋 Part 1: GitHub Repository Setup

### Step 1.1: Check Repository Exists

1. Go to: **https://github.com/yourusername** (replace with your GitHub username)
2. Look for your repository

**Questions:**
- [ ] Do you see the repository?
- [ ] What is the repository name? ________________
- [ ] Is the repository **Private** or **Public**?

**Recommended Settings:**
- ✅ Repository should be **Private** (to protect API keys in commit history)
- ✅ Repository name should NOT be "carlsonpropertieswebsite" (you said it exists already)

---

### Step 1.2: Check Default Branch Name

1. In your repository, look at the top left for branch dropdown
2. Note the default branch name

**Current branch name:** ________________

**Expected:**
- Most likely: `main` or `master`
- Vercel needs to know which branch to deploy from

---

### Step 1.3: Verify Repository Connection

**Check if files are pushed:**

1. Go to your repository on GitHub
2. Do you see these files?
   - [ ] `/src/app/App.tsx`
   - [ ] `/package.json`
   - [ ] `/vercel.json`
   - [ ] `/supabase/functions/server/index.tsx`
   - [ ] `/index.html`

**If NO:**
```bash
# Run these commands in your local project folder:
git status
git add .
git commit -m "Initial commit - Carlson Properties website"
git push origin main
```

---

## 📋 Part 2: Supabase Configuration

### Step 2.1: Get Your Supabase Project ID

1. Go to: **https://supabase.com/dashboard**
2. Click on your project
3. Look at the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`

**Your Project ID:** `hxprmevheigajzqehjgf` ✅ (already confirmed)

---

### Step 2.2: Verify API Keys

1. In Supabase Dashboard, go to: **Settings** (gear icon) → **API**
2. Scroll to "Project API keys"

**Copy these values and verify:**

| Key Name | Starts With | Status |
|----------|-------------|--------|
| Project URL | `https://hxprmevheigajzqehjgf.supabase.co` | [ ] Confirmed |
| anon public | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | [ ] Confirmed |
| service_role | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (DIFFERENT from anon) | [ ] Confirmed |

**⚠️ CRITICAL:** 
- ✅ `anon public` = Safe to use in frontend (already in `/utils/supabase/info.tsx`)
- ❌ `service_role` = NEVER expose in frontend, only in backend/Vercel env vars

---

### Step 2.3: Check Supabase Storage Buckets

1. Go to: **Storage** (in left sidebar)
2. Check for "Website Media" bucket

**Checklist:**

- [ ] Bucket exists: `Website Media` (with space, capital W and M)
- [ ] Bucket is **PUBLIC** (should show a globe icon 🌐)
- [ ] Files uploaded (or ready to upload)

**If bucket doesn't exist or is private:**

1. Click **"New bucket"**
2. Name: `Website Media`
3. Toggle **"Public bucket"** to **ON**
4. Click **"Create bucket"**

**If bucket exists but is PRIVATE:**

1. Click the **⋮** (three dots) next to "Website Media"
2. Click **"Make bucket public"**
3. Confirm

---

### Step 2.4: Verify Database Table

1. Go to: **Table Editor** (in left sidebar)
2. Look for table: `kv_store_edef7798`

**Checklist:**

- [ ] Table exists
- [ ] Columns include: `key`, `value`, `created_at`, `updated_at`

**If table doesn't exist, run this SQL:**

1. Go to: **SQL Editor** (in left sidebar)
2. Click **"New query"**
3. Paste this SQL:

```sql
-- This table should already exist, but if not:
CREATE TABLE IF NOT EXISTS kv_store_edef7798 (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_edef7798(key);

-- Enable Row Level Security (RLS) but allow all operations
ALTER TABLE kv_store_edef7798 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON kv_store_edef7798
FOR ALL USING (true) WITH CHECK (true);
```

4. Click **"Run"**

---

### Step 2.5: Check Supabase Edge Function

1. Go to: **Edge Functions** (in left sidebar)
2. Look for function: `make-server-edef7798`

**Checklist:**

- [ ] Function exists
- [ ] Function is **deployed** (green dot or "Deployed" status)
- [ ] Last deployment was recent

**If function doesn't exist or shows errors:**

We'll need to deploy it. First, check if you have Supabase CLI installed:

```bash
# Check if Supabase CLI is installed
supabase --version

# If not installed, install it:
npm install -g supabase
```

**To deploy the Edge Function:**

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref hxprmevheigajzqehjgf

# Deploy the function
supabase functions deploy make-server-edef7798
```

**Verify function URL:**

The function should be accessible at:
```
https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/properties
```

Test it in browser or with curl:
```bash
curl https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/properties \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

### Step 2.6: Verify Auth Settings

1. Go to: **Authentication** → **Providers** (in left sidebar)
2. Check Email provider

**Checklist:**

- [ ] Email provider is **enabled**
- [ ] "Confirm email" is **DISABLED** (since no email server configured)

**If "Confirm email" is enabled:**

1. Click on **Email** provider
2. Scroll to "Confirm email"
3. Toggle it **OFF**
4. Click **"Save"**

**Why?** We're using `email_confirm: true` in the backend signup to auto-confirm users since you don't have an email server set up.

---

### Step 2.7: Check Database Connection String

1. Go to: **Settings** → **Database**
2. Scroll to "Connection string"
3. Click on **"URI"** tab

**Copy the connection string:**
```
postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
```

**Note:** You'll need this for Vercel environment variables.

- [ ] Connection string copied

---

## 📋 Part 3: Vercel Configuration

### Step 3.1: Check Vercel Project Exists

1. Go to: **https://vercel.com/dashboard**
2. Look for your project

**Questions:**
- [ ] Project exists?
- [ ] Project name: ________________
- [ ] Is it connected to GitHub? (should show GitHub icon)

---

### Step 3.2: Verify Domain Configuration

1. In Vercel project, go to: **Settings** → **Domains**

**Checklist:**

- [ ] Domain `carlsonproperties.co.nz` is added
- [ ] Domain shows ✅ (green checkmark) or is it showing warning?
- [ ] Domain is set as **Primary** domain

**Domain Status:**
```
carlsonproperties.co.nz → Status: ________________
www.carlsonproperties.co.nz → Status: ________________
```

**Expected configuration:**

| Domain | Type | Redirect |
|--------|------|----------|
| `carlsonproperties.co.nz` | Primary | - |
| `www.carlsonproperties.co.nz` | Redirect | → `carlsonproperties.co.nz` |
| `*.vercel.app` | Vercel Default | Active |

**If domain shows errors:**

You may need to update DNS settings. See Part 4 below.

---

### Step 3.3: Check Git Integration

1. In Vercel project, go to: **Settings** → **Git**

**Checklist:**

- [ ] Connected Repository: `yourusername/repository-name`
- [ ] Production Branch: `main` (or `master`)
- [ ] Auto-deploy enabled for production branch

**Settings should show:**

```
Connected Git Repository: yourusername/your-repo-name
Production Branch: main
```

**Important Settings:**

- ✅ **Ignored Build Step:** Leave empty (deploy on every push)
- ✅ **Auto-deploy:** Enabled for production branch

---

### Step 3.4: Verify Environment Variables

1. In Vercel project, go to: **Settings** → **Environment Variables**

**Required variables - CHECK EACH ONE:**

| Variable Name | Environment | Value Preview | Status |
|---------------|-------------|---------------|--------|
| `SUPABASE_URL` | Production, Preview, Development | `https://hxprmevheigajzqehjgf.supabase.co` | [ ] Set |
| `SUPABASE_ANON_KEY` | Production, Preview, Development | `eyJhbGci...` | [ ] Set |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development | `eyJhbGci...` (different) | [ ] Set |
| `SUPABASE_DB_URL` | Production, Preview, Development | `postgresql://postgres...` | [ ] Set |
| `STRIPE_SECRET_KEY` | Production, Preview, Development | `sk_test_...` or `sk_live_...` | [ ] Set |
| `AIRTABLE_PAT` | Production, Preview, Development | `pat...` | [ ] Set |
| `RESEND_API_KEY` | Production, Preview, Development | `re_...` | [ ] Set |
| `ICAL_FEED_URL` | Production, Preview, Development | `https://calendar.google.com/...` | [ ] Set |

**⚠️ CRITICAL CHECKS:**

For each variable:
1. Click **"Edit"** (pencil icon)
2. Verify it's set for **ALL THREE** environments:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
3. Verify the value is correct

**How to verify values:**

**SUPABASE_URL:**
- Should be: `https://hxprmevheigajzqehjgf.supabase.co`
- From: Supabase → Settings → API → Project URL

**SUPABASE_ANON_KEY:**
- Should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M`
- From: Supabase → Settings → API → Project API keys → `anon` `public`

**SUPABASE_SERVICE_ROLE_KEY:**
- Should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M`
- DIFFERENT from anon key
- From: Supabase → Settings → API → Project API keys → `service_role` `secret`

**SUPABASE_DB_URL:**
- Should start with: `postgresql://postgres.hxprmevheigajzqehjgf`
- From: Supabase → Settings → Database → Connection string (URI tab)
- **IMPORTANT:** Replace `[YOUR-PASSWORD]` with your actual database password

**STRIPE_SECRET_KEY:**
- Test mode: Starts with `sk_test_`
- Live mode: Starts with `sk_live_`
- From: Stripe Dashboard → Developers → API keys

**AIRTABLE_PAT:**
- Starts with: `pat`
- From: Airtable → Account → Developer hub → Personal access tokens

**RESEND_API_KEY:**
- Starts with: `re_`
- From: Resend Dashboard → API Keys

**ICAL_FEED_URL:**
- Your Google Calendar iCal feed URL
- Should start with: `https://calendar.google.com/calendar/ical/`

---

### Step 3.5: Check Build Settings

1. In Vercel project, go to: **Settings** → **Build & Development Settings**

**Verify these settings:**

| Setting | Value | Status |
|---------|-------|--------|
| Framework Preset | `Vite` | [ ] Correct |
| Build Command | `npm run build` or `pnpm build` | [ ] Correct |
| Output Directory | `dist` | [ ] Correct |
| Install Command | `npm install` or `pnpm install` | [ ] Correct |
| Node.js Version | `20.x` (or latest) | [ ] Correct |

**If any are wrong, update them:**

1. Click **"Edit"** next to each setting
2. Set the correct value
3. Click **"Save"**

---

### Step 3.6: Check Function Settings (for Edge Functions)

1. In Vercel project, go to: **Settings** → **Functions**

**Recommended settings:**

| Setting | Value |
|---------|-------|
| Function Region | `syd1` (Sydney) - closest to NZ |
| Maximum Duration | `10s` (free tier) or `60s` (pro) |

**Note:** Your Supabase Edge Function is separate and handles backend logic. Vercel functions are not currently used, but good to have configured.

---

### Step 3.7: Verify Deployment Status

1. In Vercel project, go to: **Deployments** tab

**Check latest deployment:**

- [ ] Latest deployment shows ✅ "Ready"
- [ ] Deployment is from correct branch (`main`)
- [ ] Deployment has no build errors

**If deployment shows errors:**

1. Click on the failed deployment
2. Check the **"Build Logs"** tab
3. Look for error messages

**Common errors:**
- Missing environment variables → Set them in Settings → Environment Variables
- Build failures → Check `package.json` scripts
- Import errors → We just fixed these!

---

## 📋 Part 4: Domain & DNS Configuration

### Step 4.1: Check Domain Registrar Settings

**Where is your domain registered?**
- [ ] Cloudflare
- [ ] GoDaddy
- [ ] Namecheap
- [ ] Google Domains
- [ ] Other: ________________

---

### Step 4.2: Verify DNS Records

1. Go to your domain registrar's DNS management
2. Check these DNS records exist:

**Required DNS Records for carlsonproperties.co.nz:**

| Type | Name | Value | Status |
|------|------|-------|--------|
| `A` | `@` | `76.76.19.19` (Vercel IP) | [ ] Set |
| `CNAME` | `www` | `cname.vercel-dns.com` | [ ] Set |

**OR (alternative configuration):**

| Type | Name | Value | Status |
|------|------|-------|--------|
| `CNAME` | `@` | `cname.vercel-dns.com` | [ ] Set |
| `CNAME` | `www` | `cname.vercel-dns.com` | [ ] Set |

**⚠️ NOTE:** Some registrars don't allow CNAME for root domain (`@`). If that's the case, use the A record method.

---

### Step 4.3: SSL Certificate

1. In Vercel project, go to: **Settings** → **Domains**
2. Check each domain

**SSL Status for each domain:**

- [ ] `carlsonproperties.co.nz` → SSL: ________________
- [ ] `www.carlsonproperties.co.nz` → SSL: ________________

**Expected:**
- ✅ Shows a 🔒 lock icon
- ✅ "SSL Certificate: Valid"

**If SSL shows "Pending" or "Error":**
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Try clicking "Refresh" in Vercel

---

## 📋 Part 5: Integration Testing

### Step 5.1: Test Frontend → Backend Connection

**Test the booking flow:**

1. Visit: `https://carlsonproperties.co.nz/book`
2. Select dates in the calendar
3. Open browser console (F12)
4. Check for errors

**Expected behavior:**
- ✅ Calendar loads
- ✅ Dates can be selected
- ✅ No 404 errors in console
- ✅ Backend API responds

**Console should show:**
```
Fetching blocked dates from: https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/blocked-dates
```

**If errors appear:**
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel env vars
- Verify Edge Function is deployed in Supabase
- Check CORS settings in Edge Function

---

### Step 5.2: Test Supabase Storage Access

1. Visit: `https://carlsonproperties.co.nz/image-test`
2. Check which images load

**Expected results:**

If images are uploaded:
- ✅ All images show green checkmarks
- ✅ Images display in preview

If images NOT uploaded yet:
- ❌ Red X marks
- ❌ 404 errors
- 👉 Upload images to Supabase Storage (see `/IMAGE_UPLOAD_URGENT.md`)

**Test one image directly:**

Open this URL in browser:
```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
```

**Expected:**
- ✅ Image displays (if uploaded)
- ❌ "Object not found" error (if not uploaded)

---

### Step 5.3: Test Owner Dashboard Login

1. Visit: `https://carlsonproperties.co.nz/owner-login`
2. Try to log in

**Have you created an owner account yet?**
- [ ] Yes - can log in
- [ ] No - need to create account

**If you need to create an owner account:**

Option A: Create via Dashboard signup (if enabled)

Option B: Create via Supabase Auth dashboard:
1. Go to Supabase → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Create user"

Then test login at `/owner-login`

---

### Step 5.4: Test Email Sending (Resend)

**Check Resend API key is working:**

1. Make a test booking (use a future date)
2. Complete checkout
3. Check if confirmation email arrives

**Did you receive email?**
- [ ] Yes - Resend is configured correctly
- [ ] No - Check Resend API key

**To verify Resend:**

1. Go to: https://resend.com/emails
2. Check "Logs" for sent emails
3. If no emails appear, check API key in Vercel env vars

**Common issues:**
- Wrong API key format
- API key not set for all environments (Production, Preview, Development)
- "From" email not verified in Resend

---

### Step 5.5: Test Stripe Payments

**⚠️ Are you using TEST mode or LIVE mode?**

**For TEST mode:**
- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

**Steps:**
1. Visit: `https://carlsonproperties.co.nz/book`
2. Select dates
3. Click "Continue to Checkout"
4. Fill in guest details
5. Enter test card: `4242 4242 4242 4242`
6. Complete payment

**Expected behavior:**
- ✅ Payment processes
- ✅ Redirects to confirmation page
- ✅ Booking saved to database
- ✅ Email sent (if Resend configured)

**If payment fails:**
- Check `STRIPE_SECRET_KEY` in Vercel env vars
- Verify it matches mode (test vs live)
- Check Stripe dashboard for errors

---

### Step 5.6: Test iCal Calendar Integration

**Check if Google Calendar blocked dates sync:**

1. Visit: `https://carlsonproperties.co.nz/book`
2. Open calendar
3. Check if any dates are blocked

**Expected behavior:**
- Dates from your Google Calendar should be unavailable
- These dates should show as greyed out

**If no dates are blocked:**
- Check `ICAL_FEED_URL` in Vercel env vars
- Verify iCal URL is correct and public
- Test iCal URL in browser (should download a .ics file)

**To get correct iCal URL:**
1. Go to Google Calendar
2. Click settings (gear icon) → Settings
3. Click on your calendar name
4. Scroll to "Integrate calendar"
5. Copy "Secret address in iCal format"
6. URL should look like: `https://calendar.google.com/calendar/ical/...../basic.ics`

---

### Step 5.7: Test Airtable Integration

**Check if guest data saves to Airtable:**

1. Complete a test booking
2. Go to your Airtable base
3. Check if new row appears with booking data

**Did new booking appear in Airtable?**
- [ ] Yes - Airtable configured correctly
- [ ] No - Check Airtable PAT

**To verify Airtable:**
1. Check `AIRTABLE_PAT` in Vercel env vars
2. Verify the token has correct permissions
3. Check Airtable base ID in your code matches your actual base

---

## 📋 Part 6: Security Checklist

### Step 6.1: Environment Variables Security

**Verify secrets are NOT in code:**

1. Search your codebase for:
   - [ ] `sk_test_` or `sk_live_` (Stripe keys)
   - [ ] `service_role` (Supabase service key)
   - [ ] Database passwords
   - [ ] API tokens

**✅ All sensitive values should ONLY be in:**
- Vercel Environment Variables
- `/utils/supabase/info.tsx` (for public anon key only)

**❌ Should NEVER be in:**
- Frontend code (except public keys)
- Git history
- Console logs

---

### Step 6.2: Supabase Row Level Security (RLS)

1. Go to Supabase → Table Editor
2. Click on `kv_store_edef7798` table
3. Check RLS status

**Is RLS enabled?**
- [ ] Yes - Good! (lock icon shows)
- [ ] No - Enable it (see Step 2.4)

**Why RLS matters:**
Without RLS, anyone with your anon key could read/write to your database directly. With RLS + policies, only your backend can modify data.

---

### Step 6.3: CORS Configuration

**Check Edge Function CORS settings:**

1. Open `/supabase/functions/server/index.tsx`
2. Verify CORS allows your domain

**Expected code:**
```tsx
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://carlsonproperties.co.nz',
    'https://www.carlsonproperties.co.nz',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

**If CORS is too open:**
```tsx
// ❌ BAD - allows ANY origin
app.use('*', cors({ origin: '*' }));

// ✅ GOOD - specific domains only
app.use('*', cors({ 
  origin: ['https://carlsonproperties.co.nz'] 
}));
```

---

### Step 6.4: API Rate Limiting

**Consider adding rate limiting to protect against abuse:**

Your backend currently doesn't have rate limiting. This is okay for MVP but consider adding later.

**Future enhancement:** Use Upstash Rate Limiting or Supabase Edge Function rate limiting.

---

## 📋 Part 7: Performance Checklist

### Step 7.1: Check Build Performance

1. In Vercel, go to latest deployment
2. Check build time

**Build time:** ________________

**Expected:** 
- ✅ Under 2 minutes = Good
- ⚠️ 2-5 minutes = Acceptable
- ❌ Over 5 minutes = Investigate

---

### Step 7.2: Check Bundle Size

1. In Vercel deployment, click on deployment
2. Look for "Build Output"

**Check for warnings about bundle size:**
- [ ] No warnings
- [ ] Some warnings (acceptable for now)
- [ ] Critical warnings (need to optimize)

---

### Step 7.3: Lighthouse Score

**Test your site performance:**

1. Open: `https://carlsonproperties.co.nz`
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Click "Generate report"

**Target scores:**

| Metric | Target | Your Score |
|--------|--------|------------|
| Performance | 90+ | _____ |
| Accessibility | 90+ | _____ |
| Best Practices | 90+ | _____ |
| SEO | 90+ | _____ |

---

## 📋 Part 8: Final Verification

### Step 8.1: Full User Flow Test

**Complete a test booking from start to finish:**

1. [ ] Visit homepage
2. [ ] Click "Book Now"
3. [ ] Select dates in calendar
4. [ ] Select guest count
5. [ ] See correct price calculation
6. [ ] Click "Continue to Checkout"
7. [ ] Fill in guest information
8. [ ] Enter payment details (test card if test mode)
9. [ ] Submit payment
10. [ ] See confirmation page
11. [ ] Receive confirmation email
12. [ ] Check booking appears in Airtable
13. [ ] Check booking appears in owner dashboard

**All steps completed successfully?**
- [ ] Yes - Full flow works! 🎉
- [ ] No - Note which step failed: ________________

---

### Step 8.2: Cross-Browser Testing

**Test in multiple browsers:**

| Browser | Homepage Loads | Booking Works | Dashboard Works | Status |
|---------|----------------|---------------|-----------------|--------|
| Chrome | [ ] | [ ] | [ ] | _____ |
| Firefox | [ ] | [ ] | [ ] | _____ |
| Safari | [ ] | [ ] | [ ] | _____ |
| Edge | [ ] | [ ] | [ ] | _____ |
| Mobile Safari (iOS) | [ ] | [ ] | [ ] | _____ |
| Mobile Chrome (Android) | [ ] | [ ] | [ ] | _____ |

---

### Step 8.3: Mobile Responsiveness

**Test on mobile device:**

1. Visit site on phone
2. Try booking flow

**Checklist:**
- [ ] Navigation menu works
- [ ] Calendar is usable
- [ ] Forms are easy to fill
- [ ] Payment works
- [ ] Images load correctly
- [ ] No horizontal scrolling

---

## ✅ Configuration Summary

### Supabase
- [ ] Project ID confirmed: `hxprmevheigajzqehjgf`
- [ ] API keys verified (anon + service_role)
- [ ] Storage bucket created and PUBLIC
- [ ] Database table exists with RLS
- [ ] Edge Function deployed
- [ ] Auth settings configured

### Vercel
- [ ] Project deployed
- [ ] Connected to GitHub
- [ ] Environment variables set (all 8)
- [ ] Domain configured with SSL
- [ ] Build settings correct
- [ ] Latest deployment successful

### GitHub
- [ ] Repository created
- [ ] Files pushed
- [ ] Branch configured
- [ ] Auto-deploy enabled

### Integrations
- [ ] Frontend ↔ Backend working
- [ ] Stripe payments working
- [ ] Resend emails working
- [ ] Airtable sync working
- [ ] iCal calendar sync working
- [ ] Image storage working

### Security
- [ ] No secrets in code
- [ ] RLS enabled
- [ ] CORS configured
- [ ] Environment variables secured

### Performance
- [ ] Build time acceptable
- [ ] Bundle size reasonable
- [ ] Lighthouse scores good
- [ ] Mobile responsive

---

## 🚨 Common Issues & Solutions

### Issue: "Function not found" error

**Cause:** Edge Function not deployed to Supabase

**Solution:**
```bash
supabase login
supabase link --project-ref hxprmevheigajzqehjgf
supabase functions deploy make-server-edef7798
```

---

### Issue: Environment variables not working

**Cause:** Not set for all environments or deployment not refreshed

**Solution:**
1. In Vercel → Settings → Environment Variables
2. Edit each variable
3. Check ALL THREE boxes: Production, Preview, Development
4. Click "Save"
5. Go to Deployments → Click "Redeploy" on latest

---

### Issue: Images showing 404

**Cause:** Not uploaded to Supabase Storage

**Solution:** See `/IMAGE_UPLOAD_URGENT.md`

---

### Issue: Blank page after deployment

**Cause:** Build errors or JS errors

**Solution:**
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all imports use `motion/react` not `framer-motion` (we just fixed this!)

---

### Issue: Domain not working

**Cause:** DNS not propagated or misconfigured

**Solution:**
1. Check DNS records in registrar
2. Wait 24-48 hours for propagation
3. Clear browser cache
4. Test in incognito mode

---

## 📞 Next Steps

After completing this checklist:

1. **Mark any issues found:** ________________

2. **Priority fixes needed:** ________________

3. **Everything working?** 
   - [ ] Yes - Ready to launch! 🚀
   - [ ] No - Let's fix remaining issues

---

**Created:** Configuration Checklist
**Purpose:** Comprehensive setup verification
**Time to complete:** 30-45 minutes
**Result:** Fully verified production-ready application

---

## 💡 Pro Tips

1. **Bookmark this checklist** - useful for troubleshooting later
2. **Run through it after major changes** - ensures nothing broke
3. **Share with team members** - helps them understand the setup
4. **Update as you add features** - keep it current

---

Let me know which step you'd like to start with, or if you found any issues as you go through the checklist!
