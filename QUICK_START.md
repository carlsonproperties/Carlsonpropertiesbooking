# ⚡ Quick Start - Maintenance Mode

## 🚨 MAINTENANCE MODE IS NOW ACTIVE

Your site shows this to all visitors:

---

### 🖥️ What Visitors See:

```
┌──────────────────────────────────────┐
│         [Carlson Logo]               │
│                                      │
│   CLOSED FOR MAINTENANCE             │
│                                      │
│   We're currently updating our       │
│   booking system to serve you better │
│                                      │
│   ──────────────────────────────    │
│                                      │
│   Direct Bookings Available          │
│                                      │
│   Contact Ashleigh:                  │
│   [📞 027 697 7961]                  │
│                                      │
│   💬 Text | 📱 WhatsApp              │
│                                      │
│   111 Jarden Mile, Taupo             │
└──────────────────────────────────────┘
```

---

## 🎯 What You Need To Do

### 1️⃣ Deploy (if not auto-deployed)
```bash
git add .
git commit -m "Enable maintenance mode"
git push origin main
```

### 2️⃣ Verify Live
- Visit: https://www.carlsonproperties.co.nz
- Should see maintenance page ✅

### 3️⃣ Upload Images (while in maintenance)
- Go to: https://supabase.com/dashboard/project/hxprmevheigajzqehjgf/storage/buckets
- Create "Website Media" bucket (if needed)
- Make it PUBLIC
- Upload all property images
- See `/URGENT_FIX_REQUIRED.md` for details

### 4️⃣ Turn Off Maintenance (when ready)
- Open: `/src/app/routes.ts`
- Line 21: Change `MAINTENANCE_MODE = true` to `false`
- Push to GitHub
- Site goes live! 🎉

---

## 📞 Contact Info Displayed

- **Name:** Ashleigh
- **Phone:** 027 697 7961
- **Methods:** Call, SMS, WhatsApp
- **Location:** 111 Jarden Mile, Taupo, NZ

---

## 📚 Full Documentation

- `/DEPLOYMENT_STATUS.md` - Complete deployment info
- `/MAINTENANCE_MODE_GUIDE.md` - How to use maintenance mode
- `/URGENT_FIX_REQUIRED.md` - Fix the image issue
- `/CHECKLIST.md` - Step-by-step checklist

---

## ⏱️ Timeline

**Now:** Maintenance page showing ✅
**Next:** Upload images to Supabase
**Then:** Test images load correctly
**Finally:** Turn off maintenance mode → Site goes live!

---

**Need help?** Check the documentation files above.
