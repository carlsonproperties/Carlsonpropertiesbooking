import { Resend } from 'npm:resend@3.1.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!resend) {
  console.error(
    '❌ RESEND_API_KEY is not set on this function. Every email will be skipped ' +
    'silently: no confirmation to the guest and no notification to the owner. ' +
    'Set it under Edge Functions → Secrets and redeploy.',
  );
}

// Brand colors
const SAGE = '#9DA07E';
const CREAM = '#FDFCF8';
const WHITE = '#FFFFFF';
const INK = '#1A1A1A';
const BODY_GREY = '#666666';
const MUTED = '#AFAFAF';
const HAIRLINE = '#F1F1EE';

// ─── Addresses ───────────────────────────────────────────────────────────────
// All three are env-overridable so a delivery problem can be worked around
// without a code change and redeploy.
//
// SENDER_ADDRESS must be on a domain verified in Resend, or Resend rejects
// every send. If verification for carlsonproperties.co.nz is not finished,
// setting EMAIL_FROM_ADDRESS to 'onboarding@resend.dev' (Resend's always-
// available test sender) gets mail flowing again immediately.
//
// OWNER_EMAIL defaults to the same mailbox it is sent from. That is a
// self-addressed message, which some receivers treat as suspicious, and it
// only arrives if the domain actually has a mailbox behind it — so pointing
// OWNER_NOTIFICATION_EMAIL at an inbox that is known to work is the quickest
// way to confirm the sending half independently of the receiving half.
const SENDER_ADDRESS = (Deno.env.get('EMAIL_FROM_ADDRESS') || 'bookings@carlsonproperties.co.nz').trim();
const REPLY_TO_ADDRESS = (Deno.env.get('EMAIL_REPLY_TO') || SENDER_ADDRESS).trim();
const OWNER_EMAIL = (Deno.env.get('OWNER_NOTIFICATION_EMAIL') || SENDER_ADDRESS).trim();

/** `From` header with a display name, over whichever sender is configured. */
const sender = (displayName: string) => `${displayName} <${SENDER_ADDRESS}>`;

/** What happened to one email. Senders never throw; they report. */
export type EmailOutcome = {
  name: string;
  ok: boolean;
  /** True when nothing was attempted (no API key, or no address to send to). */
  skipped?: boolean;
  /** Resend's message id, on success. */
  id?: string;
  /** Why it failed, verbatim from Resend where available. */
  error?: string;
};

/** Flattens a Resend error object, or a thrown value, into one line. */
function describeError(err: any): string {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  const name = err.name ? String(err.name) : '';
  const message = err.message ? String(err.message) : '';
  if (name && message) return `${name}: ${message}`;
  return message || name || JSON.stringify(err);
}

/**
 * Sends one email and reports the outcome.
 *
 * The Resend SDK does not throw when the API rejects a send — `emails.send()`
 * resolves with `{ data: null, error }` (see its `fetchRequest`). Awaiting it
 * without reading `error` therefore looks identical to success, which is why
 * an unverified sending domain produced a log full of ✅ and an empty inbox.
 * Every send goes through here so that cannot happen again.
 *
 * Callers are not expected to handle failure: a booking must still succeed
 * when its email does not. Nothing here throws.
 */
async function deliver(name: string, payload: any): Promise<EmailOutcome> {
  if (!resend) {
    console.error(`❌ Skipped "${name}": RESEND_API_KEY is not configured.`);
    return { name, ok: false, skipped: true, error: 'RESEND_API_KEY is not configured on this function' };
  }

  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      const detail = describeError(error);
      console.error(`❌ Resend refused "${name}" (from ${SENDER_ADDRESS}): ${detail}`);
      return { name, ok: false, error: detail };
    }
    console.log(`✅ Sent "${name}" to ${[].concat(payload?.to ?? []).join(', ')} · id ${data?.id ?? 'unknown'}`);
    return { name, ok: true, id: data?.id };
  } catch (err) {
    // Only reached when the request never completed — DNS, TLS, timeout.
    const detail = describeError(err);
    console.error(`❌ Could not reach Resend for "${name}": ${detail}`);
    return { name, ok: false, error: detail };
  }
}

/** Addresses and key state, for the email-health endpoint. Never exposes the key. */
export function getEmailConfig() {
  return {
    resendConfigured: Boolean(resend),
    sender: SENDER_ADDRESS,
    replyTo: REPLY_TO_ADDRESS,
    ownerNotificationTo: OWNER_EMAIL,
    sendingDomain: SENDER_ADDRESS.split('@')[1] ?? null,
    ownerIsSelfAddressed: OWNER_EMAIL.toLowerCase() === SENDER_ADDRESS.toLowerCase(),
  };
}

// Images
const LOGO_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Logo.png';
const HERO_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Street%20facing.jpg';
const HERO_LAKE_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg';
const HERO_KITCHEN_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/looking%20into%20kitchen.png';

// Normalize bookings so both new (guest/email/phone) and legacy
// (guestName/guestEmail/guestPhone) records render correctly, and
// numeric fields are always numbers.
const norm = (booking: any) => ({
  ...booking,
  guest: booking.guest || booking.guestName || 'Guest',
  email: booking.email || booking.guestEmail || '',
  phone: booking.phone || booking.guestPhone || '',
  notes: booking.notes || booking.guestNotes || '',
  guests: Number(booking.guests) || 1,
  total: Number(booking.total) || 0,
});

// Email wrapper with consistent structure
const createEmailWrapper = (content: string, preheader: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>One Eleven on the Mile</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${CREAM}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: ${CREAM}; opacity: 0;">
    ${preheader}
  </div>

  <!-- Email container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM};">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px; background-color: ${WHITE};">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Eyebrow label component
const eyebrow = (text: string) => `
<tr>
  <td style="padding: 0 40px;">
    <p style="margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; color: ${SAGE}; text-align: center;">
      ${text}
    </p>
  </td>
</tr>
`;

// Headline component
const headline = (text: string) => `
<tr>
  <td style="padding: 16px 40px 0;">
    <h1 style="margin: 0; font-family: 'Cormorant Garamond', Garamond, 'Times New Roman', Times, serif; font-size: 42px; font-weight: 400; line-height: 1.2; color: ${INK}; text-align: center;">
      ${text}
    </h1>
  </td>
</tr>
`;

// Body text component
const bodyText = (text: string, centered: boolean = false) => `
<tr>
  <td style="padding: 24px 40px 0;">
    <p style="margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${BODY_GREY}; text-align: ${centered ? 'center' : 'left'};">
      ${text}
    </p>
  </td>
</tr>
`;

// Sage CTA button (bullet-proof)
const ctaButton = (text: string, url: string) => `
<tr>
  <td style="padding: 32px 40px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td style="background-color: ${SAGE}; border-radius: 16px;">
          <a href="${url}" style="display: inline-block; padding: 16px 32px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: ${WHITE}; text-decoration: none;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

// Footer component
const footer = () => `
<tr>
  <td style="padding: 60px 40px 40px; border-top: 1px solid ${HAIRLINE};">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <img src="${LOGO_URL}" alt="One Eleven on the Mile" width="120" style="display: block; max-width: 100%; height: auto; margin: 0 auto 20px;" />
        </td>
      </tr>
      <tr>
        <td align="center">
          <p style="margin: 0 0 8px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${BODY_GREY}; text-align: center;">
            <strong>Matt &amp; Ashleigh Carlson</strong><br/>
            ONE ELEVEN | ON THE MILE<br/>
            <a href="tel:0276977961" style="color: ${BODY_GREY}; text-decoration: none;">0276977961</a>
          </p>
          <p style="margin: 0 0 16px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.5; color: ${MUTED}; text-align: center;">
            111 Jarden Mile, Taupō, NZ
          </p>
          <p style="margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 11px; line-height: 1.4; color: ${MUTED}; text-align: center;">
            You are receiving this because you booked a stay with us.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// Format date short helper (e.g., "Apr 1")
const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' });
};

// Format date long with ordinal suffix and optional time (e.g. "Friday 8th May 2026 3pm")
const formatDateLong = (dateString: string, time?: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = (n: number) => {
    if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  };
  const weekday = date.toLocaleDateString('en-NZ', { weekday: 'long' });
  const month = date.toLocaleDateString('en-NZ', { month: 'long' });
  const year = date.getFullYear();
  const base = `${weekday} ${day}${suffix(day)} ${month} ${year}`;
  return time ? `${base} ${time}` : base;
};

// Calculate nights
const calculateNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return nights;
};

// ─── Built-in designs (fallback) ─────────────────────────────────────────────
// The six functions below are the original inline-HTML emails. They are only
// used when a Resend Template is missing or unpublished (see sendViaTemplate),
// so a booking never goes without its emails while templates are being set up.

// 1. Booking Confirmation Email
async function legacyBookingConfirmation(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) {
    console.error('❌ Skipped "booking confirmation": the booking has no guest email.');
    return { name: 'booking confirmation', ok: false, skipped: true, error: 'Booking has no guest email address' };
  }

  const firstName = b.guest.split(' ')[0];
  const nights = calculateNights(b.checkIn, b.checkOut);

  return deliver('booking confirmation', {
      from: sender('One Eleven on the Mile'),
      replyTo: REPLY_TO_ADDRESS,
      to: [b.email],
      subject: 'Your stay at One Eleven is confirmed',
      html: createEmailWrapper(`
        <!-- Hero Image -->
        <tr>
          <td style="padding: 0;">
            <img src="${HERO_URL}" alt="One Eleven on the Mile" width="600" style="display: block; width: 100%; max-width: 600px; height: auto;" />
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('RESERVATION CONFIRMED')}
        ${headline(`Thank you, ${firstName}.`)}
        ${bodyText('Your reservation is confirmed. We look forward to hosting you in Taupō.')}

        <!-- Booking Summary Card -->
        <tr>
          <td style="padding: 32px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="color: ${INK};">Check-in</strong><br/>
                        ${formatDate(b.checkIn)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="color: ${INK};">Check-out</strong><br/>
                        ${formatDate(b.checkOut)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="color: ${INK};">${nights} ${nights === 1 ? 'night' : 'nights'}</strong> · ${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 0 0; border-top: 1px solid ${HAIRLINE}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${INK};">
                        $${b.total.toLocaleString()} NZD
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Bedding Configuration Note -->
        <tr>
          <td style="padding: 16px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 8px; border-left: 3px solid ${SAGE};">
              <tr>
                <td style="padding: 20px;">
                  <p style="margin: 0 0 12px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: ${SAGE};">
                    Bedding Configuration
                  </p>
                  <p style="margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${BODY_GREY};">
                    2× Super king beds · 2× King beds · 2× Single beds
                  </p>
                  <p style="margin: 12px 0 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${BODY_GREY};">
                    The super king beds can be split into singles if needed. Just let us know.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${bodyText(`Three days before your check-in, we will send our digital guidebook with your door code, Wi-Fi details, and house instructions.`, true)}

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, 'We cannot wait to host you in Taupō.')
  });
}

// 2. Owner Notification Email
async function legacyOwnerNotification(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  const checkInShort = formatDateShort(b.checkIn);
  const bookingRef = (b.id || '').substring(0, 8).toUpperCase() || 'NEW';

  return deliver('owner notification', {
      from: sender('One Eleven Bookings'),
      replyTo: REPLY_TO_ADDRESS,
      to: [OWNER_EMAIL],
      subject: `New booking · ${b.guest} · ${checkInShort}`,
      html: createEmailWrapper(`
        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('NEW BOOKING')}
        ${headline(bookingRef)}
        ${bodyText(`${b.guest} just booked a stay.`, true)}

        <!-- Booking Details Table -->
        <tr>
          <td style="padding: 32px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Guest
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${b.guest}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Email
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${b.email || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Phone
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${b.phone || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Check-in
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${formatDate(b.checkIn)}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        Check-out
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${formatDate(b.checkOut)}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Guests
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${b.guests}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Revenue
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        $${b.total.toLocaleString()} NZD
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Channel
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        Direct Website
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${ctaButton('OPEN IN DASHBOARD', 'https://carlsonproperties.co.nz/dashboard')}

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, `${b.guest} booked ${formatDateShort(b.checkIn)} – ${formatDateShort(b.checkOut)}`)
  });
}

// 3. Pre-Arrival Email
async function legacyPreArrivalEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) {
    return { name: 'pre-arrival email', ok: false, skipped: true, error: 'Booking has no guest email address' };
  }

  const firstName = b.guest.split(' ')[0];
  const digits = (b.phone || '').replace(/\D/g, '');
  const doorCode = digits.length >= 4 ? digits.slice(-4) : 'last 4 digits of your phone';

  return deliver('pre-arrival email', {
      from: sender('One Eleven on the Mile'),
      replyTo: REPLY_TO_ADDRESS,
      to: [b.email],
      subject: 'Your arrival details for One Eleven',
      html: createEmailWrapper(`
        <!-- Hero Image -->
        <tr>
          <td style="padding: 0;">
            <img src="${HERO_LAKE_URL}" alt="Lake views from One Eleven" width="600" style="display: block; width: 100%; max-width: 600px; height: auto;" />
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('ALMOST TIME')}
        ${headline(`We are ready for you.`)}
        ${bodyText(`Your stay begins soon. Here is everything you need to know, ${firstName}.`)}

        <!-- Info Card -->
        <tr>
          <td style="padding: 32px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Door Code</strong>
                        ${doorCode}#
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Check-In</strong>
                        ${formatDateLong(b.checkIn, '3pm')}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Check-Out</strong>
                        ${formatDateLong(b.checkOut, '10am')}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Address</strong>
                        111 Jarden Mile, Taupō, Waikato 3330, New Zealand
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Wi-Fi</strong>
                        Network: Carlson &amp; Co. Guest<br/>
                        Password: Gue$t111. <span style="font-size: 12px; color: ${MUTED};">(note the full stop)</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${bodyText(`This is a self check-in. We live nearby if you need anything.`)}
        ${ctaButton('VIEW DIGITAL HOUSE MANUAL', 'https://www.carlsonproperties.co.nz/guest-info')}

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, 'Door code, Wi-Fi, and everything you need.')
  });
}

// 4. Check-In Day Email
async function legacyCheckInDayEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) {
    return { name: 'check-in day email', ok: false, skipped: true, error: 'Booking has no guest email address' };
  }

  const firstName = b.guest.split(' ')[0];

  return deliver('check-in day email', {
      from: sender('One Eleven on the Mile'),
      replyTo: REPLY_TO_ADDRESS,
      to: [b.email],
      subject: 'Welcome to One Eleven',
      html: createEmailWrapper(`
        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('WELCOME')}
        ${headline(`Welcome, ${firstName}.`)}
        ${bodyText('A few things to know as you settle in.')}

        ${bodyText(`Please grab milk on your way — with so many alternatives these days, we cannot guess what you will want. We do have a barista coffee machine and beans ready for you.`)}
        ${bodyText(`If anything is off or missing, tell us now rather than waiting until your review. We would rather fix it while you are here.`)}

        <!-- Contact Card -->
        <tr>
          <td style="padding: 32px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 12px;">
              <tr>
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0 0 16px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 700; color: ${INK};">
                    Need something?
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="background-color: ${SAGE}; border-radius: 999px;">
                        <a href="tel:0276977961" style="display: inline-block; padding: 12px 28px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #FFFFFF; text-decoration: none;">
                          Call us
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, 'A few things to know on your first day.')
  });
}

// 5. Check-Out Day Email
async function legacyCheckOutDayEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) {
    return { name: 'check-out day email', ok: false, skipped: true, error: 'Booking has no guest email address' };
  }

  const firstName = b.guest.split(' ')[0];

  return deliver('check-out day email', {
      from: sender('One Eleven on the Mile'),
      replyTo: REPLY_TO_ADDRESS,
      to: [b.email],
      subject: 'See you again — check-out today',
      html: createEmailWrapper(`
        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('SAFE TRAVELS')}
        ${headline(`Thank you, ${firstName}.`)}
        ${bodyText(`We hope you have had a good stay.`)}

        ${bodyText('We clean the house ourselves to keep costs down. A quick hand before you go helps us turn it around faster.')}

        <!-- Checklist -->
        <tr>
          <td style="padding: 24px 40px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${CREAM}; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <ul style="margin: 0; padding-left: 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.8; color: ${BODY_GREY};">
                    <li>Load and start the dishwasher</li>
                    <li>Take rubbish to the wheelie bin down the side</li>
                    <li>Strip the beds if you are able (not required)</li>
                  </ul>
                  <p style="margin: 16px 0 0; padding-top: 16px; border-top: 1px solid ${HAIRLINE}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: ${MUTED};">
                    If you do strip the beds, please leave the mattress protectors and duvet inners on. Everything goes to the commercial laundry.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, 'A few things before you head off.')
  });
}

// 6. Review Request Email
async function legacyReviewRequestEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) {
    return { name: 'review request email', ok: false, skipped: true, error: 'Booking has no guest email address' };
  }

  const firstName = b.guest.split(' ')[0];

  return deliver('review request email', {
      from: sender('One Eleven on the Mile'),
      replyTo: REPLY_TO_ADDRESS,
      to: [b.email],
      subject: 'How was your stay at One Eleven?',
      html: createEmailWrapper(`
        <!-- Small Hero -->
        <tr>
          <td style="padding: 0 40px;">
            <img src="${HERO_KITCHEN_URL}" alt="Kitchen at One Eleven" width="520" style="display: block; width: 100%; max-width: 520px; height: auto; border-radius: 8px; margin: 0 auto;" />
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('THANK YOU')}
        ${headline(`How was your stay?`)}
        ${bodyText(`Thanks for being a respectful guest, ${firstName}. If you would like to book again, reach out through our website.`, true)}

        ${bodyText('A review helps us as a small local business. Two minutes that mean the world to us.', true)}
        ${ctaButton('SHARE A REVIEW', 'https://share.google/EU7JN7Rw5jJDsS5Ci')}

        ${bodyText(`If something went wrong, please email us privately instead of posting it publicly. We would rather learn from you than from a review.`, true)}

        <!-- Spacer -->
        <tr><td style="height: 20px;"></td></tr>

        ${footer()}
      `, 'Two minutes that mean the world to us.')
  });
}

// ─── Resend Templates ────────────────────────────────────────────────────────
// The guest emails are designed and worded in Resend (Dashboard → Templates),
// so copy can be edited there without a deploy. Each send names a template by
// its alias and passes the booking's details as variables.
//
// If a template has not been created or published yet, Resend refuses the
// send and we fall back to the built-in design above, so nothing goes missing
// while templates are being set up. Set EMAIL_USE_RESEND_TEMPLATES=false to
// skip templates entirely.

export const TEMPLATE_ALIASES = {
  bookingConfirmation: 'booking-confirmation',
  ownerNotification: 'owner-notification',
  preArrival: 'pre-arrival',
  checkInDay: 'check-in-day',
  checkOutDay: 'check-out-day',
  reviewRequest: 'review-request',
} as const;

type TemplateAlias = typeof TEMPLATE_ALIASES[keyof typeof TEMPLATE_ALIASES];

/** The variables each template declares. Only these are sent with it. */
const TEMPLATE_VARIABLES: Record<TemplateAlias, string[]> = {
  'booking-confirmation': ['GUEST_NAME', 'CHECK_IN_DATE', 'CHECK_OUT_DATE', 'NIGHTS', 'GUESTS', 'TOTAL'],
  'owner-notification': ['BOOKING_REF', 'GUEST_FULL_NAME', 'GUEST_EMAIL', 'GUEST_PHONE', 'CHECK_IN_DATE',
    'CHECK_OUT_DATE', 'NIGHTS', 'GUESTS', 'TOTAL', 'CHANNEL', 'DOOR_CODE', 'NOTES'],
  'pre-arrival': ['GUEST_NAME', 'DOOR_CODE', 'CHECK_IN_DATE', 'CHECK_OUT_DATE', 'WIFI_PASSWORD'],
  'check-in-day': ['GUEST_NAME', 'DOOR_CODE'],
  'check-out-day': ['GUEST_NAME'],
  'review-request': ['GUEST_NAME'],
};

const SCHEDULED_ALIASES = new Set<TemplateAlias>(['pre-arrival', 'check-in-day', 'check-out-day', 'review-request']);

const USE_TEMPLATES = (Deno.env.get('EMAIL_USE_RESEND_TEMPLATES') ?? 'true').trim().toLowerCase() !== 'false';

// Optional. When set, it overrides the Wi-Fi password saved in the
// pre-arrival template, so a password change needs no template edit.
const WIFI_PASSWORD = (Deno.env.get('WIFI_PASSWORD') ?? '').trim();

/** Template variables are inserted as raw HTML, so guest-typed text is escaped. */
const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** "2026-03-20" → "Friday 20 March 2026". Dates are calendar dates, so no timezone shift. */
const longDate = (dateString: string) => {
  const d = new Date(`${String(dateString).slice(0, 10)}T00:00:00Z`);
  if (isNaN(d.getTime())) return String(dateString ?? '');
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-NZ', { ...o, timeZone: 'UTC' });
  return `${part({ weekday: 'long' })} ${part({ day: 'numeric' })} ${part({ month: 'long' })} ${part({ year: 'numeric' })}`;
};

/** "2026-03-20" → "20 Mar", for the owner's subject line. */
const shortDate = (dateString: string) => {
  const d = new Date(`${String(dateString).slice(0, 10)}T00:00:00Z`);
  if (isNaN(d.getTime())) return String(dateString ?? '');
  return `${d.getUTCDate()} ${d.toLocaleDateString('en-NZ', { month: 'short', timeZone: 'UTC' })}`;
};

/** The door code is the last four digits of the guest's mobile, then #. */
export const doorCodeFor = (booking: any) => {
  const saved = String(booking.doorCode ?? '').trim().replace(/#+$/, '');
  if (saved) return `${saved}#`;
  const digits = String(booking.phone ?? '').replace(/\D/g, '');
  return digits.length >= 4 ? `${digits.slice(-4)}#` : 'The last 4 digits of your mobile, then #';
};

/** Every value a template might use, worked out once from the booking. */
function templateValues(b: any): Record<string, string> {
  const nights = calculateNights(b.checkIn, b.checkOut);
  return {
    GUEST_NAME: String(b.guest).trim().split(/\s+/)[0] || 'there',
    GUEST_FULL_NAME: String(b.guest).trim() || 'Guest',
    GUEST_EMAIL: b.email || 'Not provided',
    GUEST_PHONE: b.phone || 'Not provided',
    CHECK_IN_DATE: longDate(b.checkIn),
    CHECK_OUT_DATE: longDate(b.checkOut),
    NIGHTS: `${nights} ${nights === 1 ? 'night' : 'nights'}`,
    GUESTS: `${b.guests} ${b.guests === 1 ? 'guest' : 'guests'}`,
    TOTAL: `$${b.total.toLocaleString('en-NZ')} NZD`,
    DOOR_CODE: doorCodeFor(b),
    BOOKING_REF: String(b.id || '').substring(0, 8).toUpperCase() || 'NEW',
    CHANNEL: b.channel || 'Direct website',
    NOTES: b.notes || 'None',
    ...(WIFI_PASSWORD ? { WIFI_PASSWORD } : {}),
  };
}

function variablesFor(alias: TemplateAlias, b: any): Record<string, string> {
  const all = templateValues(b);
  const out: Record<string, string> = {};
  for (const key of TEMPLATE_VARIABLES[alias]) {
    if (all[key] !== undefined) out[key] = escapeHtml(all[key]);
  }
  return out;
}

/**
 * Sends one email using a published Resend Template, and reports the outcome.
 * Uses the REST API directly: the pinned SDK predates template sends.
 * `templateMissing` is set when Resend refused because of the template itself,
 * which is the cue to fall back to the built-in design.
 */
async function sendTemplate(
  name: string,
  alias: TemplateAlias,
  message: { to: string[]; from: string; subject?: string; variables: Record<string, string>; idempotencyKey?: string },
): Promise<EmailOutcome & { templateMissing?: boolean }> {
  if (!RESEND_API_KEY) {
    console.error(`❌ Skipped "${name}": RESEND_API_KEY is not configured.`);
    return { name, ok: false, skipped: true, error: 'RESEND_API_KEY is not configured on this function' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        ...(message.idempotencyKey ? { 'Idempotency-Key': message.idempotencyKey.slice(0, 256) } : {}),
      },
      body: JSON.stringify({
        from: message.from,
        to: message.to,
        reply_to: REPLY_TO_ADDRESS,
        ...(message.subject ? { subject: message.subject } : {}),
        template: { id: alias, variables: message.variables },
      }),
    });
    const body: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = body?.message ? describeError(body) : `HTTP ${res.status}`;
      const templateMissing = res.status === 404 || /template/i.test(detail);
      console.error(`❌ Resend refused "${name}" (template ${alias}): ${detail}`);
      return { name, ok: false, error: detail, templateMissing };
    }
    console.log(`✅ Sent "${name}" (template ${alias}) to ${message.to.join(', ')} · id ${body?.id ?? 'unknown'}`);
    return { name, ok: true, id: body?.id };
  } catch (err) {
    const detail = describeError(err);
    console.error(`❌ Could not reach Resend for "${name}": ${detail}`);
    return { name, ok: false, error: detail };
  }
}

/** Template first; the built-in design only if the template isn't there. */
async function sendViaTemplate(
  name: string,
  alias: TemplateAlias,
  booking: any,
  message: { to: string[]; from: string; subject?: string },
  legacy: (booking: any) => Promise<EmailOutcome>,
): Promise<EmailOutcome> {
  if (!USE_TEMPLATES) return legacy(booking);
  const b = norm(booking);
  const outcome = await sendTemplate(name, alias, {
    ...message,
    variables: variablesFor(alias, b),
    // Scheduled emails go once per stay, even if two runs overlap. Confirmations
    // carry no key, so the dashboard's "resend confirmation" always sends.
    idempotencyKey: SCHEDULED_ALIASES.has(alias) && b.id ? `${alias}/${b.id}/${b.checkIn}` : undefined,
  });
  if (outcome.ok || !outcome.templateMissing) {
    const { templateMissing: _ignored, ...rest } = outcome;
    return rest;
  }
  console.warn(`⚠️ Template "${alias}" is not available in Resend yet. Sending "${name}" with the built-in design.`);
  return legacy(booking);
}

const noEmail = (name: string): EmailOutcome => {
  console.error(`❌ Skipped "${name}": the booking has no guest email.`);
  return { name, ok: false, skipped: true, error: 'Booking has no guest email address' };
};

// 1. Booking confirmation · straight after payment
export async function sendBookingConfirmation(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) return noEmail('booking confirmation');
  return sendViaTemplate('booking confirmation', TEMPLATE_ALIASES.bookingConfirmation, b,
    { to: [b.email], from: sender('One Eleven on the Mile') }, legacyBookingConfirmation);
}

// 2. New booking notice to the owners · straight after payment
export async function sendOwnerNotification(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  return sendViaTemplate('owner notification', TEMPLATE_ALIASES.ownerNotification, b, {
    to: [OWNER_EMAIL],
    from: sender('One Eleven Bookings'),
    subject: `New booking · ${b.guest} · ${shortDate(b.checkIn)}`,
  }, legacyOwnerNotification);
}

// 3. Arrival details · 3 days before check-in
export async function sendPreArrivalEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) return noEmail('pre-arrival email');
  return sendViaTemplate('pre-arrival email', TEMPLATE_ALIASES.preArrival, b,
    { to: [b.email], from: sender('One Eleven on the Mile') }, legacyPreArrivalEmail);
}

// 4. Welcome · check-in day
export async function sendCheckInDayEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) return noEmail('check-in day email');
  return sendViaTemplate('check-in day email', TEMPLATE_ALIASES.checkInDay, b,
    { to: [b.email], from: sender('One Eleven on the Mile') }, legacyCheckInDayEmail);
}

// 5. Check-out morning · check-out day
export async function sendCheckOutDayEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) return noEmail('check-out day email');
  return sendViaTemplate('check-out day email', TEMPLATE_ALIASES.checkOutDay, b,
    { to: [b.email], from: sender('One Eleven on the Mile') }, legacyCheckOutDayEmail);
}

// 6. Review request · 2 days after check-out
export async function sendReviewRequestEmail(booking: any): Promise<EmailOutcome> {
  const b = norm(booking);
  if (!b.email) return noEmail('review request email');
  return sendViaTemplate('review request email', TEMPLATE_ALIASES.reviewRequest, b,
    { to: [b.email], from: sender('One Eleven on the Mile') }, legacyReviewRequestEmail);
}

// Test all email templates
export async function sendTestEmails(testEmail: string): Promise<EmailOutcome[]> {
  const testBooking = {
    id: 'test-booking-' + crypto.randomUUID(),
    guest: 'Grant Ashleigh',
    email: testEmail,
    phone: '0276977961',
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    guests: 4,
    total: 6375,
    notes: 'Test booking for email verification'
  };

  console.log(`🧪 Sending test emails to ${testEmail}...`);

  // Resend's default rate limit is 2 req/sec — pace each call ~600ms apart so all 6 land.
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const outcomes: EmailOutcome[] = [];
  outcomes.push(await sendBookingConfirmation(testBooking)); await sleep(600);
  outcomes.push(await sendOwnerNotification(testBooking));   await sleep(600);
  outcomes.push(await sendPreArrivalEmail(testBooking));     await sleep(600);
  outcomes.push(await sendCheckInDayEmail(testBooking));     await sleep(600);
  outcomes.push(await sendCheckOutDayEmail(testBooking));    await sleep(600);
  outcomes.push(await sendReviewRequestEmail(testBooking));

  const sent = outcomes.filter((o) => o.ok).length;
  if (sent === outcomes.length) {
    console.log(`✅ All ${sent} test emails accepted by Resend for ${testEmail}`);
  } else {
    console.error(
      `❌ Only ${sent} of ${outcomes.length} test emails were accepted. Failures: ` +
      outcomes.filter((o) => !o.ok).map((o) => `${o.name} — ${o.error}`).join(' | '),
    );
  }

  return outcomes;
}
