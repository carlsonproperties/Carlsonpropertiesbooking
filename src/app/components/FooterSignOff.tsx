import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Link } from "react-router";

const FOOTER_LOGO = "/brand/logo/one-eleven-primary-cream.svg";

/**
 * The official reversed brand mark replaces the old typeset sign-off.
 * A brighter duplicate follows the pointer like light across the logo without
 * distorting the artwork. Touch and reduced-motion visitors get a static mark.
 */
export function FooterSignOff() {
  const reduced = useReducedMotion() ?? false;
  const [finePointer, setFinePointer] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  const enabled = finePointer && !reduced;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 220, damping: 30, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 30, mass: 0.4 });
  const spotlight = useMotionTemplate`radial-gradient(circle 320px at ${smoothX}px ${smoothY}px, #000 0%, rgba(0,0,0,.9) 38%, transparent 72%)`;

  const onMove = (event: React.MouseEvent) => {
    if (!enabled) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
  };

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => enabled && setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="relative select-none overflow-hidden border-t border-[#D7C8B4]/20 px-4 py-10 sm:px-6 sm:py-14"
    >
      <Link
        to="/"
        aria-label="One Eleven on the Mile — home"
        className="relative mx-auto block w-full max-w-[88rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7C8B4] focus-visible:ring-offset-4 focus-visible:ring-offset-[#203F3A]"
      >
        <img
          src={FOOTER_LOGO}
          alt="One Eleven on the Mile — a Carlson Properties stay"
          className={`block h-auto w-full ${enabled ? "opacity-80" : "opacity-95"}`}
          loading="lazy"
        />

        {enabled && (
          <motion.img
            src={FOOTER_LOGO}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 block h-auto w-full"
            style={{
              WebkitMaskImage: spotlight,
              maskImage: spotlight,
              opacity: active ? 1 : 0,
              transition: "opacity 420ms ease",
            }}
          />
        )}
      </Link>
    </motion.div>
  );
}
