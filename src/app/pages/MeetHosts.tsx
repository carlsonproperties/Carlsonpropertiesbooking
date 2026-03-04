import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Menu, Quote, Heart, Target, Instagram, Facebook } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { FAMILY_IMAGES } from "../lib/images";

// Using your Supabase-hosted property images for family section
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
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#fdfcf8] min-h-screen font-sans selection:bg-[#9DA07E]/30">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4 bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm" : "py-8 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/">
            <CarlsonLogo dark={isScrolled} />
          </Link>
          
          <div className="flex gap-12 items-center text-[11px] uppercase tracking-[0.3em] font-bold hidden lg:flex">
            <Link to="/" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Home</Link>
            <Link to="/about" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>About</Link>
            <Link to="/meet-hosts" className="text-[#9DA07E]">Meet Your Hosts</Link>
            <Link to="/guest-info" className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}>Guest Info</Link>
            <Link 
              to="/owner-login"
              className={`${isScrolled ? "text-slate-800" : "text-white"} hover:text-[#9DA07E] transition-colors`}
            >
              Owner Portal
            </Link>
            <Link to="/book" className="bg-[#9DA07E] text-white px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#8A8D6D] transition-all shadow-xl shadow-[#9DA07E]/20">
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
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/IMG_6633_1.jpg" className="w-full h-full object-cover opacity-60 brightness-75 scale-105" alt="The Carlson Family" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#1a1c16]" />
        </motion.div>
        
        <motion.div style={{ y: textY }} className="relative z-10 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <span className="text-[12px] uppercase tracking-[0.8em] font-black text-[#9DA07E] bg-[#9DA07E]/10 px-6 py-2 rounded-full border border-[#9DA07E]/20 backdrop-blur-sm inline-block">The Creators</span>
            <h1 className="text-7xl md:text-[11rem] font-serif leading-[0.8] tracking-tighter">
              Matt & <br />
              <span className="italic text-[#9DA07E]">Ashleigh.</span>
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-[0.2em] opacity-80 max-w-2xl mx-auto mt-12 font-serif uppercase">
              The Heart of Carlson Properties
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-24 bg-gradient-to-b from-[#9DA07E] to-transparent" />
        </motion.div>
      </section>

      {/* Vision Statement */}
      <section className="py-40 bg-[#1a1c16] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full pointer-events-none opacity-5">
           <h2 className="text-[30vw] font-serif text-[#9DA07E] whitespace-nowrap select-none">CARLSON PROPERTIES</h2>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-12">
              <Quote className="text-[#9DA07E] w-20 h-20 opacity-20" />
              <h2 className="text-4xl md:text-6xl font-serif text-white/95 leading-[1.15] italic font-light">
                We wanted to create a space that truly <span className="text-[#9DA07E]">felt like home</span>, where you had everything at your fingertips—no need to pop out for scissors.
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-16 h-px bg-[#9DA07E]" />
                <p className="text-[#9DA07E] uppercase tracking-[0.5em] text-xs font-black">Our Philosophy</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#9DA07E]/20 rounded-[50px] blur-2xl group-hover:bg-[#9DA07E]/30 transition-all" />
              <img src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/IMG_6457_2.jpg" className="relative rounded-[40px] shadow-2xl w-full grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Family High Five" />
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
                <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.6em] block">The First Chapter</span>
                <h3 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">
                  Poured our <br />
                  <span className="italic underline decoration-[#9DA07E]/30 underline-offset-12 text-[#9DA07E]">hearts in.</span>
                </h3>
              </div>
              
              <div className="space-y-8 text-xl text-slate-500 font-light leading-relaxed">
                <p>
                  This is our first Airbnb build. We have poured our hearts into creating a space that combines comfort, luxury, and the natural beauty of Taupō. 
                </p>
                <p>
                  We are fortunate to live in this neighbourhood and feel privileged to share it. Our goal is to create enough of a memorable experience that you’ll be eager to return and make it part of your <span className="text-slate-900 font-medium">yearly travel plans.</span>
                </p>
              </div>

              <div className="flex gap-16 items-center pt-8">
                <div className="group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#9DA07E] transition-all shadow-sm">
                    <Heart className="text-[#9DA07E] group-hover:text-white" size={24} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-4 text-center">Built with Love</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#9DA07E] transition-all shadow-sm">
                    <Target className="text-[#9DA07E] group-hover:text-white" size={24} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-4 text-center">Bespoke Design</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[40px] overflow-hidden shadow-xl aspect-[3/4]"
              >
                <img src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/IMG_6316_1.jpg" className="w-full h-full object-cover" alt="The Carlson Group" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-[40px] overflow-hidden shadow-xl aspect-[3/4] mt-12"
              >
                <img src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/IMG_6261_2.jpg" className="w-full h-full object-cover" alt="Family Playing" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#1a1c16]">
        <div className="absolute inset-0 opacity-40">
           <img src={familyFieldWalk} className="w-full h-full object-cover" alt="Walking in the field" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c16] via-[#1a1c16]/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-left">
          <div className="max-w-3xl space-y-12">
            <div className="space-y-6">
              <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.7em] block">Our Focus</span>
              <h3 className="text-5xl md:text-8xl font-serif text-white leading-tight">
                Excellence <br />
                <span className="italic text-[#9DA07E]">in every detail.</span>
              </h3>
            </div>
            
            <p className="text-2xl text-white/70 font-light leading-relaxed">
              Our ambition has shifted from expansion to refinement. We are dedicated to making One Eleven the premier destination in Taupō, focusing every effort on providing a world-class experience that brings you back year after year.
            </p>

            <Link 
              to="/book"
              className="group inline-flex items-center gap-6 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-full transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#9DA07E] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="text-white" size={20} />
              </div>
              <div className="text-left">
                <span className="text-white font-serif text-lg block">The Carlson Commitment</span>
                <span className="text-[#9DA07E] text-[9px] uppercase tracking-[0.4em] font-black">Book Your Stay</span>
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
              <img src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/IMG_6591_1.jpg" className="w-full h-full object-cover" alt="Kids lying in grass" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="font-serif text-2xl italic">"Our Little Explorers"</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.5em] block">The Legacy</span>
                <h3 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight">
                  A place for <br />
                  <span className="italic text-[#9DA07E]">travel stories.</span>
                </h3>
              </div>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                We hope to be a part of your travel stories for years to come. We are excited to welcome you to our neighbourhood and help you create memories that last a lifetime.
              </p>
              
              <div className="flex flex-wrap gap-8 items-center pt-6">
                <a href="https://www.instagram.com/oneelevenonthemile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-[#fdfcf8] border border-slate-100 flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-all shadow-sm">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">@oneelevenonthemile</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Instagram</span>
                  </div>
                </a>
                <a href="https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-[#fdfcf8] border border-slate-100 flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-all shadow-sm">
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