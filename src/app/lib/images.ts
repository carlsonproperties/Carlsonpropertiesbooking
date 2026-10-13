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
export const getImageUrl = (path: string) => {
  const encodedBucket = encodeURIComponent(STORAGE_BUCKET);
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
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
export const PROPERTY_CARD_IMAGE = getImageUrl("032_Open2view_ID584542-111_Jarden_Mile.jpg");

// ============================================
// 📖 GUEST INFO / HOUSE MANUAL
// ============================================
export const GUEST_INFO_IMAGES = {
  welcome: getImageUrl("036_Open2view_ID584542-111_Jarden_Mile.jpg"),
  checkout: getImageUrl("032_Open2view_ID584542-111_Jarden_Mile.jpg"),
};

/**
 * ⚠️ ASSETS STILL MISSING FROM THIS BUCKET
 *
 * These lived in the retired project `hlemnlibokutxjfaviaz` (bucket "Media"),
 * which now answers every request with {"error":"DatabaseTimeout"} — so each
 * one is a broken link on the live site today.
 *
 * To restore one: upload the file to the "Website Media" bucket and swap the
 * `null` for `getImageUrl("<filename>")`. Everything that reads these already
 * degrades gracefully when the value is null, so a partial migration is safe
 * and nothing needs changing at the call sites.
 *
 * Four how-to videos:  Pool Cover How To.mp4, Sauna How To.mp4,
 *                      Air Con How To.mp4, open door How To.mp4
 * Four how-to stills:  2_4d919f19-1ce7-4f1b-af30-a4a0ba91f92b_2.png,
 *                      a61b55a1-648d-4f89-a5b7-ad1b4574a3f4 (1).jpg,
 *                      91320ece-1cd2-4e0b-86a3-c54d5ec2637a.avif,
 *                      6502edca-88c7-447b-98b9-d4a39d843b61.jpg
 * One explore still:   1314bd58-da8d-4483-b143-4633f11ee4e9 (1).jpg
 * The guide book PDF:  ONE_ELEVEN_ON_THE_MILE_DIGITAL_GUIDE_BOOK-compressed (1).pdf
 */
export const HOWTO_MEDIA: Record<string, { image: string | null; video: string | null }> = {
  poolCover: { image: null, video: null },
  sauna: { image: null, video: null },
  airCon: { image: null, video: null },
  frontDoor: { image: null, video: null },
};

/** Explore-Taupō card still. Null until re-uploaded (see note above). */
export const EXPLORE_IMAGE: string | null = null;

/** The downloadable house manual. Null hides the download button entirely,
 *  which is better than handing a guest a link that times out. */
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