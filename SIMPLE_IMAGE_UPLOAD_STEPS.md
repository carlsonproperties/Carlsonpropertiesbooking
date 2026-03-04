# ✅ SIMPLE: Upload Your Property Images to Supabase

## 🎯 Your Site is Now Using Temporary Fallback Images

Your site currently shows your Shopify logo image as a placeholder. To show your actual property photos, follow these steps:

---

## Step 1: Go to Supabase Storage

1. Visit: https://supabase.com/dashboard
2. Sign in to your account
3. Click on your **Carlson Properties** project
4. Click **Storage** in the left sidebar

---

## Step 2: Create a PUBLIC Bucket

1. Click the green **"New Bucket"** button
2. **Bucket name:** `property-images`
3. **Toggle "Public bucket" to ON** ✅ (VERY IMPORTANT!)
4. Click **"Create bucket"**

---

## Step 3: Upload Your Images

1. Click on the `property-images` bucket you just created
2. Click **"Upload files"**
3. Upload these photos (use these exact names or similar):

### Required Images:

```
✅ logo.png (your property logo)
✅ hero-main.jpg (main homepage hero image)
✅ hero-wellness.jpg (pool/spa/gym area)
✅ gallery-kitchen.jpg
✅ gallery-pool.jpg
✅ gallery-living-room.jpg
✅ gallery-exterior.jpg
✅ gallery-sauna.jpg
✅ gallery-bbq.jpg
✅ bedroom-1.jpg
✅ bedroom-2.jpg
✅ bedroom-3.jpg
✅ bedroom-4.jpg
✅ bedroom-5.jpg
✅ ensuite-1.jpg
✅ ensuite-2.jpg
✅ ensuite-3.jpg
✅ main-bathroom.jpg
✅ family-group.jpg (your family photo for Meet Hosts page)
✅ family-outdoor.jpg
✅ family-kids.jpg
✅ family-highfive.jpg
✅ family-playing.jpg
```

**Tip:** You can rename your files to match these names, or use your own names (then just tell me what they are).

---

## Step 4: Get Your Image URLs

After uploading, each image will have a URL like this:

```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/property-images/hero-main.jpg
```

### Easy Way to Get URLs:

1. Click on any uploaded image in Supabase
2. Click **"Get URL"** or **"Copy URL"**
3. Save it in a text file

---

## Step 5: Tell Me What You Uploaded

Once you've uploaded your images, just share the filenames with me like this:

```
LOGO: logo.png
HERO: exterior-shot.jpg  
WELLNESS: pool-area.jpg
KITCHEN: kitchen-photo.jpg
(etc.)
```

**Then I'll update the code to use your actual images!** 🎉

---

## 🚀 Alternative: Quick Batch URL Method

If you want to do this yourself, open the file:

**`/src/app/lib/images.ts`**

And replace the filenames in the `getImageUrl()` calls with your actual uploaded filenames.

For example, change:
```typescript
hero: getImageUrl("hero-main.jpg")
```

To:
```typescript
hero: getImageUrl("my-actual-hero-photo.jpg")
```

---

## ⚡ Important Tips:

1. **Make bucket PUBLIC** - Otherwise images won't load on your website
2. **Optimize images** - Resize to max 1920px wide and compress at https://tinypng.com
3. **Use JPG for photos** - Better compression than PNG
4. **Use PNG for logos** - Better for graphics with transparency

---

## 🆘 Troubleshooting

**Images uploaded but not showing?**
- Check the bucket is **Public** (not Private)
- Make sure the filenames match exactly (case-sensitive)
- Try opening the URL directly in your browser to test

**Can't create bucket?**
- You must be the project owner
- Check you're in the right project

**Need help?**
Just paste the filenames here and I'll update everything for you! 📸

---

**Your site will look AMAZING with your real property photos!** 🏠✨
