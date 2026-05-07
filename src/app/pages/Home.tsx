import React, { useState, useEffect, useRef } from "react";
import { Star, MapPin, Shield, Coffee, Menu, Instagram, Facebook, Waves, Dumbbell, Zap, Thermometer, Clock, Volume2, VolumeX } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useNavigate, Link } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Testimonials } from "../components/Testimonials";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { HOME_IMAGES, DRONE_VIDEO } from "../lib/images";

// Using your Supabase-hosted images and video
const heroImg = HOME_IMAGES.hero;
const wellnessAreaImg = HOME_IMAGES.wellness;

export function Home() {
  const [property, setProperty] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted per request
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Auto-mute when scrolling past the hero section to prevent background noise
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        if (rect.bottom < 100) {
          if (!isMuted) setIsMuted(true);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    async function fetchData() {
      try {
        const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/properties`, {
          headers: { Authorization: `Bearer ${publicAnonKey.trim()}` }
        });
        const data = await res.json();
        setProperty(data[0] || { name: 'One Eleven' });
      } catch (err) {
        console.error(err);
        setProperty({ name: 'One Eleven' });
      }
    }
    fetchData();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay with sound was blocked by browser, playing muted as fallback:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
            // Show a subtle prompt if sound was blocked by the browser policy
            if (!isMuted) setShowSoundPrompt(true);
          }
        });
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowSoundPrompt(false);
  };

  return (
    <>
      <SEO 
        title="One Eleven On The Mile - Luxury Lakefront Accommodation Taupō"
        description="Experience ultimate luxury at One Eleven On The Mile. 5-bedroom lakefront estate in Taupō with pool, sauna, gym, and breathtaking Lake Taupō views. Book your exclusive stay."
        keywords="Taupō luxury accommodation, lakefront holiday home Taupō, Taupō vacation rental, luxury Taupō stay, Lake Taupō accommodation, Taupō pool house, 5 bedroom Taupō rental"
        canonicalUrl="https://carlsonproperties.co.nz"
      />

      <div ref={containerRef} className="relative min-h-screen bg-[#fdfcf8]">
        {!property ? (
          <div className="h-screen flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#9DA07E] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
              isScrolled ? "py-4 bg-white/90 backdrop-blur-xl shadow-sm" : "py-8 bg-transparent"
            }`}>
              <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/">
                  <CarlsonLogo dark={isScrolled} />
                </Link>
                
                <div className="flex gap-12 items-center text-[11px] uppercase tracking-widest font-semibold hidden lg:flex">
                  <Link to="/about" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>About</Link>
                  <Link to="/meet-hosts" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Meet Your Hosts</Link>
                  <Link to="/guest-info" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Guest Info</Link>
                  <Link to="/blog" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Journal</Link>
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

            <section ref={heroSectionRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
              <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-900">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted={isMuted}
                    loop 
                    playsInline 
                    className="w-full h-full object-cover brightness-[0.4] scale-110"
                  >
                    <source 
                      src={DRONE_VIDEO}
                      type="video/mp4" 
                    />
                    <img 
                      src={heroImg} 
                      className="w-full h-full object-cover" 
                      alt="One Eleven Taupo - Luxury lakefront accommodation with mountain views"
                      onError={(e) => {
                        console.error('Hero image failed to load');
                        console.error('Hero image URL:', e.currentTarget.src);
                        console.error('Check if Supabase Storage bucket "Website Media" is set to PUBLIC');
                        // Set fallback image
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop';
                      }}
                      onLoad={() => console.log('Hero image loaded successfully:', heroImg)}
                    />
                  </video>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#fdfcf8]" />
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={toggleMute}
                className="absolute bottom-10 right-10 z-50 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-white/20 transition-all group flex flex-col items-center"
              >
                {isMuted ? (
                  <div className="flex items-center gap-3">
                    <VolumeX size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest font-bold pr-2">Unmute</span>
                    {showSoundPrompt && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl"
                      >
                        Tap for sound
                      </motion.span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest font-bold pr-2">Mute</span>
                  </div>
                )}
              </motion.button>

              <div className="relative z-10 text-center text-white px-6">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[12px] uppercase tracking-[0.5em] mb-6 font-medium"
                >
                  Luxury stays in Taupō
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl md:text-9xl font-serif mb-8 tracking-tighter"
                >
                  One Eleven <br />
                  <span className="italic font-normal opacity-90 text-[0.8em]">On the Mile</span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <button className="group flex flex-col items-center gap-4 mx-auto cursor-pointer">
                    <div className="w-[1px] h-12 bg-white/50 relative overflow-hidden">
                      <motion.div 
                        animate={{ y: [0, 48] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-full h-full bg-[#9DA07E]" 
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Discover</span>
                  </button>
                </motion.div>
              </div>
            </section>

            <section className="py-24 px-6 bg-[#fdfcf8]">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 leading-tight">
                    Welcome to Carlson Properties – <br className="hidden md:block" />
                    <span className="text-[#9DA07E] italic">Luxury Taupō Accommodation</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                    Discover the finest luxury Taupō accommodation at One Eleven on the Mile, where contemporary design meets unrivalled lake and mountain views. Our premium lakefront property redefines the art of relaxation, offering an exclusive retreat that combines world-class amenities with the natural beauty of New Zealand's Great Lake.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-16"
                >
                  <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                    Unrivalled Panoramic <span className="text-[#9DA07E] italic">Lakeviews</span>
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8 font-light">
                    Our five-bedroom, four-bathroom estate is purpose-built to showcase sweeping views of Lake Taupō and the majestic Tongariro mountain range. Whether you are lounging by the heated pool, unwinding in the spa, or preparing a meal in the gourmet kitchen, every moment is framed by breathtaking scenery. With accommodation for up to 10 guests, this is the ultimate destination for families, groups, or couples seeking a luxurious escape.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { title: "Heated Pool & Spa", desc: "Relax in climate-controlled comfort year-round" },
                      { title: "Outdoor Sauna & Gym", desc: "Maintain your wellness routine in style" },
                      { title: "Lake & Mountain Views", desc: "Panoramic vistas from every room" }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-[#9DA07E]/20 shadow-sm"
                      >
                        <h4 className="font-serif text-xl text-[#9DA07E] mb-2">{feature.title}</h4>
                        <p className="text-sm text-slate-600 font-light leading-relaxed">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-16"
                >
                  <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                    Experience the Best of <span className="text-[#9DA07E] italic">Taupō</span>
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    Ideally located just five minutes from Taupō town center, One Eleven on the Mile offers easy access to the region's finest attractions. Spend your days exploring geothermal wonders, fishing on the lake, or dining at award-winning restaurants. When evening falls, return to your private sanctuary to enjoy a quiet drink by the fire or a soak under the stars.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mb-12"
                >
                  <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                    Why Book Direct with <span className="text-[#9DA07E] italic">Carlson Properties?</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {[
                      { title: "Best Rate Guarantee", desc: "Save on commission fees when you book directly with us" },
                      { title: "Flexible Booking", desc: "Personalized service and flexible check-in arrangements" },
                      { title: "Exclusive Perks", desc: "Special offers and local recommendations from your hosts" },
                      { title: "Direct Communication", desc: "Speak directly with property owners for a seamless stay" }
                    ].map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#9DA07E] mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-serif text-lg text-slate-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-slate-600 font-light leading-relaxed">{benefit.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-center"
                >
                  <p className="text-xl text-slate-700 mb-6 font-light">
                    Check availability and book your dates today
                  </p>
                  <Link
                    to="/book"
                    className="inline-block bg-[#9DA07E] text-white px-12 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#8A8D6D] transition-all shadow-lg shadow-[#9DA07E]/20"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </section>

            <section id="about" className="py-32 px-6">
              <div className="max-w-[1400px] mx-auto text-left">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[40px]">
                      <img src={wellnessAreaImg} className="w-full h-full object-cover" alt="Luxury wellness area with heated pool, spa, and outdoor sauna at One Eleven Taupo accommodation" />
                    </div>
                    <div className="absolute -bottom-12 -right-12 bg-white p-10 rounded-3xl shadow-2xl max-w-[280px] hidden md:block border border-slate-100">
                      <Thermometer className="text-[#9DA07E] mb-4" size={32} />
                      <h4 className="font-serif text-2xl mb-2">Wellness Oasis</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-light">Relax in our heated pool, outdoor sauna, and spa, designed for ultimate rejuvenation.</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                  >
                    <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-[#9DA07E]">The Property</span>
                    <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.1]">
                      Redefining the <br />
                      <span className="italic text-[#9DA07E]">Holiday Stay</span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed font-light">
                      Nestled in a safe, new subdivision only 5 minutes drive from town. 
                      Our purpose built Airbnb offers 5 bedrooms, 4 bathrooms and breathtaking lake and mountain views.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-200">
                      {[
                        { label: "Guests", value: "Up to 10" },
                        { label: "Bedrooms", value: "5 Luxury Suites" },
                        { label: "Wellness", value: "Sauna & Gym" },
                        { label: "Views", value: "Lake & Mountain" },
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{item.label}</p>
                          <p className="text-lg font-serif text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <Testimonials />

            <section id="amenities" className="bg-[#9DA07E] py-40 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-20 left-10 text-[20vw] font-serif text-white whitespace-nowrap select-none">AMENITIES LUXURY RELAX</div>
              </div>

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                  <h2 className="text-5xl md:text-8xl font-serif text-white mb-6">Equipped for <span className="italic">Excellence</span></h2>
                  <p className="text-white/80 max-w-2xl mx-auto text-lg font-light">Every detail curated to ensure your stay exceeds every expectation.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { icon: Waves, title: "Outdoor Spa", desc: "Climate controlled pool & sauna" },
                    { icon: Dumbbell, title: "Pro Gym", desc: "Full fitness suite in-house" },
                    { icon: Zap, title: "Fiber Wifi", desc: "High-speed digital connectivity" },
                    { icon: Thermometer, title: "Climate", desc: "Ducted heating & fireplace" },
                    { icon: Shield, title: "Security", desc: "24/7 exterior monitoring" },
                    { icon: Coffee, title: "Chef Kitchen", desc: "Basics & Espresso Machine" },
                    { icon: Clock, title: "Self Check-in", desc: "Smart lock entry system" },
                    { icon: MapPin, title: "Location", desc: "5 mins from Taupō center" },
                  ].map((item, i) => (
                    <motion.div 
                      whileHover={{ y: -10 }}
                      key={i} 
                      className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 text-white text-left"
                    >
                      <item.icon className="mb-6 opacity-80" size={32} />
                      <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                      <p className="text-sm opacity-60 leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <Footer />
          </>
        )}
      </div>
    </>
  );
}