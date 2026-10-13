import React from 'react';

interface OneElevenLogoProps {
  dark?: boolean;
  className?: string;
  layout?: "horizontal" | "stacked" | "single-line";
  withEndorsement?: boolean;
  variant?: "primary" | "place" | "wordmark" | "single-line";
  size?: number;
}

/**
 * One Eleven on the Mile — Official Brand SVG Logo
 * Route B · Clubhouse (Fraunces Black, softened, with Figtree)
 * Lake Green (#203F3A) & Warm Ivory (#F4F1EA)
 */
export const OneElevenLogo: React.FC<OneElevenLogoProps> = ({
  dark = false,
  className = "",
  layout = "horizontal",
  withEndorsement = true,
  variant,
  size,
}) => {
  // Determine variant
  let chosenVariant = variant;
  if (!chosenVariant) {
    if (layout === "single-line") {
      chosenVariant = "single-line";
    } else if (withEndorsement) {
      chosenVariant = "primary";
    } else {
      chosenVariant = "wordmark";
    }
  }

  // lake ink for light ground (dark=true), cream ink for dark ground (dark=false)
  const colorSuffix = dark ? "lake" : "cream";
  const src = `/brand/logo/one-eleven-${chosenVariant}-${colorSuffix}.svg`;

  const defaultWidth = chosenVariant === "single-line" ? 220 : chosenVariant === "primary" ? 190 : 160;
  const width = size || defaultWidth;

  return (
    <div className={`inline-flex items-center select-none group transition-opacity duration-300 hover:opacity-95 ${className}`}>
      <img
        src={src}
        alt="One Eleven on the Mile"
        width={width}
        className="h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        loading="eager"
      />
    </div>
  );
};
