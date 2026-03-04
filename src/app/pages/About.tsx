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
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { GALLERY_IMAGES, BEDROOM_IMAGES } from "../lib/images";

// Using your Supabase-hosted property images
const heroImg = GALLERY_IMAGES.hero;
const gallery1 = GALLERY_IMAGES.kitchen;
const gallery2 = GALLERY_IMAGES.pool;
const gallery4 = GALLERY_IMAGES.livingRoom;
const galleryLivingRoom = GALLERY_IMAGES.livingRoom;
const galleryExterior = GALLERY_IMAGES.exterior;
const gallerySaunaSpa = GALLERY_IMAGES.sauna;
const galleryBBQ = GALLERY_IMAGES.bbq;
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

const GalleryItem = ({ item, index }: { item: any; index: number }) => {
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
      className={`relative group mb-10 ${index % 2 === 0 ? "md:mt-0" : "md:mt-32"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="relative overflow-hidden rounded-[20px] shadow-2xl bg-white p-3"
      >
        <img 
          src={item.img} 
          className="w-full h-auto rounded-[12px] transition-transform duration-700 group-hover:scale-[1.02]" 
          alt={item.title} 
        />
      </motion.div>
      
      <div className="mt-6 px-4 text-left">
        <span className="text-[10px] text-[#9DA07E] font-bold uppercase tracking-[0.3em] block mb-1">0{index + 1}//</span>
        <h5 className="font-serif text-xl text-slate-800 uppercase">{item.title}</h5>
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#fdfcf8] min-h-screen">
      <SEO 
        title="About Our Luxury Property"
        description="Discover One Eleven Taupo - a purpose-built luxury holiday home featuring 5 bedrooms, 4 bathrooms, heated pool, sauna, gym, and stunning Lake Taupo views. Perfect Taupo accommodation for families and groups."
        keywords="accommodation taupo, about one eleven taupo, taupo luxury holiday home, taupo vacation rental details, five bedroom taupo, lake taupo property, taupo spa accommodation, taupo sauna, heated pool taupo, taupo family accommodation, luxury rental taupo, taupo accommodation features"
        url="/about"
      />
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
          >
            <button 
              className="absolute top-0 right-0 m-4 text-white/60 hover:text-white transition-colors"
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
            <Link to="/" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Home</Link>
            <Link to="/about" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>About</Link>
            <Link to="/meet-hosts" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Meet Your Hosts</Link>
            <Link to="/guest-info" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Guest Info</Link>
            <Link 
              to="/owner-login"
              className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}
            >
              Owner Portal
            </Link>
            <Link to="/book" className="bg-[#9DA07E] text-white px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#8A8D6D] transition-all shadow-lg shadow-[#9DA07E]/20">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#fdfcf8]" />
        </div>
        <div className="relative z-10 text-center text-white space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12px] uppercase tracking-[0.5em] font-bold opacity-80"
          >
            The Story of One Eleven
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif"
          >
            About the <br /><span className="italic">Property</span>
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
                A purpose-built sanctuary <br />
                <span className="italic text-[#9DA07E]">designed for excellence.</span>
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light space-y-8"
              >
                <p>
                  Nestled in a safe, new subdivision only 5 minutes drive from town.
                </p>
                <p>
                  Our purpose built Airbnb offers 5 bedrooms, 4 bathrooms and breathtaking lake and mountain views. 
                  Enjoy a year-round heated pool, spa, sauna, outdoor shower and gym.
                </p>
                <p>
                  Keep warm with a double-sided fireplace and ducted heating throughout.
                </p>
                <p>
                  There is a playground down the road, along with two tennis courts and basketball hoops.
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
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/view%20from%20dining%20table.jpg", title: "modern architecture", speed: 0.1 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/gas%20fire.jpg", title: "Double sided gas fireplace", speed: -0.1 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Open%20plan%20living.jpg", title: "Open Plan Living", speed: 0.2 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/pool%20featurephoto.png", title: "heated pool", speed: -0.05 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg", title: "panoramic lake views", speed: 0.15 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/sauanaspa.jpg", title: "Outdoor Sauna & Spa Pool", speed: -0.12 },
                    { img: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/outdoor%20lounge.png", title: "Al Fresco Dining & BBQ", speed: 0.08 }
                  ].map((item, i) => (
                    <GalleryItem key={i} item={item} index={i} />
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          </div>
        </section>

        {/* Where You'll Sleep Section */}
        <section className="bg-[#1a1c16] py-32 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9DA07E]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9DA07E]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 text-left">
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[#9DA07E] text-[10px] font-bold uppercase tracking-[0.4em] block"
                >
                  Rest & Rejuvenate
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-serif text-white leading-tight"
                >
                  The <span className="italic">Sleeping</span> Quarters
                </motion.h2>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 w-fit"
              >
                <button 
                  onClick={() => setShowEnsuites(false)}
                  className={`px-8 py-3 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${!showEnsuites ? "bg-[#9DA07E] text-white shadow-xl" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  The Bedrooms
                </button>
                <button 
                  onClick={() => setShowEnsuites(true)}
                  className={`px-8 py-3 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${showEnsuites ? "bg-[#9DA07E] text-white shadow-xl" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  The Ensuites
                </button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { img: bedroom1, ensuiteImg: ensuite1, title: "Bedroom 1", type: "Master Suite", desc: ["1x Super King Bed", "Full Private Ensuite"] },
                { img: bedroom2, ensuiteImg: ensuite2, title: "Bedroom 2", type: "Guest Suite", desc: ["1x Super King Bed", "Full Private Ensuite"] },
                { img: bedroom3, ensuiteImg: ensuite3, title: "Bedroom 3", type: "Guest Suite", desc: ["1x King Bed", "Full Private Ensuite"] },
                { img: bedroom4, ensuiteImg: ensuite4, title: "Bedroom 4", type: "Garden View", desc: ["1x King Bed", "Full Private Ensuite"] },
                { img: bedroom5, ensuiteImg: ensuite5, title: "Bedroom 5", type: "Twin Room", desc: ["2x King Single Beds", "Full Private Ensuite"] }
              ].map((room, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="relative group text-left"
                >
                  <div className="absolute -top-4 -left-2 z-20 font-serif text-5xl text-white/5 italic pointer-events-none group-hover:text-[#9DA07E]/20 transition-colors duration-500">
                    0{i + 1}
                  </div>

                  <div 
                    onClick={() => setSelectedImage(showEnsuites ? room.ensuiteImg : room.img)}
                    className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-8 shadow-2xl bg-black/40 cursor-zoom-in group/img"
                  >
                    <motion.img 
                      key={showEnsuites ? 'ensuite' : 'bedroom'}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      src={showEnsuites ? room.ensuiteImg : room.img} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={room.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c16] via-transparent to-transparent opacity-40" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-white/20 p-3 rounded-full border border-white/40">
                        <Maximize2 className="text-white" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative px-2">
                    <h4 className="font-serif text-2xl text-white group-hover:text-[#9DA07E] transition-colors duration-300">
                      {room.title}
                    </h4>
                    <div className="h-px w-8 bg-[#9DA07E]/40 group-hover:w-full transition-all duration-700" />
                    <div className="space-y-2">
                      {room.desc.map((line, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#9DA07E]/40" />
                          <p className="text-white/50 text-[10px] tracking-widest leading-relaxed font-medium uppercase">{line}</p>
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
                    className="text-[#9DA07E] text-[10px] font-bold uppercase tracking-[0.5em] block"
                  >
                    The Distinction
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight"
                  >
                    Why guests choose <br />
                    <span className="italic text-[#9DA07E]">One Eleven | On The Mile.</span>
                  </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Waves, title: "Curated Wellness", desc: "Heated pool, outdoor sauna, spa, and signature outdoor shower experience." },
                    { icon: Zap, title: "Pristine Design", desc: "Completed in late 2024. A fresh, architectural sanctuary with modern finishes." },
                    { icon: MapPin, title: "Elite Location", desc: "The perfect balance: minutes from town center, yet tucked in a quiet, high-end enclave." },
                    { icon: Eye, title: "Scenic Mastery", desc: "Uninterrupted lake and mountain vistas designed to be the backdrop of your stay." },
                    { icon: Maximize2, title: "Versatile Living", desc: "Bespoke sleeping arrangements for up to 10 guests—perfect for multi-gen groups." },
                    { icon: Shield, title: "Family Sanctuary", desc: "Fully fenced grounds, a garage 'play zone', and a neighborhood playground." },
                    { icon: Info, title: "Exceptional Value", desc: "Resort-level amenities with private villa exclusivity, offering superior value per guest." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`group p-8 rounded-3xl transition-all duration-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 ${i === 6 ? "md:col-span-2 bg-[#9DA07E]/5 hover:bg-[#9DA07E]/10" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#9DA07E] group-hover:text-white transition-all duration-500">
                        <item.icon size={22} className="text-[#9DA07E] group-hover:text-white transition-colors" />
                      </div>
                      <h5 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-[#9DA07E] transition-colors">{item.title}</h5>
                      <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#9DA07E]/10 rounded-full blur-[80px] -z-10" />
                  
                  <div className="bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 space-y-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-10 bg-[#9DA07E] rounded-full" />
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-slate-400">The Essentials</h4>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="group">
                          <h6 className="font-serif text-lg text-slate-900 mb-2">Pardon Our Progress</h6>
                          <p className="text-sm text-slate-500 leading-relaxed italic">
                            As a new development, you may hear daytime construction on weekdays. Evenings remain beautifully tranquil.
                          </p>
                        </div>

                        <div className="group">
                          <h6 className="font-serif text-lg text-slate-900 mb-2">Seamless Access</h6>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            Your bespoke entry code will arrive 72 hours before your journey begins.
                          </p>
                        </div>

                        <div className="group">
                          <h6 className="font-serif text-lg text-slate-900 mb-2">The Concierge Manual</h6>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            A curated guide awaits inside, detailing everything from climate control to the local's favorite cafes.
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
                          We prioritize your well-being. Please supervise children near the pool and pool cover. Our singular exterior security camera ensures neighborhood safety without compromising your indoor privacy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-[#1a1c16] rounded-[32px] p-8 text-white flex items-center justify-between group cursor-pointer"
                  onClick={() => navigate('/book')}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#9DA07E] font-bold uppercase tracking-[0.3em]">Ready to visit?</span>
                    <h4 className="font-serif text-xl">Reserve Your Dates</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#9DA07E] transition-colors">
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