import React from 'react';

export interface OneElevenLogoProps {
  dark?: boolean;
  className?: string;
  layout?: "horizontal" | "stacked" | "single-line";
  withEndorsement?: boolean;
  variant?: "primary" | "place" | "wordmark" | "single-line";
  size?: number;
}

export const OneElevenLogo: React.FC<OneElevenLogoProps> = ({
  dark = false,
  className = "",
  size,
}) => {
  const colorSuffix = dark ? "lake" : "cream";
  const src = "/brand/logo/one-eleven-primary-" + colorSuffix + ".svg";

  return (
    <div className={"inline-flex items-center select-none group transition-opacity duration-300 hover:opacity-90 " + className}>
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
