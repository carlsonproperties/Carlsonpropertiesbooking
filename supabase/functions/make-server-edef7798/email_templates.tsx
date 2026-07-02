import { Resend } from 'npm:resend@3.1.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Resend template IDs
const TEMPLATES = {
  bookingConfirmation: 'e6e26e84-b170-409a-bef0-6498fcce5476',
  ownerNotification:   '828ec401-f3c4-4c8b-a260-378eaa696e89',
  preArrival:          '336efe96-167a-41e6-be64-c297c0ace081',
  checkInDay:          'ff1ff07b-3b24-4aee-bab2-0cd8be55ba7e',
  checkOutDay:         'aeeff7c0-8a9b-42f9-b943-7bb5c3be4615',
  reviewRequest:       '2c16227f-ca1c-4b27-867f-b70c20c8a0f9',
};

const FROM      = 'One Eleven on the Mile <bookings@carlsonproperties.co.nz>';
const REPLY_TO  = 'bookings@carlsonproperties.co.nz';
const OWNER_EMAIL = 'bookings@carlsonproperties.co.nz';

// ─── Formatters ──────────────────────────────────────────────────────────────

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// "Monday, 20 March 2026"
const formatLong = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// "Mar 20"
const formatShort = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
};

// "Friday 20th March 2026 3pm"
const ordinal = (n: number) => {
  if (n >= 11 && n <= 13) return `${n}th`;
  const s = ['th','st','nd','rd'];
  return `${n}${s[n % 10] || 'th'}`;
};
const formatLongTime = (dateStr: string, time: string) => {
  const d = new Date(dateStr);
  return `${DAYS[d.getDay()]} ${ordinal(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${time}`;
};

// "6,375"  (no $ or NZD — template handles the label)
const formatTotal = (total: number) =>
  Math.round(total).toLocaleString('en-NZ');

const calculateNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end   = new Date(checkOut);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

// Normalize old bookings that used guestName / guestEmail / guestPhone keys
const norm = (booking: any) => ({
  ...booking,
  guest: booking.guest || booking.guestName || 'Guest',
  email: booking.email || booking.guestEmail || '',
  phone: booking.phone || booking.guestPhone || '',
  notes: booking.notes || booking.guestNotes || '',
});

// ─── 1. Booking Confirmation (to guest) ──────────────────────────────────────

export async function sendBookingConfirmation(booking: any) {
  if (!resend) { console.error('Resend not initialized'); return; }
  const b = norm(booking);
  if (!b.email) { console.error('No guest email — skipping confirmation'); return; }

  const nights = calculateNights(b.checkIn, b.checkOut);

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [b.email],
      // subject is defined in the Resend template
      template_id: TEMPLATES.bookingConfirmation,
      variables: {
        first_name:     b.guest.split(' ')[0],
        check_in_long:  formatLong(b.checkIn),
        check_out_long: formatLong(b.checkOut),
        nights:         String(nights),
        nights_label:   nights === 1 ? 'night' : 'nights',
        guests:         String(b.guests || 1),
        guests_label:   Number(b.guests) === 1 ? 'guest' : 'guests',
        total:          formatTotal(Number(b.total)),
      },
    });
    console.log(`✅ Booking confirmation sent to ${b.email}`);
  } catch (err) {
    console.error('❌ Error sending booking confirmation:', err);
  }
}

// ─── 2. Owner Notification (to bookings@carlsonproperties.co.nz) ─────────────

export async function sendOwnerNotification(booking: any) {
  if (!resend) return;
  const b = norm(booking);

  const nights = calculateNights(b.checkIn, b.checkOut);

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [OWNER_EMAIL],
      template_id: TEMPLATES.ownerNotification,
      variables: {
        booking_ref:     b.id.substring(0, 8).toUpperCase(),
        guest_name:      b.guest,
        guest_email:     b.email,
        guest_phone:     b.phone || 'Not provided',
        check_in_long:   formatLong(b.checkIn),
        check_out_long:  formatLong(b.checkOut),
        check_in_short:  formatShort(b.checkIn),
        check_out_short: formatShort(b.checkOut),
        guests:          String(b.guests || 1),
        total:           formatTotal(Number(b.total)),
      },
    });
    console.log(`✅ Owner notification sent`);
  } catch (err) {
    console.error('❌ Error sending owner notification:', err);
  }
}

// ─── 3. Pre-Arrival (4 days before check-in, to guest) ───────────────────────

export async function sendPreArrivalEmail(booking: any) {
  if (!resend) return;
  const b = norm(booking);
  if (!b.email) return;

  const digits   = (b.phone || '').replace(/\D/g, '');
  const doorCode = digits.length >= 4 ? digits.slice(-4) : '????';

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [b.email],
      template_id: TEMPLATES.preArrival,
      variables: {
        first_name:           b.guest.split(' ')[0],
        door_code:            doorCode,
        check_in_long_time:   formatLongTime(b.checkIn,  '3pm'),
        check_out_long_time:  formatLongTime(b.checkOut, '10am'),
      },
    });
    console.log(`✅ Pre-arrival email sent to ${b.email}`);
  } catch (err) {
    console.error('❌ Error sending pre-arrival email:', err);
  }
}

// ─── 4. Check-In Day (9am on check-in day, to guest) ─────────────────────────

export async function sendCheckInDayEmail(booking: any) {
  if (!resend) return;
  const b = norm(booking);
  if (!b.email) return;

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [b.email],
      template_id: TEMPLATES.checkInDay,
      variables: {
        first_name: b.guest.split(' ')[0],
      },
    });
    console.log(`✅ Check-in day email sent to ${b.email}`);
  } catch (err) {
    console.error('❌ Error sending check-in day email:', err);
  }
}

// ─── 5. Check-Out Day (9am on check-out day, to guest) ───────────────────────

export async function sendCheckOutDayEmail(booking: any) {
  if (!resend) return;
  const b = norm(booking);
  if (!b.email) return;

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [b.email],
      template_id: TEMPLATES.checkOutDay,
      variables: {
        first_name: b.guest.split(' ')[0],
      },
    });
    console.log(`✅ Check-out day email sent to ${b.email}`);
  } catch (err) {
    console.error('❌ Error sending check-out day email:', err);
  }
}

// ─── 6. Review Request (2 days after check-out, to guest) ────────────────────

export async function sendReviewRequestEmail(booking: any) {
  if (!resend) return;
  const b = norm(booking);
  if (!b.email) return;

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [b.email],
      template_id: TEMPLATES.reviewRequest,
      variables: {
        first_name: b.guest.split(' ')[0],
      },
    });
    console.log(`✅ Review request email sent to ${b.email}`);
  } catch (err) {
    console.error('❌ Error sending review request email:', err);
  }
}

// ─── Test helper ─────────────────────────────────────────────────────────────

export async function sendTestEmails(testEmail: string) {
  const testBooking = {
    id:      'test-booking-' + crypto.randomUUID(),
    guest:   'Grant Ashleigh',
    email:   testEmail,
    phone:   '0276977961',
    checkIn: '2026-03-20',
    checkOut:'2026-03-25',
    guests:  4,
    total:   6375,
    notes:   'Test booking for email verification',
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
