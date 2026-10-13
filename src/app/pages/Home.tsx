import React, { useState, useEffect, useRef } from "react";
import { Star, MapPin, Shield, Coffee, Menu, Waves, Dumbbell, Zap, Thermometer, Clock, Volume2, VolumeX, ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useNavigate, Link } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Testimonials } from "../components/Testimonials";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { OneElevenLogo } from "../components/OneElevenLogo";
import { SEO } from "../components/SEO";
import { CustomCursor } from "../components/CustomCursor";
import { EditorialPreloader } from "../components/EditorialPreloader";
import { ArchitecturalWalkthrough } from "../components/ArchitecturalWalkthrough";
import { ClubhouseGuestWorld } from "../components/ClubhouseGuestWorld";
import { AmenityIcon } from "../components/AmenityIcon";
import { OvalBadge, ClubRoundel, ScallopedSeal } from "../components/ClubMarks";
import { HOME_IMAGES, DRONE_VIDEO } from "../lib/images";

const heroImg = HOME_IMAGES.hero;
const wellnessAreaImg = HOME_IMAGES.wellness;

export function Home() {
  const [property, setProperty] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 1.08]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Auto-mute when scrolling past hero
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        if (rect.bottom < 100) {
          if (!isMuted) setIsMuted(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    async function fetchData() {
      try {
        const res = await fetch(
          `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/properties`,
          {
            headers: { Authorization: `Bearer ${publicAnonKey.trim()}` },
          }
        );
        const data = await res.json();
        setProperty(data[0] || { name: "One Eleven" });
      } catch (err) {
        console.error("Property fetch error:", err);
        setProperty({ name: "One Eleven" });
      }
    }
    fetchData();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowSoundPrompt(false);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <>
      <SEO
        title="One Eleven on the Mile — Taupō Holiday Accommodation | Heated Pool, Sauna & Lake Views"
        description="A five-bedroom Taupō lake house on Jarden Mile with year-round heated pool, cedar sauna, spa, gym, and expansive Lake Taupō views. Warm personal hosting by Matt and Ashleigh Carlson."
        keywords="Taupō holiday accommodation, One Eleven on the Mile, Lake Taupō holiday home, heated pool Taupō, cedar sauna accommodation, 5 bedroom Taupō house"
        canonicalUrl="https://carlsonproperties.co.nz"
      />

      {/* Bespoke Awwwards Cursor */}
      <CustomCursor />

      {/* Editorial Preloader */}
      <EditorialPreloader onComplete={() => setPreloaderDone(true)} />

      <div ref={containerRef} className="relative min-h-screen bg-[#F4F1EA] text-[#203F3A]">
        {/* Navigation Bar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
            isScrolled ? "py-4 bg-[#F4F1EA]/95 backdrop-blur-xl border-b border-[#D7C8B4]/40 shadow-sm" : "py-8 bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" data-cursor="home">
              <CarlsonLogo dark={isScrolled} />
            </Link>

            <div className="flex gap-10 items-center text-[11px] uppercase tracking-[0.22em] font-semibold hidden lg:flex">
              <Link
                to="/about"
                className={`${isScrolled ? "text-[#203F3A]" : "text-[#F4F1EA]"} hover:text-[#D7C8B4] transition-colors`}
              >
                About The House
              </Link>
              <Link
                to="/meet-hosts"
                className={`${isScrolled ? "text-[#203F3A]" : "text-[#F4F1EA]"} hover:text-[#D7C8B4] transition-colors`}
              >
                Meet Hosts
              </Link>
              <Link
                to="/guest-info"
                className={`${isScrolled ? "text-[#203F3A]" : "text-[#F4F1EA]"} hover:text-[#D7C8B4] transition-colors`}
              >
                Guest Manual
              </Link>
              <Link
                to="/blog"
                className={`${isScrolled ? "text-[#203F3A]" : "text-[#F4F1EA]"} hover:text-[#D7C8B4] transition-colors`}
              >
                Journal
              </Link>
              {/* Owner Portal is staff-only — it lives in the footer, not the guest nav. */}
              <Link
                to="/book"
                data-cursor="book"
                className={`px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md ${
                  isScrolled
                    ? "bg-[#203F3A] text-[#F4F1EA] hover:bg-[#16302B]"
                    : "bg-[#F4F1EA] text-[#203F3A] hover:bg-[#D7C8B4]"
                }`}
              >
                Reserve Stay
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled ? "text-[#203F3A] hover:bg-black/5" : "text-[#F4F1EA] hover:bg-white/10"
              }`}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Hero Section with Drone Video */}
        <section
          ref={heroSectionRef}
          className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#16211E]"
        >
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover brightness-[0.7] scale-105"
            >
              <source src={DRONE_VIDEO} type="video/mp4" />
              <img
                src={heroImg}
                className="w-full h-full object-cover"
                alt="One Eleven on the Mile Taupō exterior overlooking Lake Taupō"
              />
            </video>
            {/* Editorial Lake & Stone overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#F4F1EA]" />
          </motion.div>

          {/* Sound Toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            onClick={toggleMute}
            data-cursor="sound"
            className="absolute bottom-10 right-8 md:right-12 z-40 bg-[#203F3A]/70 backdrop-blur-md border border-[#D7C8B4]/30 px-4 py-3 rounded-full text-[#F4F1EA] hover:bg-[#203F3A] transition-all flex items-center gap-2.5 cursor-pointer shadow-lg"
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              {isMuted ? "Sound Off" : "Sound On"}
            </span>
          </motion.button>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-[#F4F1EA] px-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#D7C8B4]/30 bg-[#203F3A]/40 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7C8B4]" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7C8B4] font-medium">
                111 Jarden Mile · Taupō, NZ
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-7xl md:text-9xl font-serif font-light mb-6 tracking-tight text-[#F4F1EA] leading-[0.95]"
            >
              One Eleven <br />
              <span className="italic font-normal text-[#D7C8B4] text-[0.85em]">On the Mile</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="max-w-xl mx-auto text-sm sm:text-base md:text-lg text-[#F4F1EA]/85 font-light leading-relaxed mb-10"
            >
              Beautiful places to stay, warm personal hosting, and time together. Five bedrooms, heated pool, cedar sauna, and panoramic lake vistas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/book"
                data-cursor="book"
                className="w-full sm:w-auto bg-[#F4F1EA] text-[#203F3A] px-9 py-4 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-[#D7C8B4] transition-all shadow-xl"
              >
                Check Availability
              </Link>
              <a
                href="#walkthrough"
                data-cursor="explore"
                className="w-full sm:w-auto border border-[#F4F1EA]/40 text-[#F4F1EA] px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span>Tour The Spaces</span>
                <ArrowDown size={14} />
              </a>
            </motion.div>

            {/* Social proof, above the fold. The Google listing rates 5.0, so it
                shows as five stars — never a decimal. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45 }}
              className="mt-8 flex justify-center"
            >
              <a
                href="https://g.page/r/CZuTLT-YqNStEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="VIEW"
                className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#F4F1EA]/90 hover:text-[#D7C8B4] transition-colors"
              >
                <span aria-hidden="true" className="text-[#D7C8B4] tracking-[0.1em]">★★★★★</span>
                Five stars on Google
              </a>
            </motion.div>
          </div>
        </section>

        {/* Architectural Walkthrough — Interactive Scrollytelling Section */}
        {/* Board 4: The Website's Line of House Facts */}
        <section className="bg-[#EBE6DC] border-y border-[#D7C8B4]/60 py-6 px-6 overflow-x-auto select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[780px] gap-6 text-[#203F3A]">
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="bedrooms" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">5 Bedrooms</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="bathrooms" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">4 Bathrooms</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="sleeps" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">Sleeps 10</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="pool" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">Heated Pool</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="sauna" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">Cedar Sauna</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="spa" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">Spa Pool</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="coffee" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">Barista Espresso</span>
            </div>
            <span className="text-[#D7C8B4] text-xs">/</span>
            <div className="flex items-center gap-2.5">
              <AmenityIcon name="location" size={20} color="#203F3A" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans">5 Min to Town</span>
            </div>
          </div>
        </section>

        <div id="walkthrough">
          <ArchitecturalWalkthrough />
        </div>

        {/* The House Story / Overview */}
        <section className="py-24 md:py-36 px-6 bg-[#F4F1EA]">
          <div className="max-w-[1340px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              {/* Photo Card with Arched Frame */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-[#D7C8B4]/70 bg-white">
                  <img
                    src={wellnessAreaImg}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Heated pool and cedar outdoor sauna at One Eleven on the Mile"
                  />
                  {/* Oval Badge from Good Company Board */}
                  <div className="absolute top-6 right-6 z-20 hidden sm:block">
                    <OvalBadge size={130} />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-[#203F3A]/90 backdrop-blur-md text-[#F4F1EA] p-6 rounded-2xl border border-[#D7C8B4]/30">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#D7C8B4] font-semibold block mb-1">
                      Private Wellness
                    </span>
                    <h4 className="font-serif text-xl font-normal">Heated Pool, Spa &amp; Cedar Sauna</h4>
                    <p className="text-xs text-[#F4F1EA]/70 mt-1 font-light">
                      Swum even in the depths of July. Designed for total privacy and effortless relaxation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Story Copy */}
              <div className="lg:col-span-6 space-y-8 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#9B7955]" />
                  <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-[#9B7955]">
                    Hosted By Matt &amp; Ashleigh
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#203F3A] leading-[1.1]">
                  Thoughtfully designed for <br />
                  <span className="italic font-normal">time together.</span>
                </h2>

                <p className="text-base md:text-lg text-[#203F3A]/85 font-light leading-relaxed">
                  One Eleven on the Mile was designed from the ground up to host ten people with generous ease. Five private bedrooms and four bathrooms mean everyone enjoys their own space, while expansive shared living rooms, a barista coffee bar, and broad lake views bring everyone naturally together.
                </p>

                {/* Key Facts Grid */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#D7C8B4]/60">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9B7955] font-bold block mb-1">
                      Capacity
                    </span>
                    <p className="text-xl font-serif text-[#203F3A]">Up to 10 Guests</p>
                    <p className="text-xs text-[#203F3A]/60 font-light mt-0.5">5 bedrooms, 4 bathrooms</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9B7955] font-bold block mb-1">
                      Wellness
                    </span>
                    <p className="text-xl font-serif text-[#203F3A]">Pool, Spa &amp; Sauna</p>
                    <p className="text-xs text-[#203F3A]/60 font-light mt-0.5">Heated year-round + private gym</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9B7955] font-bold block mb-1">
                      Location
                    </span>
                    <p className="text-xl font-serif text-[#203F3A]">111 Jarden Mile</p>
                    <p className="text-xs text-[#203F3A]/60 font-light mt-0.5">5 mins from Taupō town centre</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9B7955] font-bold block mb-1">
                      Hosting
                    </span>
                    <p className="text-xl font-serif text-[#203F3A]">Local Hosts</p>
                    <p className="text-xs text-[#203F3A]/60 font-light mt-0.5">Direct care from Matt &amp; Ashleigh</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to="/book"
                    data-cursor="book"
                    className="bg-[#203F3A] text-[#F4F1EA] px-9 py-4 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-[#16302B] transition-all shadow-lg"
                  >
                    View Calendar &amp; Rates
                  </Link>
                  <Link
                    to="/meet-hosts"
                    className="text-xs uppercase tracking-[0.2em] font-semibold text-[#203F3A] hover:text-[#9B7955] transition-colors px-4 py-2"
                  >
                    Meet Your Hosts →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Guest Reviews Section */}
        {/* Real Guest Reviews Section */}
        <Testimonials />

        {/* Good Company / Clubhouse Guest World: Physical Objects & Rituals */}
        <ClubhouseGuestWorld />

        {/* Amenities Grid in Lake Green */}
        <section id="amenities" className="bg-[#203F3A] py-32 md:py-40 text-[#F4F1EA] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#D7C8B4] font-medium block mb-3">
                Everything In Place
              </span>
              <h2 className="text-4xl md:text-7xl font-serif font-light text-[#F4F1EA]">
                Thoughtful <span className="italic text-[#D7C8B4]">Amenities</span>
              </h2>
              <p className="text-[#F4F1EA]/75 max-w-xl mx-auto text-sm md:text-base font-light mt-4 leading-relaxed">
                Every amenity is already here when you arrive, so you can settle in immediately without needing to hunt down essentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { iconName: "pool", title: "Heated Pool & Spa", desc: "Heated year-round, swum even in July" },
                { iconName: "sauna", title: "Outdoor Cedar Sauna", desc: "Private dry cedar sauna framed by native greenery" },
                { iconName: "gym", title: "Private Fitness Gym", desc: "In-house weights and dedicated training equipment" },
                { iconName: "coffee", title: "Barista Espresso", desc: "Fresh beans, grinder, and espresso bar ready on arrival" },
                { iconName: "wifi", title: "High-Speed Wi-Fi", desc: "Fast coverage throughout indoor & outdoor living areas" },
                { iconName: "keyless", title: "Keyless Self Check-in", desc: "Effortless arrival with your personalized digital code" },
                { iconName: "views", title: "Lake & Mountain Views", desc: "Elevated vistas across Lake Taupō and Mt Ruapehu" },
                { iconName: "location", title: "Five Minutes to Town", desc: "Lakefront strolls, cafes, and Taupō town centre" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-[#D7C8B4]/20 hover:border-[#D7C8B4]/60 hover:bg-white/10 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <AmenityIcon name={item.iconName} size={24} color="#D7C8B4" strokeWidth={2.3} />
                  </div>
                  <h4 className="font-serif text-lg text-[#F4F1EA] mb-2">{item.title}</h4>
                  <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Book Direct */}
        <section className="py-24 px-6 bg-white text-[#203F3A]">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#9B7955] font-bold block mb-3">
              Direct Direct Booking
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-4">
              Why Book <span className="italic text-[#9B7955]">Direct With Us</span>
            </h2>
            <p className="text-[#203F3A]/70 max-w-xl mx-auto font-light text-sm md:text-base mb-16">
              Reserve straight through carlsonproperties.co.nz for the best rate and direct communication with Matt &amp; Ashleigh.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { title: "Best Rate Guaranteed", desc: "No third-party platform markups or hidden fees" },
                { title: "Direct Host Contact", desc: "Speak directly with Matt & Ashleigh anytime" },
                { title: "Local Recommendations", desc: "Personal suggestions for Taupō dining and outings" },
                { title: "Flexible Care", desc: "Direct handling of requests, early arrival, or questions" },
              ].map((b, i) => (
                <div key={i} className="text-center p-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#203F3A] mx-auto mb-4" />
                  <h4 className="font-serif text-lg text-[#203F3A] mb-1.5">{b.title}</h4>
                  <p className="text-xs text-[#203F3A]/70 font-light leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Massive Awwwards Statement Footer */}
        <Footer />

        {/* Mobile booking bar — most bookings start on a phone, so the direct
            CTA stays reachable. Desktop carries it in the nav instead. */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#F4F1EA]/95 backdrop-blur-md border-t border-[#D7C8B4]"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-center gap-4 px-5 py-3">
            <div className="min-w-0">
              <p className="font-display text-lg leading-none text-[#203F3A]">Sleeps 10</p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#203F3A]/70">
                Pool · Sauna · Spa
              </p>
            </div>
            <Link
              to="/book"
              data-cursor="RESERVE"
              className="ml-auto shrink-0 rounded-full bg-[#203F3A] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4F1EA] transition-colors hover:bg-[#16302B]"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
