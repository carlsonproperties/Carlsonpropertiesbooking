import * as React from "react";
import { Star, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GOOGLE_REVIEW_URL } from "../lib/links";
import { REVIEWS, REVIEW_AGGREGATE, type GuestReview } from "../lib/reviews";

/**
 * The Taupō Experience — the statement and the proof, together.
 *
 * "Guests keep telling us the same thing" only earns its place next to the
 * reviews that say it, so the statement block lives here rather than in the
 * footer. The reviews themselves run as two counter-scrolling rows: 56 of them
 * exist, and a single rotating card never conveyed that. Motion is CSS-driven
 * and transform-only so it composites on the GPU, pauses on hover/focus, and
 * stops entirely under prefers-reduced-motion (where the rows become ordinary
 * horizontally scrollable lists).
 */

const FACTS = [
  "5 Bedrooms",
  "Sleeps 10",
  "Heated Pool",
  "4-Person Cedar Sauna",
  "Double-Sided Fire",
  "5 Min to Town",
];

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      className={`flex gap-0.5 ${className}`}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: GuestReview }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between rounded-3xl border border-[#D7C8B4]/60 bg-white p-7 shadow-sm transition-shadow duration-500 hover:shadow-xl sm:w-[23rem]">
      <div>
        <div className="flex items-center justify-between">
          <Stars value={r.rating} className="text-[#7A5E41]" />
          {r.highlight && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7A5E41]">
              {r.highlight}
            </span>
          )}
        </div>
        <blockquote className="mt-5 font-serif text-base italic leading-relaxed text-[#203F3A] sm:text-lg">
          &ldquo;{r.text}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[#D7C8B4]/50 pt-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#203F3A] font-serif text-sm text-[#F4F1EA]">
          {r.author.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-serif text-sm text-[#203F3A]">{r.author}</span>
          <span className="block text-[9px] uppercase tracking-[0.2em] text-[#203F3A]/60">
            {r.source === 'Google' ? 'Google Review' : 'Verified Airbnb Guest'}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** One marquee lane. The track holds the list twice so the loop is seamless. */
function Lane({
  items,
  reverse = false,
  duration,
  animate,
}: {
  items: GuestReview[];
  reverse?: boolean;
  duration: number;
  animate: boolean;
}) {
  return (
    <div
      className={
        animate
          ? "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          : "flex gap-5 overflow-x-auto pb-2"
      }
    >
      <div
        className={animate ? "flex w-max gap-5 pr-5 oe-marquee" : "contents"}
        style={
          animate
            ? {
                animationDuration: `${duration}s`,
                animationDirection: reverse ? "reverse" : "normal",
              }
            : undefined
        }
      >
        {(animate ? [...items, ...items] : items).map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion() ?? false;
  const animate = !reduced;
  const laneTwo = React.useMemo(
    () => [...REVIEWS.slice(6), ...REVIEWS.slice(0, 6)],
    [],
  );

  return (
    <section
      aria-label="Guest reviews"
      className="relative overflow-hidden border-t border-[#D7C8B4]/50 bg-[#F4F1EA] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* The statement — moved here from the footer so it sits with the
            reviews that back it up. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#7A5E41] md:text-xs">
            The Taupō Experience
          </p>
          <h2
            className="mt-5 font-serif text-6xl font-light leading-[0.92] tracking-tighter text-[#203F3A] sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: "'SOFT' 100, 'opsz' 144",
            }}
          >
            Hard to <br />
            <span className="font-normal italic text-[#7A5E41]">leave.</span>
          </h2>

          <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-[#203F3A]/85 md:text-lg">
            Guests keep telling us the same thing — they meant to head into town, and then
            didn&rsquo;t. Five bedrooms and room for ten, a pool that stays warm through July, a
            4-person cedar sauna out in the courtyard, and the lake doing its thing through every
            window.
          </p>
          <p className="mt-4 max-w-2xl text-base font-light italic leading-relaxed text-[#7A5E41] md:text-lg">
            Taupō is five minutes away, for whenever you finally want it.
          </p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#203F3A]/75">
            {FACTS.map((fact, i) => (
              <li key={fact} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="h-1 w-1 rounded-full bg-[#7A5E41]/60" aria-hidden="true" />
                )}
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Aggregate */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-[#D7C8B4] pt-10">
          <div className="flex items-center gap-4">
            <Stars value={5} className="text-[#7A5E41]" />
            <span className="font-mono text-sm font-bold text-[#203F3A]">
              {REVIEW_AGGREGATE.ratingValue} / 5.0
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#203F3A]/75">
              {REVIEW_AGGREGATE.reviewCount} reviews · Airbnb Superhost &amp; Google
            </span>
          </div>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="reviews"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#203F3A] underline-offset-8 hover:underline"
          >
            Read all verified reviews
            <ExternalLink
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>

      {/* Two counter-scrolling lanes. Full-bleed on purpose — the rows should run
          past the page gutters so the wall reads as longer than the viewport. */}
      <div className="mt-12 space-y-5">
        <Lane items={REVIEWS} duration={64} animate={animate} />
        <Lane items={laneTwo} duration={78} reverse animate={animate} />
      </div>

      <style>{`
        @keyframes oe-marquee-shift {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .oe-marquee {
          animation-name: oe-marquee-shift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .group:hover .oe-marquee,
        .group:focus-within .oe-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .oe-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
