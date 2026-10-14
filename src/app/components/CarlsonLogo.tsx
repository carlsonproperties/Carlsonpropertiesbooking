import React from 'react';

export interface CarlsonLogoProps {
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
  className = ,
  size = 180,
}) => {
  const colorSuffix = dark ? "lake" : "cream";
  const src = ;

  return (
    <div className={}>
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

export default CarlsonLogo;
