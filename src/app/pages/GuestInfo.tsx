import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Coffee, 
  MapPin, 
  Wifi, 
  Key, 
  Wind, 
  Waves, 
  Utensils, 
  ExternalLink,
  ChevronRight,
  Play,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Globe,
  Info,
  Car,
  ShieldAlert,
  ShieldCheck,
  Eye,
  LogOut,
  Dumbbell,
  Trash2,
  Droplets,
  Tv,
  QrCode,
  Bus,
  Plane,
  Bike,
  Star,
  Baby,
  Users,
  GlassWater,
  Stethoscope,
  PlusCircle,
  VolumeX,
  AlertTriangle,
  Calendar,
  Heart,
  Tag,
  MessageSquare,
  Menu
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { guestInfoSchema } from "../lib/schemas";

const PDF_URL = "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/ONE_ELEVEN_ON_THE_MILE_DIGITAL_GUIDE_BOOK-compressed%20(1).pdf";
const LAST_UPDATED = "February 26, 2026";

const SECTIONS = [
  {
    id: "welcome",
    title: "A Warm Welcome",
    icon: <Heart size={20} />,
    content: {
      header: "A Warm Welcome",
      text: "We're thrilled to welcome you as our guest, our mission is to make you feel at home, even when you're away.\n\nWe're here to ensure your time in Taupō is nothing short of amazing. We look forward to welcoming you or answering any questions you may have prior to your stay.",
      signature: "Matt & Ash",
      image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/036_Open2view_ID584542-111_Jarden_Mile.jpg",
      contact: [
        { icon: <Phone size={18} />, value: "027 697 7961" },
        { icon: <Mail size={18} />, value: "bookings@carlsonproperties.co.nz" }
      ]
    }
  },
  {
    id: "arrival",
    title: "Arrival & WiFi",
    icon: <Key size={20} />,
    content: {
      header: "Getting Settled",
      address: "111 Jarden Mile, Taupō",
      network: "One Eleven Guest",
      password: "****",
      wifiDisclaimer: "The WiFi password is sent out to you 3 days prior to your check-in date along with your door code (which is always the last 4 digits of the cellphone used to make the booking).",
      checkInTime: "3:00 PM",
      pinInfo: "Your Unique 4 Digit Pin will be messaged to you before check in. This code provides secure access to the property and will expire upon your departure.",
      earlyCheckInBlurb: "While we would love to offer an earlier check-in, our team requires the full allocated time to ensure the property is meticulously prepared to our luxury standards. We will, however, message you immediately if the property is available sooner than 3:00 PM."
    }
  },
  {
    id: "instructions",
    title: "How-To Guides",
    icon: <Play size={20} />,
    content: {
      header: "Interactive Instructions",
      tabs: ["Pool Cover", "Sauna", "Air Con & Fire", "Smart Lock"],
      data: {
        "Pool Cover": {
          image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/2_4d919f19-1ce7-4f1b-af30-a4a0ba91f92b_2.png",
          video: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/Pool%20Cover%20How%20To.mp4", 
          steps: [
            "Insert and Unlock: Insert the key into the control panel.",
            "Open the Cover: Turn the key one time towards the I (1).",
            "Remove all toys before closing: To ensure the cover closes correctly remove everything from pool.",
            "Close the Cover: Turn the key towards II (2) and hold until the cover reaches the end."
          ]
        },
        "Sauna": {
          image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/a61b55a1-648d-4f89-a5b7-ad1b4574a3f4%20(1).jpg",
          video: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/Sauna%20How%20To.mp4", 
          steps: [
            "Preheat the Sauna: Turn on the sauna heater and set the temperature dial. Allow 15 minutes for preheating.",
            "Enjoy Your Sauna session: Enter the sauna with a towel to sit on. Use the control panel for lights and bluetooth.",
            "Cool Down and Turn Off: Exit the sauna and cool down with a cold shower. Turn off the heater after use."
          ]
        },
        "Air Con & Fire": {
          image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/91320ece-1cd2-4e0b-86a3-c54d5ec2637a.avif",
          video: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/Air%20Con%20How%20To.mp4", 
          steps: [
            "AC Panel: Located in the hallway. Select mode and temperature.",
            "Modes: Sunlight icon for heat, Snowflake icon for cooling.",
            "Gas Fire: Remote is in the kitchen cutlery drawer. Takes ~1 min to ignite. Turn off overnight for silence."
          ]
        },
        "Smart Lock": {
          image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/6502edca-88c7-447b-98b9-d4a39d843b61.jpg",
          video: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/open%20door%20How%20To.mp4", 
          steps: [
            "Wake Keypad: Touch the screen to illuminate the numbers.",
            "Enter Code: Key in your unique 4-digit PIN.",
            "Wait for Beep: The lock will chime and the bolt will retract automatically.",
            "Push to Open: Once unlocked, turn the handle and push the door to enter."
          ]
        }
      }
    }
  },
  {
    id: "attractions",
    title: "Explore Taupō",
    icon: <MapPin size={20} />,
    content: {
      header: "Local Attractions",
      categories: [
        {
          label: "ADULTS – Relax & Indulge",
          icon: <Sparkles size={18} />,
          items: [
            { name: "Wairakei Terraces", link: "https://wairakeiterraces.co.nz", image: "https://static.wixstatic.com/media/5813b5_556156fabae84a70a4d6893eec144ba3~mv2.jpg/v1/fill/w_1898,h_804,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5813b5_556156fabae84a70a4d6893eec144ba3~mv2.jpg", desc: "14+ Thermal Baths & Maori culture experience." },
            { name: "Kinloch Golf Course", link: "https://kinlochgolf.co.nz", image: "https://www.thekinlochclub.com/media/1749/kinlochclubtauponz-18th-green-12-950-633px.jpg?mode=crop&width=1920&height=700&quality=80", desc: "Jack Nicklaus designed world-class golf." },
            { name: "Craters MTB Park", link: "https://cratersofthemoon.co.nz/mountain-bike-park", image: "https://www.lovetaupo.com/media/pvfhf23n/bas-vaea-at-craters-mtb-park.FrwVMA.jpg?width=1500", desc: "Extensive network of world-class mountain bike trails." },
            { name: "Confinement Escape Rooms", link: "https://confinement.co.nz", image: "https://veronikasadventure.com/wp-content/uploads/2023/12/escape-room-experience-taupo-the-wild-tea-party.jpg", desc: "Award-winning escape room experiences." },
            { name: "BFT Taupo", link: "https://www.bodyfittraining.com/club/taupo", image: "https://bookmestatic.net.nz/bookme-product-images/products/9058/9058_image4_IOTZQkEhmo_TUBU_Untitled2.jpg", desc: "Science-based group strength and conditioning." },
            { name: "Doughboats Taupo", link: "https://doughboats.co.nz", image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/28/5b/20.jpg", desc: "Self-drive doughnut boats on Lake Taupō." },
            { name: "Mt Tauhara Walk", link: "https://www.doc.govt.nz/parks-and-recreation/places-to-go/waikato/places/taupo-area/things-to-do/tracks/mount-tauhara-track/", image: "https://longwhitegypsy.com/wp-content/uploads/2018/04/Mt-Tauhara-Guide-Featured-Image.jpg", desc: "Panoramic views of the lake and mountains." },
            { name: "Living Waters Spa (DeBretts)", link: "https://www.debretts.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQVMbUfE0ylQjUQdsWQHnBoGcP2rliKBE35A&s", desc: "Mineral pools and therapeutic spa treatments." },
            { name: "Rangatira Point Track", link: "https://www.tauponz.com/explore/walks-and-hikes/rangatira-point-track/", image: "https://admin.planmywalk.nz/assets/UserReviewImages/5a39c927682401599000fc0e2e802bcc515c96e3__FocusFillWyIwLjAwIiwiMC4wMCIsMTkyMCw2MDBd.jpeg", desc: "Beautiful lakeside walk with swimming spots." }
          ]
        },
        {
          label: "TEENS & KIDS – Adventure",
          icon: <Wind size={18} />,
          items: [
            { name: "The Edge Rockwall", link: "https://www.tauponz.com/visit/things-to-do/the-edge-rockwall/", image: "https://www.lovetaupo.com/remote.axd?https://register.newzealand.com/sites/default/files/product_images/2022-07/Rockwall%20hanging.jpg?width=1920", desc: "Indoor climbing wall for all skill levels." },
            { name: "Whakapapa / Mt Ruapehu", link: "https://www.mtruapehu.com", image: "https://www.visitruapehu.com/media/Down%20groomer%20-%20Visit%20Ruapehu.jpg", desc: "NZ's largest ski area and mountain adventures." },
            { name: "The Landing", link: "https://www.thelanding.co.nz", image: "https://images.squarespace-cdn.com/content/v1/66836ec3c5316542ae46e44d/1721165499126-TIP24O548G9TEAH7RUK0/TLDZ-54.jpg", desc: "Trampoline park, ninja course, and bowling." },
            { name: "The Cave VR Taupo", link: "https://www.thecave.nz", image: "https://images.squarespace-cdn.com/content/v1/647f1ebdc616112036a070db/b089a232-c3b8-44d9-9697-0f839c5dc91c/The+Cave+Virtual+Reality+VR+Games.jpg", desc: "Cutting-edge virtual reality experiences." },
            { name: "Swingers Putt Putt", link: "https://www.swingersputtputt.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUZ2Up5Ns0G6O2XAk8s1UQNWO6Dm2ujpmHNw&s", desc: "Mini-golf fun for the whole family." },
            { name: "AC Baths", link: "https://www.taupodc.govt.nz/recreation/sport-and-recreation-centres/ac-baths", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzX74Yr2MirQh15RFvCHGBcEVj51SU0gZQ7g&s", desc: "All-weather hot pools and leisure centre." },
            { name: "Pedal Boats Wharewaka", link: "https://www.taupowatersports.co.nz", image: "https://static.wixstatic.com/media/76de7c_0f0df0ac3942470ba713d82706e24f98~mv2.jpg/v1/fit/w_285,h_190,q_90,enc_avif,quality_auto/76de7c_0f0df0ac3942470ba713d82706e24f98~mv2.jpg", desc: "Fun pedal boat rentals on the lake." },
            { name: "Taupo Watersports", link: "https://www.taupowatersports.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIweA6C-C2uxNHjv4ME4Uoxva1R1tWFplmcQ&s", desc: "Kayaks, paddleboards, and water activities." },
            { name: "Spa Park BMX & Pump Track", link: "https://www.tauponz.com/explore/parks-and-playgrounds/spa-park/", image: "https://www.lovetaupo.com/media/5i1jfxhu/taupo-bike-park-spa-thermal-park.GNsz_A.jpg", desc: "World-class pump track and bike park." }
          ]
        },
        {
          label: "TODDLERS – Fun & Play",
          icon: <Baby size={18} />,
          items: [
            { name: "Tongariro Playground", link: "https://www.tauponz.com/explore/parks-and-playgrounds/tongariro-domain/", image: "https://www.taupodc.govt.nz/repository/libraries/id:25026fn3317q9slqygym/hierarchy/Council/Projects/Tongariro%20playground/Completed%20playground/DJI_0038.jpg", desc: "Taupō's premier destination playground." },
            { name: "Toddler Time Gymnastics", link: "https://www.taupogymnastics.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDN-3efS7tQCgAiltZGor0MzE3bsC3QIaMw&s", desc: "Fun and safe gymnastics for the little ones." },
            { name: "Mind Junction", link: "https://www.mindjunction.co.nz", image: "https://www.lovetaupo.com/media/2961883/mind-junction-hero.jpg?width=1920&format=jpg&quality=70", desc: "Activity park with puzzles, mazes, and more." },
            { name: "Lilliput Farm", link: "https://www.lilliputfarm.co.nz", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/3f/6b/de/photo3jpg.jpg?w=1200&h=-1&s=1", desc: "Animal park and fun farm experience." },
            { name: "Fairy Garden Walk", link: "https://www.tauponz.com/explore/walks-and-hikes/whangamata-stream-walk/", image: "https://scontent.fhlz4-1.fna.fbcdn.net/v/t39.30808-6/476369419_2715110355337867_4690484090148010971_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_ohc=ocCNYrEJIl8Q7kNvwGlWv0I&_nc_oc=Adn5VHl0ALBkwK40_apna5zx6woYu41_sL1P-ddzf8lWRgtjNPfyY3SHGBLknyqx82A&_nc_zt=23&_nc_ht=scontent.fhlz4-1.fna&_nc_gid=3tHJRXgbjFPnVwWGUXJEkA&oh=00_AftMrSOWGnoCR8vZboXE4MMfpQomYTcngcapWGODFzxSDw&oe=699B4B97", desc: "Magical walk along the Whangamata Stream." },
            { name: "Huka Prawn Park", link: "https://hukaprawnpark.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9PO_an7v7KReSljKYAGPceMaW4Y9JSvDDw&s", desc: "Prawn fishing and water-based fun." },
            { name: "Lions Walk Taupo", link: "https://www.tauponz.com/explore/walks-and-hikes/lions-walk/", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/slideshow__smartport/public/pics/listings/images/lionswalk.jpg?itok=NVUhYhnO", desc: "Accessible lakefront path perfect for buggies." }
          ]
        }
      ]
    }
  },
  {
    id: "dining",
    title: "Dining & Drinks",
    icon: <Coffee size={20} />,
    content: {
      header: "Our Recommendations",
      tabs: ["Restaurants", "Cafes", "Bars"],
      data: {
        Restaurants: [
          { name: "The Brantry", link: "https://thebrantry.co.nz", image: "https://dzpdbgwih7u1r.cloudfront.net/96a7138e-4766-48d0-8239-4746c626be5f/9c708dd6-c32c-4e86-82d0-bd01e1b39318/9c708dd6-c983-4847-b7ee-2b3bf57c91a2/w1200h967-7df988c2244435af03de614944530290.png", desc: "Fine dining in a historic villa setting." },
          { name: "Embra", link: "https://www.embra.nz", image: "https://www.lovetaupo.com/media/rmqgg30n/embra-food-2-1.GTjohw.png?width=800", desc: "Modern Kiwi cuisine with French techniques." },
          { name: "The Bistro Taupo", link: "https://www.thebistrotaupo.co.nz", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/90/44/94/the-bistro.jpg?w=900&h=500&s=1", desc: "Honest, fresh and seasonal local produce." },
          { name: "Bistro Lago (Hilton)", link: "https://www.hilton.com/en/hotels/tnpwaqq-hilton-taupo/dining/", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/aa/e5/f2/dining-shared-at-bistro.jpg", desc: "Sophisticated dining with stunning lake views." },
          { name: "Lionel’s Taupo", link: "https://lionelstaupo.co.nz", image: "https://www.lovetaupo.com/media/id1klt0a/lionels-1-1.jpg?width=1920&format=jpg&quality=70", desc: "Premium charcoal-grilled dining experience." },
          { name: "The Plateau Taupo", link: "https://theplateau.co.nz", image: "https://plateautaupo.co.nz/wp-content/uploads/2025/06/Plateau-new-menu-05.25-That-Green-Olive-176-1-scaled.jpg", desc: "Contemporary Kiwi cuisine & craft beer." },
          { name: "Roquette Taupo", link: "https://roquette.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9v7kKHOo_eG0cSgeRz58vBON5cs0FsY75A&s", desc: "European-inspired bistro dining." },
          { name: "Sorrento Taupo", link: "https://sorrentotaupo.co.nz", image: "https://bookmestatic.net.nz/bookme-product-images/products/7983/7983_image1_3l0T3FMJWC_QSOC_sorrento.jpg", desc: "Authentic Italian flavors in Taupō." },
          { name: "Incredible India", link: "https://www.incredibleindia.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxlp_VROSQr7n30KWBXh5O4FolXRt_sJ-Dug&s", desc: "Traditional Indian cuisine with a modern twist." },
          { name: "Lonestar", link: "https://www.lonestar.co.nz/restaurants/taupo", image: "https://www.firsttable.co.nz/_next/image?url=https%3A%2F%2Fimages.firsttable.net%2F1292x800%2Fpublic%2Frestaurant%2F2446d9d000%2FLonestar5642-1.jpg&w=3840&q=60", desc: "Legendary hospitality and generous portions." }
        ],
        Cafes: [
          { name: "L’Arté Café & Gallery", link: "https://www.lartecafe.co.nz", image: "https://images.squarespace-cdn.com/content/v1/5c062595b98a783e26690c62/1545453228163-GJ8NEADTL6NMTHCRFK48/Westermanos-0588.jpg", desc: "Unique edible art experience in a garden gallery." },
          { name: "Replete Café", link: "https://repletecafe.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8ZE6VAPnncQ3nBgazE_Yqp0Ub-khN5AL4Q&s", desc: "Gourmet food and exceptional coffee." },
          { name: "Industrie French Kitchen", link: "https://industrie.co.nz", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/36/ed/53/counter.jpg?w=400&h=300&s=1", desc: "Authentic French pastries and cafe classics." },
          { name: "The Cozy Corner", link: "https://www.thecozycorner.co.nz/", image: "https://dogfriendlynewzealand.co.nz/wp-content/uploads/2021/01/cozy-corner-.jpg", desc: "Warm hospitality and delicious local fare." },
          { name: "Baked With Love", link: "https://bakedwithlove.co.nz/", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/18/9d/90/our-shipping-containers.jpg?w=900&h=500&s=1", desc: "Artisanal bakery and specialty coffee." },
          { name: "Victoria’s Café", link: "https://www.victorias.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT90t2oUP5WaZeWTDCaFhROaFqWK3rH8skIdQ&s", desc: "Lively lakefront cafe atmosphere." },
          { name: "Café Baku", link: "https://cafebaku.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR814SrJG0CR5sNxPmu9BtOlNZUDoJVkpWrQQ&s", desc: "Stunning lake views and great cabinet food." },
          { name: "Kefi Café", link: "https://www.lovetaupo.com/en/operators/kefi-cafe/", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUuEYYjBII_QQu3YLqDbHSFtEj5Tic_fd9Xg&s", desc: "Vibrant cafe with a Mediterranean touch." },
          { name: "The Storehouse", link: "https://www.lovetaupo.com/en/operators/the-storehouse-taupo/", image: "https://www.lovetaupo.com/media/2958424/the-storehouse-cafe-coffee-friends-eating-breakfast.jpg", desc: "Trendy industrial vibe with great food." }
        ],
        Bars: [
          { name: "Finn’s Bistro & Beer Garden", link: "https://www.finnsbistro.co.nz", image: "https://core50.nz/wp-content/uploads/2021/05/JPEG_JM_Core50_Finns_0005.jpg", desc: "Classic beer garden with local brews." },
          { name: "Vine Eatery & Bar", link: "https://www.vineeatery.co.nz", image: "https://www.lovetaupo.com/media/hsidmhmi/vine-eatery-restaurant.jpg", desc: "Tapas and Mediterranean shared dining." },
          { name: "The Deck", link: "https://www.thedecktaupo.co.nz", image: "https://www.lovetaupo.com/media/2960018/the-deck-bar-taupo-13.jpg", desc: "Elevated lakefront bar with great views." },
          { name: "Jolly Good Fellows", link: "https://www.jollygoodfellows.co.nz", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/full__smartport/public/pics/listings/images/jolly_good_fellows_-_outdoor_seating_new.png?itok=9-BUeGF4", desc: "British-style pub with garden bar." },
          { name: "Mavericks", link: "https://www.mavericksgastropub.co.nz/our-story", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/full__smartport/public/pics/listings/images/mavericks_the_landing_2.jpg?itok=3Ef4wy03", desc: "Modern gastropub at The Landing." },
          { name: "Pub N Grub", link: "https://www.pubngrub.co.nz/contact-10", image: "https://static.wixstatic.com/media/707728_6b9c495a410542518fe8e87c57319bd8~mv2.jpg/v1/fill/w_640,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/707728_6b9c495a410542518fe8e87c57319bd8~mv2.jpg", desc: "Casual local pub with great deals." },
          { name: "Jimmy Coops", link: "https://www.jimmycoops.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TeQWBX8xJYAH3o-XGFL08XBJrvqZ-XQx6g&s", desc: "Lakefront burger bar and craft beer." },
          { name: "2 Mile Sailing Club", link: "https://www.2milebay.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9y3mDeCchrXE4TMDFvFhV23W8bjfXD3g17Q&s", desc: "Legendary pizza and drinks right on the water." }
        ]
      }
    }
  },
  {
    id: "house-rules",
    title: "House Rules",
    icon: <ShieldAlert size={20} />,
    content: {
      header: "House Rules",
      image: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/jC_111JardenMile_02.jpg",
      text: "Welcome to our first Airbnb build. Your respect and care for our home play a vital role in its success; by fostering a positive experience together, we can keep this journey going for many guests to enjoy.",
      rules: [
        { title: "Respect the Property", desc: "Treat the home and its furnishings with care." },
        { title: "No Smoking", desc: "Smoking is not permitted inside the property." },
        { title: "No Pets", desc: "Pets are not allowed on the premises." },
        { title: "Quiet Hours", desc: "Please observe quiet hours from 10 PM to 7 AM." }
      ]
    }
  },
  {
    id: "emergency",
    title: "Emergency",
    icon: <AlertTriangle size={20} />,
    content: {
      header: "Emergency Contacts",
      image: "https://images.unsplash.com/photo-1697952431905-9c8d169d9d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwYW1idWxhbmNlfGVufDF8fHx8MTc3MjEwMDk0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      primary: "CALL 111",
      contacts: [
        { name: "Medical Centre", address: "117 Te Heuheu Street", phone: "07 378 4080", icon: <Stethoscope size={18} /> },
        { name: "Taupō Hospital", address: "38 Kōtare Street", phone: "07 376 1000", icon: <PlusCircle size={18} /> }
      ]
    }
  },
  {
    id: "departure",
    title: "Check-out",
    icon: <LogOut size={20} />,
    content: {
      header: "Departure Guide",
      image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/1314bd58-da8d-4483-b143-4633f11ee4e9%20(1).jpg",
      checklist: [
        "Load & start the dishwasher",
        "Turn off lights and appliances",
        "Please take rubbish out to the bins",
        "Ensure all windows/doors are locked"
      ],
      doorCode: "Your unique door code will expire shortly after your 10:00 AM check-out time."
    }
  },
  {
    id: "thanks",
    title: "Thank You",
    icon: <Sparkles size={20} />,
    content: {
      header: "Thank You",
      image: "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/032_Open2view_ID584542-111_Jarden_Mile.jpg",
      text: "Thank you for choosing to stay with us. We hope you have a wonderful time in Taupō and create memories that last a lifetime.",
      contact: [
        { icon: <Phone size={18} />, value: "027 697 7961" },
        { icon: <Mail size={18} />, value: "bookings@carlsonproperties.co.nz" }
      ]
    }
  }
];

export function GuestInformation() {
  const [activeTab, setActiveTab] = useState(SECTIONS[0].id);
  const [diningSubTab, setDiningSubTab] = useState("Restaurants");
  const [instructionSubTab, setInstructionSubTab] = useState("Pool Cover");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeSection = SECTIONS.find(s => s.id === activeTab) || SECTIONS[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#fdfcf8] min-h-screen selection:bg-[#9DA07E] selection:text-white font-sans">
      <SEO 
        title="Guest Information & Digital Guidebook"
        description="Complete guest guide for One Eleven Taupo accommodation. WiFi details, check-in instructions, local attractions, dining recommendations, and property amenities. Your digital guide to Taupo."
        keywords="taupo guest information, one eleven guide, taupo accommodation guide, taupo travel guide, things to do taupo, taupo restaurants, taupo attractions, taupo wifi, taupo check in, taupo digital guidebook, taupo holiday home guide"
        url="/guest-info"
        schemaData={guestInfoSchema}
      />
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled ? "py-4 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100" : "py-8 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="hover:scale-105 transition-transform duration-500">
            <CarlsonLogo dark={true} />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {["Property", "Meet Hosts", "Guest Info"].map((item) => (
              <Link 
                key={item}
                to={item === "Guest Info" ? "/guest-info" : item === "Meet Hosts" ? "/meet-hosts" : "/about"} 
                className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all ${
                  item === "Guest Info" ? "text-[#9DA07E]" : "text-slate-500 hover:text-[#9DA07E]"
                }`}
              >
                {item}
              </Link>
            ))}
            <Link 
              to="/owner-login"
              className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 hover:text-[#9DA07E] transition-all"
            >
              Owner Portal
            </Link>
            <Link 
              to="/book" 
              className="bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#9DA07E] hover:shadow-xl hover:shadow-[#9DA07E]/20 transition-all"
            >
              Book Direct
            </Link>
          </div>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden p-2 rounded-full text-slate-900 hover:bg-slate-100 transition-colors`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sticky Sub-Nav */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 z-[90] bg-[#fdfcf8] border-b border-slate-100 shadow-sm">
        <div className="px-6 py-4">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black text-[#9DA07E] mb-3">Guide Chapters</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  const element = document.getElementById('guide-content');
                  if (element) {
                    const offset = 180; 
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 border-2 ${
                  activeTab === section.id 
                    ? "bg-white border-[#9DA07E] text-[#9DA07E] shadow-md shadow-[#9DA07E]/5" 
                    : "bg-white border-slate-50 text-slate-400"
                }`}
              >
                <span className={`${activeTab === section.id ? "text-[#9DA07E]" : "text-slate-300"}`}>{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="pt-56 md:pt-48 pb-32 px-6 max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-12 text-left"
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[1px] w-12 bg-[#9DA07E]" />
                <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.6em]">Premium Digital Companion</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter">
                Guest <span className="italic text-[#9DA07E]">Info.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-500 font-light max-w-xl leading-relaxed">
                Everything you need for a seamless stay at One Eleven, from check-in details to our hand-picked local favorites.
              </p>
            </div>
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={PDF_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 text-slate-700 font-black text-[11px] tracking-widest uppercase"
            >
              <div className="w-10 h-10 rounded-full bg-[#9DA07E]/10 flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-colors">
                <FileText size={20} />
              </div>
              Download PDF Guide
            </motion.a>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 md:gap-20">
          {/* Mobile Table of Contents (Book Style) */}
          <div className="lg:hidden mb-12">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9DA07E]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h3 className="font-serif text-2xl text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#9DA07E]" />
                Contents
              </h3>
              <div className="space-y-2">
                {SECTIONS.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveTab(section.id);
                      const element = document.getElementById('guide-content');
                      if (element) {
                        const offset = 180;
                        window.scrollTo({ 
                          top: element.getBoundingClientRect().top + window.scrollY - offset, 
                          behavior: "smooth" 
                        });
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group active:scale-[0.98]"
                    style={{
                      backgroundColor: activeTab === section.id ? '#9DA07E08' : 'transparent',
                      border: activeTab === section.id ? '1px solid #9DA07E20' : '1px solid transparent'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-serif ${activeTab === section.id ? 'text-[#9DA07E]' : 'text-slate-300'}`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${activeTab === section.id ? 'text-[#9DA07E]' : 'text-slate-500'}`}>
                        {section.title}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === section.id ? 'bg-[#9DA07E] text-white' : 'bg-slate-50 text-slate-300'}`}>
                      {section.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop Only) */}
          <aside className="hidden lg:block space-y-3 text-left sticky top-32 h-fit">
            <div className="px-6 py-3 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">Guide Chapters</span>
            </div>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] text-sm font-bold transition-all duration-500 group ${
                  activeTab === section.id 
                    ? "bg-[#9DA07E] text-white shadow-2xl shadow-[#9DA07E]/30 scale-[1.02]" 
                    : "text-slate-500 hover:bg-white hover:text-[#9DA07E] hover:shadow-lg"
                }`}
              >
                <div className={`transition-transform duration-500 ${activeTab === section.id ? "scale-110" : "group-hover:scale-110"}`}>
                  {section.icon}
                </div>
                <span className="flex-1 text-left tracking-wide">{section.title}</span>
                {activeTab === section.id && (
                  <motion.div layoutId="active-chapter">
                    <ChevronRight size={18} />
                  </motion.div>
                )}
              </button>
            ))}
            
            <div className="mt-16 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Phone className="text-[#9DA07E] mb-6" size={28} />
                <h4 className="font-serif text-2xl mb-2">Need Help?</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Matt & Ash are just a call or message away if you need anything at all.</p>
                <a href="tel:0276977961" className="text-[11px] font-black tracking-widest uppercase text-[#9DA07E] hover:text-white transition-colors">Contact Host</a>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#9DA07E]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </aside>

          {/* Main Content Area */}
          <main id="guide-content" className="min-h-[900px] text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-16"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-[#9DA07E]">
                    {activeSection.icon}
                    <span className="text-[10px] tracking-[0.4em] font-black uppercase">One Eleven | Taupō</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight tracking-tight">
                    {activeSection.content.header}
                  </h2>
                </div>

                {activeTab === "welcome" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-12">
                      <div className="prose prose-slate">
                        <p className="text-2xl text-slate-600 leading-relaxed font-light italic">
                          "{activeSection.content.text}"
                        </p>
                      </div>
                      <div className="pt-12 border-t border-slate-100">
                        <p className="font-serif text-3xl text-slate-900 mb-8">{activeSection.content.signature}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {activeSection.content.contact?.map((item: any, i: number) => (
                             <div key={i} className="flex items-center gap-4 text-slate-500 hover:text-[#9DA07E] transition-colors">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E]">
                                  {item.icon}
                                </div>
                                <span className="text-sm font-bold tracking-tight">{item.value}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[48px] overflow-hidden aspect-[4/5] shadow-2xl group relative">
                      <img src={activeSection.content.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Welcome" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </div>
                )}

                {activeTab === "arrival" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                      <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
                        <div className="space-y-4">
                          <p className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-400">The Address</p>
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-[#9DA07E]/10 text-[#9DA07E] flex items-center justify-center">
                              <MapPin size={32} />
                            </div>
                            <div>
                              <p className="text-3xl font-serif text-slate-900">{activeSection.content.address}</p>
                              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Taupō, New Zealand</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50 space-y-6">
                          <p className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-400">Digital Access</p>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] group hover:bg-[#9DA07E]/5 transition-colors">
                              <span className="text-sm font-bold text-slate-500">WiFi Network</span>
                              <span className="text-sm font-black text-slate-900">{activeSection.content.network}</span>
                            </div>
                            <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] group hover:bg-[#9DA07E]/5 transition-colors">
                              <span className="text-sm font-bold text-slate-500">Password</span>
                              <span className="text-sm font-black text-[#9DA07E] tracking-widest">{activeSection.content.password}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 italic leading-relaxed text-center px-4">
                            {activeSection.content.wifiDisclaimer}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#9DA07E] p-12 rounded-[48px] text-white shadow-xl shadow-[#9DA07E]/20 relative overflow-hidden group">
                        <div className="relative z-10 flex items-start gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Clock size={28} />
                          </div>
                          <div>
                            <h4 className="text-3xl font-serif mb-4">Check-in from {activeSection.content.checkInTime}</h4>
                            <p className="text-white/80 leading-relaxed font-light italic">
                              "{activeSection.content.earlyCheckInBlurb}"
                            </p>
                          </div>
                        </div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-16 rounded-[56px] text-white flex flex-col justify-between relative overflow-hidden group">
                      <div className="relative z-10 space-y-12">
                        <div className="w-20 h-20 rounded-[24px] bg-white/10 flex items-center justify-center text-[#9DA07E]">
                          <Key size={40} />
                        </div>
                        <h3 className="text-5xl font-serif leading-tight">Smart Lock <span className="text-[#9DA07E]">Entry.</span></h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                          {activeSection.content.pinInfo}
                        </p>
                        <div className="pt-12 border-t border-white/10 grid grid-cols-2 gap-12">
                          <div>
                            <p className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500 mb-2">Check-in</p>
                            <p className="text-3xl font-serif">3:00 PM</p>
                          </div>
                          <div>
                            <p className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500 mb-2">Check-out</p>
                            <p className="text-3xl font-serif">10:00 AM</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#9DA07E]/10 to-transparent pointer-events-none" />
                      <button className="mt-20 w-full py-6 bg-[#9DA07E] rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-white hover:text-[#9DA07E] transition-all duration-500 shadow-xl shadow-[#9DA07E]/20">
                        GET DIRECTIONS
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div className="space-y-12">
                    <div className="flex flex-wrap gap-3 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm w-fit">
                      {activeSection.content.tabs?.map((tab: string) => (
                        <button
                          key={tab}
                          onClick={() => setInstructionSubTab(tab)}
                          className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${instructionSubTab === tab ? "bg-[#9DA07E] text-white shadow-lg" : "text-slate-400 hover:text-[#9DA07E]"}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                      <div className="space-y-10">
                        <h3 className="text-4xl font-serif text-slate-900">{instructionSubTab} Guide</h3>
                        <div className="space-y-6">
                          {activeSection.content.data[instructionSubTab].steps.map((step: string, i: number) => (
                            <div key={i} className="flex gap-6 p-8 bg-white rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                              <span className="text-4xl font-serif text-[#9DA07E]/20 group-hover:text-[#9DA07E] transition-colors">{i + 1}</span>
                              <p className="text-slate-600 leading-relaxed font-light">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="rounded-[48px] overflow-hidden shadow-2xl bg-slate-100 aspect-video relative group">
                          {activeSection.content.data[instructionSubTab].video ? (
                            <video 
                              key={instructionSubTab}
                              controls 
                              className="w-full h-full object-cover"
                              poster={activeSection.content.data[instructionSubTab].image}
                            >
                              <source src={activeSection.content.data[instructionSubTab].video} type="video/mp4" />
                            </video>
                          ) : (
                            <img src={activeSection.content.data[instructionSubTab].image} className="w-full h-full object-cover" alt="Guide" />
                          )}
                        </div>
                        <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 flex gap-6">
                          <Info className="text-blue-500 flex-shrink-0" size={24} />
                          <p className="text-blue-900/60 text-sm leading-relaxed">
                            Need live assistance? Use the contact details in the sidebar to call Matt or Ashleigh for a guided walkthrough.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "attractions" && (
                  <div className="space-y-20">
                    {activeSection.content.categories?.map((cat: any, i: number) => (
                      <div key={i} className="space-y-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#9DA07E]/10 flex items-center justify-center text-[#9DA07E]">
                            {cat.icon}
                          </div>
                          <h3 className="text-3xl font-serif text-slate-900">{cat.label}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          {cat.items.map((item: any, idx: number) => (
                            <a 
                              key={idx} 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group space-y-6 block"
                            >
                              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl relative">
                                <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                  <ExternalLink className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                  <h4 className="text-2xl font-serif mb-2">{item.name}</h4>
                                  <p className="text-xs text-white/70 font-light line-clamp-2">{item.desc}</p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "dining" && (
                  <div className="space-y-12">
                    <div className="flex flex-wrap gap-3 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm w-fit">
                      {activeSection.content.tabs?.map((tab: string) => (
                        <button
                          key={tab}
                          onClick={() => setDiningSubTab(tab)}
                          className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${diningSubTab === tab ? "bg-[#9DA07E] text-white shadow-lg" : "text-slate-400 hover:text-[#9DA07E]"}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {activeSection.content.data[diningSubTab].map((item: any, i: number) => (
                        <a 
                          key={i} 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group bg-white p-4 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full"
                        >
                          <div className="aspect-video rounded-[28px] overflow-hidden mb-6 relative">
                            <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink size={16} />
                            </div>
                          </div>
                          <div className="px-4 pb-4 space-y-2 flex-1">
                            <h4 className="text-2xl font-serif text-slate-900 group-hover:text-[#9DA07E] transition-colors">{item.name}</h4>
                            <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-3">{item.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "house-rules" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                      <p className="text-2xl text-slate-600 leading-relaxed font-light italic">"{activeSection.content.text}"</p>
                      <div className="space-y-6">
                        {activeSection.content.rules?.map((rule: any, i: number) => (
                          <div key={i} className="flex gap-6 p-8 bg-white rounded-[32px] border border-slate-100 group hover:bg-slate-50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-[#9DA07E]/10 flex items-center justify-center text-[#9DA07E] flex-shrink-0">
                              <ShieldCheck size={24} />
                            </div>
                            <div>
                              <h4 className="text-xl font-serif text-slate-900 mb-1">{rule.title}</h4>
                              <p className="text-slate-500 text-sm font-light">{rule.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[56px] overflow-hidden aspect-[4/5] shadow-2xl">
                      <img src={activeSection.content.image} className="w-full h-full object-cover" alt="House Rules" />
                    </div>
                  </div>
                )}

                {activeTab === "emergency" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-red-600 p-16 rounded-[56px] text-white space-y-12 shadow-2xl shadow-red-600/20 relative overflow-hidden group">
                      <div className="relative z-10 space-y-8">
                        <AlertTriangle size={64} className="animate-pulse" />
                        <h3 className="text-6xl font-serif">In an Emergency</h3>
                        <div className="bg-white/20 backdrop-blur-md rounded-[32px] p-10 text-center">
                          <p className="text-xs font-black uppercase tracking-[0.4em] mb-4">Immediate Assistance</p>
                          <p className="text-7xl font-serif tracking-tighter">{activeSection.content.primary}</p>
                        </div>
                      </div>
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-4xl font-serif text-slate-900 mb-8">Medical Services</h3>
                      {activeSection.content.contacts?.map((contact: any, i: number) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-10 hover:shadow-xl transition-all duration-500">
                          <div className="w-20 h-20 rounded-[24px] bg-slate-50 flex items-center justify-center text-[#9DA07E]">
                            {contact.icon}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-serif text-slate-900">{contact.name}</h4>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{contact.address}</p>
                            <a href={`tel:${contact.phone}`} className="text-[#9DA07E] font-black text-xl hover:text-slate-900 transition-colors block">{contact.phone}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "departure" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                      <div className="space-y-10">
                        <h3 className="text-4xl font-serif text-slate-900">Checkout Checklist</h3>
                        <div className="space-y-4">
                          {activeSection.content.checklist?.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[24px] border border-slate-100 group">
                              <div className="w-10 h-10 rounded-full bg-[#9DA07E]/10 flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-all">
                                <ShieldCheck size={20} />
                              </div>
                              <span className="text-slate-600 font-light">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-10 bg-slate-900 rounded-[40px] text-white">
                        <div className="flex gap-6 mb-6">
                          <Clock className="text-[#9DA07E]" size={28} />
                          <h4 className="text-2xl font-serif">Check-out by 10:00 AM</h4>
                        </div>
                        <p className="text-slate-400 leading-relaxed italic">{activeSection.content.doorCode}</p>
                      </div>
                    </div>
                    <div className="rounded-[56px] overflow-hidden aspect-[4/5] shadow-2xl">
                      <img src={activeSection.content.image} className="w-full h-full object-cover" alt="Departure" />
                    </div>
                  </div>
                )}

                {activeTab === "thanks" && (
                  <div className="text-center space-y-16 py-20">
                    <div className="max-w-2xl mx-auto space-y-8">
                      <Heart className="text-[#9DA07E] mx-auto animate-bounce" size={64} />
                      <h2 className="text-6xl font-serif text-slate-900 tracking-tighter">Thank you for <br /><span className="italic text-[#9DA07E]">staying with us.</span></h2>
                      <p className="text-xl text-slate-500 font-light leading-relaxed">{activeSection.content.text}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {activeSection.content.contact?.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E]">
                            {item.icon}
                          </div>
                          <span className="text-lg font-bold text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-xs text-stone-400">
          Last Updated: <time dateTime="2026-02-26">{LAST_UPDATED}</time>
        </p>
      </div>

      <Footer />
    </div>
  );
}
