import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Waves, Thermometer, Flame } from 'lucide-react';
import { getImageUrl } from '../lib/images';

interface Ritual {
  time: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number | string }>;
  badge: string;
  image: string;
  featured?: boolean;
}

const RITUALS: Ritual[] = [
  {
    time: '07:30',
    title: 'Coffee on the cedar deck',
    desc: 'The espresso machine goes on, the morning light catches Lake Taupō, and the deck warms in the sun. No reception desk, no schedule to keep.',
    icon: Coffee,
    badge: 'Morning Lakefront',
    image: getImageUrl('frontdeck.jpg'),
    featured: true,
  },
  {
    time: '11:00',
    title: 'A swim, even in July',
    desc: 'The courtyard pool is heated year-round. Cold mountain air overhead, steam rising from the blue water, and Mount Tauhara across the lake.',
    icon: Waves,
    badge: 'Heated 28°C Year-Round',
    image: getImageUrl('poolview.jpg'),
  },
  {
    time: '16:30',
    title: 'Cedar sauna, then the spa',
    desc: 'The rectilinear 4-person cedar cabin warms in the garden and the hydrotherapy spa sits just steps away. A quiet transition into evening.',
    icon: Thermometer,
    badge: 'Cedar Cabin · Hot Spa',
    image: getImageUrl('sauanaandspa.jpg'),
  },
  {
    time: '20:00',
    title: 'The long table & the fire',
    desc: 'Ten seats around the solid timber dining table, the double-sided gas fireplace warming both spaces, and the lake reflecting the dusk.',
    icon: Flame,
    badge: 'Seats 10 · Dual Gas Fire',
    image: getImageUrl('Dining Room.jpg'),
    featured: true,
  },
];

export const ClubhouseGuestWorld: React.FC = () => {
  return (
    <section className="relative border-t border-[#D5CFC4] bg-[#F3F0E9] px-6 py-24 text-[#292D2D] md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-[#D5CFC4] pb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#292D2D]/15 bg-[#E2DED5] px-3.5 py-1.5 text-[#292D2D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#292D2D]" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#62655F]">
                Daily Rhythm · 111 Jarden Mile
              </span>
            </div>
            <h2 className="font-serif text-3xl font-normal leading-[1.1] tracking-tight text-[#292D2D] sm:text-4xl md:text-5xl">
              The day finds its own <span className="font-serif italic text-[#625348]">rhythm here.</span>
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-[#62655F] md:text-lg">
              No reception desk, no schedule to keep. An espresso machine, a pool that is warm in
              July, a cedar sauna out in the garden and ten seats around one table. This is roughly how a
              day here unfolds.
            </p>
          </div>

          <div className="self-start text-left md:self-end md:text-right">
            <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B68D62]">
              Taupō · New Zealand
            </span>
            <span className="font-sans text-sm text-[#62655F]">5 Bedrooms · 4 Bathrooms · Sleeps 10</span>
          </div>
        </div>

        {/* Asymmetric Architectural Rhythm Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {RITUALS.map((r, i) => (
            <motion.div
              key={r.time}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col justify-between rounded-xl border border-[#D5CFC4] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_-8px_rgba(41,45,45,0.06)]"
            >
              <div>
                {/* Architectural Photo Frame — clean rectangular with 12px corners */}
                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#E2DED5]">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-[#292D2D]/85 px-2.5 py-1 text-[11px] font-medium tracking-wider text-[#F3F0E9] backdrop-blur-sm">
                    {r.time}
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <r.icon size={16} className="text-[#B68D62]" />
                  <span className="font-sans text-xs font-medium uppercase tracking-wider text-[#62655F]">
                    {r.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-normal text-[#292D2D]">
                  {r.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#62655F]">
                  {r.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
