import { Resend } from 'npm:resend@3.1.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Email Styles - Matching website brand guidelines
const emailStyles = {
  container: `
    font-family: 'Times New Roman', serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 60px 40px;
    background-color: #FDFCF8;
    color: #2D2D2D;
  `,
  card: `
    background: white;
    padding: 60px 40px;
    border-radius: 40px;
    border: 1px solid #F1F1F1;
    box-shadow: 0 20px 40px rgba(0,0,0,0.02);
  `,
  accent: `
    color: #9DA07E;
    font-family: sans-serif;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: block;
    text-align: center;
  `,
  h1: `
    font-size: 42px;
    color: #1A1A1A;
    margin: 0 0 30px 0;
    line-height: 1.1;
    font-weight: normal;
    text-align: center;
  `,
  paragraph: `
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    margin-bottom: 20px;
    font-weight: 300;
    text-align: left;
  `,
  noteBox: `
    background: #F8F8F6;
    border-left: 4px solid #9DA07E;
    border-radius: 12px;
    padding: 24px;
    margin: 30px 0;
    text-align: left;
  `,
  infoBox: `
    background: #F8F8F6;
    border-radius: 20px;
    padding: 30px;
    margin: 30px 0;
    text-align: left;
  `,
  list: `
    font-family: sans-serif;
    font-size: 16px;
    line-height: 2;
    color: #666;
    text-align: left;
    padding-left: 20px;
    margin: 20px 0;
  `,
  button: `
    display: inline-block;
    background: #9DA07E;
    color: white;
    padding: 20px 40px;
    border-radius: 16px;
    text-decoration: none;
    font-family: sans-serif;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  `,
  footer: `
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid #F1F1EE;
    text-align: center;
  `,
  divider: `
    width: 1px;
    height: 60px;
    background: #9DA07E;
    margin: 0 auto 40px;
    opacity: 0.3;
  `
};

// 1. Booking Confirmation (sent immediately after payment)
export async function sendBookingConfirmation(booking: any) {
  if (!resend) {
    console.error('Resend not initialized - missing API key');
    return;
  }

  const guestName = booking.guest.split(' ')[0];
  
  try {
    await resend.emails.send({
      from: 'One Eleven | On the Mile <bookings@carlsonproperties.co.nz>',
      to: [booking.email],
      subject: `Booking Confirmed - ONE ELEVEN ON THE MILE`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <div style="${emailStyles.divider}"></div>
            <span style="${emailStyles.accent}">Booking Confirmed</span>
            <h1 style="${emailStyles.h1}">
              Thank You<br/>
              <span style="font-style: italic; color: #9DA07E;">for Choosing Us</span>
            </h1>

            <p style="${emailStyles.paragraph}">
              Hi ${guestName},
            </p>

            <p style="${emailStyles.paragraph}">
              Thank you for choosing <strong>ONE ELEVEN ON THE MILE</strong> for your upcoming stay in Taupō! We're excited to host you.
            </p>

            <div style="${emailStyles.noteBox}">
              <p style="font-family: sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #9DA07E; text-transform: uppercase; margin-bottom: 15px;">NOTE</p>
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 10px;">
                The current bedding configuration is:
              </p>
              <ul style="${emailStyles.list}">
                <li>2x Super king beds</li>
                <li>2x King beds</li>
                <li>2x Single beds</li>
              </ul>
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666; margin-top: 15px;">
                Please message me if you need any of the beds split. The 2x Super king beds split into singles giving you 4x singles.
              </p>
            </div>

            <p style="${emailStyles.paragraph}">
              Three days before your check-in, you'll receive our digital guidebook with:
            </p>
            <ul style="${emailStyles.list}">
              <li>Your Access Code</li>
              <li>House Instructions (pool, sauna, gym, etc.)</li>
              <li>Recommendations for the Best Local Dining and Activities</li>
            </ul>

            <div style="${emailStyles.footer}">
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 10px;">
                Warm regards,<br/>
                <strong>Matt and Ashleigh Carlson</strong><br/>
                ONE ELEVEN | ON THE MILE
              </p>
              <p style="font-family: sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #AFAFAF; text-transform: uppercase; margin-top: 30px;">
                111 Jarden Mile, Taupō, NZ
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Booking confirmation sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending booking confirmation:', err);
  }
}

// 2. Guest Information (sent 4 days before check-in)
export async function sendPreArrivalEmail(booking: any) {
  if (!resend) return;

  const guestName = booking.guest.split(' ')[0];
  const guestPhone = booking.phone || '';
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const checkInFormatted = formatDate(checkInDate);
  const checkOutFormatted = formatDate(checkOutDate);
  
  // Extract last 4 digits of phone for door code
  let doorCodeHint = 'the last 4 digits of your cellphone number';
  if (guestPhone) {
    const digits = guestPhone.replace(/\D/g, '');
    if (digits.length >= 4) {
      doorCodeHint = `${digits.slice(-4)}`;
    }
  }

  try {
    await resend.emails.send({
      from: 'One Eleven | On the Mile <bookings@carlsonproperties.co.nz>',
      to: [booking.email],
      subject: `Your Stay is Almost Here - Guest Information`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <div style="${emailStyles.divider}"></div>
            <span style="${emailStyles.accent}">Almost Time</span>
            <h1 style="${emailStyles.h1}">
              Almost Time!<br/>
              <span style="font-style: italic; color: #9DA07E;">See You Soon</span>
            </h1>

            <p style="${emailStyles.paragraph}">
              Hi ${guestName},
            </p>

            <p style="${emailStyles.paragraph}">
              Your stay at <strong>ONE ELEVEN ON THE MILE</strong> is just around the corner. Here's everything you need to know:
            </p>

            <div style="${emailStyles.infoBox}">
              <p style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 14px; line-height: 2.2;">
                <strong style="color: #9DA07E; display: inline-block; width: 160px;">Door Code:</strong> ${doorCodeHint} followed by the # key<br/>
                <span style="font-size: 12px; color: #999; margin-left: 160px; display: block;">Activates at 3pm on ${checkInFormatted}</span>
                <span style="font-size: 12px; color: #999; margin-left: 160px; display: block;">Expires at 10am on ${checkOutFormatted}</span>
              </p>
              <p style="margin: 20px 0 15px 0; font-family: sans-serif; font-size: 14px; line-height: 2.2;">
                <strong style="color: #9DA07E; display: inline-block; width: 160px;">Address:</strong> 111 Jarden Mile, Taupō, Waikato 3330, New Zealand
              </p>
              <p style="margin: 20px 0 15px 0; font-family: sans-serif; font-size: 14px; line-height: 2.2;">
                <strong style="color: #9DA07E; display: inline-block; width: 160px;">Wi-Fi Network:</strong> Carlson & Co. Guest<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 160px;">Wi-Fi Password:</strong> Gue$t111. <span style="font-size: 12px; color: #999;">(Don't forget the full stop!)</span>
              </p>
            </div>

            <p style="${emailStyles.paragraph}">
              Here is our Digital House Manual which can be found through this link:
            </p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://www.carlsonproperties.co.nz/guest-info" style="${emailStyles.button}">
                VIEW DIGITAL HOUSE MANUAL
              </a>
            </p>

            <p style="${emailStyles.paragraph}">
              It is a Self Check-In so we will not be there to meet you, however we also live in the neighbourhood so if you need anything we are around to help out.
            </p>

            <div style="${emailStyles.footer}">
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666;">
                See you soon,<br/>
                <strong>Matt and Ashleigh Carlson</strong><br/>
                ONE ELEVEN | ON THE MILE
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Pre-arrival email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending pre-arrival email:', err);
  }
}

// 3. Check-In Day Welcome (sent 9am on check-in day)
export async function sendCheckInDayEmail(booking: any) {
  if (!resend) return;

  const guestName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven | On the Mile <bookings@carlsonproperties.co.nz>',
      to: [booking.email],
      subject: `Welcome to ONE ELEVEN ON THE MILE!`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <div style="${emailStyles.divider}"></div>
            <span style="${emailStyles.accent}">Welcome</span>
            <h1 style="${emailStyles.h1}">
              Welcome!<br/>
              <span style="font-style: italic; color: #9DA07E;">Enjoy Your Stay</span>
            </h1>

            <p style="${emailStyles.paragraph}">
              Hi ${guestName},
            </p>

            <p style="${emailStyles.paragraph}">
              Welcome to <strong>ONE ELEVEN ON THE MILE!</strong>
            </p>

            <p style="${emailStyles.paragraph}">
              Please swing by a supermarket and pick up your milk. With the number of milk alternatives out there, it's too hard for us to know what you like and do not supply milk. We do however have a barista coffee machine and provide a bag of beans for you.
            </p>

            <p style="${emailStyles.paragraph}">
              Don't wait until the end of your trip when you are writing your review to tell us about your stay. If anything is missing or you need anything, or something is broken then please please reach out to us. We would rather fix it than have you be uncomfortable during your stay.
            </p>

            <div style="background: #F8F8F6; border-radius: 20px; padding: 30px; margin: 30px 0; text-align: center;">
              <p style="font-family: sans-serif; font-size: 18px; color: #9DA07E; font-weight: bold; margin-bottom: 10px;">
                Have an amazing time!
              </p>
              <p style="font-family: sans-serif; font-size: 14px; color: #666; margin: 0;">
                Matt & Ash<br/>
                <a href="tel:0276977961" style="color: #9DA07E; text-decoration: none;">027 697 7961</a>
              </p>
            </div>

            <div style="${emailStyles.footer}">
              <p style="font-family: sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #AFAFAF; text-transform: uppercase;">
                ONE ELEVEN | ON THE MILE
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Check-in day email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending check-in day email:', err);
  }
}

// 4. Check-Out Day Instructions (sent 9am on check-out day)
export async function sendCheckOutDayEmail(booking: any) {
  if (!resend) return;

  const guestName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven | On the Mile <bookings@carlsonproperties.co.nz>',
      to: [booking.email],
      subject: `Check-Out Instructions - Thank You for Staying`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <div style="${emailStyles.divider}"></div>
            <span style="${emailStyles.accent}">Check-Out</span>
            <h1 style="${emailStyles.h1}">
              Good Morning<br/>
              <span style="font-style: italic; color: #9DA07E;">Safe Travels</span>
            </h1>

            <p style="${emailStyles.paragraph}">
              Good morning ${guestName},
            </p>

            <p style="${emailStyles.paragraph}">
              We hope you've had a wonderful stay.
            </p>

            <p style="${emailStyles.paragraph}">
              We do the cleaning ourselves to save you on a cleaning fee, so as your visit comes to an end, please help us with a quicker turnover by:
            </p>

            <ul style="${emailStyles.list}">
              <li>Loading and starting the dishwasher</li>
              <li>Taking your rubbish out to the wheelie bin down the side of the house</li>
            </ul>

            <p style="${emailStyles.paragraph}">
              It is not expected that you strip the beds but it is really helpful when you do. However, please, please, leave the mattress protectors on and the duvet inner protectors on. All bedding and towels get taken to the commercial laundry so don't worry about washing/drying them.
            </p>

            <div style="${emailStyles.footer}">
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666;">
                Warm regards,<br/>
                <strong>Matt & Ash</strong><br/>
                ONE ELEVEN | ON THE MILE
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Check-out day email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending check-out day email:', err);
  }
}

// 5. Review Request (sent 2 days after check-out at 11am)
export async function sendReviewRequestEmail(booking: any) {
  if (!resend) return;

  const guestName = booking.guest.split(' ')[0];

  try {
    await resend.emails.send({
      from: 'One Eleven | On the Mile <bookings@carlsonproperties.co.nz>',
      to: [booking.email],
      subject: `How Was Your Stay? We'd Love Your Feedback`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <div style="${emailStyles.divider}"></div>
            <span style="${emailStyles.accent}">Thank You</span>
            <h1 style="${emailStyles.h1}">
              Thank You<br/>
              <span style="font-style: italic; color: #9DA07E;">for Staying With Us</span>
            </h1>

            <p style="${emailStyles.paragraph}">
              Hi ${guestName},
            </p>

            <p style="${emailStyles.paragraph}">
              Thanks for being such a respectful guest and looking after our property. If you would like to book again in the future then please reach out to us again via our website.
            </p>

            <p style="${emailStyles.paragraph}">
              In the meantime please review your stay:
            </p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://share.google/EU7JN7Rw5jJDsS5Ci" style="${emailStyles.button}">
                LEAVE A REVIEW
              </a>
            </p>

            <div style="${emailStyles.footer}">
              <p style="font-family: sans-serif; font-size: 14px; line-height: 1.8; color: #666;">
                See you again soon,<br/>
                <strong>Matt & Ash</strong><br/>
                ONE ELEVEN | ON THE MILE
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Review request email sent to ${booking.email}`);
  } catch (err) {
    console.error('❌ Error sending review request email:', err);
  }
}

// Owner notification email
export async function sendOwnerNotification(booking: any) {
  if (!resend) return;

  const bookingRef = booking.id.slice(0, 8).toUpperCase();
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  try {
    await resend.emails.send({
      from: 'One Eleven | Booking Alert <bookings@carlsonproperties.co.nz>',
      to: ['bookings@carlsonproperties.co.nz'],
      subject: `🎉 New Booking - ${booking.guest} - ${formatDate(checkInDate)}`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.card}">
            <span style="${emailStyles.accent}">New Booking Received</span>
            <h1 style="${emailStyles.h1}">
              Booking Confirmed<br/>
              <span style="font-style: italic; color: #9DA07E;">${booking.guest}</span>
            </h1>

            <div style="background: #F8F8F6; padding: 30px; border-radius: 20px; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 14px; line-height: 2;">
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Guest Name:</strong> ${booking.guest}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Email:</strong> ${booking.email}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Phone:</strong> ${booking.phone || 'Not provided'}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Check-In:</strong> ${formatDate(checkInDate)}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Check-Out:</strong> ${formatDate(checkOutDate)}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Guests:</strong> ${booking.guests || 1}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Total:</strong> $${booking.total}<br/>
                <strong style="color: #9DA07E; display: inline-block; width: 140px;">Booking ID:</strong> ${bookingRef}
              </p>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://carlsonproperties.co.nz/dashboard" style="${emailStyles.button}">
                VIEW IN DASHBOARD
              </a>
            </p>
          </div>
        </div>
      `
    });

    console.log(`✅ Owner notification sent`);
  } catch (err) {
    console.error('❌ Error sending owner notification:', err);
  }
}

// Test all email templates
export async function sendTestEmails(testEmail: string) {
  const testBooking = {
    id: 'test-booking-123456',
    guest: 'Grant Ashleigh',
    email: testEmail,
    phone: '0276977961',
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    guests: 4,
    total: 6375,
    notes: 'This is a test booking'
  };

  console.log(`🧪 Sending test emails to ${testEmail}...`);

  await sendBookingConfirmation(testBooking);
  await sendOwnerNotification(testBooking);
  await sendPreArrivalEmail(testBooking);
  await sendCheckInDayEmail(testBooking);
  await sendCheckOutDayEmail(testBooking);
  await sendReviewRequestEmail(testBooking);

  console.log(`✅ All test emails sent to ${testEmail}`);
}
