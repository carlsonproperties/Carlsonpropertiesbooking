# 🛠️ Maintenance Mode Guide

## Current Status: ✅ MAINTENANCE MODE ENABLED

Your website at **www.carlsonproperties.co.nz** now shows a maintenance page to all visitors.

---

## What Visitors See

- 🔒 Professional "Closed for Maintenance" page
- 📞 Ashleigh's contact number: **027 697 7961**
- 📱 Click-to-call button for mobile users
- 💬 Links to Text/SMS and WhatsApp
- 🏠 Property address: 111 Jarden Mile, Taupo

---

## Features of the Maintenance Page

✅ **Clean, Professional Design** - Matches your luxury property aesthetic
✅ **Mobile Optimized** - Large, tappable phone number button
✅ **Multiple Contact Methods:**
   - Direct call: `tel:0276977961`
   - SMS/Text: `sms:0276977961`
   - WhatsApp: `https://wa.me/640276977961`
✅ **Responsive** - Looks great on all devices
✅ **Fast Loading** - No external images required

---

## How to Turn OFF Maintenance Mode

When you're ready to bring the site back online:

### Option 1: Edit the Code (Recommended)

1. Open `/src/app/routes.ts`
2. Find line 21: `const MAINTENANCE_MODE = true;`
3. Change to: `const MAINTENANCE_MODE = false;`
4. Commit and push to GitHub
5. Site will auto-deploy and show normal pages

### Option 2: Quick Command Line

```bash
# In your terminal
sed -i 's/MAINTENANCE_MODE = true/MAINTENANCE_MODE = false/' src/app/routes.ts
git add src/app/routes.ts
git commit -m "Disable maintenance mode"
git push
```

---

## Testing Maintenance Mode

**Live Site:**
- Visit: https://www.carlsonproperties.co.nz
- Should show maintenance page on ALL routes:
  - `/` (home)
  - `/about`
  - `/book`
  - `/dashboard` (even protected pages)

**Test Contact Links:**
- ✅ Click phone number on mobile - should open phone dialer
- ✅ Click "Text Message" - should open SMS app
- ✅ Click "WhatsApp" - should open WhatsApp with number pre-filled

---

## Customizing the Message

To change the maintenance message, edit `/src/app/pages/Maintenance.tsx`:

```tsx
// Line 26-29: Main heading
<h1 className="...">
  Closed for Maintenance  {/* Change this text */}
</h1>

// Line 32-35: Subheading
<p className="...">
  We're currently updating our booking system...  {/* Change this */}
</p>

// Line 58-60: Contact section description
<p className="...">
  For immediate booking inquiries...  {/* Change this */}
</p>
```

---

## SEO Impact

⚠️ **Important:** While in maintenance mode:
- Search engines will see the maintenance page
- No booking functionality available
- Dashboard/admin areas are also hidden
- Consider adding a meta tag to prevent indexing if down for long periods

---

## When to Use Maintenance Mode

Good reasons:
- ✅ Uploading images to Supabase Storage
- ✅ Fixing critical bugs
- ✅ Major feature updates
- ✅ Database maintenance
- ✅ Payment system changes

Avoid for:
- ❌ Minor CSS tweaks (use feature flags instead)
- ❌ Content updates (edit directly)
- ❌ Testing (use staging environment)

---

## Timeline

**Current:**
- Maintenance mode: ACTIVE ✅
- All routes redirect to maintenance page
- Contact info displayed: 027 697 7961

**To Restore Normal Operation:**
1. Upload images to Supabase Storage (see /URGENT_FIX_REQUIRED.md)
2. Test at /image-test to verify images load
3. Set `MAINTENANCE_MODE = false` in routes.ts
4. Push to GitHub
5. Site automatically deploys and goes live

---

## Emergency Access

If you need to access the dashboard while in maintenance mode:

### Temporary Solution:
Comment out the maintenance mode for specific routes:

```typescript
// In routes.ts, create a backdoor
{
  path: "/secret-admin-access",
  Component: Dashboard,
}
```

Then visit: `https://carlsonproperties.co.nz/secret-admin-access`

**Remember to remove this before disabling maintenance mode!**

---

## Quick Reference

| Action | File | Line | Change |
|--------|------|------|--------|
| Enable Maintenance | `/src/app/routes.ts` | 21 | `MAINTENANCE_MODE = true` |
| Disable Maintenance | `/src/app/routes.ts` | 21 | `MAINTENANCE_MODE = false` |
| Change Message | `/src/app/pages/Maintenance.tsx` | 26+ | Edit text content |
| Change Phone | `/src/app/pages/Maintenance.tsx` | 64 | Update number |

---

## Contact Info Currently Displayed

- **Name:** Ashleigh
- **Phone:** 027 697 7961
- **SMS:** sms:0276977961
- **WhatsApp:** wa.me/640276977961
- **Property:** 111 Jarden Mile, Taupo, NZ

All links are live and functional! 📱
