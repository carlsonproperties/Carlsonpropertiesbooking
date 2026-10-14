import React from 'react';

interface CarlsonLogoProps {
  dark?: boolean;
  className?: string;
  showSubtitle?: boolean;
  size?: number;
}

/**
 * Carlson Properties — Japandi Organic Soft Modern Logo
 * Charcoal (#292D2D) for light grounds & Warm Ivory (#F3F0E9) for dark grounds
 */
export const CarlsonLogo: React.FC<CarlsonLogoProps> = ({
  dark = false,
  className = "",
  size = 180,
}) => {
  const colorSuffix = dark ? "lake" : "cream";
  const src = `/brand/logo/carlson-properties-${colorSuffix}.svg`;

  return (
    <div className={`inline-flex items-center select-none group transition-opacity duration-300 hover:opacity-90 ${className}`}>
      <img
        src={src}
        alt="Carlson Properties"
        width={size}
        className="h-auto object-contain max-h-12 w-auto"
        loading="eager"
      />
    </div>
  );
};
