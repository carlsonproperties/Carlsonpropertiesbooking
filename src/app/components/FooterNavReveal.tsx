import * as React from "react";
import { Link } from "react-router";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GALLERY_IMAGES, HOME_IMAGES } from "../lib/images";

/**
 * Oversized footer navigation where hovering a link floats the matching
 * photograph alongside the cursor.
 *
 * The reveal is a progressive enhancement and is switched off entirely for
 * coarse pointers (there is no hover to speak of on a phone) and for anyone
 * who asked for reduced motion. In both cases this degrades to a plain, large,
 * perfectly usable list of links.
 */

interface NavItem {
  label: string;
  to: string;
  meta: string;
  image: string;
}

const NAV: NavItem[] = [
  { label: "The House", to: "/about", meta: "5 bedrooms · sleeps 10", image: GALLERY_IMAGES.livingRoom },
  { label: "Your Hosts", to: "/meet-hosts", meta: "Matt & Ashleigh", image: GALLERY_IMAGES.exterior },
  { label: "Guest Manual", to: "/guest-info", meta: "Everything on arrival", image: GALLERY_IMAGES.kitchen },
  { label: "Taupō Journal", to: "/blog", meta: "Where we send people", image: GALLERY_IMAGES.hero },
  { label: "Check Availability", to: "/book", meta: "Best rate, direct", image: HOME_IMAGES.wellness },
];

export function FooterNavReveal() {
  const reduced = useReducedMotion() ?? false;
  const [fine, setFine] = React.useState(false);
  const [active, setActive] = React.useState<number | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Only arm the hover reveal where there is a real pointer.
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const enabled = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    if (!enabled) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
      className="relative py-16 md:py-20"
    >
      {/* Floating preview — pinned to the cursor, never interactive itself. */}
      {enabled && (
        <motion.div
          aria-hidden="true"
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
        >
          <AnimatePresence mode="wait">
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.96, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="-translate-y-1/2 translate-x-8 overflow-hidden rounded-2xl border border-[#D7C8B4]/30 shadow-2xl"
                style={{ width: 300, height: 220 }}
              >
                <img
                  src={NAV[active].image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16302B]/50 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D7C8B4]">
        Explore
      </p>

      <ul className="relative z-10 -mx-2">
        {NAV.map((item, i) => {
          const dimmed = enabled && active !== null && active !== i;
          return (
            <li key={item.to} className="border-b border-[#D7C8B4]/15 last:border-b-0">
              <Link
                to={item.to}
                data-cursor="VIEW"
                onMouseEnter={() => enabled && setActive(i)}
                onFocus={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 px-2 py-5 md:py-7 transition-opacity duration-300"
                style={{ opacity: dimmed ? 0.35 : 1 }}
              >
                <span className="flex items-baseline gap-4 md:gap-7 min-w-0">
                  <span className="font-mono text-[10px] text-[#D7C8B4]/90 tabular-nums shrink-0">
                    0{i + 1}
                  </span>
                  <span
                    className="truncate font-serif text-3xl font-light leading-none tracking-tight text-[#F4F1EA] transition-transform duration-500 ease-out md:text-5xl lg:text-6xl md:group-hover:translate-x-3"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {item.label}
                  </span>
                </span>
                <span className="flex items-center gap-4 shrink-0">
                  <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[#F4F1EA]/75 sm:inline">
                    {item.meta}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className="text-[#D7C8B4] transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
