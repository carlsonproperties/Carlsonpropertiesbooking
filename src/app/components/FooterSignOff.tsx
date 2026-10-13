import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * The closing wordmark — One Eleven set as large as the viewport allows and
 * bled to the edges, so the page ends on the name rather than on legal text.
 *
 * A warm light tracks the cursor across the letterforms: the base type sits at
 * low contrast and a second, identical copy is painted with a radial gradient
 * clipped to the glyphs, so only the part under the pointer lifts. It reads as
 * low sun moving across the house, which is the brand's own idea.
 *
 * Both copies carry the same text, so the accessible name would be announced
 * twice — the lit copy is aria-hidden and the base one carries the heading.
 * On touch and under prefers-reduced-motion the light is simply not mounted
 * and the wordmark renders as static type.
 */
export function FooterSignOff() {
  const reduced = useReducedMotion() ?? false;
  const [fine, setFine] = React.useState(false);
  const [lit, setLit] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

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
  const sx = useSpring(x, { stiffness: 220, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 30, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (!enabled) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  // Called unconditionally — the lit copy is rendered conditionally, so a hook
  // inside that branch would break the rules of hooks.
  const radial = useRadial(sx, sy);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  const WORD = "One Eleven";

  return (
    <div className="relative">
      {/* Back to top — a long page deserves a way out of the bottom. */}
      <div className="flex justify-end pb-10">
        <button
          type="button"
          onClick={toTop}
          data-cursor="TOP"
          aria-label="Back to top"
          className="group inline-flex items-center gap-3 rounded-full border border-[#D7C8B4]/35 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7C8B4] transition-colors hover:border-[#D7C8B4] hover:bg-[#F4F1EA] hover:text-[#203F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7C8B4]"
        >
          Back to top
          <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => enabled && setLit(true)}
        onMouseLeave={() => setLit(false)}
        className="relative select-none"
      >
        <h2
          className="whitespace-nowrap text-center font-serif font-light leading-[0.82] tracking-[-0.03em] text-[#F4F1EA]/22"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'WONK' 0, 'opsz' 144",
            fontSize: "clamp(3.5rem, 17.5vw, 15rem)",
          }}
        >
          {WORD}
        </h2>

        {enabled && (
          <motion.h2
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 whitespace-nowrap text-center font-serif font-light leading-[0.82] tracking-[-0.03em]"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: "'SOFT' 100, 'WONK' 0, 'opsz' 144",
              fontSize: "clamp(3.5rem, 17.5vw, 15rem)",
              backgroundImage: radial,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: lit ? 1 : 0,
              transition: "opacity 420ms ease",
            }}
          >
            {WORD}
          </motion.h2>
        )}
      </div>
    </div>
  );
}

/** Radial wash centred on the pointer, clipped to the glyphs above. */
function useRadial(sx: ReturnType<typeof useSpring>, sy: ReturnType<typeof useSpring>) {
  const [bg, setBg] = React.useState(
    "radial-gradient(circle 200px at 50% 50%, #F4F1EA 0%, #D7C8B4 45%, transparent 72%)",
  );
  React.useEffect(() => {
    const paint = () =>
      setBg(
        `radial-gradient(circle 260px at ${sx.get()}px ${sy.get()}px, #FFFDF8 0%, #D7C8B4 42%, transparent 70%)`,
      );
    const un1 = sx.on("change", paint);
    const un2 = sy.on("change", paint);
    return () => {
      un1();
      un2();
    };
  }, [sx, sy]);
  return bg;
}
