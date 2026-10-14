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
  ArrowUp
} from "lucide-react";
import { CarlsonLogo } from "./CarlsonLogo";
import { OneElevenLogo } from "./OneElevenLogo";
import { motion } from "motion/react";
import { FooterSignOff } from "./FooterSignOff";
import { PHONE_HREF, PHONE_DISPLAY, BOOKINGS_EMAIL, INSTAGRAM_URL, FACEBOOK_URL } from "../lib/links";

/** Live local time at the house. Taupō observes NZST/NZDT. */
function TaupoClock() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-NZ", {
          timeZone: "Pacific/Auckland",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setTime(formatted);
      } catch {
        setTime(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] text-[#F3F0E9]/85 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B68D62] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B68D62]" />
      </span>
      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#D8D3CB]">
        Taupō Time
      </span>
      <span className="tabular-nums font-semibold tracking-wider text-[#F3F0E9]">
        {time ?? "—"} NZST
      </span>
    </div>
  );
}

export function StatementFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#1C1D1F] text-[#F3F0E9] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        
        {/* Final Booking Invitation — wrapped in subtle Ebony Grain frame with solid charcoal interior */}
        <div className="relative mb-24 overflow-hidden rounded-3xl bg-ebony-grain p-1 sm:p-2 border border-white/10">
          <div className="rounded-[22px] bg-[#292D2D] p-8 sm:p-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-[#F3F0E9]">
              <Star size={13} className="text-[#B68D62] fill-[#B68D62]" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D8D3CB]">
                Direct Reservation
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F3F0E9] tracking-tight leading-[1.15]">
              Why Book <span className="font-serif italic text-[#C9C3B8]">Direct With Us</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-sans text-sm md:text-base leading-relaxed text-[#D8D3CB]">
              Reserve straight through <span className="text-[#F3F0E9] font-medium underline underline-offset-4 decoration-[#B68D62]/60">carlsonproperties.co.nz</span> for our guaranteed best rate, zero third-party markups, and direct communication with hosts Matt &amp; Ashleigh.
            </p>

            {/* Benefit Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: ShieldCheck,
                  title: "Best Rate Guaranteed",
                  desc: "Zero platform commission fees. You always receive our lowest available direct seasonal rate."
                },
                {
                  icon: MessageSquare,
                  title: "Direct Host Contact",
                  desc: "Speak directly with Matt & Ashleigh. Personal recommendations, prompt responses, no middlemen."
                },
                {
                  icon: Compass,
                  title: "Curated Taupō Guide",
                  desc: "Private charters, secluded hot springs, and preferred local dining recommendations."
                },
                {
                  icon: CalendarCheck,
                  title: "Flexible Care",
                  desc: "Early luggage drop or late checkout accommodated whenever property scheduling allows."
                }
              ].map((card, i) => (
                <div 
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#1C1D1F]/90 p-6 text-left transition-all duration-300 hover:border-[#B68D62]/50 hover:bg-[#1C1D1F]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#292D2D] text-[#B68D62]">
                    <card.icon size={20} />
                  </div>
                  <h4 className="font-serif text-lg font-normal text-[#F3F0E9] mb-2">
                    {card.title}
                  </h4>
                  <p className="font-sans text-xs leading-relaxed text-[#D8D3CB]">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Direct Reserve Action Bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-[#1C1D1F] p-6 text-left">
              <div>
                <span className="block font-serif text-lg text-[#F3F0E9]">Planning your stay at One Eleven?</span>
                <span className="font-sans text-xs text-[#D8D3CB]">5 bedrooms · 4 bathrooms · heated pool &amp; sauna · sleeps up to 10 guests</span>
              </div>
              <Link
                to="/book"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#F3F0E9] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#292D2D] transition-all duration-300 hover:bg-[#E2DED5]"
              >
                <span>Check Availability</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Lockup & Global Footer */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 py-16 border-b border-white/10">
          <div className="flex flex-col gap-6">
            <Link to="/" aria-label="One Eleven on the Mile — home" className="inline-block">
              <OneElevenLogo
                dark={false}
                size={380}
                className="w-full max-w-[24rem]"
              />
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#D8D3CB]">
                A Stay by
              </span>
              <CarlsonLogo dark={false} size={150} />
            </div>

            <TaupoClock />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/book"
              className="rounded-full bg-[#F3F0E9] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#292D2D] transition-all hover:bg-[#E2DED5]"
            >
              Reserve Directly
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-wider text-[#F3F0E9] hover:bg-white/10"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 text-sm border-b border-white/10">
          <div>
            <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B68D62] mb-4">The Property</h5>
            <ul className="space-y-2.5 text-[#D8D3CB]">
              <li><Link to="/about" className="hover:text-[#F3F0E9] transition-colors">About the House</Link></li>
              <li><Link to="/about#wellness" className="hover:text-[#F3F0E9] transition-colors">Pool, Sauna &amp; Spa</Link></li>
              <li><Link to="/about#bedrooms" className="hover:text-[#F3F0E9] transition-colors">Sleeping Quarters</Link></li>
              <li><Link to="/guest-info" className="hover:text-[#F3F0E9] transition-colors">Guest House Manual</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B68D62] mb-4">Location &amp; Guides</h5>
            <ul className="space-y-2.5 text-[#D8D3CB]">
              <li><Link to="/blog" className="hover:text-[#F3F0E9] transition-colors">Taupō Local Guide</Link></li>
              <li><Link to="/meet-hosts" className="hover:text-[#F3F0E9] transition-colors">Meet Matt &amp; Ashleigh</Link></li>
              <li><Link to="/faq" className="hover:text-[#F3F0E9] transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B68D62] mb-4">Reservations</h5>
            <ul className="space-y-2.5 text-[#D8D3CB]">
              <li><Link to="/book" className="hover:text-[#F3F0E9] transition-colors">Live Availability</Link></li>
              <li><Link to="/terms" className="hover:text-[#F3F0E9] transition-colors">Booking Terms &amp; Policies</Link></li>
              <li><Link to="/privacy" className="hover:text-[#F3F0E9] transition-colors">Privacy Notice</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B68D62] mb-4">Direct Contact</h5>
            <ul className="space-y-2.5 text-[#D8D3CB]">
              <li>
                <a href={PHONE_HREF} className="inline-flex items-center gap-2 hover:text-[#F3F0E9]">
                  <Phone size={14} className="text-[#B68D62]" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${BOOKINGS_EMAIL}`} className="inline-flex items-center gap-2 hover:text-[#F3F0E9]">
                  <Mail size={14} className="text-[#B68D62]" />
                  <span>{BOOKINGS_EMAIL}</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-[#D8D3CB]">
                <MapPin size={14} className="text-[#B68D62]" />
                <span>111 Jarden Mile, Taupō, NZ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8D3CB]/80">
          <p>© {new Date().getFullYear()} Carlson Properties Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F3F0E9] transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F3F0E9] transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
