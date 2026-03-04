import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schemaData?: any;
}

const DEFAULT_SEO = {
  siteName: 'One Eleven Taupo - Luxury Accommodation',
  defaultTitle: 'One Eleven Taupo | Luxury Lakefront Holiday Home & Accommodation',
  defaultDescription: 'Book luxury accommodation in Taupo, New Zealand. Five-bedroom lakefront holiday home with spa, sauna, gym, and stunning Lake Taupo views. Perfect for families and groups seeking premium Taupo accommodation.',
  defaultKeywords: 'accommodation taupo, taupo accommodation, luxury accommodation taupo, holiday home taupo, lakefront taupo, taupo holiday homes, vacation rental taupo, taupo rentals, lake taupo accommodation, luxury holiday homes taupo, family accommodation taupo, taupo lakefront accommodation, premium accommodation taupo, taupo vacation homes, spa accommodation taupo, sauna taupo, gym accommodation taupo, taupo airbnb alternative, direct booking taupo, taupo luxury rentals, five bedroom taupo, group accommodation taupo, large holiday home taupo, taupo property rental, new zealand accommodation, taupo nz accommodation, taupo stays, boutique accommodation taupo',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : '',
  image: '/og-image.jpg', // We'll need to create this
};

export function SEO({
  title,
  description = DEFAULT_SEO.defaultDescription,
  keywords = DEFAULT_SEO.defaultKeywords,
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
  
  const fullImage = image 
    ? `${DEFAULT_SEO.siteUrl}${image}` 
    : `${DEFAULT_SEO.siteUrl}${DEFAULT_SEO.image}`;

  // Default structured data for the property
  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VacationRental",
        "name": "One Eleven Taupo",
        "description": "Luxury five-bedroom lakefront holiday home in Taupo with spa, sauna, gym, and stunning Lake Taupo views",
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
          "reviewCount": "47"
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "Carlson Properties - One Eleven Taupo",
        "description": "Premium vacation rental property management in Taupo, New Zealand",
        "url": DEFAULT_SEO.siteUrl,
        "telephone": "",
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
      <meta name="keywords" content={keywords} />
      
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
