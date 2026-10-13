import React from 'react';

interface OneElevenLogoProps {
  dark?: boolean;
  className?: string;
  layout?: "horizontal" | "stacked";
  withEndorsement?: boolean;
}

/**
 * One Eleven on the Mile — Flagship Property Logo
 * Architectural mark drawing from the real property architecture:
 * - Shallow peaked roofline
 * - Distinctive tall entrance with 3 vertical pillar lines (echoing "111")
 * - Broad horizontal grounding base
 */
export const OneElevenLogo: React.FC<OneElevenLogoProps> = ({
  dark = false,
  className = "",
  layout = "horizontal",
  withEndorsement = true,
}) => {
  const primary = dark ? "#203F3A" : "#F4F1EA";
  const bronze = "#9B7955";
  const sandstone = "#D7C8B4";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none group ${
        layout === "stacked" ? "flex-col text-center" : "text-left"
      } ${className}`}
    >
      {/* Architectural 111 Roofline Monogram */}
      <svg
        width="40"
        height="36"
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Shallow peaked roofline */}
        <path
          d="M3 13L20 4L37 13"
          stroke={primary}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 111 Three Pillars (tall entrance and glazing cadence) */}
        <path
          d="M13 13V30"
          stroke={sandstone}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 10V30"
          stroke={primary}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M27 13V30"
          stroke={sandstone}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Foundation line */}
        <path
          d="M6 30H34"
          stroke={primary}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className={`flex flex-col ${layout === "stacked" ? "items-center" : "items-start"}`}>
        <span
          className="font-serif tracking-tight text-xl md:text-2xl font-light leading-none"
          style={{ color: primary }}
        >
          ONE ELEVEN
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="font-sans text-[9px] uppercase tracking-[0.32em] font-medium leading-none"
            style={{ color: sandstone }}
          >
            On The Mile · Taupō
          </span>
          {withEndorsement && (
            <>
              <span className="text-[9px] opacity-40" style={{ color: sandstone }}>·</span>
              <span
                className="font-sans text-[8px] uppercase tracking-[0.2em] font-normal leading-none"
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
