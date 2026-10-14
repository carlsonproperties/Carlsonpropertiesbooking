import React from 'react';

export interface OneElevenLogoProps {
  dark?: boolean;
  className?: string;
  layout?: "horizontal" | "stacked" | "single-line";
  withEndorsement?: boolean;
  variant?: "primary" | "place" | "wordmark" | "single-line";
  size?: number;
}

/**
 * One Eleven on the Mile — Japandi Organic Soft Modern Logo
 * Stacked 'one eleven' with 'on the mile' and 'A Carlson Properties Stay' endorsement
 */
export const OneElevenLogo: React.FC<OneElevenLogoProps> = ({
  dark = false,
  className = "",
  size,
}) => {
  const colorSuffix = dark ? "lake" : "cream";
  const src = ;

  return (
    <div className={}>
      <img
        src={src}
        alt="One Eleven on the Mile — A Carlson Properties Stay"
        width={size || 220}
        className="h-auto object-contain max-h-14 w-auto"
        loading="eager"
      />
    </div>
  );
};

export default OneElevenLogo;
