import { Resend } from 'npm:resend@3.1.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Brand colors
const SAGE = '#9DA07E';
const CREAM = '#FDFCF8';
const WHITE = '#FFFFFF';
const INK = '#1A1A1A';
const BODY_GREY = '#666666';
const MUTED = '#AFAFAF';
const HAIRLINE = '#F1F1EE';

// Images
const LOGO_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Logo.png';
const HERO_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Street%20facing.jpg';
const HERO_LAKE_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/lake%20views.jpg';
const HERO_KITCHEN_URL = 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/looking%20into%20kitchen.png';

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

// 1. Booking Confirmation Email
export async function sendBookingConfirmation(booking: any) {
  if (!resend) {
    console.error('Resend not initialized - missing API key');
    return;
  }

  const firstName = booking.guest.split(' ')[0];
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  try {
    await resend.emails.send({
      from: 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: [booking.email],
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
                        ${formatDate(booking.checkIn)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="color: ${INK};">Check-out</strong><br/>
                        ${formatDate(booking.checkOut)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="color: ${INK};">${nights} ${nights === 1 ? 'night' : 'nights'}</strong> · ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 0 0; border-top: 1px solid ${HAIRLINE}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${INK};">
                        $${booking.total.toLocaleString()} NZD
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

    console.log(`✅ Booking confirmation sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending booking confirmation:', err);
  }
}

// 2. Owner Notification Email
export async function sendOwnerNotification(booking: any) {
  if (!resend) return;

  const checkInShort = formatDateShort(booking.checkIn);
  const bookingRef = booking.id.substring(0, 8).toUpperCase();

  try {
    await resend.emails.send({
      from: 'One Eleven Bookings <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: ['bookings@carlsonproperties.co.nz'],
      subject: `New booking · ${booking.guest} · ${checkInShort}`,
      html: createEmailWrapper(`
        <!-- Spacer -->
        <tr><td style="height: 40px;"></td></tr>

        ${eyebrow('NEW BOOKING')}
        ${headline(bookingRef)}
        ${bodyText(`${booking.guest} just booked a stay.`, true)}

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
                        ${booking.guest}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Email
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${booking.email}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Phone
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${booking.phone || 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Check-in
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${formatDate(booking.checkIn)}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Check-out
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${formatDate(booking.checkOut)}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Guests
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        ${booking.guests || 1}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 140px; padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: ${SAGE};">
                        Revenue
                      </td>
                      <td style="padding: 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${INK};">
                        $${booking.total} NZD
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
      `, `${booking.guest} booked ${formatDateShort(booking.checkIn)} – ${formatDateShort(booking.checkOut)}`)
    });

    console.log(`✅ Owner notification sent`);
  } catch (err) {
    console.error('❌ Error sending owner notification:', err);
  }
}

// 3. Pre-Arrival Email
export async function sendPreArrivalEmail(booking: any) {
  if (!resend) return;

  const firstName = booking.guest.split(' ')[0];
  const phone = booking.phone || '';
  const digits = phone.replace(/\D/g, '');
  const doorCode = digits.length >= 4 ? digits.slice(-4) : 'last 4 digits of your phone';

  try {
    await resend.emails.send({
      from: 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: [booking.email],
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
                        ${formatDateLong(booking.checkIn, '3pm')}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: ${BODY_GREY};">
                        <strong style="display: block; color: ${INK}; margin-bottom: 4px;">Check-Out</strong>
                        ${formatDateLong(booking.checkOut, '10am')}
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

    console.log(`✅ Pre-arrival email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending pre-arrival email:', err);
  }
}

// 4. Check-In Day Email
export async function sendCheckInDayEmail(booking: any) {
  if (!resend) return;

  const firstName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: [booking.email],
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

    console.log(`✅ Check-in day email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending check-in day email:', err);
  }
}

// 5. Check-Out Day Email
export async function sendCheckOutDayEmail(booking: any) {
  if (!resend) return;

  const firstName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: [booking.email],
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

    console.log(`✅ Check-out day email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending check-out day email:', err);
  }
}

// 6. Review Request Email
export async function sendReviewRequestEmail(booking: any) {
  if (!resend) return;

  const firstName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>',
      replyTo: 'bookings@carlsonproperties.co.nz',
      to: [booking.email],
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

    console.log(`✅ Review request email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending review request email:', err);
  }
}

// Test all email templates
export async function sendTestEmails(testEmail: string) {
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

  await sendBookingConfirmation(testBooking); await sleep(600);
  await sendOwnerNotification(testBooking);   await sleep(600);
  await sendPreArrivalEmail(testBooking);     await sleep(600);
  await sendCheckInDayEmail(testBooking);     await sleep(600);
  await sendCheckOutDayEmail(testBooking);    await sleep(600);
  await sendReviewRequestEmail(testBooking);

  console.log(`✅ All test emails sent to ${testEmail}`);
}
