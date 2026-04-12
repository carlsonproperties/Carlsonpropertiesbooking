# Supabase Storage Setup - Image Loading Fix

## 🚨 Issue
Hero image and other images are failing to load with the error:
```
Hero image failed to load
Hero image URL: https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
Check if Supabase Storage bucket "Website Media" is set to PUBLIC
```

## ✅ Solution

The "Website Media" bucket needs to be set to **PUBLIC** in your Supabase project dashboard.

### Steps to Fix:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `hxprmevheigajzqehjgf`

2. **Navigate to Storage**
   - Click **Storage** in the left sidebar
   - Find the bucket called **"Website Media"**

3. **Make Bucket Public**
   - Click on the **"Website Media"** bucket
   - Click the **Settings** or **⋮** (three dots) menu
   - Select **"Make bucket public"**
   - Confirm the action

4. **Verify**
   - Test the image URL in your browser:
     ```
     https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
     ```
   - It should now load the image directly

5. **Clear Cache & Reload**
   - Hard refresh your website: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Images should now load correctly

## 🔒 Security Note

Making the bucket public means anyone with the URL can view the images. This is standard for website assets like:
- Property photos
- Logo images
- Marketing materials
- Public gallery images

**DO NOT** store sensitive documents (contracts, personal data, etc.) in public buckets.

## 📋 Alternative Solution (If you prefer private buckets)

If you want to keep the bucket private, you'll need to:
1. Generate signed URLs from the backend
2. Update the frontend to fetch signed URLs instead of direct URLs
3. This adds complexity and is typically not needed for public website images

---

**Status:** The dashboard backend error is now fixed. Only the Storage permissions need to be updated in Supabase console.
