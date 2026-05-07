import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  // `keywords` is intentionally still accepted for backwards compat but no longer rendered —
  // Google has ignored the meta keywords tag since 2009.
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schemaData?: any;
}

const DEFAULT_SEO = {
  siteName: 'One Eleven Taupo',
  defaultTitle: 'One Eleven Taupo | Luxury Holiday Home with Panoramic Lake Views',
  defaultDescription: 'Book luxury accommodation in Taupō, New Zealand. Five-bedroom holiday home with panoramic Lake Taupō views, spa, sauna and gym. Direct booking — no platform fees.',
  siteUrl: 'https://www.carlsonproperties.co.nz',
  image: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg',
};

export function SEO({
  title,
  description = DEFAULT_SEO.defaultDescription,
  image,
  url,
  type = 'website',
  schemaData,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | One Eleven Taupo`
    : DEFAULT_SEO.defaultTitle;

  const fullUrl = url
    ? `${DEFAULT_SEO.siteUrl}${url}`
    : DEFAULT_SEO.siteUrl;

  // Allow callers to pass either an absolute URL or a path; default is an absolute URL already.
  const fullImage = image
    ? (image.startsWith('http') ? image : `${DEFAULT_SEO.siteUrl}${image}`)
    : DEFAULT_SEO.image;

  // Default structured data for the property
  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VacationRental",
        "name": "One Eleven Taupo",
        "description": "Luxury five-bedroom holiday home in Taupo with panoramic Lake Taupo views, spa, sauna and gym",
        "image": [
          fullImage
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taupo",
          "addressRegion": "Waikato",
          "addressCountry": "NZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -38.6857,
          "longitude": 176.0702
        },
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Spa",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Sauna",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Gym",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Lake View",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "BBQ",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Parking",
            "value": true
          }
        ],
        "numberOfRooms": 5,
        "numberOfBedrooms": 5,
        "numberOfBathroomsTotal": 4,
        "petsAllowed": false,
        "url": fullUrl,
        "priceRange": "$$$",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "bestRating": "5",
          "reviewCount": "73"
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "Carlson Properties - One Eleven Taupo",
        "description": "Premium vacation rental property management in Taupo, New Zealand",
        "url": DEFAULT_SEO.siteUrl,
        "telephone": "+64-27-697-7961",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taupo",
          "addressRegion": "Waikato",
          "addressCountry": "NZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -38.6857,
          "longitude": 176.0702
        },
        "priceRange": "$$$",
        "image": fullImage
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": DEFAULT_SEO.siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": title || "One Eleven Taupo",
            "item": fullUrl
          }
        ]
      }
    ]
  };

  const schema = schemaData || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content="en_NZ" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="NZ-WKO" />
      <meta name="geo.placename" content="Taupo" />
      <meta name="geo.position" content="-38.6857;176.0702" />
      <meta name="ICBM" content="-38.6857, 176.0702" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
