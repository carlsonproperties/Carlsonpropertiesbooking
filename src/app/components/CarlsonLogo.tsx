import React from 'react';
// Removed unused figma:asset import - using direct Supabase Storage URL instead

interface CarlsonLogoProps {
  dark?: boolean;
}

export const CarlsonLogo = ({ dark = false }: CarlsonLogoProps) => (
  <div className="flex items-center transition-opacity duration-500 hover:opacity-90">
    <img 
      src="https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Logo.png"
      alt="Carlson Properties" 
      className="h-16 md:h-20 w-auto"
      onError={(e) => {
        console.error('Logo image failed to load');
        console.error('Logo URL:', e.currentTarget.src);
      }}
      onLoad={() => console.log('Logo loaded successfully')}
    />
  </div>
);