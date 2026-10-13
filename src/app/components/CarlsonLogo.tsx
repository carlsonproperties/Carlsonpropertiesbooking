import React from 'react';
import { RouteBCarlsonWordmark } from './ClubMarks';

interface CarlsonLogoProps {
  dark?: boolean;
  className?: string;
  showSubtitle?: boolean;
  variant?: 'mark' | 'text' | 'vector';
}

/**
 * Carlson Properties — Umbrella Brand Logo
 * Route B · Clubhouse (Fraunces Black, soft, with Figtree)
 * Lake Green (#203F3A) & Warm Ivory (#F4F1EA) & Sandstone (#D7C8B4)
 */
export const CarlsonLogo: React.FC<CarlsonLogoProps> = ({
  dark = false,
  className = "",
  showSubtitle = true,
  variant = "mark",
}) => {
  const primaryColor = dark ? "#203F3A" : "#F4F1EA";
  const accentColor = "#D7C8B4";

  if (variant === "vector") {
    return (
      <div className={`inline-flex items-center select-none group transition-opacity duration-300 hover:opacity-90 ${className}`}>
        <RouteBCarlsonWordmark size={150} style={{ color: primaryColor }} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none group transition-opacity duration-300 hover:opacity-90 ${className}`}>
      {/* Clubhouse Portal & Three Pillars (111) Emblem */}
      <svg
        width="32"
        height="36"
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Soft rounded arch / threshold */}
        <path
          d="M3 34V13C3 6.92487 7.92487 2 14 2H18C24.0751 2 29 6.92487 29 13V34"
          stroke={primaryColor}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Three vertical strokes (111 house number) */}
        <path
          d="M10 14V34"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 10V34"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M22 14V34"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Base datum */}
        <path
          d="M1 34H31"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography in Clubhouse Fraunces + Figtree */}
      <div className="flex flex-col justify-center text-left">
        <span
          className="font-serif tracking-tight text-lg md:text-xl font-normal leading-none"
          style={{
            color: primaryColor,
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: "'SOFT' 100, 'opsz' 72",
          }}
        >
          Carlson Properties
        </span>
        {showSubtitle && (
          <span
            className="font-sans text-[9px] uppercase tracking-[0.28em] font-semibold mt-1 leading-none"
            style={{ color: accentColor }}
          >
            Taupō · New Zealand
          </span>
        )}
      </div>
    </div>
  );
};
