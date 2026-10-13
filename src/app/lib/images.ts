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

// Helper function to build Supabase Storage URL.
// A path may contain "/" for a folder (e.g. "email/banner.jpg"); each segment
// is encoded separately so the slash survives.
//
// Commas are left literal. encodeURIComponent escapes them to %2C, but a comma
// is a legal sub-delimiter inside a path segment and the storage URLs that are
// known to work (e.g. "A swim, even in July.jpg") carry it unescaped. Percent-
// encoding a reserved character is not guaranteed to be equivalent, so matching
// the form that is known to resolve is the safe choice.
const encodeSegment = (segment: string) =>
  encodeURIComponent(segment).replace(/%2C/g, ",");

export const getImageUrl = (path: string) => {
  const encodedBucket = encodeSegment(STORAGE_BUCKET);
  const encodedPath = path.split("/").map(encodeSegment).join("/");
  return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${encodedBucket}/${encodedPath}`;
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
  bedroom1: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom%201.avif", // Master bedroom
  ensuite1: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/bed1ensuite.png", // Master ensuite
  bedroom2: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom%202.jpg", // Second bedroom
  ensuite2: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom%202%20Ensuite.avif", // Second ensuite
  bedroom3: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom%203.png", // Third bedroom
  ensuite3: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/bedroom%203%20ensuite1.1.avif", // Third ensuite
  bedroom4: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom%204.jpg", // Fourth bedroom
  ensuite4: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/mainbathroom.avif", // Fourth bedroom ensuite
  bedroom5: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Bedroom5.1.jpg", // Fifth bedroom (twin room)
  ensuite5: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Main%20Bathroom.avif", // Fifth bedroom ensuite
  mainBathroom: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Main%20Bathroom.avif", // Main bathroom
};

// ============================================
// 👨‍👩‍👧‍👦 FAMILY / MEET HOSTS IMAGES
// ============================================
export const FAMILY_IMAGES = {
  banner: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/family%20cover%20photo.jpg", // Hero banner
  group: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/family1.jpg", // The Carlson Group
  highFive: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/family2high5s.jpg", // Quote banner
  playing: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/familyswing.jpg", // Family playing
  outdoor: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/barstools.png", // Excellence background
  kids: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/rubyleolyingdown.jpg", // Our little explorers
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

// ============================================
// 🛒 BOOKING FLOW
// ============================================
export const PROPERTY_CARD_IMAGE = getImageUrl("lake views.jpg");

// ============================================
// 📖 GUEST INFO / HOUSE MANUAL
// ============================================
export const GUEST_INFO_IMAGES = {
  welcome: getImageUrl("street facing jordanphotos.jpg"),
  /** The circular mark used to close out the manual. */
  checkout: getImageUrl("one eleven logo circle.png"),
};

/**
 * How-to media, re-uploaded to this bucket after the retired
 * `hlemnlibokutxjfaviaz` project went away.
 *
 * The stills are deliberately null: each video carries its own first frame, so
 * a separate poster would only be a second file to keep in sync. The player
 * falls back to a placeholder panel when both are null, so a missing entry
 * never renders as a broken image.
 */
export const HOWTO_MEDIA: Record<string, { image: string | null; video: string | null }> = {
  poolCover: { image: null, video: getImageUrl("pool cover.mp4") },
  sauna: { image: null, video: getImageUrl("sauna-video.mp4") },
  airCon: { image: null, video: getImageUrl("Air Conditioning.mp4") },
  frontDoor: { image: null, video: getImageUrl("doorlock-video.mp4") },
};

/** Explore-Taupō card still. */
export const EXPLORE_IMAGE: string | null = getImageUrl("fairygardenwalk.jpg");

/**
 * The downloadable house manual. Still missing: it lived in the retired
 * project and has not been re-uploaded. Null hides the download button
 * entirely, which is better than handing a guest a link that times out —
 * swap in getImageUrl("<filename>.pdf") once it is in the bucket.
 */
export const GUIDE_BOOK_PDF: string | null = null;

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