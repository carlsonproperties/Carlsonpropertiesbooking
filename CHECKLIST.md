# ✅ Image Upload Checklist

## Current Status: 🔴 Images Not Uploaded

The green boxes appear because **your image files don't exist in Supabase Storage yet**.

---

## Step-by-Step Fix:

### ✅ Step 1: Access Supabase Storage
- [ ] Go to https://supabase.com/dashboard/project/hxprmevheigajzqehjgf/storage/buckets
- [ ] Login to your Supabase account

### ✅ Step 2: Create/Verify Bucket
- [ ] Check if "Website Media" bucket exists
- [ ] If not, create it with exact name: `Website Media`
- [ ] Make sure it's set to **PUBLIC** (not private)

### ✅ Step 3: Upload Core Images
Upload these files first to fix the homepage:

- [ ] `029_Open2view_ID584542-111_Jarden_Mile.jpg` - Hero image
- [ ] `poolview.jpg` - Wellness area photo
- [ ] `One eleven drone (1).mp4` - Drone video
- [ ] `AirBnB_Profile_Photo_9.png` - Logo

### ✅ Step 4: Test Core Images
- [ ] Visit https://carlsonproperties.co.nz/image-test
- [ ] All 4 core images should show ✅ green checkmarks
- [ ] If ❌ red X, check filename spelling exactly

### ✅ Step 5: Upload Remaining Images
- [ ] All Open2View photos (029-058)
- [ ] Bedroom ensuite images (.avif files)
- [ ] Meet Hosts photos (IMG_*.jpg)

### ✅ Step 6: Final Verification
- [ ] Visit https://carlsonproperties.co.nz
- [ ] Homepage hero image appears (not green box)
- [ ] Scroll down - wellness area image appears
- [ ] Visit /about page - gallery images load
- [ ] All green boxes are gone! 🎉

---

## Quick Test URL

After uploading the hero image, this URL should work:
```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
```

Copy that URL into your browser. You should see the property photo, not a 404 error.

---

## Need Help Finding Your Images?

Your images might be:
1. In your Downloads folder
2. Emailed to you by Open2View photographer
3. In a Google Drive / Dropbox shared folder
4. On your phone's photo library
5. Download from your current Airbnb listing

**Don't have them?** Contact the Open2View photographer who shot your property.

---

## Status Indicator

- 🔴 **Before uploading:** All images return 404 errors
- 🟡 **Partially uploaded:** Some images work, others 404
- 🟢 **All uploaded:** /image-test shows all ✅ checkmarks
