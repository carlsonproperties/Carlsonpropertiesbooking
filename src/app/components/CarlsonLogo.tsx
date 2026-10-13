import React from 'react';

interface CarlsonLogoProps {
  dark?: boolean;
  className?: string;
  showSubtitle?: boolean;
  size?: number;
}

/**
 * Carlson Properties — Official Brand SVG Logo
 * Outlined vector with Figtree endorsement
 * Lake Green (#203F3A) & Warm Ivory (#F4F1EA)
 */
export const CarlsonLogo: React.FC<CarlsonLogoProps> = ({
  dark = false,
  className = "",
  showSubtitle = true,
  size = 180,
}) => {
  const colorSuffix = dark ? "lake" : "cream";
  const src = `/brand/logo/carlson-properties-${colorSuffix}.svg`;

  return (
    <div className={`inline-flex items-center select-none group transition-opacity duration-300 hover:opacity-95 ${className}`}>
      <img
        src={src}
        alt="Carlson Properties"
        width={size}
        className="h-auto object-contain"
        loading="eager"
      />
    </div>
  );
};
