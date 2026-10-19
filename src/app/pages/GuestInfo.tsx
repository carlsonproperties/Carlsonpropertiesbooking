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
  Menu,
  ArrowUpRight,
  PlayCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MobileMenu } from "../components/MobileMenu";
import { StatementFooter as Footer } from "../components/StatementFooter";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { guestInfoSchema } from "../lib/schemas";
import { GUEST_INFO_IMAGES, HOWTO_MEDIA, GUIDE_BOOK_PDF, getImageUrl } from "../lib/images";
import { GOOGLE_REVIEW_URL, PHONE_DISPLAY, PHONE_HREF, BOOKINGS_EMAIL } from "../lib/links";

declare const __GUEST_INFO_UPDATED__: string; // ISO date injected at build time (vite.config.ts)

const GUEST_INFO_UPDATED_ISO = __GUEST_INFO_UPDATED__;
const _MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const _dateParts = GUEST_INFO_UPDATED_ISO.split("-").map(Number);
const LAST_UPDATED = `${_MONTHS[_dateParts[1] - 1]} ${_dateParts[2]}, ${_dateParts[0]}`;

const SECTIONS = [
  {
    id: "welcome",
    title: "A Warm Welcome",
    icon: <Heart size={20} />,
    content: {
      header: "A Warm Welcome",
      text: "Welcome to One Eleven. We hope the house feels easy to settle into from the moment you arrive.\n\nThis guide covers the essentials; if you need anything before or during your stay, call or email us.",
      signature: "Matt & Ash",
      image: GUEST_INFO_IMAGES.welcome,
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
      wifiDisclaimer: "We’ll send the Wi-Fi password and your door code three days before check-in.",
      checkInTime: "3:00 PM",
      pinInfo: "Your four-digit PIN provides access from check-in and expires after departure.",
      earlyCheckInBlurb: "Check-in is from 3:00 PM. We use the full changeover window to prepare the house, but we’ll message you if it is ready earlier."
    }
  },
  {
    id: "instructions",
    title: "How-To Guides",
    icon: <Play size={20} />,
    content: {
      header: "How to Use the House",
      tabs: ["Pool Cover", "Sauna", "Air Con & Fire", "Smart Lock"],
      data: {
        "Pool Cover": {
          image: HOWTO_MEDIA.poolCover.image,
          video: HOWTO_MEDIA.poolCover.video, 
          steps: [
            "Insert and Unlock: Insert the key into the control panel.",
            "Open the Cover: Turn the key once towards I (1).",
            "Before Closing: Remove everything from the pool so the cover can close correctly.",
            "Close the Cover: Turn the key towards II (2) and hold until the cover reaches the end."
          ]
        },
        "Sauna": {
          image: HOWTO_MEDIA.sauna.image,
          video: HOWTO_MEDIA.sauna.video, 
          steps: [
            "Preheat the Sauna: Turn on the sauna heater and set the temperature dial. Allow 15 minutes for preheating.",
            "Enjoy Your Sauna Session: Enter with a towel to sit on. Use the control panel for the lights and Bluetooth.",
            "Cool Down and Turn Off: Exit the sauna and cool down with a cold shower. Turn off the heater after use."
          ]
        },
        "Air Con & Fire": {
          image: HOWTO_MEDIA.airCon.image,
          video: HOWTO_MEDIA.airCon.video, 
          steps: [
            "AC Panel: Located in the hallway. Select mode and temperature.",
            "Modes: Sunlight icon for heat, Snowflake icon for cooling.",
            "Gas Fire: The remote is in the kitchen cutlery drawer. It takes about one minute to ignite. Turn it off overnight."
          ]
        },
        "Smart Lock": {
          image: HOWTO_MEDIA.frontDoor.image,
          video: HOWTO_MEDIA.frontDoor.video, 
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
          label: "ADULTS – Relax and Unwind",
          icon: <Sparkles size={18} />,
          items: [
            { name: "Wairakei Terraces", link: "https://wairakeiterraces.co.nz", image: "https://static.wixstatic.com/media/5813b5_556156fabae84a70a4d6893eec144ba3~mv2.jpg/v1/fill/w_1898,h_804,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5813b5_556156fabae84a70a4d6893eec144ba3~mv2.jpg", desc: "Fourteen thermal baths and a Māori cultural experience." },
            { name: "Kinloch Golf Course", link: "https://kinlochgolf.co.nz", image: "https://www.thekinlochclub.com/media/1749/kinlochclubtauponz-18th-green-12-950-633px.jpg?mode=crop&width=1920&height=700&quality=80", desc: "A Jack Nicklaus–designed course beside the lake." },
            { name: "Craters MTB Park", link: "https://cratersofthemoon.co.nz/mountain-bike-park", image: "https://www.lovetaupo.com/media/pvfhf23n/bas-vaea-at-craters-mtb-park.FrwVMA.jpg?width=1500", desc: "A large network of mountain bike trails on the edge of town." },
            { name: "Confinement Escape Rooms", link: "https://confinement.co.nz", image: "https://veronikasadventure.com/wp-content/uploads/2023/12/escape-room-experience-taupo-the-wild-tea-party.jpg", desc: "Escape rooms in the middle of town, one of them award-winning." },
            { name: "BFT Taupo", link: "https://www.bodyfittraining.com/club/taupo", image: "https://bookmestatic.net.nz/bookme-product-images/products/9058/9058_image4_IOTZQkEhmo_TUBU_Untitled2.jpg", desc: "Science-based group strength and conditioning." },
            { name: "Doughboats Taupo", link: "https://doughboats.co.nz", image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/28/5b/20.jpg", desc: "Self-drive doughnut boats on Lake Taupō." },
            { name: "Mt Tauhara Walk", link: "https://www.doc.govt.nz/parks-and-recreation/places-to-go/waikato/places/taupo-area/things-to-do/tracks/mount-tauhara-track/", image: "https://longwhitegypsy.com/wp-content/uploads/2018/04/Mt-Tauhara-Guide-Featured-Image.jpg", desc: "Lake and mountain views from the summit." },
            { name: "Living Waters Spa (DeBretts)", link: "https://www.debretts.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQVMbUfE0ylQjUQdsWQHnBoGcP2rliKBE35A&s", desc: "Mineral pools and therapeutic spa treatments." },
            { name: "Rangatira Point Track", link: "https://www.tauponz.com/explore/walks-and-hikes/rangatira-point-track/", image: "https://admin.planmywalk.nz/assets/UserReviewImages/5a39c927682401599000fc0e2e802bcc515c96e3__FocusFillWyIwLjAwIiwiMC4wMCIsMTkyMCw2MDBd.jpeg", desc: "Lakeside walk with spots to swim." }
          ]
        },
        {
          label: "TEENS & KIDS – Adventure",
          icon: <Wind size={18} />,
          items: [
            { name: "The Edge Rockwall", link: "https://www.tauponz.com/visit/things-to-do/the-edge-rockwall/", image: "https://www.lovetaupo.com/remote.axd?https://register.newzealand.com/sites/default/files/product_images/2022-07/Rockwall%20hanging.jpg?width=1920", desc: "Indoor climbing wall for all skill levels." },
            { name: "Whakapapa / Mt Ruapehu", link: "https://www.mtruapehu.com", image: "https://www.visitruapehu.com/media/Down%20groomer%20-%20Visit%20Ruapehu.jpg", desc: "NZ's largest ski area and mountain adventures." },
            { name: "The Landing", link: "https://www.thelanding.co.nz", image: "https://images.squarespace-cdn.com/content/v1/66836ec3c5316542ae46e44d/1721165499126-TIP24O548G9TEAH7RUK0/TLDZ-54.jpg", desc: "Trampoline park, ninja course, and bowling." },
            { name: "The Cave VR Taupo", link: "https://www.thecave.nz", image: "https://images.squarespace-cdn.com/content/v1/647f1ebdc616112036a070db/b089a232-c3b8-44d9-9697-0f839c5dc91c/The+Cave+Virtual+Reality+VR+Games.jpg", desc: "Virtual reality games in town." },
            { name: "Swingers Putt Putt", link: "https://www.swingersputtputt.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUZ2Up5Ns0G6O2XAk8s1UQNWO6Dm2ujpmHNw&s", desc: "Mini-golf fun for the whole family." },
            { name: "AC Baths", link: "https://www.taupodc.govt.nz/recreation/sport-and-recreation-centres/ac-baths", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzX74Yr2MirQh15RFvCHGBcEVj51SU0gZQ7g&s", desc: "All-weather hot pools and leisure centre." },
            { name: "Pedal Boats Wharewaka", link: "https://www.taupowatersports.co.nz", image: "https://static.wixstatic.com/media/76de7c_0f0df0ac3942470ba713d82706e24f98~mv2.jpg/v1/fit/w_285,h_190,q_90,enc_avif,quality_auto/76de7c_0f0df0ac3942470ba713d82706e24f98~mv2.jpg", desc: "Pedal boat hire on the lake." },
            { name: "Taupo Watersports", link: "https://www.taupowatersports.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIweA6C-C2uxNHjv4ME4Uoxva1R1tWFplmcQ&s", desc: "Kayaks, paddleboards, and water activities." },
            { name: "Spa Park BMX & Pump Track", link: "https://www.tauponz.com/explore/parks-and-playgrounds/spa-park/", image: "https://www.lovetaupo.com/media/5i1jfxhu/taupo-bike-park-spa-thermal-park.GNsz_A.jpg", desc: "Pump track and bike park by the river." }
          ]
        },
        {
          label: "TODDLERS – Fun & Play",
          icon: <Baby size={18} />,
          items: [
            { name: "Tongariro Playground", link: "https://www.tauponz.com/explore/parks-and-playgrounds/tongariro-domain/", image: "https://www.taupodc.govt.nz/repository/libraries/id:25026fn3317q9slqygym/hierarchy/Council/Projects/Tongariro%20playground/Completed%20playground/DJI_0038.jpg", desc: "Taupō's biggest playground." },
            { name: "Toddler Time Gymnastics", link: "https://www.taupogymnastics.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDN-3efS7tQCgAiltZGor0MzE3bsC3QIaMw&s", desc: "Gymnastics classes for pre-schoolers." },
            { name: "Mind Junction", link: "https://www.mindjunction.co.nz", image: "https://www.lovetaupo.com/media/2961883/mind-junction-hero.jpg?width=1920&format=jpg&quality=70", desc: "Activity park with puzzles, mazes, and more." },
            { name: "Lilliput Farm", link: "https://www.lilliputfarm.co.nz", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/3f/6b/de/photo3jpg.jpg?w=1200&h=-1&s=1", desc: "Farm park with animals to feed." },
            { name: "Fairy Garden Walk", link: "https://www.tauponz.com/explore/walks-and-hikes/whangamata-stream-walk/", image: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/fairygardenwalk.jpg", desc: "Easy walk along the Whangamata Stream." },
            { name: "Huka Prawn Park", link: "https://hukaprawnpark.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9PO_an7v7KReSljKYAGPceMaW4Y9JSvDDw&s", desc: "Prawn fishing and water-based fun." },
            { name: "Lions Walk Taupo", link: "https://www.tauponz.com/explore/walks-and-hikes/lions-walk/", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/slideshow__smartport/public/pics/listings/images/lionswalk.jpg?itok=NVUhYhnO", desc: "Flat lakefront path that suits buggies." }
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
          { name: "Bistro Lago (Hilton)", link: "https://www.hilton.com/en/hotels/tnpwaqq-hilton-taupo/dining/", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/aa/e5/f2/dining-shared-at-bistro.jpg", desc: "Lakefront dining at the Hilton." },
          { name: "Lionel’s Taupo", link: "https://lionelstaupo.co.nz", image: "https://www.lovetaupo.com/media/id1klt0a/lionels-1-1.jpg?width=1920&format=jpg&quality=70", desc: "Charcoal-grilled steaks and seafood." },
          { name: "The Plateau Taupo", link: "https://theplateau.co.nz", image: "https://plateautaupo.co.nz/wp-content/uploads/2025/06/Plateau-new-menu-05.25-That-Green-Olive-176-1-scaled.jpg", desc: "Contemporary Kiwi cooking and craft beer." },
          { name: "Roquette Taupo", link: "https://roquette.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9v7kKHOo_eG0cSgeRz58vBON5cs0FsY75A&s", desc: "European-inspired bistro dining." },
          { name: "Sorrento Taupo", link: "https://sorrentotaupo.co.nz", image: "https://bookmestatic.net.nz/bookme-product-images/products/7983/7983_image1_3l0T3FMJWC_QSOC_sorrento.jpg", desc: "Italian cooking in the middle of town." },
          { name: "Incredible India", link: "https://www.incredibleindia.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxlp_VROSQr7n30KWBXh5O4FolXRt_sJ-Dug&s", desc: "Traditional Indian cuisine with a modern twist." },
          { name: "Lonestar", link: "https://www.lonestar.co.nz/restaurants/taupo", image: "https://www.firsttable.co.nz/_next/image?url=https%3A%2F%2Fimages.firsttable.net%2F1292x800%2Fpublic%2Frestaurant%2F2446d9d000%2FLonestar5642-1.jpg&w=3840&q=60", desc: "Big portions and a menu that suits families." }
        ],
        Cafes: [
          { name: "L’Arté Café & Gallery", link: "https://www.lartecafe.co.nz", image: "https://images.squarespace-cdn.com/content/v1/5c062595b98a783e26690c62/1545453228163-GJ8NEADTL6NMTHCRFK48/Westermanos-0588.jpg", desc: "Cafe and gallery in a garden setting." },
          { name: "Replete Café", link: "https://repletecafe.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8ZE6VAPnncQ3nBgazE_Yqp0Ub-khN5AL4Q&s", desc: "Good coffee and a full brunch menu." },
          { name: "Industrie French Kitchen", link: "https://industrie.co.nz", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/36/ed/53/counter.jpg?w=400&h=300&s=1", desc: "Authentic French pastries and cafe classics." },
          { name: "The Cozy Corner", link: "https://www.thecozycorner.co.nz/", image: "https://dogfriendlynewzealand.co.nz/wp-content/uploads/2021/01/cozy-corner-.jpg", desc: "Friendly local cafe." },
          { name: "Baked With Love", link: "https://bakedwithlove.co.nz/", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/18/9d/90/our-shipping-containers.jpg?w=900&h=500&s=1", desc: "Artisanal bakery and specialty coffee." },
          { name: "Victoria’s Café", link: "https://www.victorias.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT90t2oUP5WaZeWTDCaFhROaFqWK3rH8skIdQ&s", desc: "Busy lakefront cafe." },
          { name: "Café Baku", link: "https://cafebaku.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR814SrJG0CR5sNxPmu9BtOlNZUDoJVkpWrQQ&s", desc: "Lake views and good cabinet food." },
          { name: "Kefi Café", link: "https://www.lovetaupo.com/en/operators/kefi-cafe/", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUuEYYjBII_QQu3YLqDbHSFtEj5Tic_fd9Xg&s", desc: "Mediterranean-leaning cafe." },
          { name: "The Storehouse", link: "https://www.lovetaupo.com/en/operators/the-storehouse-taupo/", image: "https://www.lovetaupo.com/media/2958424/the-storehouse-cafe-coffee-friends-eating-breakfast.jpg", desc: "Brunch and coffee in a converted industrial space." }
        ],
        Bars: [
          { name: "Finn’s Bistro & Beer Garden", link: "https://www.finnsbistro.co.nz", image: getImageUrl("finnsbistro.jpg"), desc: "Classic beer garden with local brews." },
          { name: "Vine Eatery & Bar", link: "https://www.vineeatery.co.nz", image: "https://www.lovetaupo.com/media/hsidmhmi/vine-eatery-restaurant.jpg", desc: "Tapas and Mediterranean shared dining." },
          { name: "The Deck", link: "https://www.thedecktaupo.co.nz", image: "https://www.lovetaupo.com/media/2960018/the-deck-bar-taupo-13.jpg", desc: "Lakefront bar with a view." },
          { name: "Jolly Good Fellows", link: "https://www.jollygoodfellows.co.nz", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/full__smartport/public/pics/listings/images/jolly_good_fellows_-_outdoor_seating_new.png?itok=9-BUeGF4", desc: "British-style pub with garden bar." },
          { name: "Mavericks", link: "https://www.mavericksgastropub.co.nz/our-story", image: "https://www.taupo.info/sites/www.taupo.info/files/styles/full__smartport/public/pics/listings/images/mavericks_the_landing_2.jpg?itok=3Ef4wy03", desc: "Modern gastropub at The Landing." },
          { name: "Pub N Grub", link: "https://www.pubngrub.co.nz/contact-10", image: "https://static.wixstatic.com/media/707728_6b9c495a410542518fe8e87c57319bd8~mv2.jpg/v1/fill/w_640,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/707728_6b9c495a410542518fe8e87c57319bd8~mv2.jpg", desc: "Casual local pub with great deals." },
          { name: "Jimmy Coops", link: "https://www.jimmycoops.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TeQWBX8xJYAH3o-XGFL08XBJrvqZ-XQx6g&s", desc: "Lakefront burger bar and craft beer." },
          { name: "2 Mile Sailing Club", link: "https://www.2milebay.co.nz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9y3mDeCchrXE4TMDFvFhV23W8bjfXD3g17Q&s", desc: "Pizza and drinks right on the water." }
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
      image: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/looking%20into%20kitchen.png",
      text: "A few simple rules help keep the house safe, comfortable and ready for every guest.",
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
      image: getImageUrl("exterior lights.png"),
      checklist: [
        "Load & start the dishwasher",
        "Turn off lights and appliances",
        "Please take rubbish out to the bins",
        "Ensure all windows/doors are locked",
        "It is not expected that you strip the sheets but if you do, please leave the mattress protectors on as well as the duvet inner protectors."
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
      image: GUEST_INFO_IMAGES.checkout,
      text: "Thank you for staying at One Eleven. We hope you leave rested, well fed and with a few new favourite places in Taupō.",
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
  const activeIndex = SECTIONS.findIndex(x => x.id === activeSection.id);

  /* Chapters are addressable: /guest-info#wifi opens straight on that
     chapter, so a host can text a guest the exact page they need. The hash
     is kept in sync as they move, and back/forward work as expected. */
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id && SECTIONS.some(x => x.id === id)) setActiveTab(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const goToSection = React.useCallback((id: string) => {
    setActiveTab(id);
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  /* A manual is read like a book, so arrow keys page through it — but not
     while someone is typing in a field. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (el?.isContentEditable) return;
      const i = SECTIONS.findIndex(x => x.id === activeTab);
      if (e.key === "ArrowRight" && i < SECTIONS.length - 1) goToSection(SECTIONS[i + 1].id);
      if (e.key === "ArrowLeft" && i > 0) goToSection(SECTIONS[i - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTab, goToSection]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#F4F1EA] min-h-screen selection:bg-[#203F3A] selection:text-white font-sans">
      <SEO 
        title="Guest Guide | One Eleven on the Mile"
        description="Arrival details, house instructions and local favourites for an easy stay at One Eleven on the Mile in Taupō."
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
                  item === "Guest Info" ? "text-[#203F3A]" : "text-slate-500 hover:text-[#203F3A]"
                }`}
              >
                {item}
              </Link>
            ))}
            <Link 
              to="/owner-login"
              className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 hover:text-[#203F3A] transition-all"
            >
              Owner Portal
            </Link>
            <Link 
              to="/book" 
              className="bg-[#16302B] text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#203F3A] hover:shadow-xl hover:shadow-[#203F3A]/20 transition-all"
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
      <div className="md:hidden fixed top-[72px] left-0 right-0 z-[90] bg-[#F4F1EA] border-b border-slate-100 shadow-sm">
        <div className="px-6 py-4">
          <p className="text-[8px] uppercase tracking-[0.3em] font-black text-[#203F3A] mb-3">Guide Chapters</p>
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
                    ? "bg-white border-[#203F3A] text-[#203F3A] shadow-md shadow-[#203F3A]/5" 
                    : "bg-white border-slate-50 text-slate-400"
                }`}
              >
                <span className={`${activeTab === section.id ? "text-[#203F3A]" : "text-slate-300"}`}>{section.icon}</span>
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
                <span className="h-[1px] w-12 bg-[#203F3A]" />
                <span className="text-[#203F3A] text-[10px] font-black uppercase tracking-[0.6em]">One Eleven on the Mile</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter">
                Guest <span className="italic text-[#203F3A]">Guide.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-500 font-light max-w-xl leading-relaxed">
                Arrival details, house instructions and local favourites for an easy stay at One Eleven.
              </p>

              {/* Interactive Quick Essentials Bar */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText("One Eleven Guest");
                    alert("WiFi Network: 'One Eleven Guest' copied! Password is sent 3 days before arrival.");
                  }}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-[#203F3A]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#203F3A] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#203F3A] hover:shadow-md"
                >
                  <Wifi size={15} className="text-[#9B7955]" />
                  <span>WiFi: One Eleven Guest</span>
                </button>

                <button
                  onClick={() => {
                    alert("Your unique four-digit door code is sent three days before check-in.");
                  }}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-[#203F3A]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#203F3A] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#203F3A] hover:shadow-md"
                >
                  <Key size={15} className="text-[#9B7955]" />
                  <span>Keyless Door Code</span>
                </button>

                <a
                  href="tel:0276977961"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-[#203F3A]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#203F3A] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#203F3A] hover:shadow-md"
                >
                  <Phone size={15} className="text-[#9B7955]" />
                  <span>Call Matt &amp; Ash</span>
                </a>

                <a
                  href="https://maps.google.com/?q=111+Jarden+Mile,+Taup%C5%8D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-[#203F3A]/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#203F3A] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#203F3A] hover:shadow-md"
                >
                  <MapPin size={15} className="text-[#9B7955]" />
                  <span>111 Jarden Mile</span>
                </a>
              </div>
            </div>
            {GUIDE_BOOK_PDF && (
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={GUIDE_BOOK_PDF} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 text-slate-700 font-black text-[11px] tracking-widest uppercase"
            >
              <div className="w-10 h-10 rounded-full bg-[#203F3A]/10 flex items-center justify-center text-[#203F3A] group-hover:bg-[#203F3A] group-hover:text-white transition-colors">
                <FileText size={20} />
              </div>
              Download PDF Guide
            </motion.a>
            )}
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 md:gap-20">
          {/* Mobile Table of Contents (Book Style) */}
          <div className="lg:hidden mb-12">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#203F3A]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h3 className="font-serif text-2xl text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#203F3A]" />
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
                      // Via variables so the preview theme can reach them —
                      // an inline value is not addressable from a stylesheet.
                      backgroundColor: activeTab === section.id ? 'var(--tab-active-bg)' : 'transparent',
                      border: activeTab === section.id ? '1px solid var(--tab-active-border)' : '1px solid transparent'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-serif ${activeTab === section.id ? 'text-[#203F3A]' : 'text-slate-300'}`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${activeTab === section.id ? 'text-[#203F3A]' : 'text-slate-500'}`}>
                        {section.title}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === section.id ? 'bg-[#203F3A] text-white' : 'bg-slate-50 text-slate-300'}`}>
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
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1 flex-1 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#203F3A]"
                    animate={{ width: `${((activeIndex + 1) / SECTIONS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular-nums text-slate-400">
                  {activeIndex + 1}/{SECTIONS.length}
                </span>
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Use <kbd className="rounded border border-slate-200 px-1">←</kbd>{" "}
                <kbd className="rounded border border-slate-200 px-1">→</kbd> to page through
              </p>
            </div>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  goToSection(section.id);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] text-sm font-bold transition-all duration-500 group ${
                  activeTab === section.id 
                    ? "bg-[#203F3A] text-white shadow-2xl shadow-[#203F3A]/30 scale-[1.02]" 
                    : "text-slate-500 hover:bg-white hover:text-[#203F3A] hover:shadow-lg"
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
            
            <div className="mt-16 p-10 rounded-[40px] bg-[#16302B] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Phone className="text-[#D7C8B4] mb-6" size={28} />
                <h4 className="font-serif text-2xl mb-2">Need Help?</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Matt & Ash are just a call or message away if you need anything at all.</p>
                <a href="tel:0276977961" className="text-[11px] font-black tracking-widest uppercase text-[#D7C8B4] hover:text-white transition-colors">Contact Host</a>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#203F3A]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
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
                {/* The Thank You panel carries its own heading, so the generic
                    chapter title is suppressed there rather than stacking a
                    second "Thank You" above it. */}
                {activeTab !== "thanks" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#203F3A]">
                      {activeSection.icon}
                      <span className="text-[10px] tracking-[0.4em] font-black uppercase">One Eleven | Taupō</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight tracking-tight">
                      {activeSection.content.header}
                    </h2>
                  </div>
                )}

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
                             <div key={i} className="flex items-center gap-4 text-slate-500 hover:text-[#203F3A] transition-colors">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#203F3A]">
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
                            <div className="w-16 h-16 rounded-[24px] bg-[#203F3A]/10 text-[#203F3A] flex items-center justify-center">
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
                            <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] group hover:bg-[#203F3A]/5 transition-colors">
                              <span className="text-sm font-bold text-slate-500">WiFi Network</span>
                              <span className="text-sm font-black text-slate-900">{activeSection.content.network}</span>
                            </div>
                            <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] group hover:bg-[#203F3A]/5 transition-colors">
                              <span className="text-sm font-bold text-slate-500">Password</span>
                              <span className="text-sm font-black text-[#203F3A] tracking-widest">{activeSection.content.password}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 italic leading-relaxed text-center px-4">
                            {activeSection.content.wifiDisclaimer}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#203F3A] p-12 rounded-[48px] text-white shadow-xl shadow-[#203F3A]/20 relative overflow-hidden group">
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

                    <div className="bg-[#16302B] p-16 rounded-[56px] text-white flex flex-col justify-between relative overflow-hidden group">
                      <div className="relative z-10 space-y-12">
                        <div className="w-20 h-20 rounded-[24px] bg-white/10 flex items-center justify-center text-[#D7C8B4]">
                          <Key size={40} />
                        </div>
                        <h3 className="text-5xl font-serif leading-tight">Smart Lock <span className="italic text-[#D7C8B4]">Entry.</span></h3>
                        <p className="text-[#F4F1EA]/80 text-lg leading-relaxed">
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
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#203F3A]/10 to-transparent pointer-events-none" />
                      <button className="mt-20 w-full py-6 bg-[#203F3A] rounded-full text-[11px] font-black tracking-widest uppercase hover:bg-white hover:text-[#203F3A] transition-all duration-500 shadow-xl shadow-[#203F3A]/20">
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
                          className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${instructionSubTab === tab ? "bg-[#203F3A] text-white shadow-lg" : "text-slate-400 hover:text-[#203F3A]"}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-10">
                      <h3 className="text-4xl font-serif text-slate-900">{instructionSubTab} Guide</h3>

                      {/* Keep the complete recording visible at its natural aspect ratio.
                          The previous fixed 16:9 crop hid the edges of some guide videos. */}
                      <div className="w-full overflow-hidden rounded-[32px] bg-[#111C1A] p-2 shadow-2xl sm:rounded-[48px] sm:p-3">
                        {activeSection.content.data[instructionSubTab].video ? (
                          <video
                            key={instructionSubTab}
                            controls
                            playsInline
                            preload="metadata"
                            className="block h-auto max-h-[78vh] w-full rounded-[24px] bg-black object-contain sm:rounded-[38px]"
                            poster={activeSection.content.data[instructionSubTab].image ?? undefined}
                            aria-label={`${instructionSubTab} how-to video`}
                          >
                            <source src={activeSection.content.data[instructionSubTab].video} type="video/mp4" />
                          </video>
                        ) : activeSection.content.data[instructionSubTab].image ? (
                          <img
                            src={activeSection.content.data[instructionSubTab].image}
                            className="block h-auto max-h-[78vh] w-full rounded-[24px] bg-black object-contain sm:rounded-[38px]"
                            alt={`${instructionSubTab} guide`}
                          />
                        ) : (
                          /* No media for this step yet — show a calm placeholder
                             rather than a broken image. The written steps below
                             it are the real instructions either way. */
                          <div className="flex min-h-[18rem] w-full flex-col items-center justify-center gap-3 rounded-[24px] bg-slate-50 px-8 text-center sm:min-h-[28rem] sm:rounded-[38px]">
                            <div className="w-14 h-14 rounded-full bg-[#203F3A]/10 flex items-center justify-center text-[#203F3A]">
                              <PlayCircle size={26} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Video guide coming shortly</p>
                            <p className="text-xs text-slate-400 max-w-[18rem] leading-relaxed">
                              Follow the written steps, or call us on {PHONE_DISPLAY} and we&rsquo;ll
                              talk you through it.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {activeSection.content.data[instructionSubTab].steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-6 p-8 bg-white rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                            <span className="text-4xl font-serif text-[#203F3A]/20 group-hover:text-[#203F3A] transition-colors">{i + 1}</span>
                            <p className="text-slate-600 leading-relaxed font-light">{step}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 flex gap-6">
                        <Info className="text-blue-500 flex-shrink-0" size={24} />
                        <p className="text-blue-900/60 text-sm leading-relaxed">
                          Need live assistance? Use the contact details in the sidebar to call Matt or Ashleigh for a guided walkthrough.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "attractions" && (
                  <div className="space-y-20">
                    {activeSection.content.categories?.map((cat: any, i: number) => (
                      <div key={i} className="space-y-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#203F3A]/10 flex items-center justify-center text-[#203F3A]">
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
                          className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${diningSubTab === tab ? "bg-[#203F3A] text-white shadow-lg" : "text-slate-400 hover:text-[#203F3A]"}`}
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
                            <h4 className="text-2xl font-serif text-slate-900 group-hover:text-[#203F3A] transition-colors">{item.name}</h4>
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
                            <div className="w-12 h-12 rounded-2xl bg-[#203F3A]/10 flex items-center justify-center text-[#203F3A] flex-shrink-0">
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
                          <div className="w-20 h-20 rounded-[24px] bg-slate-50 flex items-center justify-center text-[#203F3A]">
                            {contact.icon}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-serif text-slate-900">{contact.name}</h4>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{contact.address}</p>
                            <a href={`tel:${contact.phone}`} className="text-[#203F3A] font-black text-xl hover:text-slate-900 transition-colors block">{contact.phone}</a>
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
                              <div className="w-10 h-10 rounded-full bg-[#203F3A]/10 flex items-center justify-center text-[#203F3A] group-hover:bg-[#203F3A] group-hover:text-white transition-all">
                                <ShieldCheck size={20} />
                              </div>
                              <span className="text-slate-600 font-light">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-10 bg-[#16302B] rounded-[40px] text-white">
                        <div className="flex gap-6 mb-6">
                          <Clock className="text-[#D7C8B4]" size={28} />
                          <h4 className="text-2xl font-serif">Check-out by 10:00 AM</h4>
                        </div>
                        <p className="text-[#F4F1EA]/80 leading-relaxed italic">{activeSection.content.doorCode}</p>
                      </div>
                    </div>
                    <div className="aspect-square overflow-hidden rounded-[56px] bg-[#F4F1EA] shadow-2xl">
                      <img
                        src={activeSection.content.image}
                        className="h-full w-full object-cover"
                        alt="One Eleven on the Mile"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "thanks" && (
                  /* One ask, not three thank-yous. The guest is on this page
                     during or just after the stay, which is the one moment a
                     review actually gets written — so the review is the page,
                     and everything else is a footnote under it. */
                  <div className="py-10 md:py-16">
                    <div className="mx-auto max-w-4xl overflow-hidden rounded-[48px] bg-[#16302B] text-[#F4F1EA] shadow-2xl">
                      <div className="p-10 text-center md:p-16">
                        <div className="mb-7 flex items-center justify-center gap-1.5 text-[#D7C8B4]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} fill="#D7C8B4" strokeWidth={0} />
                          ))}
                        </div>

                        <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
                          Thanks for staying.<br />
                          <span className="italic text-[#D7C8B4]">Would you tell someone?</span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-[#F4F1EA]/85 md:text-lg">
                          We&rsquo;re a family running one house, not a chain. A review on Google is
                          the biggest thing you can do for us, and it tells the next guests what
                          they&rsquo;re really booking. It takes about a minute.
                        </p>

                        {/* The incentive is the reason to act now, so it sits with
                            the button rather than in small print below it. */}
                        <div className="mx-auto mt-9 inline-flex flex-col items-center gap-5">
                          <a
                            href={GOOGLE_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="review"
                            className="group inline-flex items-center gap-3 rounded-full bg-[#F4F1EA] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#203F3A] shadow-xl transition-all hover:bg-[#D7C8B4]"
                          >
                            Leave a Google Review
                            <ArrowUpRight
                              size={16}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </a>

                          <p className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D7C8B4]">
                            <span className="rounded-full border border-[#D7C8B4]/50 px-3 py-1">10% off</span>
                            your next stay when you do
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between gap-4 border-t border-[#D7C8B4]/20 px-10 py-7 text-center md:flex-row md:text-left">
                        <p className="text-[11px] leading-relaxed text-[#F4F1EA]/70">
                          Something not right? Tell us first — we&rsquo;d much rather fix it.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#D7C8B4]">
                          <a href={PHONE_HREF} className="hover:text-[#F4F1EA] transition-colors">
                            {PHONE_DISPLAY}
                          </a>
                          <a href={`mailto:${BOOKINGS_EMAIL}`} className="hover:text-[#F4F1EA] transition-colors">
                            {BOOKINGS_EMAIL}
                          </a>
                        </div>
                      </div>
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
          Last Updated: <time dateTime={GUEST_INFO_UPDATED_ISO}>{LAST_UPDATED}</time>
        </p>
      </div>

      <Footer />
    </div>
  );
}
