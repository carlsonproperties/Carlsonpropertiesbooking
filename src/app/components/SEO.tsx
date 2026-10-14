import React from 'react';
import { Helmet } from 'react-helmet-async';
import { faqSchema } from '../lib/schemas';
import { REVIEWS, REVIEW_AGGREGATE } from '../lib/reviews';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonicalUrl?: string;
  type?: string;
  schemaData?: any;
}

const DEFAULT_SEO = {
  siteName: 'One Eleven on the Mile | Taupō Holiday Accommodation',
  defaultTitle: 'Taupō Holiday Accommodation | One Eleven on the Mile — 5-Bed House with Pool, Spa & Sauna',
  defaultDescription: 'Book accommodation in Taupō at One Eleven on the Mile — a five-bedroom, four-bathroom Taupō holiday home with a year-round heated pool, spa, cedar sauna, gym and wide lake views. Sleeps 10, hosted locally by Matt and Ashleigh Carlson.',
  defaultKeywords: 'accommodation in taupo, taupo accommodation, accommodation taupo nz, luxury accommodation taupo, holiday home taupo, lake view taupo, taupo holiday homes, vacation rental taupo, taupo rentals, lake taupo accommodation, luxury holiday homes taupo, family accommodation taupo, group accommodation taupo, large holiday home taupo, five bedroom taupo, spa accommodation taupo, sauna taupo, gym accommodation taupo, taupo airbnb alternative, direct booking taupo, taupo luxury rentals, new zealand accommodation, taupo nz accommodation, taupo stays, boutique accommodation taupo, one eleven on the mile',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://carlsonproperties.co.nz',
  image: '/og-image.jpg',
  // Purpose-built 1200x630 social card (public/og-image.jpg) rather than a raw
  // property photo, so link previews carry the name, the pitch and the brand.
  imageUrl: 'https://www.carlsonproperties.co.nz/og-image.jpg',
};

export function SEO({
  title,
  description = DEFAULT_SEO.defaultDescription,
  keywords = DEFAULT_SEO.defaultKeywords,
  image,
  url,
  canonicalUrl,
  type = 'website',
  schemaData,
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | One Eleven on the Mile` 
    : DEFAULT_SEO.defaultTitle;
  
  const fullUrl = canonicalUrl
    ? canonicalUrl
    : url 
      ? `${DEFAULT_SEO.siteUrl}${url}` 
      : `${DEFAULT_SEO.siteUrl}/`;
  
  const fullImage = image 
    ? `${DEFAULT_SEO.siteUrl}${image}` 
    : DEFAULT_SEO.imageUrl;

  const sameAs = [
    'https://www.instagram.com/oneelevenonthemile',
    'https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/',
    'https://g.page/r/CZuTLT-YqNStEBM/review',
    'https://share.google/t0KAo2MAm0a41hEg3',
  ];

  const PROPERTY_IMAGES = [
    'Street facing.jpg', 'kitchen.png', 'poolview.jpg', 'close up pool feature.png',
    'Open plan living.jpg', 'Bedroom 1.avif', 'sauanaandspa.jpg', 'BBq and patio.png',
    'lake views.jpg', 'frontdeck.jpg', 'looking into kitchen.png', 'Dining Room.jpg',
  ].map((f) => `https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/${encodeURIComponent(f)}`);

  // Review markup is built from the same twelve reviews the page renders, so
  // the structured data cannot drift from what a visitor actually sees —
  // Google's policy requires the two to match.
  const reviews = REVIEWS.map((r) => ({
    '@type': 'Review',
    'author': { '@type': 'Person', 'name': r.author },
    'datePublished': r.date,
    'reviewBody': r.text,
    'reviewRating': { '@type': 'Rating', 'ratingValue': String(r.rating), 'bestRating': '5' },
    'publisher': { '@type': 'Organization', 'name': r.source },
  }));

  const amenityFeature = [
    'Heated swimming pool', 'Spa pool', 'Sauna', 'Gym', 'BBQ', 'Lake views',
    'Free parking', 'Free WiFi', 'Air conditioning', 'Full kitchen',
    'Washing machine', 'Self check-in', 'Indoor fireplace', 'Smart lock entry',
  ].map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  }));

  // Default structured data for the property
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LodgingBusiness', 'VacationRental'],
        '@id': `${DEFAULT_SEO.siteUrl}/#accommodation`,
        'name': 'One Eleven on the Mile',
        'alternateName': 'One Eleven Taupo — Holiday Accommodation in Taupō',
        'description': 'A five-bedroom, four-bathroom Taupō holiday home with a heated pool, spa, cedar sauna, gym and wide Lake Taupō views. Sleeps up to 10 guests, hosted locally by Matt and Ashleigh Carlson.',
        'url': `${DEFAULT_SEO.siteUrl}/`,
        'image': PROPERTY_IMAGES,
        'logo': PROPERTY_IMAGES[0],
        'identifier': { '@type': 'PropertyValue', 'propertyID': 'one-eleven-on-the-mile', 'value': '111 Jarden Mile, Taupō, New Zealand' },
        'hasMap': 'https://www.google.com/maps/search/?api=1&query=111+Jarden+Mile+Taupo+New+Zealand',
        'containsPlace': [
          {
            '@type': 'Accommodation',
            'name': 'One Eleven on the Mile — 5-Bedroom Lake House',
            'numberOfRooms': 5,
            'numberOfBedrooms': 5,
            'numberOfBathroomsTotal': 4,
            'maximumAttendeeCapacity': 10,
            'petsAllowed': false,
            'smokingAllowed': false,
            'amenityFeature': amenityFeature,
            'occupancy': { '@type': 'QuantitativeValue', 'value': 10, 'maxValue': 10 },
          },
        ],
        'review': reviews,
        'telephone': '+64 27 697 7961',
        'email': 'bookings@carlsonproperties.co.nz',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '111 Jarden Mile',
          'addressLocality': 'Taupō',
          'addressRegion': 'Waikato',
          'postalCode': '3330',
          'addressCountry': 'NZ',
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': -38.6857,
          'longitude': 176.0702,
        },
        'checkinTime': '15:00',
        'checkoutTime': '10:00',
        'numberOfRooms': 5,
        'numberOfBedrooms': 5,
        'numberOfBathroomsTotal': 4,
        'maximumAttendeeCapacity': 10,
        'petsAllowed': false,
        'smokingAllowed': false,
        'amenityFeature': amenityFeature,
        'priceRange': '$$$',
        'currenciesAccepted': 'NZD',
        'paymentAccepted': 'Credit Card, Debit Card, Bank Transfer',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': REVIEW_AGGREGATE.ratingValue,
          'reviewCount': String(REVIEW_AGGREGATE.reviewCount),
          'bestRating': '5',
          'worstRating': '1',
        },
        'sameAs': sameAs,
        'potentialAction': {
          '@type': 'ReserveAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${DEFAULT_SEO.siteUrl}/book`,
            'inLanguage': 'en-NZ',
            'actionPlatform': ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
          },
          'result': { '@type': 'LodgingReservation', 'name': 'Reserve a stay at One Eleven on the Mile' },
        },
      },
      {
        '@type': 'VideoObject',
        'name': 'One Eleven on the Mile — Drone Tour',
        'description': 'Aerial drone tour of One Eleven on the Mile, holiday accommodation in Taupō, New Zealand.',
        'thumbnailUrl': PROPERTY_IMAGES[0],
        'contentUrl': 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/One%20eleven%20drone%20(1).mp4',
        'embedUrl': 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/One%20eleven%20drone%20(1).mp4',
        'uploadDate': '2026-01-01',
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${DEFAULT_SEO.siteUrl}/#business`,
        'name': 'Carlson Properties — One Eleven on the Mile',
        'description': 'Holiday home accommodation in Taupō, New Zealand, run by Matt and Ashleigh Carlson.',
        'url': DEFAULT_SEO.siteUrl,
        'telephone': '+64 27 697 7961',
        'email': 'bookings@carlsonproperties.co.nz',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '111 Jarden Mile',
          'addressLocality': 'Taupō',
          'addressRegion': 'Waikato',
          'postalCode': '3330',
          'addressCountry': 'NZ',
        },
        'geo': { '@type': 'GeoCoordinates', 'latitude': -38.6857, 'longitude': 176.0702 },
        'priceRange': '$$$',
        'image': fullImage,
        'sameAs': sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${DEFAULT_SEO.siteUrl}/#website`,
        'name': DEFAULT_SEO.siteName,
        'url': `${DEFAULT_SEO.siteUrl}/`,
        'inLanguage': 'en-NZ',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': { '@type': 'EntryPoint', 'urlTemplate': `${DEFAULT_SEO.siteUrl}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      faqSchema,
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${DEFAULT_SEO.siteUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': title || 'One Eleven on the Mile', 'item': fullUrl },
        ],
      },
    ],
  };

  const schema = schemaData || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Carlson Properties" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      {/* Facebook, LinkedIn and Slack size the preview from these before the
          image itself loads; without them the card can render small or late. */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="One Eleven on the Mile — private five-bedroom lake house, Taupō" />
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
