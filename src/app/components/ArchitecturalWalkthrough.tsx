import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { DRONE_VIDEO } from "../lib/images";
import { Waves, Flame, Sparkles, Coffee, Compass, Volume2, VolumeX, Eye } from "lucide-react";

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  quote?: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  fallbackUrl?: string;
  badges: string[];
  ambientColor: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "elevation",
    number: "01",
    title: "The Rise on Jarden Mile",
    subtitle: "Elevation & Architecture",
    description:
      "Dark vertical cedar cladding, a shallow roofline, and soaring glass. Positioned high on the mile to command uninterrupted sweeps across Lake Taupō and the mountains beyond.",
    quote: "Positioned 5 minutes from town, yet quiet enough to hear the lake breeze.",
    mediaType: "video",
    mediaUrl: DRONE_VIDEO,
    fallbackUrl: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg",
    badges: ["5 Bedrooms", "4 Bathrooms", "10 Guests", "5 Mins to Town"],
    ambientColor: "#203F3A",
  },
  {
    id: "living",
    number: "02",
    title: "Where Everyone Gathers",
    subtitle: "Great Room & Hearth",
    description:
      "Expansive open-plan living with timber accents and full-height glazing. Designed so ten guests can share morning espresso at the island, linger over long dinners, and look out at the water without ever feeling crowded.",
    quote: "The house is spacious, clean, and incredibly well appointed. Zero complaints.",
    mediaType: "image",
    mediaUrl: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/looking%20into%20kitchen.png",
    badges: ["Barista Espresso Bar", "10-Seater Dining", "Open-Plan Living", "Lake Glazing"],
    ambientColor: "#2C3E38",
  },
  {
    id: "wellness",
    number: "03",
    title: "Heated Year-Round, Swum in July",
    subtitle: "The Wellness Sanctuary",
    description:
      "A private courtyard retreat. Transition effortlessly between the outdoor cedar sauna, the steaming hydrotherapy spa, and the heated pool—framed by manicured gardens and fresh Taupō mountain air.",
    quote: "The pool and sauna area made it really hard to leave.",
    mediaType: "image",
    mediaUrl: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/poolview.jpg",
    badges: ["Year-Round Heated Pool", "Cedar Outdoor Sauna", "Open-Air Spa", "Private Gym"],
    ambientColor: "#1B332F",
  },
  {
    id: "dusk",
    number: "04",
    title: "When the Water Turns to Glass",
    subtitle: "Dusk & Starry Nights",
    description:
      "As the sun dips behind the western ranges, the water turns to glass. Steaming hot tub under Taupō's starlit skies, fire glowing, and wine shared with family and friends.",
    quote: "The pool was the perfect temperature even for night swims on a cold evening.",
    mediaType: "image",
    mediaUrl: "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg",
    badges: ["Hydrotherapy Jets", "Ambient Pool Lighting", "Total Privacy", "Starry Skies"],
    ambientColor: "#162320",
  },
];

export function ArchitecturalWalkthrough() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = CHAPTERS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % CHAPTERS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-[#F4F1EA] text-[#203F3A] overflow-hidden"
    >
      {/* Top Section Intro Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D7C8B4]/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#203F3A]" />
              <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-[#9B7955]">
                Architectural Walkthrough
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-[#203F3A] leading-[1.08]">
              One Eleven <br className="hidden md:inline" />
              <span className="italic font-normal">Room by Room</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm md:text-base text-[#203F3A]/80 font-light leading-relaxed">
              Explore the spaces, materials, and private wellness facilities that make this house stand apart on Lake Taupō.
            </p>
          </div>
        </div>

        {/* Chapter Navigation Scroller Pills (ACTL / Nueve inspired) */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {CHAPTERS.map((ch, idx) => {
            const isCurrent = idx === activeIdx;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveIdx(idx)}
                data-cursor="view"
                className={`flex items-center gap-3 px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? "bg-[#203F3A] text-[#F4F1EA] shadow-md shadow-[#203F3A]/15 scale-[1.02]"
                    : "bg-white/70 hover:bg-white text-[#203F3A]/70 border border-[#D7C8B4]/50"
                }`}
              >
                <span className={`text-[10px] font-mono ${isCurrent ? "text-[#D7C8B4]" : "text-[#9B7955]"}`}>
                  {ch.number}
                </span>
                <span>{ch.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Column: Editorial Copy & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#9B7955] tracking-widest">
                    PLATE {active.number} / 04
                  </span>
                  <span className="w-8 h-[1px] bg-[#D7C8B4]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#203F3A]/60 font-semibold">
                    {active.subtitle}
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-serif font-light text-[#203F3A] tracking-tight leading-[1.12]">
                  {active.title}
                </h3>

                <p className="text-sm md:text-base text-[#203F3A]/85 font-light leading-relaxed">
                  {active.description}
                </p>

                {/* Real Guest Review Quote */}
                {active.quote && (
                  <div className="border-l-2 border-[#D7C8B4] pl-4 py-1 italic font-serif text-sm text-[#203F3A]/80">
                    “{active.quote}”
                  </div>
                )}

                {/* Verified Architectural Fact Badges */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {active.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-md text-[11px] font-sans font-medium bg-white border border-[#D7C8B4]/70 text-[#203F3A]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stage Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#D7C8B4]/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  data-cursor="prev"
                  aria-label="Previous Chapter"
                  className="w-10 h-10 rounded-full border border-[#203F3A]/30 flex items-center justify-center hover:bg-[#203F3A] hover:text-[#F4F1EA] transition-all cursor-pointer"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  data-cursor="next"
                  aria-label="Next Chapter"
                  className="w-10 h-10 rounded-full border border-[#203F3A]/30 flex items-center justify-center hover:bg-[#203F3A] hover:text-[#F4F1EA] transition-all cursor-pointer"
                >
                  →
                </button>
                <span className="text-xs font-mono ml-3 text-[#203F3A]/60">
                  {active.number} of 04
                </span>
              </div>

              <Link
                to="/book"
                data-cursor="book"
                className="bg-[#203F3A] text-[#F4F1EA] px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#16302B] transition-all shadow-md shadow-[#203F3A]/15"
              >
                Reserve Stay
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Arched Portal Mask (Nueve inspiration) */}
          <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
            <div
              className="relative w-full max-w-[580px] aspect-[4/5] rounded-[36px] md:rounded-[48px] overflow-hidden shadow-2xl border border-[#D7C8B4]/60 bg-[#16211E]"
              data-cursor={active.mediaType === "video" ? "sound" : "explore"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {active.mediaType === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted={videoMuted}
                        playsInline
                        className="w-full h-full object-cover brightness-[0.88]"
                      >
                        <source src={active.mediaUrl} type="video/mp4" />
                        <img
                          src={active.fallbackUrl}
                          alt="One Eleven on the Mile drone exterior"
                          className="w-full h-full object-cover"
                        />
                      </video>

                      {/* Video Sound Toggle Button */}
                      <button
                        onClick={() => setVideoMuted(!videoMuted)}
                        className="absolute bottom-5 right-5 z-20 bg-[#203F3A]/80 backdrop-blur-md text-[#F4F1EA] p-3 rounded-full hover:bg-[#203F3A] transition-all border border-[#D7C8B4]/30 flex items-center gap-2 cursor-pointer"
                        title={videoMuted ? "Unmute Drone Video" : "Mute Video"}
                      >
                        {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        <span className="text-[9px] uppercase tracking-widest font-semibold pr-1">
                          {videoMuted ? "Muted" : "Sound"}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <img
                      src={active.mediaUrl}
                      alt={active.title}
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                      onError={(e) => {
                        // Fallback image if bucket is loading
                        e.currentTarget.src =
                          "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg";
                      }}
                    />
                  )}

                  {/* Elegant Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  {/* Top Architectural Badge */}
                  <div className="absolute top-5 left-5 z-10 bg-[#203F3A]/80 backdrop-blur-md text-[#F4F1EA] px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-[0.22em] font-medium border border-[#D7C8B4]/30 pointer-events-none">
                    Taupō, NZ · 111 Jarden Mile
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
