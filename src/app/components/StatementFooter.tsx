import * as React from "react";
import { Link } from "react-router";
import { Star, Instagram, Facebook, ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { CarlsonLogo } from "./CarlsonLogo";
import { OneElevenLogo } from "./OneElevenLogo";
import { ScallopedSeal, ClubRoundel } from "./ClubMarks";

/** Live local time at the house. Taupō observes NZST/NZDT, so the zone does
 *  the daylight-saving switch for us rather than a hardcoded offset. */
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
      <span className="inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/85">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D7C8B4]" />
        Taupō <span className="font-mono tracking-normal tabular-nums">{time}</span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EA]/85">
        Pool <span className="font-mono tracking-normal">38°C</span>
        <span className="text-[#D7C8B4]/70">Heated year-round</span>
      </span>
    </div>
  );
}

export function StatementFooter() {
  return (
    <footer className="relative bg-[#203F3A] text-[#F4F1EA] pt-24 pb-12 px-6 overflow-hidden">
      {/* Decorative architectural ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5E7F77]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Row: Coordinated Logo & Direct CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-16 border-b border-[#D7C8B4]/20">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <CarlsonLogo dark={false} />
              <span className="hidden sm:inline text-[#D7C8B4]/40">|</span>
              <OneElevenLogo dark={false} withEndorsement={false} />
            </div>
            <TaupoClock />
          </div>

          <div className="flex items-center gap-4">
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

        {/* Big Editorial Statement with Good Company Scalloped Seal */}
        <div className="py-20 md:py-28 border-b border-[#D7C8B4]/20 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#D7C8B4] font-medium mb-4">
                The Taupō Experience
              </p>
              <h2 className="text-6xl sm:text-7xl md:text-9xl lg:text-[9.5rem] font-serif font-light text-[#F4F1EA] tracking-tighter leading-[0.92] select-none"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}>
                Hard to <br />
                <span className="italic font-normal text-[#D7C8B4]">leave.</span>
              </h2>
            </div>
            {/* Scalloped Seal Badge from Good Company Board */}
            <div className="flex-shrink-0 self-start lg:self-center pb-4">
              <div className="hover:rotate-6 transition-transform duration-500 cursor-default">
                <ScallopedSeal size={150} />
              </div>
            </div>
          </div>
          <p className="mt-8 max-w-xl text-base md:text-lg text-[#F4F1EA]/80 font-light leading-relaxed">
            Five bedrooms, a heated pool, cedar sauna, and quiet lakefront mornings on Jarden Mile. Curated for family reunions, milestone gatherings, and unhurried time together.
          </p>
        </div>

        {/* Main Grid: Directory, Hosts, Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 border-b border-[#D7C8B4]/20">
          {/* Col 1: Personal Host Note */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="font-serif text-xl text-[#F4F1EA]">Local Hosting</h4>
            <p className="text-sm text-[#F4F1EA]/75 font-light leading-relaxed">
              We are Matt and Ashleigh Carlson. We live nearby in Taupō and look after every detail ourselves so your stay is effortless from arrival to check-out.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#D7C8B4] font-medium">
              <a href="tel:0276977961" className="flex items-center gap-2 hover:text-[#F4F1EA] transition-colors">
                <Phone size={13} />
                <span>027 697 7961</span>
              </a>
              <a href="mailto:bookings@carlsonproperties.co.nz" className="flex items-center gap-2 hover:text-[#F4F1EA] transition-colors">
                <Mail size={13} />
                <span>bookings@carlsonproperties.co.nz</span>
              </a>
              <div className="flex items-center gap-2 text-[#D7C8B4]/80">
                <MapPin size={13} />
                <span>111 Jarden Mile, Taupō 3330, NZ</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-xl text-[#F4F1EA]">Navigation</h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.2em] font-medium text-[#D7C8B4]">
              <li><Link to="/about" className="hover:text-[#F4F1EA] transition-colors">About One Eleven</Link></li>
              <li><Link to="/meet-hosts" className="hover:text-[#F4F1EA] transition-colors">Meet Matt & Ashleigh</Link></li>
              <li><Link to="/guest-info" className="hover:text-[#F4F1EA] transition-colors">Guest Directory & House Manual</Link></li>
              <li><Link to="/blog" className="hover:text-[#F4F1EA] transition-colors">Taupō Journal</Link></li>
              <li><Link to="/book" className="hover:text-[#F4F1EA] transition-colors">Check Availability</Link></li>
            </ul>
          </div>

          {/* Col 3: Policies & Owner Access */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="font-serif text-xl text-[#F4F1EA]">Information</h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-[0.2em] font-medium text-[#D7C8B4]">
              <li><Link to="/terms" className="hover:text-[#F4F1EA] transition-colors">Terms of Stay</Link></li>
              <li><Link to="/privacy" className="hover:text-[#F4F1EA] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-[#F4F1EA] transition-colors">Cancellation Terms</Link></li>
              <li className="pt-2">
                <Link
                  to="/owner-login"
                  className="inline-block text-[10px] text-[#D7C8B4]/60 hover:text-[#F4F1EA] border border-[#D7C8B4]/20 px-3 py-1 rounded transition-colors"
                >
                  Owner Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Reviews & Social */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-xl text-[#F4F1EA]">Guest Verified</h4>
            <div className="flex items-center gap-1.5 text-[#D7C8B4]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#D7C8B4" />
              ))}
              <span className="text-xs font-mono font-bold ml-2 text-[#F4F1EA]">5.0 / 5.0</span>
            </div>
            <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">
              56 verified guest reviews across direct bookings and Airbnb.
            </p>
            <div className="flex gap-3 pt-3">
              <a
                href="https://www.instagram.com/oneelevenonthemile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#D7C8B4]/30 flex items-center justify-center hover:bg-[#F4F1EA] hover:text-[#203F3A] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#D7C8B4]/30 flex items-center justify-center hover:bg-[#F4F1EA] hover:text-[#203F3A] transition-all"
                aria-label="Facebook"
              >
                <Facebook size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Banner Wordmark: CARLSON PROPERTIES */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.25em] text-[#D7C8B4]/60 font-medium">
          <span>© {new Date().getFullYear()} Carlson Properties Ltd · Taupō, NZ</span>
          <span className="font-serif tracking-widest text-sm text-[#D7C8B4]/80">CARLSON PROPERTIES</span>
          <span>Designed with Lake &amp; Stone</span>
        </div>
      </div>
    </footer>
  );
}
