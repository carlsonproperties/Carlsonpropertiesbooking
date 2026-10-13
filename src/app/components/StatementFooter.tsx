import * as React from "react";
import { Link } from "react-router";
import { 
  Star, 
  Instagram, 
  Facebook, 
  ArrowUpRight, 
  Phone, 
  Mail, 
  MapPin,
  ShieldCheck,
  MessageSquare,
  Compass,
  CalendarCheck,
  Sparkles,
  ArrowUp
} from "lucide-react";
import { CarlsonLogo } from "./CarlsonLogo";
import { OneElevenLogo } from "./OneElevenLogo";
import { ScallopedSeal, ClubRoundel } from "./ClubMarks";
import { motion } from "motion/react";
import { FooterSignOff } from "./FooterSignOff";
import { PHONE_HREF, PHONE_DISPLAY, BOOKINGS_EMAIL, INSTAGRAM_URL, FACEBOOK_URL } from "../lib/links";

/** Live local time at the house. Taupō observes NZST/NZDT. */
function TaupoClock() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-NZ", {
            timeZone: "Pacific/Auckland",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime(null);
      }
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/85 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D7C8B4]" />
        Taupō <span className="font-mono tracking-normal tabular-nums">{time}</span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/85 backdrop-blur-sm">
        Pool <span className="text-[#D7C8B4]/90">Heated year-round</span>
      </span>
    </div>
  );
}

export function StatementFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#203F3A] pt-24 text-[#F4F1EA]">
      {/* Decorative architectural ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5E7F77]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-[#D7C8B4]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        {/* ==============================================================
            INTERACTIVE DIRECT BOOKING SUITE (Replaces old static section)
           ============================================================== */}
        <div className="pb-20 border-b border-[#D7C8B4]/20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#D7C8B4] backdrop-blur-md">
              <Sparkles size={12} className="text-[#D7C8B4]" />
              Direct Reservation Privileges
            </div>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#F4F1EA] tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
            >
              Why Book <span className="italic font-normal text-[#D7C8B4]">Direct With Us</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-sans text-sm md:text-base font-light leading-relaxed text-[#F4F1EA]/80">
              Reserve straight through <span className="text-[#F4F1EA] font-medium underline underline-offset-4 decoration-[#D7C8B4]/50">carlsonproperties.co.nz</span> for the guaranteed best rate, zero third-party markups, and direct communication with hosts Matt &amp; Ashleigh.
            </p>
          </div>

          {/* Four Interactive Direct Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Best Rate Guaranteed",
                tag: "Zero Platform Markups",
                desc: "Save 12–18% in commercial OTA commission fees. You always receive our lowest available seasonal rate."
              },
              {
                icon: MessageSquare,
                title: "Direct Host Contact",
                tag: "Matt & Ashleigh",
                desc: "Speak directly with us anytime via call or WhatsApp. No automated chatbots, delays, or middlemen."
              },
              {
                icon: Compass,
                title: "Curated Taupō Guide",
                tag: "Local Insider Access",
                desc: "Handpicked lake charters, private chefs, secluded geothermal pools, and preferred dining reservations."
              },
              {
                icon: CalendarCheck,
                title: "Flexible Care",
                tag: "Priority Scheduling",
                desc: "Direct handling of requests, early arrival, or late departure whenever property prep allows."
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-[#D7C8B4]/25 bg-white/[0.04] p-8 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D7C8B4] hover:bg-white/[0.08] hover:shadow-2xl"
              >
                {/* warm wash that rises out of the card on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-[#D7C8B4]/18 to-transparent transition-[height] duration-700 ease-out group-hover:h-2/3"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-7 top-7 font-mono text-[10px] tabular-nums text-[#D7C8B4]/80 transition-colors duration-500 group-hover:text-[#D7C8B4]"
                >
                  0{i + 1}
                </span>
                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D7C8B4]/30 bg-[#203F3A] text-[#D7C8B4] shadow-md transition-all duration-500 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:bg-[#F4F1EA] group-hover:text-[#203F3A]">
                  <card.icon size={26} strokeWidth={1.75} />
                </div>
                <span className="relative block text-[9px] font-bold uppercase tracking-[0.25em] text-[#D7C8B4]/90 mb-2">
                  {card.tag}
                </span>
                <h4 className="relative font-serif text-xl text-[#F4F1EA] mb-3 leading-snug">
                  {card.title}
                </h4>
                <p className="relative font-sans text-xs font-light leading-relaxed text-[#F4F1EA]/80">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Direct Reserve Action Bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-[#D7C8B4]/20 bg-white/[0.03] p-6 backdrop-blur-sm">
            <div className="text-left">
              <span className="block font-serif text-lg text-[#F4F1EA]">Planning your stay at One Eleven?</span>
              <span className="text-xs font-light text-[#F4F1EA]/70">5 bedrooms · 4 bathrooms · heated pool &amp; sauna · sleeps up to 10 guests</span>
            </div>
            <Link
              to="/book"
              data-cursor="RESERVE"
              className="group flex-shrink-0 inline-flex items-center gap-3 rounded-full bg-[#F4F1EA] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#203F3A] shadow-xl transition-all duration-300 hover:bg-[#D7C8B4]"
            >
              <span>Check Calendar &amp; Rates</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Brand lockup. One Eleven leads at full scale with Carlson as the
            endorsement beneath it, which is the hierarchy the brand is built
            on — the house is the name people book, the company signs it. */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 py-20 border-b border-[#D7C8B4]/20">
          <div className="flex flex-col gap-8">
            <Link to="/" aria-label="One Eleven on the Mile — home" className="inline-block">
              {/* size sets an intrinsic width on the inner <img>, which would
                  overflow a phone; the child selector lets it scale down. */}
              <OneElevenLogo
                dark={false}
                withEndorsement={false}
                size={560}
                className="w-full max-w-[34rem] [&>img]:w-full [&>img]:h-auto"
              />
            </Link>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]/85">
                by
              </span>
              <CarlsonLogo dark={false} size={200} />
            </div>

            <TaupoClock />
          </div>

          <div className="flex flex-shrink-0 items-center gap-4">
            <Link
              to="/book"
              data-cursor="book"
              className="group flex items-center gap-3 bg-[#F4F1EA] text-[#203F3A] px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#D7C8B4] transition-all shadow-xl"
            >
              <span>Reserve Directly</span>
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Directory. Phone and email are the conversion points on a direct
            booking site, so they are set as real targets rather than footnotes. */}
        <div className="grid grid-cols-1 gap-12 border-b border-[#D7C8B4]/20 py-16 md:grid-cols-12">
          <div className="space-y-5 text-left md:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">
              Your hosts
            </p>
            <h4
              className="font-serif text-3xl font-light leading-tight text-[#F4F1EA] md:text-4xl"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Matt &amp; Ashleigh Carlson
            </h4>
            <p className="max-w-md text-sm font-light leading-relaxed text-[#F4F1EA]/80">
              We live nearby in Taupō and look after every detail ourselves, so your stay is
              effortless from arrival to check-out.
            </p>

            <div className="space-y-1 pt-3">
              <a
                href={PHONE_HREF}
                className="group flex items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5 transition-colors hover:text-[#D7C8B4]"
              >
                <Phone size={15} className="shrink-0 text-[#D7C8B4]" />
                <span className="font-serif text-lg text-[#F4F1EA] transition-colors group-hover:text-[#D7C8B4]">
                  {PHONE_DISPLAY}
                </span>
                <ArrowUpRight
                  size={14}
                  className="ml-auto text-[#D7C8B4]/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={`mailto:${BOOKINGS_EMAIL}`}
                className="group flex items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5 transition-colors hover:text-[#D7C8B4]"
              >
                <Mail size={15} className="shrink-0 text-[#D7C8B4]" />
                <span className="min-w-0 truncate font-serif text-lg text-[#F4F1EA] transition-colors group-hover:text-[#D7C8B4]">
                  {BOOKINGS_EMAIL}
                </span>
                <ArrowUpRight
                  size={14}
                  className="ml-auto shrink-0 text-[#D7C8B4]/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <p className="flex items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5 text-sm text-[#F4F1EA]/75">
                <MapPin size={15} className="shrink-0 text-[#D7C8B4]" />
                111 Jarden Mile, Taupō 3330, New Zealand
              </p>
            </div>
          </div>

          <div className="space-y-5 text-left md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">
              Information
            </p>
            <ul className="space-y-0.5">
              {[
                { to: "/terms", label: "Terms of Stay" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/refund", label: "Cancellation Terms" },
                { to: "/owner-login", label: "Owner Portal" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex items-center justify-between border-t border-[#D7C8B4]/20 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#D7C8B4] transition-colors hover:text-[#F4F1EA]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-8 text-left md:col-span-4">
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">
                Guest verified
              </p>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-serif text-5xl font-light leading-none text-[#F4F1EA]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  5.0
                </span>
                <span className="flex gap-0.5 text-[#D7C8B4]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#D7C8B4" strokeWidth={0} />
                  ))}
                </span>
              </div>
              <p className="max-w-xs text-sm font-light leading-relaxed text-[#F4F1EA]/80">
                56 verified guest reviews across direct bookings, Airbnb and Google.
              </p>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="flex gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C8B4]/35 transition-all hover:bg-[#F4F1EA] hover:text-[#203F3A]"
                  aria-label="One Eleven on Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C8B4]/35 transition-all hover:bg-[#F4F1EA] hover:text-[#203F3A]"
                  aria-label="One Eleven on Facebook"
                >
                  <Facebook size={16} />
                </a>
              </div>

              {/* Slow-turning club seal — the one piece of idle motion down here. */}
              <div className="oe-spin shrink-0 text-[#D7C8B4]/70" aria-hidden="true">
                <ClubRoundel size={88} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D7C8B4]/85 md:flex-row">
          <span>© {new Date().getFullYear()} Carlson Properties Ltd · Taupō, NZ</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor="TOP"
            className="group inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/35 px-4 py-2 transition-colors hover:border-[#D7C8B4] hover:bg-[#F4F1EA] hover:text-[#203F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7C8B4]"
          >
            Back to top
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
          <span>Designed with Lake &amp; Stone</span>
        </div>

        {/* Slow idle rotation on the club seal. Paused for reduced motion. */}
        <style>{`
          @keyframes oe-seal-spin { to { transform: rotate(360deg); } }
          .oe-spin { animation: oe-seal-spin 26s linear infinite; will-change: transform; }
          @media (prefers-reduced-motion: reduce) { .oe-spin { animation: none; } }
        `}</style>
      </div>

      <FooterSignOff />
    </footer>
  );
}
