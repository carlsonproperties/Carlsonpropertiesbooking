# 📸 How to Upload Your Property Images to Supabase

## 🚀 Quick Start Guide

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Select your **Carlson Properties** project

---

### Step 2: Create a Public Storage Bucket

1. Click **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it: `property-images`
4. ✅ **IMPORTANT:** Toggle **Public bucket** to ON
5. Click **Create bucket**

![Storage Setup]

**Why Public?**
- Public buckets give you permanent, direct image URLs
- No need for signed URLs that expire
- Perfect for website images

---

### Step 3: Upload Your Images

1. Click on your `property-images` bucket
2. Click **Upload files**
3. Select all your property photos:
   - Hero images
   - Gallery photos
   - Bedroom photos
   - Bathroom photos
   - Wellness area (pool, sauna, gym)
   - Family photos
   - Logo

**Recommended Image Names:**
```
hero-main.jpg
hero-wellness.jpg
gallery-kitchen.jpg
gallery-pool.jpg
gallery-living-room.jpg
gallery-exterior.jpg
gallery-sauna.jpg
gallery-bbq.jpg
bedroom-1.jpg
bedroom-2.jpg
bedroom-3.jpg
bedroom-4.jpg
bedroom-5.jpg
ensuite-1.jpg
ensuite-2.jpg
ensuite-3.jpg
main-bathroom.jpg
family-group.jpg
family-outdoor.jpg
family-kids.jpg
logo.png
```

---

### Step 4: Get Your Image URLs

After uploading, you'll get URLs in this format:

```
https://[project-id].supabase.co/storage/v1/object/public/property-images/hero-main.jpg
```

#### How to Copy URLs:

1. Click on an uploaded image
2. Click **Get URL** or **Copy URL**
3. Save it in a text file

**OR Build URLs Manually:**

```
https://[YOUR-PROJECT-ID].supabase.co/storage/v1/object/public/property-images/[filename]
```

Replace `[YOUR-PROJECT-ID]` with your actual Supabase project ID.

---

## 📋 Step 5: Update Your Code

Once you have all your image URLs, I'll help you update the code. Just paste them here in this format:

```
Hero Main: https://...
Hero Wellness: https://...
Gallery Kitchen: https://...
(etc.)
```

---

## 🎯 Alternative: Quick Upload via Supabase CLI (Advanced)

If you have many images, you can use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Upload images
supabase storage upload property-images hero-main.jpg --project-ref [your-project-id]
```

---

## ⚡ What I Need From You

1. Upload your images to Supabase Storage
2. Copy all the public URLs
3. Share them with me in this format:

```
LOGO: https://...
HERO_MAIN: https://...
HERO_WELLNESS: https://...
GALLERY_1: https://...
GALLERY_2: https://...
(etc.)
```

Then I'll update all the files with your actual images! 🎉

---

## 🆘 Troubleshooting

### Can't see "New Bucket" button?
- Make sure you're on the **Storage** tab
- Check you have permissions (you should as project owner)

### Images not loading after upload?
- ✅ Confirm bucket is **Public**
- Check the URL format is correct
- Try opening the URL directly in a browser

### Need to resize images?
- Recommended: 1920px width for hero images
- 1200px width for gallery images
- Keep file sizes under 500KB for fast loading
- Use JPG format (better compression than PNG for photos)

---

## 💡 Pro Tips

1. **Optimize images before uploading:**
   - Use https://tinypng.com to compress
   - Resize to appropriate dimensions
   - Convert to JPG for photos, PNG for logos

2. **Organize with folders:**
   ```
   property-images/
   ├── hero/
   ├── gallery/
   ├── bedrooms/
   └── family/
   ```

3. **Use descriptive filenames:**
   - ✅ `master-bedroom-lake-view.jpg`
   - ❌ `IMG_1234.jpg`

---

Ready to upload? Let me know when you have the URLs and I'll update everything! 📸
