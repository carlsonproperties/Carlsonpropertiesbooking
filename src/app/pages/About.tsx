import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { 
  Shield, 
  Instagram, 
  Facebook,
  Menu,
  Check,
  X,
  Info,
  MapPin,
  Waves,
  Dumbbell,
  Zap,
  Thermometer,
  Eye,
  Lock,
  MessageCircle,
  Maximize2
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { MobileMenu } from "../components/MobileMenu";
import { StatementFooter as Footer } from "../components/StatementFooter";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { aboutSchema } from "../lib/schemas";
import { GALLERY_IMAGES, BEDROOM_IMAGES } from "../lib/images";

// Using your Supabase-hosted property images
const heroImg = GALLERY_IMAGES.hero;
const bedroom1 = BEDROOM_IMAGES.bedroom1;
const ensuite1 = BEDROOM_IMAGES.ensuite1;
const bedroom2 = BEDROOM_IMAGES.bedroom2;
const ensuite2 = BEDROOM_IMAGES.ensuite2;
const bedroom3 = BEDROOM_IMAGES.bedroom3;
const ensuite3 = BEDROOM_IMAGES.ensuite3;
const mainBathroom = BEDROOM_IMAGES.mainBathroom;
const bedroom4 = BEDROOM_IMAGES.bedroom4;
const ensuite4 = BEDROOM_IMAGES.ensuite4;
const bedroom5 = BEDROOM_IMAGES.bedroom5;
const ensuite5 = BEDROOM_IMAGES.ensuite5;

const GalleryItem = ({ item, index, onOpen }: { item: any; index: number; onOpen: (src: string) => void }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, item.speed * 400]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={`relative group mb-12 ${index % 2 === 0 ? "md:mt-0" : "md:mt-24"}`}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(item.img)}
        aria-label={`View ${item.title} full screen`}
        data-cursor="EXPAND"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.08 }}
        className="block w-full cursor-pointer relative overflow-hidden rounded-3xl border border-[#D7C8B4]/40 bg-[#F4F1EA] p-3 shadow-xl transition-all duration-700 ease-out group-hover:border-[#D7C8B4] group-hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B7955] focus-visible:ring-offset-2"
      >
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-black/5">
          <img 
            src={item.img} 
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105" 
            alt={item.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Maximize2 size={16} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white block drop-shadow">
              Click to view fullscreen
            </span>
          </div>
        </div>
      </motion.button>
      
      <div className="mt-5 px-3 text-left flex items-baseline justify-between">
        <div>
          <span className="text-[10px] text-[#7A5E41] font-bold uppercase tracking-[0.3em] block mb-1">0{index + 1} //</span>
          <h5 className="font-serif text-xl text-[#203F3A] uppercase tracking-wide">{item.title}</h5>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#203F3A]/85">Explore</span>
      </div>
    </motion.div>
  );
};

export function About() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showEnsuites, setShowEnsuites] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Lightbox: close on Escape and stop the page scrolling underneath it.
  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedImage]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#F4F1EA] min-h-screen">
      <SEO 
        title="About One Eleven on the Mile"
        description="Explore One Eleven on the Mile, a five-bedroom Taupō holiday home for up to ten guests with four bathrooms, a heated pool, spa, cedar sauna, gym and lake views."
        keywords="accommodation taupo, about one eleven taupo, taupo luxury holiday home, taupo vacation rental details, five bedroom taupo, lake taupo property, taupo spa accommodation, taupo sauna, heated pool taupo, taupo family accommodation, luxury rental taupo, taupo accommodation features"
        url="/about"
        schemaData={aboutSchema}
      />
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
          >
            <button 
              type="button"
              aria-label="Close photo viewer"
              autoFocus
              className="absolute top-0 right-0 z-10 m-4 rounded-full p-2 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              alt="Full View" 
            />
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "py-8 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/">
            <CarlsonLogo dark={isScrolled} />
          </Link>
          
          <div className="flex gap-12 items-center text-[11px] uppercase tracking-widest font-semibold hidden lg:flex">
            <Link to="/" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>Home</Link>
            <Link to="/about" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>About</Link>
            <Link to="/meet-hosts" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>Meet Your Hosts</Link>
            <Link to="/guest-info" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>Guest Info</Link>
            <Link to="/book" className="bg-[#203F3A] text-white px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#D7C8B4] transition-all shadow-lg shadow-[#203F3A]/20">
              Book Now
            </Link>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero Header */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img src={heroImg} className="w-full h-full object-cover opacity-60" alt="About Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#F4F1EA]" />
        </div>
        <div className="relative z-10 text-center text-white space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] uppercase tracking-[0.5em] font-bold opacity-80"
          >
            111 Jarden Mile · Taupō
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif"
          >
            A house designed <br /><span className="italic">around the view.</span>
          </motion.h1>
        </div>
      </header>

      <main className="pb-24">
        {/* Property Description Section */}
        <section className="py-24 md:py-40 px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-8 text-left">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight"
              >
                Room for everyone. <br />
                <span className="italic text-[#203F3A]">Space to come together.</span>
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light space-y-8"
              >
                <p>
                  Set on a quiet residential street five minutes&rsquo; drive from central Taupō, One Eleven sleeps up to ten across five bedrooms, with four bathrooms and generous indoor–outdoor living.
                </p>
                <p>
                  The heated pool, spa, cedar sauna, outdoor shower and gym create a private place to unwind in every season.
                </p>
                <p>
                  Inside, ducted heating and the double-sided gas fire keep the house warm through winter. A playground, tennis courts and basketball hoops are a short walk down the road.
                </p>
              </motion.div>
            </div>

            {/* Innovative Staggered Floating Gallery (No Cropping) */}
            <div className="pt-24 relative">
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 2 }}
              >
                <Masonry gutter="40px">
                  {[
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/view%20from%20dining%20table.jpg", title: "Lake Views from the Dining Room", speed: 0.1 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/gas%20fire.jpg", title: "Double-Sided Gas Fire", speed: -0.1 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Open%20plan%20living.jpg", title: "Open-Plan Living", speed: 0.2 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/pool%20featurephoto.png", title: "Heated Pool", speed: -0.05 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg", title: "Lake & Mountain Views", speed: 0.15 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/sauanaspa.jpg", title: "Sauna & Spa", speed: -0.12 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/outdoor%20lounge.png", title: "Poolside Outdoor Living", speed: 0.08 }
                  ].map((item, i) => (
                    <GalleryItem key={i} item={item} index={i} onOpen={setSelectedImage} />
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          </div>
        </section>

        {/* Where You'll Sleep Section */}
        <section className="bg-[#16302B] py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D7C8B4]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9B7955]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 text-left">
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[#D7C8B4] text-[10px] font-bold uppercase tracking-[0.4em] block"
                >
                  Five Bedrooms · Sleeps 10
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-serif text-white leading-tight"
                >
                  Where You&rsquo;ll <span className="italic">Sleep</span>
                </motion.h2>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-fit"
              >
                <button 
                  onClick={() => setShowEnsuites(false)}
                  className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 ${!showEnsuites ? "bg-[#F4F1EA] text-[#203F3A] shadow-xl" : "text-[#F4F1EA]/70 hover:text-white hover:bg-white/10"}`}
                >
                  Bedrooms
                </button>
                <button 
                  onClick={() => setShowEnsuites(true)}
                  className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 ${showEnsuites ? "bg-[#F4F1EA] text-[#203F3A] shadow-xl" : "text-[#F4F1EA]/70 hover:text-white hover:bg-white/10"}`}
                >
                  Bathrooms
                </button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { img: bedroom1, ensuiteImg: ensuite1, title: "Bedroom 1", type: "Super King", desc: ["1 Super King Bed"] },
                { img: bedroom2, ensuiteImg: ensuite2, title: "Bedroom 2", type: "Super King", desc: ["1 Super King Bed"] },
                { img: bedroom3, ensuiteImg: ensuite3, title: "Bedroom 3", type: "King", desc: ["1 King Bed"] },
                { img: bedroom4, ensuiteImg: ensuite4, title: "Bedroom 4", type: "King", desc: ["1 King Bed"] },
                { img: bedroom5, ensuiteImg: ensuite5, title: "Bedroom 5", type: "Twin", desc: ["2 King Single Beds"] }
              ].map((room, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="relative group text-left"
                >
                  <div className="absolute -top-4 -left-2 z-20 font-serif text-5xl text-[#D7C8B4]/55 italic pointer-events-none group-hover:text-[#D7C8B4]/80 transition-colors duration-500">
                    0{i + 1}
                  </div>

                  <div 
                    onClick={() => setSelectedImage(showEnsuites ? room.ensuiteImg : room.img)}
                    className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-6 shadow-2xl bg-black/40 border border-white/10 cursor-zoom-in group/img"
                  >
                    <motion.img 
                      key={showEnsuites ? 'ensuite' : 'bedroom'}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      src={showEnsuites ? room.ensuiteImg : room.img} 
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-700 ease-out" 
                      alt={room.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16302B] via-transparent to-transparent opacity-40" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-white/20 p-3 rounded-full border border-white/40">
                        <Maximize2 className="text-white" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative px-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-2xl text-[#F4F1EA] group-hover:text-[#D7C8B4] transition-colors duration-300">
                        {room.title}
                      </h4>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D7C8B4] border border-[#D7C8B4]/30 px-2.5 py-0.5 rounded-full bg-white/5">
                        {room.type}
                      </span>
                    </div>
                    <div className="h-px w-8 bg-[#D7C8B4]/40 group-hover:w-full transition-all duration-700" />
                    <div className="space-y-2">
                      {room.desc.map((line, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D7C8B4]" />
                          <p className="text-[#F4F1EA]/85 text-[11px] tracking-wider leading-relaxed font-semibold uppercase">{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The One Eleven Distinction */}
        <section className="py-32 md:py-48 bg-white px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start text-left">
              <div className="lg:col-span-7">
                <div className="max-w-2xl mb-16 space-y-6">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-[#D7C8B4] text-[10px] font-bold uppercase tracking-[0.5em] block"
                  >
                    At a Glance
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight"
                  >
                    Everything your group needs, <br />
                    <span className="italic text-[#203F3A]">all in one place.</span>
                  </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Waves, title: "Pool, Spa & Sauna", desc: "A year-round heated pool, spa and four-person cedar sauna in the private courtyard." },
                    { icon: Zap, title: "Purpose-Built", desc: "Open-plan living, practical storage and warm, modern finishes designed for group stays." },
                    { icon: MapPin, title: "Quiet, Close to Town", desc: "A residential Taupō setting around five minutes by car from the town centre." },
                    { icon: Eye, title: "Lake & Mountain Views", desc: "Wide outlooks across Lake Taupō and the surrounding ranges from the main living areas." },
                    { icon: Maximize2, title: "Made for Groups", desc: "Five bedrooms and four bathrooms give up to ten guests room to gather and retreat." },
                    { icon: Shield, title: "Family-Friendly Layout", desc: "Fully fenced grounds, generous shared spaces and a neighbourhood playground nearby." },
                    { icon: Info, title: "Everything Under One Roof", desc: "A well-equipped kitchen, BBQ, gym and private wellness area make longer stays easy." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`group p-8 rounded-3xl transition-all duration-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 ${i === 6 ? "md:col-span-2 bg-[#203F3A]/5 hover:bg-[#203F3A]/10" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#203F3A] group-hover:text-white transition-all duration-500">
                        <item.icon size={22} className="text-[#203F3A] group-hover:text-white transition-colors" />
                      </div>
                      <h5 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-[#203F3A] transition-colors">{item.title}</h5>
                      <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#203F3A]/10 rounded-full blur-[80px] -z-10" />
                  
                  <div className="bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 space-y-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-10 bg-[#203F3A] rounded-full" />
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-slate-400">The Essentials</h4>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="group">
                          <h6 className="font-serif text-lg text-slate-900 mb-2">Self Check-In</h6>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            Your four-digit door code is sent three days before check-in.
                          </p>
                        </div>

                        <div className="group">
                          <h6 className="font-serif text-lg text-slate-900 mb-2">Your Guest Guide</h6>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            Your digital guide covers arrival, Wi-Fi, house instructions and local recommendations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                          <Shield size={18} />
                          <h4 className="font-bold text-[9px] uppercase tracking-widest">Safety & Privacy</h4>
                        </div>
                        <p className="text-[11px] text-red-900/60 leading-relaxed">
                          Please supervise children near the pool and pool cover. One exterior security camera is present; it does not monitor any indoor area.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-[#16302B] rounded-[32px] p-8 text-white flex items-center justify-between group cursor-pointer"
                  onClick={() => navigate('/book')}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#D7C8B4] font-bold uppercase tracking-[0.3em]">Ready to visit?</span>
                    <h4 className="font-serif text-xl">Reserve Your Dates</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#203F3A] transition-colors">
                    <Zap size={20} className="text-white" />
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
