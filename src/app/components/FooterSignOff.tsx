import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * The floor of the site: One Eleven set edge to edge and cropped at the
 * baseline, so the page ends on the name the way a book ends on a colophon.
 *
 * A warm light tracks the cursor across the letterforms — the base type sits
 * at low contrast and a second identical copy is painted with a radial
 * gradient clipped to the glyphs, so only the part under the pointer lifts. It
 * reads as low sun moving across the house, which is the brand's own idea.
 *
 * Both copies carry the same words, so the lit one is aria-hidden and the base
 * one is the readable text. On touch and under prefers-reduced-motion the lit
 * copy is never mounted and this is simply very large static type.
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

  // Called unconditionally — the lit copy renders conditionally, so a hook
  // inside that branch would break the rules of hooks.
  const radial = useRadial(sx, sy);

  const onMove = (e: React.MouseEvent) => {
    if (!enabled) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  // 10 glyphs of Fraunces at ~0.52em average: ~19vw fills the viewport with a
  // small gutter at every width.
  const type: React.CSSProperties = {
    fontFamily: "'Fraunces', Georgia, serif",
    fontVariationSettings: "'SOFT' 100, 'WONK' 0, 'opsz' 144",
    fontSize: "clamp(3rem, 18.6vw, 17rem)",
    lineHeight: 0.78,
    letterSpacing: "-0.035em",
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => enabled && setLit(true)}
      onMouseLeave={() => setLit(false)}
      className="relative select-none overflow-hidden px-4 pt-6"
    >
      <h2
        className="whitespace-nowrap text-center font-serif font-light text-[#F4F1EA]/45"
        style={type}
      >
        One Eleven
      </h2>

      {enabled && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-6 whitespace-nowrap text-center font-serif font-light"
          style={{
            ...type,
            display: "block",
            backgroundImage: radial,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: lit ? 1 : 0,
            transition: "opacity 420ms ease",
          }}
        >
          One Eleven
        </motion.span>
      )}
    </div>
  );
}

/** Radial wash centred on the pointer, clipped to the glyphs above. */
function useRadial(sx: ReturnType<typeof useSpring>, sy: ReturnType<typeof useSpring>) {
  const [bg, setBg] = React.useState(
    "radial-gradient(circle 240px at 50% 50%, #FFFDF8 0%, #D7C8B4 42%, transparent 70%)",
  );
  React.useEffect(() => {
    const paint = () =>
      setBg(
        `radial-gradient(circle 300px at ${sx.get()}px ${sy.get()}px, #FFFDF8 0%, #D7C8B4 42%, transparent 70%)`,
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
