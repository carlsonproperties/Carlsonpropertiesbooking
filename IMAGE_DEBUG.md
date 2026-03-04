# Image Loading Debug Information

## ✅ What We Fixed (Feb 27, 2026)

### Problem
- Green placeholder boxes appearing on live deployment (carlsonproperties.co.nz)
- Images loading fine locally but failing in production

### Root Cause
The `figmaAssetPlugin` in `/vite.config.ts` was STILL ACTIVE and interfering with the Vite build process, even though we removed all `figma:asset/` imports.

### Solution Applied
1. **COMPLETELY REMOVED** the `figmaAssetPlugin` from `vite.config.ts` (previously it was just modified)
2. Verified NO `figma:asset/` imports exist anywhere in the codebase
3. All images now use direct Supabase Storage URLs from `/src/app/lib/images.ts`

## 📋 Image URL Format

All images are stored in Supabase Storage:
```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/[filename]
```

### Verification Steps
1. Open browser console on live site
2. Look for these console logs:
   - "Image URL for [filename]: https://..."
   - "Logo loaded successfully"
   - "Hero image loaded successfully: https://..."
3. If images still show as green:
   - Check Network tab for 404 errors
   - Verify Supabase bucket "Website Media" is PUBLIC
   - Check CORS settings on Supabase Storage

## 🔧 Next Deployment Steps

Since you're working in **Figma Make Browser**:
1. Figma Make will auto-sync changes to GitHub
2. Vercel will auto-deploy from GitHub
3. **CRITICAL:** In Vercel, do "Clear cache and redeploy" to remove old build artifacts

## 🎯 Image Files in Use

### Logo
- `AirBnB_Profile_Photo_9.png`

### Homepage
- Hero: `029_Open2view_ID584542-111_Jarden_Mile.jpg`
- Wellness: `032_Open2view_ID584542-111_Jarden_Mile.jpg`

### Bedrooms/Bathrooms
- All `.avif` files for bedroom/ensuite photos
- All `Open2view` `.jpg` files for professional photography

### Video
- `One eleven drone (1).mp4`

## ✅ Files Modified
- `/vite.config.ts` - REMOVED figmaAssetPlugin entirely
- `/src/app/components/CarlsonLogo.tsx` - Using direct Supabase URL
- `/src/app/lib/images.ts` - All images configured with Supabase URLs
