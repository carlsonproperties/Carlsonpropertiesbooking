// Single source of truth for the One Eleven on the Mile VacationRental entity.
//
// Imported two ways so the crawlable JSON-LD and the client-rendered JSON-LD
// can never drift apart:
//   1. Build time  — vite.config.ts injects it into index.html (served before JS runs)
//   2. Run time    — src/app/components/SEO.tsx drops it into the React Helmet graph
//
// Fields follow Google's VacationRental structured-data spec:
// https://developers.google.com/search/docs/appearance/structured-data/vacation-rental
import { REVIEWS, REVIEW_AGGREGATE } from './reviews';

export const SITE_URL = 'https://carlsonproperties.co.nz';
export const ACCOMMODATION_ID = `${SITE_URL}/#accommodation`;

export const BUSINESS_SAME_AS = [
  'https://www.instagram.com/oneelevenonthemile',
  'https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/',
  'https://g.page/r/CZuTLT-YqNStEBM/review',
  'https://share.google/t0KAo2MAm0a41hEg3',
];

const MEDIA = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/';
const img = (filename: string) => MEDIA + encodeURIComponent(filename);

// At least 8 photos, including a bedroom, a bathroom and a common area
// (Google VacationRental image requirements).
export const PROPERTY_IMAGES = [
  img('Street facing.jpg'),
  img('Open plan living.jpg'),
  img('kitchen.png'),
  img('Dining Room.jpg'),
  img('Bedroom 1.avif'),
  img('Main Bathroom.avif'),
  img('poolview.jpg'),
  img('sauanaandspa.jpg'),
  img('lake views.jpg'),
  img('BBq and patio.png'),
  img('frontdeck.jpg'),
  img('close up pool feature.png'),
];

// Google's VacationRental feature accepts a fixed English vocabulary for
// amenityFeature.name — free-text names (e.g. "Heated swimming pool") are ignored.
const feature = (name: string) => ({ '@type': 'LocationFeatureSpecification', name, value: true });

export const AMENITY_FEATURES = [
  feature('ac'),
  feature('childFriendly'),
  feature('fireplace'),
  feature('gymFitnessEquipment'),
  feature('heating'),
  feature('hotTub'),
  feature('instantBookable'),
  feature('kitchen'),
  feature('microwave'),
  feature('outdoorGrill'),
  feature('ovenStove'),
  feature('patio'),
  feature('pool'),
  feature('selfCheckinCheckout'),
  feature('tv'),
  feature('washerDryer'),
  feature('wifi'),
  { '@type': 'LocationFeatureSpecification', name: 'internetType', value: 'Free' },
  { '@type': 'LocationFeatureSpecification', name: 'parkingType', value: 'Free' },
  { '@type': 'LocationFeatureSpecification', name: 'poolType', value: 'Outdoor' },
];

export const CONTAINS_PLACE = {
  '@type': 'Accommodation',
  name: 'One Eleven on the Mile — 5-Bedroom Lake House',
  additionalType: 'EntirePlace',
  numberOfRooms: 5,
  numberOfBedrooms: 5,
  numberOfBathroomsTotal: 4,
  maximumAttendeeCapacity: 10,
  occupancy: { '@type': 'QuantitativeValue', value: 10, maxValue: 10 },
  petsAllowed: false,
  smokingAllowed: false,
  amenityFeature: AMENITY_FEATURES,
};

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '111 Jarden Mile',
  addressLocality: 'Taupō',
  addressRegion: 'Waikato',
  postalCode: '3351',
  addressCountry: 'NZ',
};

// Real parcel coordinates (111 Jarden Mile, Nukuhau, Taupō) from LINZ/OSM data.
export const GEO = { '@type': 'GeoCoordinates', latitude: -38.678066, longitude: 176.0486473 };

const buildReviews = () =>
  REVIEWS.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    datePublished: r.date,
    reviewBody: r.text,
    reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
    publisher: { '@type': 'Organization', name: r.source },
  }));

const buildAggregateRating = () => ({
  '@type': 'AggregateRating',
  ratingValue: Number(REVIEW_AGGREGATE.ratingValue),
  reviewCount: Number(REVIEW_AGGREGATE.reviewCount),
  bestRating: 5,
  worstRating: 1,
});

export const buildAccommodationNode = () => ({
  '@type': ['LodgingBusiness', 'VacationRental'],
  '@id': ACCOMMODATION_ID,
  name: 'One Eleven on the Mile',
  alternateName: 'One Eleven Taupo — Holiday Accommodation in Taupō',
  additionalType: 'House',
  brand: { '@type': 'Brand', name: 'One Eleven on the Mile' },
  description:
    'A five-bedroom, four-bathroom Taupō holiday home with a heated pool, spa, cedar sauna, gym and wide Lake Taupō views. Sleeps up to 10 guests, hosted locally by Matt and Ashleigh Carlson.',
  url: `${SITE_URL}/`,
  image: PROPERTY_IMAGES,
  logo: PROPERTY_IMAGES[0],
  identifier: 'one-eleven-on-the-mile',
  hasMap: 'https://www.google.com/maps/search/?api=1&query=111+Jarden+Mile+Taupo+New+Zealand',
  containsPlace: CONTAINS_PLACE,
  review: buildReviews(),
  telephone: '+64 27 697 7961',
  email: 'bookings@carlsonproperties.co.nz',
  address: POSTAL_ADDRESS,
  geo: GEO,
  latitude: -38.678066,
  longitude: 176.0486473,
  checkinTime: '15:00:00+12:00',
  checkoutTime: '10:00:00+12:00',
  numberOfRooms: 5,
  numberOfBedrooms: 5,
  numberOfBathroomsTotal: 4,
  maximumAttendeeCapacity: 10,
  petsAllowed: false,
  smokingAllowed: false,
  amenityFeature: AMENITY_FEATURES,
  priceRange: '$$$',
  currenciesAccepted: 'NZD',
  paymentAccepted: 'Credit Card, Debit Card, Bank Transfer',
  aggregateRating: buildAggregateRating(),
  sameAs: BUSINESS_SAME_AS,
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/book`,
      inLanguage: 'en-NZ',
      actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'],
    },
    result: { '@type': 'LodgingReservation', name: 'Reserve a stay at One Eleven on the Mile' },
  },
});
