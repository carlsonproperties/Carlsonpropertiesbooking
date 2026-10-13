import React from 'react';

interface CarlsonLogoProps {
  dark?: boolean;
  className?: string;
  showSubtitle?: boolean;
}

/**
 * Carlson Properties — Coordinated Umbrella Brand Logo
 * Features an architectural threshold / portal symbol paired with warm, balanced typography.
 * Scales cleanly down to 24px and up to billboard sizes with crisp vector strokes.
 */
export const CarlsonLogo: React.FC<CarlsonLogoProps> = ({
  dark = false,
  className = "",
  showSubtitle = true,
}) => {
  // If dark mode or on dark header background, use Warm Ivory/Sandstone.
  // Otherwise use Lake Green (#203F3A).
  const primaryColor = dark ? "#203F3A" : "#F4F1EA";
  const accentColor = "#D7C8B4"; // Sandstone

  return (
    <div className={`inline-flex items-center gap-3 select-none group transition-opacity duration-300 hover:opacity-90 ${className}`}>
      {/* Architectural Threshold Mark */}
      <svg
        width="34"
        height="38"
        viewBox="0 0 34 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Outer door frame / lintel */}
        <path
          d="M4 36V6C4 3.79086 5.79086 2 8 2H26C28.2091 2 30 3.79086 30 6V36"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Inner threshold / lake horizon opening */}
        <path
          d="M10 36V13C10 11.3431 11.3431 10 13 10H21C22.6569 10 24 11.3431 24 13V36"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Warm welcoming hearth / floor datum line */}
        <path
          d="M2 36H32"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center text-left">
        <span
          className="font-serif tracking-tight text-lg md:text-xl font-normal leading-none"
          style={{ color: primaryColor }}
        >
          Carlson Properties
        </span>
        {showSubtitle && (
          <span
            className="font-sans text-[9px] uppercase tracking-[0.3em] font-medium mt-1 leading-none"
            style={{ color: accentColor }}
          >
            Taupō · New Zealand
          </span>
        )}
      </div>
    </div>
  );
};
