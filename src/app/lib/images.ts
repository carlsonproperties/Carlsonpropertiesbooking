/**
 * Property Images - Supabase Storage URLs
 * 
 * All images are stored in the "Website Media" bucket
 * URL Format: https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website Media/[filename]
 */

// ============================================
// 🔧 CONFIGURATION
// ============================================
const SUPABASE_PROJECT_ID = "hxprmevheigajzqehjgf";
const STORAGE_BUCKET = "Website Media"; // Bucket name (will be encoded in URL)

// Helper function to build Supabase Storage URL
const getImageUrl = (filename: string) => {
  // Encode both bucket and filename properly
  const encodedBucket = encodeURIComponent(STORAGE_BUCKET);
  const encodedFilename = encodeURIComponent(filename);
  const url = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${encodedBucket}/${encodedFilename}`;
  // Log URLs for debugging mobile image loading issues
  console.log(`📸 Image URL for "${filename}":`, url);
  return url;
};

// ============================================
// 🎨 LOGO & BRANDING
// ============================================
export const LOGO_IMAGE = getImageUrl("AirBnB_Profile_Photo_9.png");

// ============================================
// 🎥 DRONE VIDEO
// ============================================
export const DRONE_VIDEO = getImageUrl("One eleven drone (1).mp4");

// ============================================
// 🏠 HOMEPAGE IMAGES
// ============================================
export const HOME_IMAGES = {
  // Using your professional Open2View photography
  hero: getImageUrl("029_Open2view_ID584542-111_Jarden_Mile.jpg"), // Stunning exterior view
  wellness: getImageUrl("poolview.jpg"), // Pool/wellness area - Updated per user request
};

// ============================================
// 🖼️ ABOUT PAGE / GALLERY IMAGES
// ============================================
export const GALLERY_IMAGES = {
  hero: getImageUrl("Street facing.jpg"), // Exterior hero - Updated per user request
  kitchen: getImageUrl("043_Open2view_ID584542-111_Jarden_Mile.jpg"), // Modern kitchen
  pool: getImageUrl("032_Open2view_ID584542-111_Jarden_Mile.jpg"), // Pool area
  livingRoom: getImageUrl("039_Open2view_ID584542-111_Jarden_Mile.jpg"), // Living space
  exterior: getImageUrl("030_Open2view_ID584542-111_Jarden_Mile.jpg"), // Alternative exterior
  sauna: getImageUrl("045_Open2view_ID584542-111_Jarden_Mile.jpg"), // Spa/wellness
  bbq: getImageUrl("031_Open2view_ID584542-111_Jarden_Mile.jpg"), // Outdoor entertaining
};

// ============================================
// 🛏️ BEDROOM & BATHROOM IMAGES
// ============================================
export const BEDROOM_IMAGES = {
  bedroom1: getImageUrl("042_Open2view_ID584542-111_Jarden_Mile.jpg"), // Master bedroom
  ensuite1: getImageUrl("2fe3f719-ec39-4375-bac8-1d4a9fc86ef5 (1).avif"), // Master ensuite
  bedroom2: getImageUrl("053_Open2view_ID584542-111_Jarden_Mile.jpg"), // Second bedroom
  ensuite2: getImageUrl("b43eb65c-673f-4aee-bc95-1aca682c878b (2).avif"), // Second ensuite
  bedroom3: getImageUrl("367692e4-c62e-40da-bfc1-aa8c187b8637 (1).avif"), // Third bedroom
  ensuite3: getImageUrl("652445b7-4f14-4258-ab83-70799c8b9db8 (2).avif"), // Third ensuite
  bedroom4: getImageUrl("e45edcb9-9f7f-4c17-90da-49333758f5da (1).avif"), // Fourth bedroom
  ensuite4: getImageUrl("1ed13a04-082e-4f5b-b545-23802b10eb1d (1).avif"), // Fourth bedroom ensuite
  bedroom5: getImageUrl("058_Open2view_ID584542-111_Jarden_Mile.jpg"), // Fifth bedroom (twin room)
  ensuite5: getImageUrl("2dff177f-06c9-4be8-a2a5-f343298fa1b0 (1).avif"), // Fifth bedroom ensuite
  mainBathroom: getImageUrl("048_Open2view_ID584542-111_Jarden_Mile.jpg"), // Main bathroom
};

// ============================================
// 👨‍👩‍👧‍👦 FAMILY / MEET HOSTS IMAGES
// ============================================
export const FAMILY_IMAGES = {
  // Using your professional property shots as placeholders
  // Replace with actual family photos when available
  group: getImageUrl("029_Open2view_ID584542-111_Jarden_Mile.jpg"),
  outdoor: getImageUrl("031_Open2view_ID584542-111_Jarden_Mile.jpg"),
  kids: getImageUrl("032_Open2view_ID584542-111_Jarden_Mile.jpg"),
  highFive: getImageUrl("033_Open2view_ID584542-111_Jarden_Mile.jpg"),
  playing: getImageUrl("034_Open2view_ID584542-111_Jarden_Mile.jpg"),
};

// ============================================
// 📝 ADDITIONAL PROPERTY IMAGES
// Full collection of your Open2View photography
// ============================================
export const ALL_PROPERTY_IMAGES = [
  getImageUrl("029_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("030_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("031_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("032_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("033_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("034_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("035_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("036_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("037_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("038_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("039_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("040_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("041_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("042_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("043_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("044_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("045_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("046_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("047_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("048_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("049_Open2view_ID584542-111_Jarden_Mile.jpg"),
  getImageUrl("050_Open2view_ID584542-111_Jarden_Mile.jpg"),
];

/**
 * USAGE EXAMPLE:
 * 
 * import { HOME_IMAGES, GALLERY_IMAGES, DRONE_VIDEO, LOGO_IMAGE } from "../lib/images";
 * 
 * <img src={HOME_IMAGES.hero} alt="Hero" />
 * <img src={GALLERY_IMAGES.kitchen} alt="Kitchen" />
 * <video src={DRONE_VIDEO} />
 * <img src={LOGO_IMAGE} alt="Logo" />
 */