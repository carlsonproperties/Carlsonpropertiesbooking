import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, Quote, Heart, Target, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router";
import { MobileMenu } from "../components/MobileMenu";
import { StatementFooter as Footer } from "../components/StatementFooter";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { FAMILY_IMAGES } from "../lib/images";

// Using your Supabase-hosted property images for family section
const familyBanner = FAMILY_IMAGES.banner;
const familyGroup = FAMILY_IMAGES.group;
const familyFieldWalk = FAMILY_IMAGES.outdoor;
const kidsLyingDown = FAMILY_IMAGES.kids;
const familyHighFive = FAMILY_IMAGES.highFive;
const familyPlaying = FAMILY_IMAGES.playing;

export function MeetHosts() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax and scroll effects
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#F4F1EA] min-h-screen font-sans selection:bg-[#203F3A]/30">
      <SEO
        title="Meet Your Hosts | Matt & Ashleigh Carlson"
        description="Meet Matt and Ashleigh Carlson, the local family behind One Eleven on the Mile in Taupō, and discover why they built the house for easy group stays."
        url="/meet-hosts"
      />
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4 bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm" : "py-8 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/">
            <CarlsonLogo dark={isScrolled} />
          </Link>
          
          <div className="flex gap-12 items-center text-[11px] uppercase tracking-[0.3em] font-bold hidden lg:flex">
            <Link to="/" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>Home</Link>
            <Link to="/about" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>About</Link>
            <Link to="/meet-hosts" className="text-[#203F3A]">Meet Your Hosts</Link>
            <Link to="/guest-info" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#203F3A] transition-colors`}>Guest Info</Link>
            <Link to="/book" className="bg-[#203F3A] text-white px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#D7C8B4] transition-all shadow-xl shadow-[#203F3A]/20">
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

      {/* Hero Section */}
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-[#16302B]">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img src={familyBanner} className="w-full h-full object-cover opacity-60 brightness-75 scale-105" alt="The Carlson Family" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#1a1c16]" />
        </motion.div>
        
        <motion.div style={{ y: textY }} className="relative z-10 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <span className="text-[11px] uppercase tracking-[0.6em] font-bold text-[#D7C8B4] bg-white/10 px-6 py-2 rounded-full border border-[#D7C8B4]/30 backdrop-blur-sm inline-block">Your Local Hosts</span>
            <h1 className="text-7xl md:text-[11rem] font-serif leading-[0.8] tracking-tighter text-[#F4F1EA]">
              Matt & <br />
              <span className="italic text-[#D7C8B4]">Ashleigh.</span>
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-[0.2em] text-[#F4F1EA]/85 max-w-2xl mx-auto mt-12 font-serif uppercase">
              Local hosts, just around the corner
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-24 bg-gradient-to-b from-[#203F3A] to-transparent" />
        </motion.div>
      </section>

      {/* Vision Statement */}
      <section className="py-40 bg-[#16302B] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full pointer-events-none opacity-5">
           <h2 className="text-[30vw] font-serif text-[#203F3A] whitespace-nowrap select-none">CARLSON PROPERTIES</h2>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-12">
              <Quote className="text-[#D7C8B4] w-20 h-20 opacity-30" />
              <h2 className="text-4xl md:text-6xl font-serif text-white/95 leading-[1.15] italic font-light">
                We wanted to create the kind of stay where <span className="text-[#D7C8B4]">everything feels considered</span>—right down to the scissors in the drawer.
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-[#D7C8B4]" />
                <p className="text-[#D7C8B4] uppercase tracking-[0.5em] text-xs font-bold">Our Philosophy</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#D7C8B4]/15 rounded-[50px] blur-2xl group-hover:bg-[#D7C8B4]/25 transition-all" />
              <img src={familyHighFive} className="relative w-full rounded-[40px] shadow-2xl grayscale transition-all duration-1000 ease-out group-hover:grayscale-0" alt="Family High Five" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-40 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start text-left">
            <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-40">
              <div className="space-y-8">
                <span className="text-[#203F3A] text-[10px] font-black uppercase tracking-[0.6em] block">How It Began</span>
                <h3 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">
                  Built with family <br />
                  <span className="italic underline decoration-[#203F3A]/30 underline-offset-12 text-[#203F3A]">stays in mind.</span>
                </h3>
              </div>
              
              <div className="space-y-8 text-xl text-slate-500 font-light leading-relaxed">
                <p>
                  One Eleven was our first purpose-built holiday home. We designed it around the things we value when we travel as a family: room to be together, space to retreat, and the practical details already taken care of.
                </p>
                <p>
                  We live in the neighbourhood, so guests have local support when they need it. Our hope is simple: that the house feels easy to settle into and <span className="text-slate-900 font-medium">worth returning to.</span>
                </p>
              </div>

              <div className="flex gap-16 items-center pt-8">
                <div className="group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#203F3A] transition-all shadow-sm">
                    <Heart className="text-[#203F3A] group-hover:text-white" size={24} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-4 text-center">Family Hosted</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#203F3A] transition-all shadow-sm">
                    <Target className="text-[#203F3A] group-hover:text-white" size={24} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-4 text-center">Purpose Built</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-[40px] overflow-hidden shadow-xl aspect-[3/4]"
              >
                <img src={familyGroup} alt="The Carlson Group" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group rounded-[40px] overflow-hidden shadow-xl aspect-[3/4] mt-12"
              >
                <img src={familyPlaying} alt="Family Playing" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Section */}
      {/* min-h, not h: a fixed 80vh clipped the heading and the button out of
          the section on shorter viewports, because the content is taller than
          the box. Padding lets it grow instead. */}
      <section className="relative min-h-[80vh] py-28 md:py-36 flex items-center overflow-hidden bg-[#16302B]">
        <div className="absolute inset-0 opacity-40">
           <img src={familyFieldWalk} className="w-full h-full object-cover" alt="Open-plan kitchen and breakfast bar at One Eleven" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c16] via-[#1a1c16]/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-left">
          <div className="max-w-3xl space-y-8 md:space-y-10">
            <div className="space-y-6">
              <span className="text-[#D7C8B4] text-[10px] font-bold uppercase tracking-[0.7em] block">Designed for Real Stays</span>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.12]">
                Everything you need, <br />
                <span className="italic text-[#D7C8B4]">where you need it.</span>
              </h3>
            </div>
            
            <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
              The kitchen opens directly to outdoor dining, the living spaces give groups room to spread out, and practical details are in place before you arrive. We keep refining the house through the feedback our guests share.
            </p>

            <Link 
              to="/book"
              className="group inline-flex items-center gap-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#D7C8B4]/40 px-10 py-5 rounded-full transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#D7C8B4] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="text-[#203F3A]" size={20} />
              </div>
              <div className="text-left">
                {/* Same reason as the /book heading: Fraunces has no
                    precomposed ō, so it falls back mid-word. */}
                <span className="text-white font-serif text-lg block">Plan your stay</span>
                <span className="text-[#D7C8B4] text-[10px] uppercase tracking-[0.35em] font-bold">Check availability</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* The Joy Section */}
      <section className="py-40 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[16/10] rounded-[60px] overflow-hidden shadow-2xl"
            >
              <img src={kidsLyingDown} className="w-full h-full object-cover" alt="Kids lying in grass" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="font-serif text-2xl italic">"Our Little Explorers"</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-[#203F3A] text-[10px] font-black uppercase tracking-[0.5em] block">Why It Matters</span>
                <h3 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight">
                  Made for <br />
                  <span className="italic text-[#203F3A]">time together.</span>
                </h3>
              </div>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                As parents, we know the best group stays are the ones that feel easy. One Eleven gives families and friends room to settle in, spread out and enjoy Taupō together.
              </p>
              
              <div className="flex flex-wrap gap-8 items-center pt-6">
                <a href="https://www.instagram.com/oneelevenonthemile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] border border-slate-100 flex items-center justify-center text-[#203F3A] group-hover:bg-[#203F3A] group-hover:text-white transition-all shadow-sm">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">@oneelevenonthemile</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Instagram</span>
                  </div>
                </a>
                <a href="https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] border border-slate-100 flex items-center justify-center text-[#203F3A] group-hover:bg-[#203F3A] group-hover:text-white transition-all shadow-sm">
                    <Facebook size={24} />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">One Eleven On The Mile</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Facebook</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
