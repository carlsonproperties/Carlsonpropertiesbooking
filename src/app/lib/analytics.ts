// Google Analytics 4 tracking utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-FYSMJGFR1J', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track booking conversions
export const trackBookingConversion = (bookingData: {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  guests: number;
}) => {
  trackEvent('purchase', {
    transaction_id: bookingData.bookingId,
    value: bookingData.totalAmount,
    currency: 'NZD',
    items: [
      {
        item_id: 'one-eleven-taupo',
        item_name: 'One Eleven Taupo - Luxury Accommodation',
        item_category: 'Vacation Rental',
        quantity: bookingData.nights,
        price: bookingData.totalAmount / bookingData.nights,
      },
    ],
    check_in_date: bookingData.checkIn,
    check_out_date: bookingData.checkOut,
    number_of_guests: bookingData.guests,
  });
};

// Track booking started (begin_checkout)
export const trackBookingStarted = (bookingData: {
  checkIn: string;
  checkOut: string;
  nights: number;
  estimatedAmount: number;
  guests: number;
}) => {
  trackEvent('begin_checkout', {
    value: bookingData.estimatedAmount,
    currency: 'NZD',
    items: [
      {
        item_id: 'one-eleven-taupo',
        item_name: 'One Eleven Taupo - Luxury Accommodation',
        item_category: 'Vacation Rental',
        quantity: bookingData.nights,
        price: bookingData.estimatedAmount / bookingData.nights,
      },
    ],
    check_in_date: bookingData.checkIn,
    check_out_date: bookingData.checkOut,
    number_of_guests: bookingData.guests,
  });
};

// Track search/availability check
export const trackAvailabilityCheck = (dates: { checkIn: string; checkOut: string }) => {
  trackEvent('view_item', {
    items: [
      {
        item_id: 'one-eleven-taupo',
        item_name: 'One Eleven Taupo - Luxury Accommodation',
        item_category: 'Vacation Rental',
      },
    ],
    check_in_date: dates.checkIn,
    check_out_date: dates.checkOut,
  });
};

// Track contact/inquiry
export const trackInquiry = (source: string) => {
  trackEvent('generate_lead', {
    source,
  });
};

// Track outbound links
export const trackOutboundLink = (url: string, label?: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    value: url,
  });
};