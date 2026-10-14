import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Link } from "react-router";
import { DRONE_VIDEO } from "../lib/images";
import { Volume2, VolumeX } from "lucide-react";

/* ───────────────────────────────────────────────────────────────
   Scroll-synchronised architectural walkthrough.

   A tall scroll track (CHAPTERS.length * 115vh) holds a sticky,
   full-viewport stage. Scroll progress 0 → 1 is divided evenly
   between chapters; each chapter layer derives its own opacity,
   scale and parallax from that single progress value, so the
   sequence scrubs rather than steps.

   Everything animated is transform/opacity only, so it composites
   on the GPU and holds 60fps.
   ─────────────────────────────────────────────────────────────── */

const IMG = "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media";
// Poster for the drone reel and the last-resort image source. Deliberately a
// photograph confirmed to be in the bucket: a fallback that 404s is no fallback.
const FALLBACK = `${IMG}/lake%20views.jpg`;

interface Chapter {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  quote?: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  facts: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: "arrival",
    number: "01",
    eyebrow: "Arrival on the Mile",
    title: "Arrive above the lake.",
    body: "Dark vertical cladding, warm timber and broad glazing set the tone from the first view of the house. Taupō town centre is around five minutes away by car.",
    mediaType: "video",
    mediaUrl: DRONE_VIDEO,
    facts: ["5 Bedrooms", "4 Bathrooms", "10 Guests", "5 Mins to Town"],
  },
  {
    id: "great-hall",
    number: "02",
    eyebrow: "Open-Plan Living",
    title: "Made for long dinners and slow mornings.",
    body: "The kitchen, dining and living areas share one generous space, centred on a double-sided gas fire and a dining table with room for the whole group.",
    quote: "The house is spacious, clean and incredibly well appointed. Zero complaints.",
    mediaType: "image",
    mediaUrl: `${IMG}/looking%20into%20kitchen.png`,
    facts: ["Barista Espresso Bar", "10-Seater Dining", "Double-Sided Fireplace", "Lake Glazing"],
  },
  {
    id: "wellness",
    number: "03",
    eyebrow: "Pool, Spa & Sauna",
    title: "Heated year-round. Ready in every season.",
    body: "The private courtyard brings the heated pool, four-person cedar sauna and spa together in one easy outdoor space.",
    quote: "The pool, sauna and spa area made it really hard to leave.",
    mediaType: "image",
    mediaUrl: `${IMG}/poolview.jpg`,
    facts: ["Year-Round Heated Pool", "4-Person Cedar Sauna", "Hydrotherapy Spa", "Private Gym"],
  },
  {
    id: "dusk",
    number: "04",
    eyebrow: "Lake-Facing Living",
    title: "The view follows you inside.",
    body: "Broad windows keep Lake Taupō and the surrounding ranges in sight from the main living areas, whether you are settling in with coffee or gathering by the fire.",
    quote: "The pool was the perfect temperature, even for night swims on a cold evening.",
    mediaType: "image",
    mediaUrl: `${IMG}/lake%20views.jpg`,
    facts: ["Lake Views", "Double-Sided Gas Fire", "Ducted Heating", "Open-Plan Living"],
  },
];

const SPAN = 1 / CHAPTERS.length;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ── Architectural court / lot lines, drawn in sync with scroll ── */
function CourtLines({ progress }: { progress: MotionValue<number> }) {
  const draw = useTransform(progress, [0, SPAN * 0.9], [0, 1]);
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-[0.28]"
      preserveAspectRatio="xMidYMid slice"
    >
      <motion.rect
        x="40" y="30" width="320" height="200"
        stroke="#F4F1EA" strokeWidth="0.75" style={{ pathLength: draw }}
      />
      <motion.line
        x1="200" y1="30" x2="200" y2="230"
        stroke="#F4F1EA" strokeWidth="0.75" style={{ pathLength: draw }}
      />
      <motion.line
        x1="40" y1="130" x2="360" y2="130"
        stroke="#F4F1EA" strokeWidth="0.75" style={{ pathLength: draw }}
      />
      <motion.circle
        cx="200" cy="130" r="42"
        stroke="#D7C8B4" strokeWidth="0.75" style={{ pathLength: draw }}
      />
    </svg>
  );
}

/* ── One chapter layer: owns its own scroll-derived transforms ── */
function ChapterLayer({
  chapter,
  index,
  progress,
  reduced,
  muted,
  onToggleMute,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const start = index * SPAN;
  const end = start + SPAN;
  const pad = SPAN * 0.22;
  const isFirst = index === 0;
  const isLast = index === CHAPTERS.length - 1;

  /* Every stop below has to sit inside [0, 1] and strictly ascend.
     When a useTransform reads a useScroll value and drives a property the
     compositor can own (opacity, transform, filter, clipPath,
     backgroundColor), Motion skips JS and hands the *input range* to
     Element.animate() as WAAPI keyframe offsets — see
     framer-motion/value/use-transform (`result.accelerate.times`) and
     motion-dom/render/VisualElement (`bindToMotionValue`). WAAPI rejects
     any offset outside [0, 1] with "Offsets must be null or in the range
     [0,1]", which throws during mount and takes the whole route down.
     So the outer chapters clip to the track instead of fading from -0.055
     or out to 1.055: chapter 01 opens already visible, chapter 04 holds. */

  // Crossfade in and out at the chapter boundaries.
  const fadeTimes: number[] = [];
  const fadeOpacity: number[] = [];
  if (isFirst) {
    fadeTimes.push(0);
    fadeOpacity.push(1);
  } else {
    fadeTimes.push(start - pad, start + pad * 0.5);
    fadeOpacity.push(0, 1);
  }
  if (isLast) {
    fadeTimes.push(1);
    fadeOpacity.push(1);
  } else {
    fadeTimes.push(end - pad * 0.5, end + pad);
    fadeOpacity.push(1, 0);
  }
  const opacity = useTransform(progress, fadeTimes, fadeOpacity);

  // The push-in and the copy drift share the chapter's clipped window.
  const from = isFirst ? 0 : start - pad;
  const to = isLast ? 1 : end + pad;
  // Slow cinematic push-in across the chapter's own span.
  const scale = useTransform(progress, [from, to], reduced ? [1, 1] : [1.1, 1]);
  // Copy drifts a little slower than the media — depth without parallax jitter.
  const textY = useTransform(progress, [from, to], reduced ? [0, 0] : [48, -48]);
  const badgeSpin = useTransform(progress, [start, end], [0, 90]);

  const ctaOpacity = useTransform(progress, [end - pad * 1.4, end - pad * 0.2], [0, 1]);

  return (
    <motion.div
      style={{ opacity, willChange: "opacity" }}
      className="absolute inset-0"
      aria-hidden={undefined}
    >
      {/* Media bed */}
      <motion.div style={{ scale, willChange: "transform" }} className="absolute inset-0">
        {chapter.mediaType === "video" ? (
          <video
            autoPlay
            loop
            muted={muted}
            playsInline
            poster={FALLBACK}
            className="h-full w-full object-cover"
          >
            <source src={chapter.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={chapter.mediaUrl}
            alt=""
            className="h-full w-full object-cover"
            loading={index > 1 ? "lazy" : "eager"}
            onError={(e) => {
              // Swap to the fallback once and only once. Assigning src
              // re-requests even when the URL is unchanged, so if the
              // fallback is unreachable too this handler would otherwise
              // re-fire and hammer the bucket indefinitely.
              const img = e.currentTarget;
              if (img.dataset.fellBack) return;
              img.dataset.fellBack = "1";
              img.src = FALLBACK;
            }}
          />
        )}
      </motion.div>

      {/* Legibility scrim — kept light so the photography still reads */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#16302B]/85 via-[#16302B]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16302B]/70 via-transparent to-[#16302B]/30" />

      {/* Chapter 01 carries the surveyed court lines */}
      {index === 0 && (
        <div className="pointer-events-none absolute inset-0">
          <CourtLines progress={progress} />
        </div>
      )}

      {/* Editorial copy */}
      <motion.div
        style={{ y: textY, willChange: "transform" }}
        className="absolute inset-0 flex items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-xl text-[#F4F1EA]">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-[#D7C8B4]">
                {chapter.number}
              </span>
              <span className="h-px w-10 bg-[#D7C8B4]/60" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F4F1EA]/80">
                {chapter.eyebrow}
              </span>
            </div>

            <h3 className="font-display text-4xl leading-[1.04] tracking-tight md:text-6xl">
              {chapter.title}
            </h3>

            <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-[#F4F1EA]/85 md:text-lg">
              {chapter.body}
            </p>

            {chapter.quote && (
              <p className="mt-6 border-l-2 border-[#D7C8B4] pl-4 font-display text-sm italic text-[#F4F1EA]/80 md:text-base">
                “{chapter.quote}”
              </p>
            )}

            <ul className="mt-8 flex flex-wrap gap-2">
              {chapter.facts.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-[#D7C8B4]/40 bg-[#16302B]/40 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#F4F1EA]/90 backdrop-blur-sm"
                >
                  {f}
                </li>
              ))}
            </ul>

            {/* Chapter 04 resolves into the reserve pill */}
            {isLast && (
              <motion.div style={{ opacity: ctaOpacity }} className="mt-10">
                <Link
                  to="/book"
                  data-cursor="RESERVE"
                  className="inline-flex items-center gap-3 rounded-full bg-[#F4F1EA] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#203F3A] transition-colors hover:bg-[#D7C8B4]"
                >
                  Check Availability
                  <span className="h-1 w-1 rounded-full bg-[#9B7955]" />
                  Reserve the House
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Chapter 01 — surveyed coordinates */}
      {index === 0 && (
        <div className="pointer-events-none absolute bottom-10 left-6 font-mono text-[10px] tracking-[0.25em] text-[#F4F1EA]/70 md:left-10">
          38°41′S · 176°04′E
        </div>
      )}

      {/* Chapter 01 — sound control for the drone reel */}
      {chapter.mediaType === "video" && (
        <button
          type="button"
          onClick={onToggleMute}
          data-cursor={muted ? "SOUND ON" : "MUTE"}
          aria-label={muted ? "Turn drone reel sound on" : "Mute drone reel"}
          className="absolute bottom-24 right-6 z-20 flex items-center gap-2 rounded-full border border-[#D7C8B4]/30 bg-[#16302B]/70 px-4 py-3 text-[#F4F1EA] backdrop-blur-md transition-colors hover:bg-[#16302B] md:right-10"
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
            {muted ? "Sound On" : "Mute"}
          </span>
        </button>
      )}

      {/* Chapter 03 — club seal and the temperature stat */}
      {index === 2 && (
        <>
          <motion.img
            src="/brand/marks/seal-stay-a-little-longer-sand.svg"
            alt=""
            aria-hidden="true"
            style={{ rotate: reduced ? 0 : badgeSpin, willChange: "transform" }}
            className="pointer-events-none absolute right-8 top-24 h-24 w-24 opacity-90 md:right-14 md:h-32 md:w-32"
          />
          <div className="pointer-events-none absolute bottom-24 right-6 max-w-[16rem] rounded-2xl border border-[#D7C8B4]/30 bg-[#16302B]/70 p-4 backdrop-blur-md md:right-10">
            <p className="font-display text-2xl text-[#F4F1EA]">Heated year-round</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#F4F1EA]/80">
              Swim in July, sauna at dusk.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export function ArchitecturalWalkthrough() {
  const trackRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(v / SPAN)));
    setActiveIdx((prev) => (prev === idx ? prev : idx));
  });

  // Clicking a pill scrolls to the middle of that chapter's span.
  const goToChapter = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (i * SPAN + SPAN / 2) * distance;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      ref={trackRef}
      aria-label="Architectural walkthrough"
      className="relative bg-[#16302B]"
      style={{ height: `${CHAPTERS.length * 115}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {CHAPTERS.map((c, i) => (
          <ChapterLayer
            key={c.id}
            chapter={c}
            index={i}
            progress={scrollYProgress}
            reduced={reduced}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          />
        ))}

        {/* Scrub pills — click to jump, stroke fills as you scroll */}
        <nav
          aria-label="Walkthrough chapters"
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#D7C8B4]/25 bg-[#16302B]/70 p-2 backdrop-blur-md"
        >
          {CHAPTERS.map((c, i) => (
            <ChapterPill
              key={c.id}
              chapter={c}
              index={i}
              isActive={i === activeIdx}
              progress={scrollYProgress}
              onSelect={() => goToChapter(i)}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}

function ChapterPill({
  chapter,
  index,
  isActive,
  progress,
  onSelect,
}: {
  chapter: Chapter;
  index: number;
  isActive: boolean;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const start = index * SPAN;
  const fill = useTransform(progress, [start, start + SPAN], [0, 1], { clamp: true });

  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor="VIEW"
      aria-label={`Chapter ${chapter.number} — ${chapter.eyebrow}`}
      aria-current={isActive ? "true" : undefined}
      className={`relative overflow-hidden rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors md:px-5 ${
        isActive ? "text-[#16302B]" : "text-[#F4F1EA]/70 hover:text-[#F4F1EA]"
      }`}
    >
      {/* Progress stroke */}
      <motion.span
        aria-hidden="true"
        style={{ scaleX: fill, transformOrigin: "left", willChange: "transform" }}
        className="absolute inset-0 rounded-full bg-[#D7C8B4]"
      />
      <span className="relative flex items-center gap-2">
        <span className="font-mono">{chapter.number}</span>
        <span className="hidden sm:inline">{chapter.eyebrow}</span>
      </span>
    </button>
  );
}
