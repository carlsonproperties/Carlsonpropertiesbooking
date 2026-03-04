# Google Analytics 4 Setup Instructions

## Overview
Your website now has Google Analytics 4 (GA4) tracking fully integrated with conversion tracking for bookings, availability checks, and user behavior monitoring.

## Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to **Admin** > **Data Streams**
4. Click on your web data stream
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 2: Update Your Website

1. Open `/index.html` in your code
2. Find **both** instances of `G-XXXXXXXXXX`
3. Replace them with your actual Measurement ID

```html
<!-- Replace G-XXXXXXXXXX with your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ACTUAL_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', 'G-YOUR_ACTUAL_ID', {
    send_page_view: false
  });
</script>
```

4. Also update `/src/app/lib/analytics.ts` line 9:
```typescript
window.gtag('config', 'G-YOUR_ACTUAL_ID', {
```

## Step 3: Push to GitHub & Deploy

1. Click **"Push to carlsonproperties/Carlsonpropertieswebsite"** in Figma Make
2. Wait for Vercel to deploy (2-3 minutes)
3. Visit your website to generate test data

## Step 4: Verify Tracking Works

### Real-Time Reports (Immediate)
1. In Google Analytics, go to **Reports** > **Realtime**
2. Visit your website in another browser tab
3. You should see yourself as an active user

### Conversion Events (24-48 hours)
The following events are automatically tracked:

**Standard Events:**
- `page_view` - Every page visit
- `view_item` - When users check availability
- `begin_checkout` - When users start the checkout process
- `purchase` - When a booking is completed (most important!)

**Custom Events:**
- `generate_lead` - Contact/inquiry form submissions
- `click` - Outbound link tracking

## Step 5: Set Up Conversion Tracking

1. In GA4, go to **Admin** > **Events**
2. Mark these events as **conversions**:
   - `purchase` ✅ (Primary conversion)
   - `begin_checkout` (Secondary)
   - `generate_lead` (Inquiry tracking)

## Step 6: Create Custom Reports

### Booking Funnel Report
Track the customer journey:
1. **Reports** > **Explore** > **Funnel exploration**
2. Add steps:
   - Step 1: `page_view` (path contains `/book`)
   - Step 2: `view_item` (availability check)
   - Step 3: `begin_checkout` (checkout started)
   - Step 4: `purchase` (booking completed)

### Revenue Dashboard
1. **Reports** > **Monetization** > **Overview**
2. View total revenue, average booking value, and conversion rate

## What's Being Tracked

### Booking Conversions (`purchase`)
```javascript
{
  transaction_id: "booking_abc123",
  value: 3825.00,
  currency: "NZD",
  items: [{
    item_name: "One Eleven Taupo - Luxury Accommodation",
    quantity: 3, // nights
    price: 1275.00 // per night
  }],
  check_in_date: "2026-03-15",
  check_out_date: "2026-03-18",
  number_of_guests: 4
}
```

### Checkout Started (`begin_checkout`)
Tracks when users fill out guest details and click checkout

### Availability Checks (`view_item`)
Tracks when users select dates to check availability

## Key Metrics to Monitor

### Conversion Rate
- **Target:** 2-5% (typical for accommodation bookings)
- **Formula:** (Bookings ÷ Sessions) × 100

### Average Booking Value
- **Your Rate:** $1,275/night
- **Target:** Track average length of stay

### Bounce Rate
- **Target:** < 60%
- **Good:** Users exploring multiple pages

### Traffic Sources
Monitor where bookings come from:
- Organic Search (Google)
- Direct (people typing your URL)
- Social Media
- Referral (other websites)

## Advanced Features

### Enhanced Ecommerce
Already configured! You'll see:
- Shopping behavior analysis
- Checkout behavior analysis
- Product performance (your property)

### User Engagement
Track how guests interact with:
- Guest Information page
- Photo galleries
- Amenities sections

## Troubleshooting

### Not Seeing Data?
1. Check that GA4 Measurement ID is correct
2. Disable ad blockers on your test browser
3. Wait 24-48 hours for full data processing
4. Use **Realtime** reports for immediate feedback

### Conversions Not Recording?
1. Test a booking yourself
2. Check **Realtime** > **Events** to see if `purchase` fires
3. Verify the event is marked as a conversion in Admin

### Need Help?
- [GA4 Help Center](https://support.google.com/analytics)
- [GA4 Setup Assistant](https://support.google.com/analytics/answer/9744165)

## Next Steps

1. Set up **Google Search Console** integration
2. Create **weekly email reports**
3. Set up **goals** for specific pages
4. Enable **remarketing** for return visitors

---

**Pro Tip:** Set up alerts for significant drops in traffic or conversions so you can respond quickly to issues!
