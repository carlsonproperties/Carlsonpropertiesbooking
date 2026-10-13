import React from 'react';

export type AmenityType =
  | 'pool'
  | 'sauna'
  | 'spa'
  | 'views'
  | 'coffee'
  | 'gym'
  | 'bedrooms'
  | 'bathrooms'
  | 'sleeps'
  | 'checkin'
  | 'wifi'
  | 'town';

interface AmenityIconProps extends React.SVGProps<SVGSVGElement> {
  name: AmenityType | string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const iconPaths: Record<string, React.ReactNode> = {
  pool: (
    <>
      <path d="M7 14V5.6a1.6 1.6 0 0 1 3.2 0" />
      <path d="M13 14V5.6a1.6 1.6 0 0 1 3.2 0" />
      <path d="M7 8.5h6M7 11.5h6" />
      <path d="M2.5 17.5c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2" />
      <path d="M2.5 21c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2" />
    </>
  ),
  sauna: (
    <>
      <path d="M8 2.8c-1 1.1 1 2.2 0 3.4s1 2.2 0 3.4" />
      <path d="M12 2.8c-1 1.1 1 2.2 0 3.4s1 2.2 0 3.4" />
      <path d="M16 2.8c-1 1.1 1 2.2 0 3.4s1 2.2 0 3.4" />
      <path d="M3.5 14h17M3.5 18h17M6 14v7M18 14v7" />
    </>
  ),
  spa: (
    <>
      <path d="M3 12h18v1.5a6.5 6.5 0 0 1-6.5 6.5h-5A6.5 6.5 0 0 1 3 13.5z" />
      <path d="M7.5 20l-1 1.8M16.5 20l1 1.8" />
      <circle cx="8.5" cy="7.5" r="1.6" />
      <circle cx="13" cy="4.6" r="1.3" />
      <circle cx="15.5" cy="8.6" r="1.7" />
    </>
  ),
  views: (
    <>
      <path d="M2.5 15.5 8 8l3.2 4.2L14.5 7l7 8.5" />
      <path d="M2.5 19.5c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.5 9.5h11v4.2a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
      <path d="M15.5 11h1.3a2.4 2.4 0 0 1 0 4.8h-1.6" />
      <path d="M3.5 21.2h14" />
      <path d="M8.5 3.2c-.8.9.8 1.8 0 2.8M12 3.2c-.8.9.8 1.8 0 2.8" />
    </>
  ),
  gym: (
    <>
      <rect x="4.5" y="7" width="3.5" height="10" rx="1.2" />
      <rect x="16" y="7" width="3.5" height="10" rx="1.2" />
      <path d="M8 12h8M2.5 10v4M21.5 10v4" />
    </>
  ),
  bedrooms: (
    <>
      <path d="M3 5v15" />
      <path d="M3 16h18v4" />
      <path d="M3 13h15a3 3 0 0 1 3 3" />
      <rect x="5.5" y="9.2" width="4.5" height="3.8" rx="1.4" />
    </>
  ),
  bathrooms: (
    <>
      <path d="M5 21V6.5A3.5 3.5 0 0 1 8.5 3h1A3.5 3.5 0 0 1 13 6.5V8" />
      <path d="M9.5 8.5h7" />
      <path d="M10.5 12v1M13 12v1M15.5 12v1M11.8 15.5v1M14.3 15.5v1" />
    </>
  ),
  sleeps: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M16 14.2a5 5 0 0 1 5.5 5.3" />
    </>
  ),
  checkin: (
    <>
      <rect x="5.5" y="2.8" width="13" height="18.4" rx="2.6" />
      <path d="M9.5 17.4h5" />
      <circle cx="9.2" cy="7.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="7.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="10.6" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.6" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10.6" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="13.7" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.7" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="13.7" r="0.95" fill="currentColor" stroke="none" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9.2a13.5 13.5 0 0 1 19 0" />
      <path d="M5.6 12.7a9 9 0 0 1 12.8 0" />
      <path d="M8.8 16.1a4.6 4.6 0 0 1 6.4 0" />
      <circle cx="12" cy="19.6" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  town: (
    <>
      <path d="M12 21.5s-6.5-5.9-6.5-11.1a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11.1-6.5 11.1z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </>
  ),
};

// Aliases for convenience
iconPaths['heated pool'] = iconPaths.pool;
iconPaths['pool & spa'] = iconPaths.pool;
iconPaths['outdoor sauna'] = iconPaths.sauna;
iconPaths['cedar sauna'] = iconPaths.sauna;
iconPaths['lake views'] = iconPaths.views;
iconPaths['espresso'] = iconPaths.coffee;
iconPaths['fitness'] = iconPaths.gym;
iconPaths['bed'] = iconPaths.bedrooms;
iconPaths['bath'] = iconPaths.bathrooms;
iconPaths['guests'] = iconPaths.sleeps;
iconPaths['key'] = iconPaths.checkin;
iconPaths['internet'] = iconPaths.wifi;
iconPaths['location'] = iconPaths.town;

export const AmenityIcon: React.FC<AmenityIconProps> = ({
  name,
  size = 24,
  strokeWidth = 2.3,
  className = '',
  ...props
}) => {
  const key = name.toLowerCase();
  const content = iconPaths[key] || iconPaths.pool;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {content}
    </svg>
  );
};
