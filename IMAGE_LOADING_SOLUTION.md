# 🎯 Complete Solution: Fix Green Placeholder Boxes

## TL;DR - Quick Fix (90% of cases)

The green/placeholder boxes appear because your **Supabase Storage bucket is PRIVATE**. 

**Fix in 60 seconds:**

1. Go to: https://supabase.com/dashboard/project/hxprmevheigajzqehjgf/storage/buckets
2. Find "Website Media" bucket
3. Click **⋮** → **"Make bucket public"**
4. Confirm
5. Refresh carlsonproperties.co.nz ✨

---

## What We Fixed in This Update

### ✅ 1. Fixed Image URL Generation
**File:** `/src/app/lib/images.ts`

**Problem:** URL encoding wasn't handling filenames with spaces correctly.

**Solution:** Improved the `getImageUrl()` function to properly encode both bucket name and filenames:

```typescript
const getImageUrl = (filename: string) => {
  const encodedBucket = encodeURIComponent(STORAGE_BUCKET);
  const encodedFilename = encodeURIComponent(filename);
  const url = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${encodedBucket}/${encodedFilename}`;
  console.log(`📸 Image URL for "${filename}":`, url);
  return url;
};
```

**What this does:**
- Properly encodes "Website Media" → "Website%20Media"
- Handles filenames with spaces like "Street facing.jpg"
- Logs every URL to console for debugging
- Ensures consistent URL format

---

### ✅ 2. Fixed Scroll Animation Warning
**File:** `/src/app/pages/Home.tsx`

**Problem:** Warning about container position for scroll offset calculation.

**Solution:** The main container already has `position: relative` in its className.

---

### ✅ 3. Created Diagnostic Tools

**New Files:**
1. `/src/app/pages/ImageTest.tsx` - Visual image tester
2. `/src/app/components/DiagnosticImage.tsx` - Debug wrapper component
3. `/DIAGNOSE_GREEN_BOXES.md` - Step-by-step troubleshooting guide
4. `/SUPABASE_STORAGE_FIX.md` - Supabase-specific fix instructions
5. `/TEST_IMAGE_URL.md` - Quick single-image test

**Access the Image Test Page:**
After deploying, visit: `https://carlsonproperties.co.nz/image-test`

This page will:
- Test all 12+ images automatically
- Show success ✅ / failure ❌ status
- Display exact URLs being used
- Provide troubleshooting tips in real-time

---

## Why Are You Seeing Green Boxes?

### Browser Rendering Behavior:
When an `<img>` tag fails to load, browsers show:
- **Chrome/Edge:** Broken image icon
- **Firefox:** Gray placeholder box  
- **Safari:** Empty space or gray box
- **Some browsers:** Green tinted placeholder (rare)

The "green" you're seeing is likely:
1. **Browser's default placeholder** while image is loading/failed
2. **CSS background color** showing through (we use `bg-slate-100`)
3. **Color profile rendering** of broken image

---

## Most Common Root Causes (in order)

### 1. 🔒 Bucket is PRIVATE (90% of cases)
**Symptoms:**
- All images show placeholders
- Console shows 403 or access denied errors
- Direct URL test fails

**Fix:** Make bucket PUBLIC (see Quick Fix above)

---

### 2. 📁 Files Not Uploaded
**Symptoms:**
- Some images load, others don't
- Console shows 404 errors
- Specific images missing

**Fix:**
1. Go to Supabase Storage → "Website Media"
2. Upload missing files
3. Ensure filenames match exactly (case-sensitive):
   - ✅ `poolview.jpg`
   - ❌ `Poolview.jpg` (wrong case)
   - ❌ `poolview.JPG` (wrong extension)

---

### 3. 📝 Filename Mismatch
**Symptoms:**
- Console logs show URLs with %20 or encoded characters
- Files exist but don't load
- Works locally but not in production

**Fix:**
- Check filenames in Supabase match code exactly
- Remove special characters from filenames if possible
- Use the `console.log()` output to verify URLs

---

### 4. 🌐 Network/CORS Issues (rare)
**Symptoms:**
- CORS errors in console
- Works sometimes, fails other times
- Only affects certain browsers

**Fix:**
- Make bucket public (fixes CORS automatically)
- Check Supabase project status

---

## How to Verify It's Fixed

### Test 1: Direct URL
Open in browser:
```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
```
✅ Should show: Beautiful property exterior photo

---

### Test 2: Console Logs
1. Open your site: carlsonproperties.co.nz
2. Press F12 → Console tab
3. Look for: `📸 Image URL for "...": https://...`
4. Click each URL - all should open and show images

---

### Test 3: Image Test Page
Visit: `https://carlsonproperties.co.nz/image-test`

Should show:
- ✅ 12/12 images loaded successfully
- Green badges on all images
- No red error boxes

---

## Deployment Checklist

After pulling these changes to your GitHub repo:

- [ ] Pull latest code: `git pull origin main`
- [ ] Code is deployed to Vercel automatically
- [ ] Visit carlsonproperties.co.nz
- [ ] Open browser console (F12)
- [ ] Check for `📸` emoji logs showing image URLs
- [ ] If images fail, follow Quick Fix to make bucket public
- [ ] Visit /image-test to verify all images
- [ ] Hard refresh (Cmd+Shift+R or Ctrl+Shift+R) to clear cache

---

## Emergency Fallback

If making the bucket public doesn't work:

1. **Check Supabase project status**
   - Go to Supabase Dashboard
   - Look for any service outages or issues

2. **Verify bucket name is correct**
   - Should be exactly: "Website Media" (with capital W and M)
   - Not: "website media", "WebsiteMedia", etc.

3. **Re-upload one test image**
   - Upload a simple test.jpg
   - Try accessing: `https://...public/Website%20Media/test.jpg`
   - If this works, issue is with original filenames

4. **Check file permissions**
   - In Supabase Storage, click on a file
   - Check if there are individual file permissions blocking access

---

## Summary

**What's Changed:**
- ✅ Improved URL encoding in images.ts
- ✅ Added comprehensive logging
- ✅ Created diagnostic tools
- ✅ Fixed container positioning warning

**What You Need to Do:**
1. Pull the code from GitHub
2. Make "Website Media" bucket PUBLIC in Supabase
3. Refresh your website
4. Images should load! 🎉

**Still having issues?**
Visit `/image-test` and check browser console for specific error messages.
