import React from 'react';
import { RouteBOneElevenWordmark } from './ClubMarks';

interface OneElevenLogoProps {
  dark?: boolean;
  className?: string;
  layout?: "horizontal" | "stacked";
  withEndorsement?: boolean;
  variant?: "mark" | "vector";
}

/**
 * One Eleven on the Mile — Flagship Property Logo
 * Route B · Clubhouse (Fraunces Black, softened, with Figtree)
 * Lake Green (#203F3A) & Warm Ivory (#F4F1EA) & Sandstone (#D7C8B4)
 */
export const OneElevenLogo: React.FC<OneElevenLogoProps> = ({
  dark = false,
  className = "",
  layout = "horizontal",
  withEndorsement = true,
  variant = "mark",
}) => {
  const primary = dark ? "#203F3A" : "#F4F1EA";
  const sandstone = "#D7C8B4";
  const bronze = "#9B7955";

  if (variant === "vector") {
    return (
      <div className={`inline-flex items-center select-none group ${className}`}>
        <RouteBOneElevenWordmark size={240} style={{ color: primary }} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 select-none group ${
        layout === "stacked" ? "flex-col text-center" : "text-left"
      } ${className}`}
    >
      {/* 111 Architectural Roofline & Cedar Pillars */}
      <svg
        width="38"
        height="34"
        viewBox="0 0 38 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Soft shallow peaked roofline */}
        <path
          d="M2 13L19 4L36 13"
          stroke={primary}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 111 Three Pillars (tall entrance and glazing cadence) */}
        <path
          d="M12 13V28"
          stroke={sandstone}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M19 10V28"
          stroke={primary}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M26 13V28"
          stroke={sandstone}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Horizontal datum */}
        <path
          d="M5 28H33"
          stroke={primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography in Clubhouse Fraunces + Figtree */}
      <div className={`flex flex-col ${layout === "stacked" ? "items-center" : "items-start"}`}>
        <span
          className="font-serif tracking-tight text-xl md:text-2xl font-light leading-none"
          style={{
            color: primary,
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'opsz' 72",
          }}
        >
          One Eleven
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="font-sans text-[9px] uppercase tracking-[0.3em] font-semibold leading-none"
            style={{ color: sandstone }}
          >
            On The Mile · Taupō
          </span>
          {withEndorsement && (
            <>
              <span className="text-[9px] opacity-40" style={{ color: sandstone }}>·</span>
              <span
                className="font-sans text-[8px] uppercase tracking-[0.22em] font-medium leading-none"
                style={{ color: bronze }}
              >
                By Carlson
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
