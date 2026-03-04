# Breadcrumb Schema Implementation Guide

## ✅ Implementation Complete

All breadcrumb schema markup has been successfully implemented across the website using Schema.org BreadcrumbList format.

## 📍 Breadcrumb Structure by Page

### Guest Information Page
**Path:** Home → Guest Information  
**Schema Type:** Combined @graph with FAQPage + BreadcrumbList  
**File:** `/src/app/lib/schemas.ts` → `guestInfoSchema`

### Booking Flow Pages

#### Cart Page
**Path:** Home → Book Your Stay → Cart  
**Schema:** `cartBreadcrumbSchema`  
**URL:** `/cart`

#### Checkout Page
**Path:** Home → Book Your Stay → Cart → Checkout  
**Schema:** `checkoutBreadcrumbSchema`  
**URL:** `/checkout`

#### Booking Confirmation
**Path:** Home → Book Your Stay → Booking Confirmation  
**Schema:** `bookingConfirmationBreadcrumbSchema`  
**URL:** `/booking-success`

### Legal Pages

#### Terms & Conditions
**Path:** Home → Terms & Conditions  
**Schema:** `termsBreadcrumbSchema`  
**URL:** `/terms`

#### Privacy Policy
**Path:** Home → Privacy Policy  
**Schema:** `privacyBreadcrumbSchema`  
**URL:** `/privacy`

#### Refund Policy
**Path:** Home → Refund Policy  
**Schema:** `refundBreadcrumbSchema`  
**URL:** `/refund`

## 🔧 Technical Details

### Schema Format
All breadcrumbs use the standard Schema.org BreadcrumbList format:

```json
{
  "@context": "https://schema.org",
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
      "name": "Page Name",
      "item": "https://carlsonproperties.co.nz/page-url"
    }
  ]
}
```

### Default Breadcrumbs
Pages that don't have custom breadcrumb schemas (Home, About, Meet Hosts, Book, Owner Login, Dashboard) use the **default 2-level breadcrumb** built into the SEO component:
- Home → [Current Page Name]

This is automatically generated in `/src/app/components/SEO.tsx` (lines 131-146).

## 📊 SEO Benefits

### Google Search Console
Breadcrumbs will appear in:
- Rich Results Test
- Search Console → Enhancements → Breadcrumbs

### SERP Display
Google may show breadcrumbs in search results like:
```
carlsonproperties.co.nz › book › cart › checkout
Checkout - Complete Your Booking | One Eleven Taupo
```

### User Benefits
- Better understanding of site structure
- Improved navigation context
- Enhanced click-through rates from search results

## 🧪 Testing

### Test in Google Rich Results Test:
https://search.google.com/test/rich-results

Enter your URLs:
- https://carlsonproperties.co.nz/guest-info
- https://carlsonproperties.co.nz/cart
- https://carlsonproperties.co.nz/checkout
- https://carlsonproperties.co.nz/terms
- https://carlsonproperties.co.nz/privacy
- https://carlsonproperties.co.nz/refund

### Expected Result:
✅ **BreadcrumbList** detected  
✅ **FAQPage** detected (Guest Info page only)

## 📝 Notes

- All schemas include full absolute URLs with `https://carlsonproperties.co.nz`
- Breadcrumbs are injected via the SEO component's `schemaData` prop
- Guest Info page uses `@graph` to combine FAQ schema with breadcrumbs
- Position numbers start at 1 (not 0) per Schema.org spec

## 🎯 Next Steps

1. **Deploy to Vercel** - Changes need to be live for Google to crawl
2. **Submit to Search Console** - Request indexing of updated pages
3. **Monitor Rich Results** - Check Search Console for breadcrumb detection (48-72 hours)
4. **Verify in SERPs** - Look for breadcrumb display in search results (2-4 weeks)

---

Last Updated: February 26, 2026
