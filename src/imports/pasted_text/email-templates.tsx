Redesign the 6 email templates in supabase/functions/server/email_templates.tsx to feel like the
  carlsonproperties.co.nz website — quiet luxury, editorial whitespace, serif headlines. Keep the export signatures
  (sendBookingConfirmation, sendOwnerNotification, sendPreArrivalEmail, sendCheckInDayEmail, sendCheckOutDayEmail,
  sendReviewRequestEmail, sendTestEmails) and the booking object shape unchanged so the rest of the codebase keeps
  working.

  BRAND
  - Primary sage: #9DA07E
  - Cream background: #FDFCF8
  - Card white: #FFFFFF
  - Ink: #1A1A1A / body grey: #666 / muted: #AFAFAF
  - Hairline: #F1F1EE
  - Logo signature image: https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Black%20Wh
  ite%20Minimalist%20Calligraphy%20Signature%20Logo.png
  - Hero photo:
  https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/032_Open2view_ID584542-111_Jarden_Mile.jpg

  TYPOGRAPHY (must be email-safe, no @import or webfont link tags)
  - Serif stack for headlines + brand marks: "Cormorant Garamond", Garamond, "Times New Roman", Times, serif
  - Sans stack for body + UI labels: "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
  - Tiny all-caps eyebrow labels (10px, 0.4em letter-spacing, weight 900) in sage — keep the existing visual language

  LAYOUT RULES (email reality, not website reality)
  - Use a 600px max-width centered table-based layout, NOT div-only flex/grid. Outlook will not render flex.
  - All styles inline. No <style> blocks except a single optional <style>@media (prefers-color-scheme: dark)
  {...}</style> for dark-mode tweaks.
  - Single column. No background-image; use a real <img> for the hero with width="600" and alt text.
  - Every <img> needs alt, width, and style="display:block; max-width:100%;"
  - Buttons must be bullet-proof: <a> wrapped in a table cell with padding, not a CSS button. Sage background, white
  uppercase Inter text, 16px radius (Outlook will square it — that's fine).
  - Include a plain-text preheader (hidden preview text) for each email, ~80 chars, that complements the subject line.
  - Footer on every email: signature image (max 120px wide), "Matt & Ashleigh Carlson", address "111 Jarden Mile,
  Taupō, NZ", and an unsubscribe-style fine-print line "You're receiving this because you booked a stay with us."

  THE 6 EMAILS — keep current triggers/recipients, upgrade the visuals
  1. sendBookingConfirmation — to guest, immediate. Hero photo at top. Eyebrow "RESERVATION CONFIRMED". Headline
  "Thank you, {firstName}." Booking summary card (check-in, check-out, nights, guests, total NZD) styled like a hotel
  folio. Bedding configuration note in a soft cream sub-card. Subject: "Your stay at One Eleven is confirmed".
  Preheader: "We can't wait to host you in Taupō."
  2. sendOwnerNotification — to bookings@carlsonproperties.co.nz, immediate. NO hero photo (utilitarian). Eyebrow "NEW
   BOOKING". Big booking ID. Two-column data table (guest, email, phone, dates, guests, revenue, channel "Direct
  Website"). Sage CTA "Open in Dashboard" → https://carlsonproperties.co.nz/dashboard. Subject: "New booking · {guest}
   · {checkInShort}".
  3. sendPreArrivalEmail — to guest, 4 days before check-in. Hero photo. Eyebrow "ALMOST TIME". Headline "We're ready
  for you." Info card with door code (last 4 of phone + #), address, Wi-Fi (Carlson & Co. Guest / Gue$t111.), check-in
   3pm / check-out 10am. Sage CTA → https://www.carlsonproperties.co.nz/guest-info "View Digital House Manual".
  Subject: "Your arrival details for One Eleven". Preheader: "Door code, Wi-Fi, and everything you need."
  4. sendCheckInDayEmail — to guest, 9am check-in day. No hero (lighter). Eyebrow "WELCOME". Friendly note about milk
  + barista coffee + "tell us if anything's off". Phone line "027 697 7961" as a tap-to-call link. Subject: "Welcome
  to One Eleven". Preheader: "A few things to know on your first day."
  5. sendCheckOutDayEmail — to guest, 9am check-out day. No hero. Eyebrow "SAFE TRAVELS". Soft check-out checklist
  (dishwasher, rubbish, leave mattress + duvet protectors on). Subject: "See you again — check-out today". Preheader:
  "A few things before you head off."
  6. sendReviewRequestEmail — to guest, 2 days post-stay. Small hero (or a thumbnail strip). Eyebrow "THANK YOU".
  Headline "How was your stay?" Sage CTA → https://share.google/EU7JN7Rw5jJDsS5Ci "Share a Review". Subject: "How was
  your stay at One Eleven?". Preheader: "Two minutes that mean the world to us."

  COPY TONE
  Warm, confident, Kiwi understatement. Short paragraphs. Never use words like "amazing," "exciting," or exclamation
  marks beyond one per email. Read like a letter from a thoughtful host, not a marketing blast.

  TECHNICAL CONSTRAINTS
  - Update every `from:` address from `bookings@resend.dev` to `bookings@carlsonproperties.co.nz` (domain is now
  verified in Resend).
  - Owner email `from:` should be `One Eleven Bookings <bookings@carlsonproperties.co.nz>`, guest emails `One Eleven
  on the Mile <bookings@carlsonproperties.co.nz>`.
  - Add a `replyTo: 'matt@carlsonproperties.co.nz'` (or whichever address Matt monitors) so guest replies don't go to
  a no-reply.
  - Wrap each send in try/catch with the existing `console.log('✅ ...')` / `console.error('❌ ...')` pattern.
  - Don't change the file's exports, function signatures, or the booking object property names (`booking.guest`,
  `booking.email`, `booking.phone`, `booking.checkIn`, `booking.checkOut`, `booking.guests`, `booking.total`,
  `booking.id`, `booking.notes`).
  - Keep `sendTestEmails(testEmail)` working — it should fire all 6 with the existing test booking object.

  DELIVERABLE
  Replace the contents of supabase/functions/server/email_templates.tsx. Do not touch
  supabase/functions/server/index.tsx — the call sites stay the same.

  Two notes on using it:

  - Render-test before you ship. Use https://www.htmlemailcheck.com or send the test endpoint
  (/test-emails?email=you@x.com) to a Litmus/Email-on-Acid trial, and at minimum to a Gmail + Outlook + Apple Mail
  address. Outlook is where bullet-proof buttons matter.
  - Update the replyTo address in the prompt before pasting if matt@carlsonproperties.co.nz isn't the right inbox.