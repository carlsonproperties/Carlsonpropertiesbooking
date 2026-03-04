# 🧪 Quick Image URL Test

## Test Your Hero Image Right Now

Open this URL in your browser to see if the bucket is public:

```
https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg
```

### What You Should See:

✅ **SUCCESS:** The beautiful exterior property photo loads  
❌ **FAILURE:** Error message like "Object not found" or "Bucket not found"

---

## If You See an Error:

The bucket is **PRIVATE**. You need to make it **PUBLIC**.

### Steps to Fix:

1. **Login to Supabase:**  
   https://supabase.com/dashboard/project/hxprmevheigajzqehjgf

2. **Navigate to Storage:**  
   Click "Storage" in the left sidebar

3. **Find "Website Media" bucket:**  
   You should see it in the list of buckets

4. **Make it Public:**  
   - Click the **⋮** (three dots) next to "Website Media"
   - Select **"Make bucket public"**
   - Confirm

5. **Verify:**  
   Refresh the URL above - the image should now load!

---

## Test All Images

After fixing the bucket, visit your diagnostic page:

```
https://carlsonproperties.co.nz/image-test
```

This will test ALL images and show you exactly which ones are loading and which are failing.

---

## Alternative: Use Browser Console

1. Open your website: https://carlsonproperties.co.nz
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for error messages about images

You'll see logs like:
- ✅ `Image loaded successfully: https://...`
- ❌ `Hero image failed to load`

This tells you exactly which images are working!
