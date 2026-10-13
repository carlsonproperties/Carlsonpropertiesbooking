import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Waves, Thermometer, Flame, Check } from 'lucide-react';
import { ScallopedSeal, OvalBadge } from './ClubMarks';
import { Link } from 'react-router';

/**
 * ClubhouseGuestWorld — how a day at One Eleven actually runs.
 *
 * Everything on this page has to be something a guest will really find when
 * they arrive: the espresso machine, the year-round heated pool, the 4-person
 * rectangular cedar sauna and spa, the double-sided fireplace, the ten-seater table. There is
 * no merchandise and no branded kit, so nothing here may imply any.
 */

interface Ritual {
  time: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number | string }>;
  badge: string;
  image: string;
}

const RITUALS: Ritual[] = [
  {
    time: '07:30',
    title: 'Coffee on the cedar deck',
    desc: 'The espresso machine goes on, the mist lifts off the lake, and the deck takes the early sun. Nobody is anywhere they have to be.',
    icon: Coffee,
    badge: 'Barista Espresso Bar',
    image: '/images/rituals/ritual-01-coffee.jpg',
  },
  {
    time: '11:00',
    title: 'A swim, even in July',
    desc: 'The pool is heated the whole year round. Cold mountain air on your face, steam coming off the water, Mount Tauhara across the lake.',
    icon: Waves,
    badge: 'Heated Year-Round',
    image: '/images/rituals/ritual-02-swim.jpg',
  },
  {
    time: '16:30',
    title: 'Sauna, then the spa',
    desc: 'The 4-person rectangular cedar sauna warms up in the courtyard and the hydrotherapy spa sits just steps away. Guests keep telling us this is the part that makes the house hard to leave.',
    icon: Thermometer,
    badge: '4-Person Sauna · Spa · Pool',
    image: '/images/rituals/ritual-03-sauna.jpg',
  },
  {
    time: '20:00',
    title: 'The table and the fire',
    desc: 'Ten seats gather around the dining table, the double-sided fireplace warms the living room, and the lake goes dark outside the glass. Town is five minutes away if you want it.',
    icon: Flame,
    badge: 'Double-Sided Fire · Seats 10',
    image: '/images/rituals/ritual-04-dining.jpg',
  },
];

export const ClubhouseGuestWorld: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-t border-[#D7C8B4]/50 bg-[#F4F1EA] px-6 py-28 text-[#203F3A] md:py-36">
      {/* Decorative court-line watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          stroke="#203F3A"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="50" y="50" width="1100" height="700" />
          <line x1="600" y1="50" x2="600" y2="750" />
          <line x1="200" y1="50" x2="200" y2="750" />
          <line x1="1000" y1="50" x2="1000" y2="750" />
          <line x1="200" y1="400" x2="1000" y2="400" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-[#D7C8B4] pb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#203F3A]/15 bg-[#203F3A]/5 px-3.5 py-1.5 text-[#203F3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#203F3A]" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em]">
                Good Company · A Day on the Mile
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-[#203F3A] sm:text-5xl md:text-6xl">
              The day finds its own <br />
              <span className="font-normal italic">rhythm here.</span>
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base font-light leading-relaxed text-[#203F3A]/80 md:text-lg">
              No reception desk, no schedule to keep. An espresso machine, a pool that is warm in
              July, a sauna out in the garden and ten seats around one table. This is roughly how a
              day here goes.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start md:self-end">
            <div className="hidden text-right sm:block">
              <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#9B7955]">
                Taupō · New Zealand
              </span>
              <span className="font-sans text-xs text-[#203F3A]/70">5 Bedrooms · Sleeps 10</span>
            </div>
            <ScallopedSeal size={105} className="flex-shrink-0 text-[#203F3A]" />
          </div>
        </div>

        {/* The four parts of the day */}
        <ol className="grid grid-cols-1 gap-8 font-sans md:grid-cols-2 lg:grid-cols-4">
          {RITUALS.map((r, i) => (
            <motion.li
              key={r.time}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D7C8B4] bg-white text-left shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div>
                {/* Ritual Image Container with subtle grayscale to color and time chip */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#203F3A]/5">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md">
                    <span className="font-serif text-sm font-light text-[#F4F1EA]">
                      {r.time}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[#F4F1EA] backdrop-blur-md transition-colors group-hover:bg-[#F4F1EA] group-hover:text-[#203F3A]">
                    <r.icon size={15} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-serif text-xl leading-snug text-[#203F3A]">{r.title}</h3>
                  <p className="text-xs font-light leading-relaxed text-[#203F3A]/75">{r.desc}</p>
                </div>
              </div>

              <div className="mx-6 mb-6 flex items-center justify-between border-t border-[#D7C8B4]/40 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B7955]">
                  {r.badge}
                </span>
                <Check size={14} className="text-[#203F3A]/40" />
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Bottom booking banner */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#203F3A] p-8 text-[#F4F1EA] shadow-2xl sm:flex-row md:p-12">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-4">
              <OvalBadge
                size={140}
                className="hidden flex-shrink-0 text-[#F4F1EA] opacity-90 sm:block"
              />
              <div>
                <h3 className="font-serif text-2xl font-light text-[#F4F1EA] md:text-3xl">
                  Experience One Eleven in Person
                </h3>
                <p className="mt-0.5 font-sans text-xs text-[#F4F1EA]/75 md:text-sm">
                  Reserve direct with local hosts Matt &amp; Ashleigh for the best dates and rates.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/book"
            data-cursor="book"
            className="flex-shrink-0 rounded-full bg-[#F4F1EA] px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#203F3A] shadow-lg transition-all hover:bg-[#D7C8B4]"
          >
            Check Calendar &amp; Rates
          </Link>
        </div>
      </div>
    </section>
  );
};
