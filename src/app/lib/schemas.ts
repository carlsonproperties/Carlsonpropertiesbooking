// Schema.org markup helpers for SEO

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the check-in time at One Eleven Taupo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check-in time is 3:00 PM. While we would love to offer an earlier check-in, our team requires the full allocated time to ensure the property is meticulously prepared to our luxury standards. We will message you immediately if the property is available sooner than 3:00 PM."
      }
    },
    {
      "@type": "Question",
      "name": "How do I access the WiFi at One Eleven Taupo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The WiFi network name is 'One Eleven Guest'. The WiFi password is sent out to you 3 days prior to your check-in date along with your door code."
      }
    },
    {
      "@type": "Question",
      "name": "What is the check-out time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check-out time is 10:00 AM. Your unique door code will expire shortly after your check-out time."
      }
    },
    {
      "@type": "Question",
      "name": "Are pets allowed at One Eleven Taupo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, pets are not allowed on the premises."
      }
    },
    {
      "@type": "Question",
      "name": "What amenities are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "One Eleven Taupo includes a heated swimming pool, sauna, gym, spa pool, BBQ, modern kitchen, air conditioning, heating, and WiFi. The property has 5 bedrooms and sleeps up to 10 guests."
      }
    },
    {
      "@type": "Question",
      "name": "What are the quiet hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Please observe quiet hours from 10 PM to 7 AM to respect the neighborhood."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get the door code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your unique 4-digit door code will be messaged to you 3 days before check-in. The code is always the last 4 digits of the cellphone number used to make the booking and provides secure access to the property."
      }
    },
    {
      "@type": "Question",
      "name": "What should I do before checkout?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Before checking out at 10:00 AM, please load and start the dishwasher, turn off lights and appliances, take rubbish out to the bins, and ensure all windows and doors are locked."
      }
    }
  ],
  "dateModified": "2026-02-26"
};

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://carlsonproperties.co.nz${item.url}`
    }))
  };
};

// Combined schema with FAQ and breadcrumbs for Guest Info page
export const guestInfoSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": faqSchema.mainEntity,
      "dateModified": "2026-02-26"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://carlsonproperties.co.nz"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Guest Information",
          "item": "https://carlsonproperties.co.nz/guest-info"
        }
      ]
    }
  ]
};

// Booking flow breadcrumb schemas
export const cartBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Book Your Stay", url: "/book" },
  { name: "Cart", url: "/cart" }
]);

export const checkoutBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Book Your Stay", url: "/book" },
  { name: "Cart", url: "/cart" },
  { name: "Checkout", url: "/checkout" }
]);

export const bookingConfirmationBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Book Your Stay", url: "/book" },
  { name: "Booking Confirmation", url: "/booking-success" }
]);

// Legal pages breadcrumb schemas
export const termsBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Terms & Conditions", url: "/terms" }
]);

export const privacyBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Privacy Policy", url: "/privacy" }
]);

export const refundBreadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Refund Policy", url: "/refund" }
]);