import * as React from "react";
import { Link } from "react-router";
import {
  ArrowUp,
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ClubRoundel } from "./ClubMarks";
import { FooterSignOff } from "./FooterSignOff";
import {
  BOOKINGS_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "../lib/links";
import { REVIEW_AGGREGATE } from "../lib/reviews";

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {time && (
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D7C8B4]/35 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D7C8B4]" />
          Taupō <span className="font-mono tracking-normal tabular-nums">{time}</span>
        </span>
      )}
      <span className="inline-flex min-h-11 items-center rounded-full border border-[#D7C8B4]/35 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/90">
        Pool heated year-round
      </span>
    </div>
  );
}

export function StatementFooter() {
  const reduced = useReducedMotion() ?? false;

  return (
    <footer className="relative overflow-hidden bg-[#203F3A] pt-16 text-[#F4F1EA] sm:pt-20">
      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#9DA07E]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-48 bottom-20 h-[30rem] w-[30rem] rounded-full bg-[#D7C8B4]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-10 border-b border-[#D7C8B4]/20 pb-14 lg:grid-cols-12 lg:pb-16">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-left lg:col-span-8"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D7C8B4]">
              One Eleven on the Mile · Taupō
            </p>
            <h2 className="max-w-3xl font-serif text-4xl font-light leading-[1.08] sm:text-5xl md:text-6xl">
              A private Taupō stay with <span className="italic text-[#D7C8B4]">room for everyone.</span>
            </h2>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-[#F4F1EA]/80 sm:text-base">
              Five bedrooms, four bathrooms and space for ten—plus a heated pool, spa,
              cedar sauna and wide lake views. Hosted locally by Matt and Ashleigh.
            </p>
            <TaupoClock />
          </motion.div>

          <div className="flex lg:col-span-4 lg:justify-end">
            <Link
              to="/book"
              data-cursor="RESERVE"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4F1EA] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#203F3A] shadow-xl transition-colors hover:bg-[#D7C8B4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-4 focus-visible:ring-offset-[#203F3A]"
            >
              Check availability
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 border-b border-[#D7C8B4]/20 py-14 md:grid-cols-12 md:py-16">
          <div className="space-y-5 text-left md:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">Your hosts</p>
            <h3 className="font-serif text-3xl font-light leading-tight md:text-4xl">Matt &amp; Ashleigh Carlson</h3>
            <p className="max-w-md text-sm font-light leading-relaxed text-[#F4F1EA]/80">
              We live nearby in Taupō and look after One Eleven ourselves. If you need help
              before or during your stay, you will be speaking directly with us.
            </p>

            <div className="space-y-1 pt-2">
              <a href={PHONE_HREF} className="group flex min-h-12 items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5">
                <Phone size={15} className="shrink-0 text-[#D7C8B4]" />
                <span className="font-serif text-lg transition-colors group-hover:text-[#D7C8B4]">{PHONE_DISPLAY}</span>
                <ArrowUpRight size={14} className="ml-auto text-[#D7C8B4]/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href={`mailto:${BOOKINGS_EMAIL}`} className="group flex min-h-12 items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5">
                <Mail size={15} className="shrink-0 text-[#D7C8B4]" />
                <span className="min-w-0 truncate font-serif text-lg transition-colors group-hover:text-[#D7C8B4]">{BOOKINGS_EMAIL}</span>
                <ArrowUpRight size={14} className="ml-auto shrink-0 text-[#D7C8B4]/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <p className="flex min-h-12 items-center gap-4 border-t border-[#D7C8B4]/20 py-3.5 text-sm text-[#F4F1EA]/75">
                <MapPin size={15} className="shrink-0 text-[#D7C8B4]" />
                111 Jarden Mile, Taupō 3330, New Zealand
              </p>
            </div>
          </div>

          <div className="space-y-5 text-left md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">Information</p>
            <ul>
              {[
                { to: "/terms", label: "Terms of stay" },
                { to: "/privacy", label: "Privacy policy" },
                { to: "/refund", label: "Cancellation terms" },
                { to: "/owner-login", label: "Owner portal" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="group flex min-h-12 items-center justify-between border-t border-[#D7C8B4]/20 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#D7C8B4] transition-colors hover:text-[#F4F1EA]">
                    {item.label}
                    <ArrowUpRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-8 text-left md:col-span-4">
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D7C8B4]">Guest reviews</p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-5xl font-light leading-none">{REVIEW_AGGREGATE.ratingValue}</span>
                <span className="flex gap-0.5 text-[#D7C8B4]" aria-label={`${REVIEW_AGGREGATE.ratingValue} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
              </div>
              <p className="max-w-xs text-sm font-light leading-relaxed text-[#F4F1EA]/80">
                {REVIEW_AGGREGATE.reviewCount} guest reviews across Airbnb and Google.
              </p>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="flex gap-3">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C8B4]/35 transition-colors hover:bg-[#F4F1EA] hover:text-[#203F3A]" aria-label="One Eleven on Instagram">
                  <Instagram size={16} />
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C8B4]/35 transition-colors hover:bg-[#F4F1EA] hover:text-[#203F3A]" aria-label="One Eleven on Facebook">
                  <Facebook size={16} />
                </a>
              </div>
              <div className="oe-seal-spin shrink-0 text-[#D7C8B4]/75" aria-hidden="true">
                <ClubRoundel size={88} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-7 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#D7C8B4]/85 md:flex-row md:text-left">
          <span>© {new Date().getFullYear()} Carlson Properties · Taupō, New Zealand</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D7C8B4]/35 px-4 py-2 transition-colors hover:bg-[#F4F1EA] hover:text-[#203F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7C8B4]"
          >
            Back to top
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
          <span>Hosted locally by Matt &amp; Ashleigh</span>
        </div>

        <style>{`
          @keyframes oe-seal-spin { to { transform: rotate(360deg); } }
          .oe-seal-spin { animation: oe-seal-spin 26s linear infinite; will-change: transform; }
          @media (prefers-reduced-motion: reduce) { .oe-seal-spin { animation: none; } }
        `}</style>
      </div>

      <FooterSignOff />
    </footer>
  );
}
