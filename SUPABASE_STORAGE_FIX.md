# 🔧 Fix Supabase Storage - Make "Website Media" Bucket PUBLIC

## The Problem
Your images are showing as green placeholders because the **"Website Media"** bucket is currently **PRIVATE**. 

The error logs show:
```
Hero image failed to load
Hero image URL: https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
Check if Supabase Storage bucket "Website Media" is set to PUBLIC
```

---

## ✅ Solution: Make Bucket Public

### Step 1: Login to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **`hxprmevheigajzqehjgf`**

### Step 2: Navigate to Storage
1. Click **"Storage"** in the left sidebar
2. Click on **"Website Media"** bucket

### Step 3: Make Bucket Public
1. Click the **"⋮" (three dots)** next to the bucket name
2. Select **"Make bucket public"**
3. Confirm the action

### Step 4: Verify Bucket is Public
After making it public, you should see a **"Public"** badge next to the bucket name.

---

## 🧪 Test If It Worked

Open this URL in your browser:
```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
```

✅ **Success:** The hero image should display  
❌ **Failed:** You'll see an error or 404

---

## 🔐 Alternative: Use Signed URLs (if you want to keep bucket private)

If you need to keep the bucket private for security reasons, you'll need to:

1. Update the server code to generate signed URLs
2. Modify the frontend to fetch signed URLs instead of direct public URLs

**For most public website use cases, making the bucket PUBLIC is the right choice.**

---

## 📋 Quick Checklist
- [ ] Bucket "Website Media" is set to PUBLIC
- [ ] Test URL loads the hero image
- [ ] Refresh carlsonproperties.co.nz to see images load
- [ ] No more green placeholder boxes

---

## 🚨 Still Not Working?

Check browser console (F12) for specific error messages and verify:
1. Bucket name is exactly **"Website Media"** (with space)
2. File names match exactly (case-sensitive)
3. Files are actually uploaded to the bucket
