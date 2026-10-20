import { Hono } from 'npm:hono@4.0.0'
import { cors } from 'npm:hono/cors'
import { createClient } from 'npm:@supabase/supabase-js@2.39.7'
import * as kv from './kv_store.tsx'
import ical from 'npm:node-ical@0.18.0'
import Stripe from 'npm:stripe@14.16.0'
import { Resend } from 'npm:resend@3.1.0'
import { 
  sendBookingConfirmation, 
  sendPreArrivalEmail, 
  sendCheckInDayEmail, 
  sendCheckOutDayEmail, 
  sendReviewRequestEmail,
  sendOwnerNotification,
  sendTestEmails,
  getEmailConfig
} from './email_templates.tsx'

const app = new Hono()

// Simple logger
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${c.req.method} ${c.req.path} - ${ms}ms`)
})

// Only allow the site's own origins to call the API from a browser.
const ALLOWED_ORIGINS = [
  'https://carlsonproperties.co.nz',
  'https://www.carlsonproperties.co.nz',
];
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';                       // non-browser / server-to-server
    if (ALLOWED_ORIGINS.includes(origin)) return origin;
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return origin; // Vercel previews
    return null;                                   // any other site is refused
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-user-token'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))

const AIRTABLE_PAT = Deno.env.get('AIRTABLE_PAT')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ICAL_FEED_URL = Deno.env.get('ICAL_FEED_URL') || "https://calendar.google.com/calendar/ical/guest%40carlsonproperties.co.nz/public/basic.ics"
const AIRTABLE_BASE_ID = 'appdLyi60QUkPJdEP'
const AIRTABLE_TABLE_NAME = 'Bookings' 

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Initialize Supabase admin client for storage management
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ─── Authorization ───────────────────────────────────────────────────────────
// These endpoints previously enforced NOTHING server-side — the owner-dashboard
// email check ran only in the browser, so anyone who knew a URL could read all
// guest data or tamper with bookings. Enforce the owner allowlist here, on the
// server, using the caller's Supabase session token (not the public anon key).
const AUTHORIZED_EMAILS = [
  'grantashl1@gmail.com',
  'donki.bmbr@gmail.com',
  'bookings@carlsonproperties.co.nz',
];
const ANON_KEY = (Deno.env.get('SUPABASE_ANON_KEY') ?? '').trim();
const CRON_SECRET = (Deno.env.get('CRON_SECRET') ?? '').trim();

function unauthorized(message = 'Unauthorized') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

// Verify the caller is a signed-in, authorized owner.
// Returns { ok: true, user } on success, or { ok: false, response } to return.
async function requireOwner(c: any): Promise<{ ok: true; user: any } | { ok: false; response: Response }> {
  const header = c.req.header('Authorization') || c.req.header('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return { ok: false, response: unauthorized('Missing authorization token') };
  // The public anon key is not a user session — reject it explicitly.
  if (ANON_KEY && token === ANON_KEY) return { ok: false, response: unauthorized('Owner session required') };
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    const email = data?.user?.email?.toLowerCase();
    if (error || !email) return { ok: false, response: unauthorized('Invalid or expired session') };
    if (!AUTHORIZED_EMAILS.includes(email)) return { ok: false, response: unauthorized('Not an authorized owner') };
    return { ok: true, user: data.user };
  } catch (_err) {
    return { ok: false, response: unauthorized('Invalid or expired session') };
  }
}

// For endpoints a cron job may call: accept a matching CRON_SECRET query param,
// otherwise fall back to owner authentication.
async function requireOwnerOrCron(c: any): Promise<{ ok: true } | { ok: false; response: Response }> {
  const secret = (c.req.query('secret') || '').trim();
  if (CRON_SECRET && secret && secret === CRON_SECRET) return { ok: true };
  const auth = await requireOwner(c);
  return auth.ok ? { ok: true } : { ok: false, response: auth.response };
}

// Auto-fix storage bucket permissions on server startup
async function ensureStorageBucketIsPublic() {
  const bucketName = 'Website Media';
  
  try {
    console.log(`🔍 Checking storage bucket "${bucketName}" permissions...`);
    
    // Get bucket info
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    const bucket = buckets?.find(b => b.name === bucketName);
    
    if (!bucket) {
      console.log(`📦 Bucket "${bucketName}" not found. Creating it...`);
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
      } else {
        console.log(`✅ Bucket "${bucketName}" created as PUBLIC`);
      }
      return;
    }
    
    // Check if bucket is already public
    if (bucket.public) {
      console.log(`✅ Bucket "${bucketName}" is already PUBLIC - images will load correctly`);
      return;
    }
    
    // Make bucket public
    console.log(`🔧 Making bucket "${bucketName}" PUBLIC...`);
    const { error: updateError } = await supabaseAdmin.storage.updateBucket(bucketName, {
      public: true
    });
    
    if (updateError) {
      console.error('❌ Error updating bucket permissions:', updateError);
      console.error('⚠️  You may need to manually set the bucket to PUBLIC in Supabase Dashboard');
    } else {
      console.log(`✅ SUCCESS! Bucket "${bucketName}" is now PUBLIC - hero image will load!`);
    }
    
  } catch (err) {
    console.error('❌ Error in storage bucket setup:', err);
  }
}

// Run storage setup on server start
ensureStorageBucketIsPublic().catch(console.error);

// Helper to send emails to guests (updated to use new email templates)
async function sendAutomationEmails(booking: any) {
  if (!resend) {
    console.error('Resend API key missing, skipping emails');
    return;
  }

  try {
    // 1. Send immediate booking confirmation
    console.log(`📧 Sending booking confirmation to ${booking.email}...`);
    const confirmation = await sendBookingConfirmation(booking);

    // 2. Send owner notification
    console.log(`📧 Sending owner notification...`);
    const ownerNotice = await sendOwnerNotification(booking);

    // 3–6. Arrival details, welcome, check-out and review emails are sent by
    // the hourly /process-scheduled-emails job when each one falls due.
    
    // Say which emails actually went out. The booking itself is already saved
    // and must not fail over email, but a failure here needs to be findable in
    // the log rather than reported as success.
    const notSent = [confirmation, ownerNotice].filter((o) => !o.ok);
    if (notSent.length === 0) {
      console.log(`✅ Booking emails sent successfully for ${booking.guest}`);
    } else {
      console.error(
        `❌ ${notSent.length} of 2 booking emails were NOT sent for ${booking.guest}: ` +
        notSent.map((o) => `${o.name} — ${o.error}`).join(' | '),
      );
    }
  } catch (err) {
    console.error('❌ Email automation error:', err);
  }
}

// Helper to push to Airtable
async function syncToAirtable(booking: any) {
  if (!AIRTABLE_PAT) {
    console.error('Airtable PAT missing, skipping sync');
    return;
  }
  try {
    const checkInDate = new Date(booking.checkIn)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const monthDisplay = `${monthNames[checkInDate.getMonth()]} ${checkInDate.getFullYear()}`

    console.log(`Syncing booking for ${booking.guest} to Airtable...`);
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${AIRTABLE_PAT}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Customer Name': booking.guest,
            'Email': booking.email || '',
            'Cellphone': booking.phone || '',
            'Check-In': booking.checkIn,
            'Check-Out': booking.checkOut,
            'Revenue': booking.total,
            'Booking Channel': 'Direct Booking (Website)',
            'Month Display': monthDisplay,
            'Property': '111 jarden mile',
            'Notes': booking.notes ? `${booking.notes}\n\nWebsite Booking ID: ${booking.id}` : `Website Booking ID: ${booking.id}`
          }
        }]
      })
    })

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Airtable Sync failed: ${response.status} ${errBody}`);
    } else {
      console.log('Airtable Sync successful');
    }
  } catch (err) { 
    console.error('Airtable Sync Exception:', err) 
  }
}

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, options: any = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function getFromAirtable() {
  if (!AIRTABLE_PAT) return [];
  const baseId = 'appdLyi60QUkPJdEP';
  const tableNames = ['Bookings', 'Booking', 'Reservations', 'Stay', 'Stays', 'Property Bookings', 'Direct Bookings'];
  let allRecords: any[] = [];

  for (const tableName of tableNames) {
    try {
      let offset = '';
      let tableFound = false;
      while (true) {
        const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
        const response = await fetchWithTimeout(url, {
          headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Accept': 'application/json' }
        }, 10000);
        if (!response.ok) {
          if (response.status === 404) break;
          break;
        }
        tableFound = true;
        const data = await response.json();
        allRecords = [...allRecords, ...(data.records || [])];
        offset = data.offset;
        if (!offset) break;
      }
      if (tableFound && allRecords.length > 0) return processAirtableRecords(allRecords);
    } catch (err) { console.error(`Airtable fetch error:`, err); }
  }
  return [];
}

// NEW: Fetch expenses from Airtable with full pagination
async function getExpensesFromAirtable() {
  if (!AIRTABLE_PAT) return [];
  const baseId = 'appdLyi60QUkPJdEP';
  const tableNames = ['Expenses', 'Expense', 'Costs', 'Outgoings'];
  let allRecords: any[] = [];

  for (const tableName of tableNames) {
    try {
      let offset = '';
      let recordCount = 0;

      while (true) {
        const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${offset ? `?offset=${offset}` : ''}`;
        const response = await fetchWithTimeout(url, {
          headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}`, 'Accept': 'application/json' }
        }, 10000);

        if (!response.ok) {
          if (response.status === 404) break;
          break;
        }

        const data = await response.json();
        const records = data.records || [];
        allRecords = [...allRecords, ...records];
        recordCount += records.length;

        offset = data.offset;
        if (!offset) break;
      }

      if (allRecords.length > 0) {
        console.log(`✅ Fetched ${recordCount} expense records from ${tableName}`);
        return processAirtableExpenses(allRecords);
      }
    } catch (err) {
      console.error(`Airtable expenses fetch error:`, err);
    }
  }

  console.log('⚠️ No expense records found');
  return [];
}

function processAirtableExpenses(records: any[]) {
  const expenses: any[] = [];
  let totalExpenses = 0;

  records.forEach((r: any) => {
    const f = r.fields;

    // Extract amount - try multiple column names
    let amount = 0;
    const amountVal = f['Amount'] || f['Price'] || f['Value'] || f['Cost'] || f['Expense'] || f['Total'];
    if (amountVal) {
      // Handle currency formatting
      const cleanAmount = String(amountVal).replace(/[$,]/g, '');
      amount = parseFloat(cleanAmount) || 0;
    }

    // Skip if no amount
    if (amount === 0) return;

    // Aggressive date detection - check multiple fields
    let year: number | null = null;
    let month: number | null = null;

    // Try Month Display field (e.g., "January 2024")
    const monthDisplay = f['Month Display'] || f['Month'] || f['Period'];
    if (monthDisplay) {
      const monthMatch = String(monthDisplay).match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
      if (monthMatch) {
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        month = monthNames.indexOf(monthMatch[1].toLowerCase());
        year = parseInt(monthMatch[2]);
      }
    }

    // Try Month Sort field (e.g., "202401", "01-2024")
    if (!year || month === null) {
      const monthSort = f['Month Sort'] || f['month sort'] || f['MonthIndex'];
      if (monthSort) {
        const sortStr = String(monthSort);
        const match = sortStr.match(/^(\d{4})(\d{2})$/) || sortStr.match(/^(\d{2})-(\d{4})$/);
        if (match) {
          year = parseInt(match[1].length === 4 ? match[1] : match[2]);
          month = parseInt(match[1].length === 4 ? match[2] : match[1]) - 1;
        }
      }
    }

    // Try date fields
    if (!year || month === null) {
      const dateField = f['Date'] || f['Payment Date'] || f['Transaction Date'] || f['Created'];
      if (dateField) {
        const date = new Date(dateField);
        if (!isNaN(date.getTime())) {
          year = date.getFullYear();
          month = date.getMonth();
        }
      }
    }

    // If we found a valid date, add the expense
    if (year && month !== null) {
      totalExpenses += amount;
      expenses.push({
        id: r.id,
        amount,
        year,
        month,
        description: f['Description'] || f['Name'] || f['Category'] || 'Expense',
        category: f['Category'] || f['Type'] || 'Other',
        date: f['Date'] || f['Payment Date']
      });
    }
  });

  console.log(`💰 Processed ${expenses.length} expenses totaling $${totalExpenses.toFixed(2)}`);
  return expenses;
}

function processAirtableRecords(records: any[]) {
  const getVal = (fields: any, possibleKeys: string[]) => {
    for (const key of possibleKeys) {
      if (fields[key] !== undefined && fields[key] !== null) {
        const val = fields[key];
        return Array.isArray(val) ? val[0] : val;
      }
    }
    return undefined;
  };

  return records.map((r: any) => {
    const f = r.fields;
    let monthIndex = -1;
    const monthSortVal = getVal(f, ['Month Sort', 'month sort', 'MonthIndex']);
    if (monthSortVal) {
      const match = String(monthSortVal).match(/^(\d+)/);
      if (match) monthIndex = parseInt(match[1], 10) - 1;
    }

    const checkIn = getVal(f, ['Check-In', 'Check In', 'Arrival', 'Start Date', 'check-in']);
    const checkOut = getVal(f, ['Check-Out', 'Check Out', 'Departure', 'End Date', 'check-out']);
    let status = checkIn && new Date(checkIn) > new Date() ? 'upcoming' : 'completed';

    return {
      id: r.id,
      guest: getVal(f, ['Customer Name', 'Guest Name', 'Name', 'Guest', 'customer']) || 'Guest',
      email: getVal(f, ['Email', 'Guest Email', 'email', 'Contact Email']) || '',
      phone: String(getVal(f, ['Cellphone', 'Cell', 'Phone', 'Mobile', 'phone', 'Telephone']) || ''),
      doorCode: String(getVal(f, ['Door Code', 'Code', 'Doorcode', 'Key Code']) || ''),
      checkIn,
      checkOut,
      total: parseFloat(String(getVal(f, ['Revenue', 'Total Gross Revenue', 'Amount', 'Total', 'Price', 'gross revenue']) || '0')),
      expenses: parseFloat(String(getVal(f, ['Expenses', 'Cost', 'Commission', 'fees', 'expense']) || '0')),
      property: getVal(f, ['Property', 'House', 'Listing', 'Unit']) || '',
      nightsStayed: parseFloat(String(getVal(f, ['Nights Stayed', 'nights stayed', 'Nights', 'Duration', 'Nights Stayed Formula']) || '0')),
      channel: getVal(f, ['Booking Channel', 'Source', 'Platform', 'Channel']) || 'Direct',
      notes: getVal(f, ['Notes', 'Comment', 'Special Request']) || '',
      outstandingBalance: parseFloat(String(getVal(f, ['Outstanding Balance', 'Balance Due', 'Outstanding']) || '0')),
      depositPaid: !!getVal(f, ['Deposit Paid/Payout Received', 'Deposit Paid', 'Payout Received']),
      status,
      monthIndex
    };
  });
}

// Handlers
const handleHealth = async (c: any) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  return new Response(JSON.stringify({ 
    status: 'ok', 
    stripeConfigured: !!stripeKey,
    mode: 'live',
    time: new Date().toISOString() 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

const handleProperties = async (c: any) => {
  const props = await kv.get('properties') || []
  return new Response(JSON.stringify(props), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

/**
 * Bookings held in this project, minus the ones that should not block a date.
 *
 * Shared by /calendar-events (what the website greys out) and /calendar.ics
 * (what Airbnb blocks), so the two can never disagree about availability —
 * a disagreement between them is exactly how a double booking happens.
 */
async function loadLocalBookings(): Promise<any[]> {
  const all = (await kv.get('bookings')) || [];
  const DEAD = ['cancelled', 'canceled', 'declined', 'refunded', 'expired'];
  return all.filter((b: any) => {
    // Legacy test record.
    if (b.checkIn === '2026-03-16' && b.checkOut === '2026-03-18') return false;
    if (!b.checkIn || !b.checkOut) return false;
    return !DEAD.includes(String(b.status || '').toLowerCase());
  });
}

/** YYYY-MM-DD → YYYYMMDD, or null if it is not a plain date. */
const toIcsDate = (value: string): string | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
  return m ? `${m[1]}${m[2]}${m[3]}` : null;
};

/**
 * Availability as an iCal feed, for Airbnb (and any other channel) to import.
 *
 * Direct bookings taken on this site are stored here and in Airtable — they
 * never reach the Google calendar the site reads — so a channel importing that
 * Google feed would not see them. This endpoint publishes everything this
 * project treats as occupied instead.
 *
 * All-day VEVENTs use an exclusive DTEND, which is the check-out date itself.
 * That matches how the booking calendar already treats turnover: the morning
 * someone leaves is bookable by the next guest.
 *
 * The feed is deliberately anonymous. It is fetched by third parties over an
 * unauthenticated URL, so it carries dates only — no guest names, contact
 * details or amounts.
 */
const handleCalendarIcs = async (_c: any) => {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Carlson Properties//One Eleven on the Mile//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:One Eleven on the Mile — booked',
  ];

  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  let emitted = 0;

  const pushEvent = (start: string, end: string, uid: string) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      'SUMMARY:Booked',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    );
    emitted++;
  };

  try {
    for (const b of await loadLocalBookings()) {
      const start = toIcsDate(b.checkIn);
      const end = toIcsDate(b.checkOut);
      if (!start || !end || end <= start) continue;
      pushEvent(start, end, `direct-${b.id || `${start}-${end}`}@carlsonproperties.co.nz`);
    }
  } catch (err) {
    console.error('❌ /calendar.ics could not read local bookings:', err);
  }

  // Also carry whatever the Google calendar holds, so one feed describes the
  // whole picture. A channel re-importing its own reservations is harmless.
  try {
    const response = await fetchWithTimeout(ICAL_FEED_URL, {}, 10000);
    if (response.ok) {
      const events = ical.sync.parseICS(await response.text());
      for (const k in events) {
        const ev: any = events[k];
        if (ev?.type !== 'VEVENT' || !ev.start || !ev.end) continue;
        const start = toIcsDate(new Date(ev.start).toISOString().split('T')[0]);
        const end = toIcsDate(new Date(ev.end).toISOString().split('T')[0]);
        if (!start || !end || end <= start) continue;
        pushEvent(start, end, `gcal-${String(ev.uid || k).replace(/[^\w.-]/g, '')}@carlsonproperties.co.nz`);
      }
    } else {
      console.error(`❌ /calendar.ics: source calendar returned ${response.status}`);
    }
  } catch (err) {
    // A feed that silently drops dates would cause the double bookings this
    // endpoint exists to prevent, so make the gap loud.
    console.error('❌ /calendar.ics could not read the source calendar:', err);
  }

  lines.push('END:VCALENDAR');
  console.log(`📅 /calendar.ics served ${emitted} blocked periods`);

  return new Response(lines.join('\r\n') + '\r\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="one-eleven.ics"',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

const handleCalendarEvents = async (c: any) => {
  try {
    const response = await fetchWithTimeout(ICAL_FEED_URL, {}, 10000);
    if (!response.ok) throw new Error(`Failed to fetch iCal: ${response.status}`);
    const icalData = await response.text();
    const events = ical.sync.parseICS(icalData);
    const occupiedDates: string[] = [];
    
    for (const k in events) {
      if (events.hasOwnProperty(k)) {
        const ev = events[k];
        if (ev.type === 'VEVENT') {
          const start = new Date(ev.start);
          const end = new Date(ev.end);
          let current = new Date(start);
          // CHANGED: Only block dates UP TO (but not including) the checkout date
          // This allows same-day turnovers - checkout date is available for new check-ins
          while (current < end) {
            occupiedDates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
          }
        }
      }
    }
    
    const localBookings = await loadLocalBookings();
    localBookings.forEach((b: any) => {
      let current = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      // CHANGED: Only block dates UP TO (but not including) the checkout date
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        if (!occupiedDates.includes(dateStr)) occupiedDates.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
    });

    return new Response(JSON.stringify({ 
      occupiedDates: [...new Set(occupiedDates)], 
      lastUpdated: new Date().toISOString() 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message, occupiedDates: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Valid coupon codes
const COUPON_CODES: Record<string, { discount: number; description: string }> = {
  'TEST100': { discount: 100, description: 'Test booking - 100% off' },
  'WELCOME10': { discount: 10, description: 'Welcome discount - 10% off' },
};

const handleCreateCheckout = async (c: any) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

  console.log(`Checkout Request: Mode=LIVE.`);

  try {
    const body = await c.req.json();
    if (!body || !body.bookingData) {
      return new Response(JSON.stringify({ error: 'Invalid request: Missing booking data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const { bookingData, couponCode } = body;

    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe API key is missing. Please set STRIPE_SECRET_KEY in Supabase secrets.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const stripe = new Stripe(stripeKey.trim(), { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
    const bookingId = crypto.randomUUID();
    const origin = c.req.header('origin') || c.req.header('referer') || 'https://oneeleven.nz';
    const baseUrl = origin.split('?')[0].replace(/\/$/, '');

    // ── Server-side pricing ──────────────────────────────────────────────
    // The price is computed HERE from the dates and the fixed rate. The amount
    // sent by the browser is NEVER trusted for the charge (it can be edited to
    // pay any value). These must match the values in BookingEngine.tsx.
    const NIGHTLY_RATE = 1275;      // NZD per night
    const DIRECT_DISCOUNT = 0.10;   // 10% direct-booking discount on every direct booking
    const MIN_NIGHTS = 2;

    const checkInDate = new Date(`${bookingData.checkIn}T00:00:00Z`);
    const checkOutDate = new Date(`${bookingData.checkOut}T00:00:00Z`);
    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);

    if (isNaN(nights) || nights < MIN_NIGHTS) {
      return new Response(JSON.stringify({ error: `Invalid dates — a minimum of ${MIN_NIGHTS} nights is required.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const subtotal = nights * NIGHTLY_RATE;
    let finalAmount = subtotal * (1 - DIRECT_DISCOUNT);   // price the guest sees

    // Validate and apply coupon code (stacks on top of the direct discount)
    let discount = 0;
    let couponDescription = '';
    if (couponCode && COUPON_CODES[couponCode.toUpperCase()]) {
      const coupon = COUPON_CODES[couponCode.toUpperCase()];
      discount = coupon.discount;
      couponDescription = coupon.description;
      finalAmount = finalAmount * (1 - discount / 100);
    }
    finalAmount = Math.round(finalAmount * 100) / 100;

    // Log if the browser-sent amount disagrees with the server price (tamper signal)
    const clientAmount = parseFloat(String(bookingData.amount));
    if (!isNaN(clientAmount) && Math.abs(clientAmount - subtotal * (1 - DIRECT_DISCOUNT)) > 1) {
      console.warn(`⚠️ Client amount ($${clientAmount}) != server price ($${subtotal * (1 - DIRECT_DISCOUNT)}) — charging server-computed price.`);
    }

    // Stripe requires minimum 50 cents for NZD
    const amountInCents = Math.max(50, Math.round(finalAmount * 100));

    // Only carry safe, known fields into Stripe metadata (not the raw client amount)
    const sessionData: any = {
      payment_method_types: ['card'],
      customer_email: bookingData.guestEmail,
      line_items: [{
        price_data: {
          currency: 'nzd',
          product_data: {
            name: `Stay at One Eleven | On the Mile`,
            description: `${bookingData.checkIn} to ${bookingData.checkOut} (${bookingData.guests} guests)${discount > 0 ? ` - ${couponDescription}` : ''}`,
            images: ['https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/032_Open2view_ID584542-111_Jarden_Mile.jpg'],
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        bookingId,
        guestName: bookingData.guestName || '',
        guestEmail: bookingData.guestEmail || '',
        guestPhone: bookingData.guestPhone || '',
        guestNotes: bookingData.guestNotes || '',
        checkIn: bookingData.checkIn || '',
        checkOut: bookingData.checkOut || '',
        guests: String(bookingData.guests),
        nights: String(nights),
        amount: String(finalAmount),
        originalAmount: String(subtotal),
        discountPercent: String(discount),
        couponCode: couponCode || '',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionData);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const handleVerifyCheckout = async (c: any) => {
  const sessionId = c.req.query('session_id')
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

  if (!sessionId || !stripeKey) {
    return new Response(JSON.stringify({ error: 'Invalid verification request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  try {
    const stripe = new Stripe(stripeKey.trim(), { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() })
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid') {
      const bookings = await kv.get('bookings') || []
      if (!bookings.find((b: any) => b.stripeSessionId === sessionId)) {
        const newBooking = {
          id: session.metadata?.bookingId || crypto.randomUUID(),
          guest: session.metadata?.guestName || session.customer_details?.name || 'Guest',
          email: session.metadata?.guestEmail || session.customer_details?.email || '',
          phone: session.metadata?.guestPhone || '',
          notes: session.metadata?.guestNotes || '',
          checkIn: session.metadata?.checkIn,
          checkOut: session.metadata?.checkOut,
          total: parseFloat(session.metadata?.amount || '0'),
          guests: parseInt(session.metadata?.guests || '1'),
          status: 'upcoming',
          stripeSessionId: sessionId,
          createdAt: new Date().toISOString()
        }
        await kv.set('bookings', [...bookings, newBooking])
        await syncToAirtable(newBooking)
        await sendAutomationEmails(newBooking)
        return new Response(JSON.stringify({ success: true, booking: newBooking }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      return new Response(JSON.stringify({ success: true, booking: bookings.find((b: any) => b.stripeSessionId === sessionId) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Payment not completed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const handleSignup = async (c: any) => {
  try {
    const { email, password, name } = await c.req.json();
    const cleanEmail = email.toLowerCase().trim();
    // Only pre-approved owner emails may create an account. Without this,
    // anyone could POST to /signup and mint an account on this project.
    if (!AUTHORIZED_EMAILS.includes(cleanEmail)) {
      return new Response(JSON.stringify({ error: 'This email address is not authorized.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data, error } = await supabase.auth.admin.createUser({ email: cleanEmail, password, user_metadata: { name }, email_confirm: true });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ success: true, user: data.user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// DISABLED — security. This endpoint used to set ANY account's password given
// only an email + new password, with no authentication: a full account-takeover
// backdoor. Legitimate password resets go through Supabase's email-recovery
// flow (OwnerLogin "Forgot Password" → resetPasswordForEmail → /reset-password
// page → supabase.auth.updateUser), which never touches this endpoint.
const handleResetPassword = async (_c: any) => {
  return new Response(
    JSON.stringify({ error: 'This endpoint has been disabled. Use the “Forgot Password” link on the owner login to reset your password by email.' }),
    { status: 410, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
  );
}

const handleDashboardStats = async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    console.log('Dashboard stats requested');
    const bookings = await kv.get('bookings') || [];
    console.log('Local bookings:', bookings.length);

    const airtableBookings = await getFromAirtable();
    console.log('Airtable bookings:', airtableBookings.length);

    // Fetch expenses from Airtable
    const expenses = await getExpensesFromAirtable();
    console.log('Airtable expenses:', expenses.length);
    
    // Merge bookings, avoiding duplicates - filter for 111 Jarden Mile property
    const allBookings = [...bookings, ...airtableBookings].filter((b: any) => {
      const property = (b.property || '').toLowerCase();
      return !property || property.includes('111') || property.includes('jarden') || property.includes('mile');
    });
    console.log('Total bookings (111 Jarden Mile):', allBookings.length);
    
    // Improved sorting: Upcoming bookings first (closest arrival first), 
    // followed by past bookings (most recent completion first).
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    allBookings.sort((a: any, b: any) => {
      const dateA = new Date(a.checkIn);
      const dateB = new Date(b.checkIn);
      
      const isAUpcoming = dateA >= today;
      const isBUpcoming = dateB >= today;

      // If one is upcoming and the other isn't, upcoming comes first
      if (isAUpcoming && !isBUpcoming) return -1;
      if (!isAUpcoming && isBUpcoming) return 1;
      
      if (isAUpcoming && isBUpcoming) {
        // Both upcoming: soonest arrival first
        return dateA.getTime() - dateB.getTime();
      }
      
      // Both past: most recent check-in first
      return dateB.getTime() - dateA.getTime();
    });

    // Calculate aggregated stats
    let totalRevenue = 0;
    let totalExpenses = 0;
    const yearlyEarnings: any = {};
    const yearlyStats: any = {};
    const yearlyOccupancy: any = {};
    const yearlyExpenses: any = {};
    const channelBreakdown: any = {};

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    allBookings.forEach((b: any) => {
      const revenue = parseFloat(String(b.total || 0));
      const expense = parseFloat(String(b.expenses || 0));
      const checkInDate = new Date(b.checkIn);
      const checkOutDate = new Date(b.checkOut);

      // Skip invalid dates
      if (isNaN(checkInDate.getTime())) {
        console.warn('Invalid date in booking:', b.checkIn);
        return;
      }

      // Fix status based on actual dates
      if (checkOutDate < today) {
        b.status = 'completed';
      } else if (checkInDate >= today) {
        b.status = 'upcoming';
      } else if (checkInDate < today && checkOutDate >= today) {
        b.status = 'current';
      }

      const year = checkInDate.getFullYear();
      const month = checkInDate.getMonth();

      totalRevenue += revenue;
      totalExpenses += expense;

      // Track booking channels
      const channel = b.channel || 'Direct Booking (Website)';
      channelBreakdown[channel] = (channelBreakdown[channel] || 0) + 1;

      // Initialize year data if not exists
      if (!yearlyEarnings[year]) {
        yearlyEarnings[year] = monthNames.map(name => ({ name, earnings: 0, expenses: 0 }));
      }
      if (!yearlyStats[year]) {
        yearlyStats[year] = { totalBookings: 0, totalNights: 0, totalRevenue: 0 };
      }
      if (!yearlyExpenses[year]) {
        yearlyExpenses[year] = monthNames.map(name => ({ name, amount: 0 }));
      }

      // Add to monthly data - ensure the month index is valid
      if (yearlyEarnings[year] && yearlyEarnings[year][month]) {
        yearlyEarnings[year][month].earnings += revenue;
        yearlyEarnings[year][month].expenses += expense;
      }

      // Add to yearly stats
      yearlyStats[year].totalBookings += 1;
      yearlyStats[year].totalRevenue += revenue;

      const stayNights = b.nightsStayed || (b.checkOut && b.checkIn ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0);
      yearlyStats[year].totalNights += stayNights;
    });

    // Process Airtable expenses into monthly buckets
    expenses.forEach((exp: any) => {
      const { year, month, amount } = exp;

      if (!yearlyExpenses[year]) {
        yearlyExpenses[year] = monthNames.map(name => ({ name, amount: 0 }));
      }

      if (yearlyExpenses[year][month]) {
        yearlyExpenses[year][month].amount += amount;
      }

      // Also add to yearlyEarnings for combined chart
      if (!yearlyEarnings[year]) {
        yearlyEarnings[year] = monthNames.map(name => ({ name, earnings: 0, expenses: 0 }));
      }

      if (yearlyEarnings[year][month]) {
        yearlyEarnings[year][month].expenses += amount;
      }
    });

    // Calculate occupancy rates
    Object.keys(yearlyStats).forEach(yearStr => {
      const year = parseInt(yearStr);
      const stats = yearlyStats[year];
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const daysInYear = isLeap ? 366 : 365;
      const rate = Math.min(100, Math.round((stats.totalNights / daysInYear) * 100));
      yearlyOccupancy[year] = rate; // Return as number instead of string
    });

    // Calculate additional stats
    const occupancyRate = yearlyOccupancy[currentYear] || 0;
    const totalFees = totalRevenue * 0.15; // Standard 15% platform fee estimation
    const avgBookingValue = allBookings.length > 0 ? totalRevenue / allBookings.length : 0;
    const upcomingBookings = allBookings.filter((b: any) => new Date(b.checkIn) >= today).length;

    const response = {
      allGuests: allBookings,
      recentGuests: allBookings.slice(0, 10),
      totalBookings: allBookings.length,
      totalRevenue,
      totalExpenses,
      totalFees,
      avgBookingValue,
      upcomingBookings,
      occupancyRate,
      yearlyEarnings,
      yearlyStats,
      yearlyOccupancy,
      yearlyExpenses,
      channelBreakdown,
      totalAirtableExpenses: expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    };

    console.log('Dashboard stats calculated successfully:', {
      totalBookings: response.totalBookings,
      totalRevenue: response.totalRevenue,
      occupancyRate: response.occupancyRate,
      avgBookingValue: response.avgBookingValue
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('Dashboard stats error:', err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const handleManualBooking = async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingData } = await c.req.json();
    // Normalize field names so email templates and dashboard work correctly
    const newBooking = {
      id: crypto.randomUUID(),
      guest: bookingData.guestName || bookingData.guest || 'Guest',
      email: bookingData.guestEmail || bookingData.email || '',
      phone: bookingData.guestPhone || bookingData.phone || '',
      notes: bookingData.guestNotes || bookingData.notes || '',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests || 1,
      total: parseFloat(bookingData.amount || bookingData.total || '0'),
      status: 'pending_payment',
      channel: 'Direct Booking (Website)',
      createdAt: new Date().toISOString()
    };
    const bookings = await kv.get('bookings') || [];
    await kv.set('bookings', [...bookings, newBooking]);
    // Send confirmation emails immediately — same as Stripe flow
    await sendAutomationEmails(newBooking);
    await syncToAirtable(newBooking);
    return new Response(JSON.stringify({ success: true, booking: newBooking }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const handleUpdateBooking = async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingId, updates } = await c.req.json();
    const bookings = await kv.get('bookings') || [];
    const idx = bookings.findIndex((b: any) => b.id === bookingId);
    if (idx === -1) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    // Normalise legacy field names (guestName → guest, etc.) when merging
    const existing = bookings[idx];
    const normalizedExisting = {
      ...existing,
      guest: existing.guest || existing.guestName || 'Guest',
      email: existing.email || existing.guestEmail || '',
      phone: existing.phone || existing.guestPhone || '',
      notes: existing.notes || existing.guestNotes || '',
    };
    bookings[idx] = { ...normalizedExisting, ...updates };
    await kv.set('bookings', bookings);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const handleDeleteBooking = async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingId } = await c.req.json();
    const bookings = await kv.get('bookings') || [];
    await kv.set('bookings', bookings.filter((b: any) => b.id !== bookingId));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) { 
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Robust Routing: Handle routes both with and without the function name prefix
const registerRoute = (method: 'get' | 'post', path: string, handler: any) => {
  const functionPrefix = '/make-server-edef7798';
  if (method === 'get') {
    app.get(path, handler);
    app.get(`${functionPrefix}${path}`, handler);
  } else {
    app.post(path, handler);
    app.post(`${functionPrefix}${path}`, handler);
  }
};

registerRoute('get', '/health', handleHealth);
registerRoute('get', '/properties', handleProperties);
registerRoute('get', '/calendar-events', handleCalendarEvents);
// Public by design: Airbnb and other channels fetch this with no credentials.
// It exposes dates only. See handleCalendarIcs.
registerRoute('get', '/calendar.ics', handleCalendarIcs);
registerRoute('get', '/verify-checkout', handleVerifyCheckout);
registerRoute('get', '/dashboard-stats', handleDashboardStats);
registerRoute('post', '/signup', handleSignup);
registerRoute('post', '/reset-password', handleResetPassword);
registerRoute('post', '/manual-booking', handleManualBooking);
registerRoute('post', '/create-checkout-session', handleCreateCheckout);
registerRoute('post', '/update-booking', handleUpdateBooking);
registerRoute('post', '/delete-booking', handleDeleteBooking);
registerRoute('post', '/resend-confirmation', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingId } = await c.req.json();
    const bookings = await kv.get('bookings') || [];
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    // Normalize field names in case this is an old booking with wrong keys
    const normalized = {
      ...booking,
      guest: booking.guest || booking.guestName || 'Guest',
      email: booking.email || booking.guestEmail || '',
      phone: booking.phone || booking.guestPhone || '',
      notes: booking.notes || booking.guestNotes || '',
    };
    await sendAutomationEmails(normalized);
    return new Response(JSON.stringify({ success: true, message: `Confirmation emails sent to ${normalized.email}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

registerRoute('post', '/create-booking', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingData, sendEmails } = await c.req.json();
    const newBooking = {
      id: crypto.randomUUID(),
      guest: bookingData.guest || 'Guest',
      email: bookingData.email || '',
      phone: bookingData.phone || '',
      notes: bookingData.notes || '',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests || 1,
      total: parseFloat(bookingData.total || '0'),
      status: bookingData.status || 'upcoming',
      channel: bookingData.channel || 'Direct Booking (Manual Entry)',
      createdAt: new Date().toISOString()
    };
    const bookings = await kv.get('bookings') || [];
    await kv.set('bookings', [...bookings, newBooking]);
    if (sendEmails) await sendAutomationEmails(newBooking);
    await syncToAirtable(newBooking);
    return new Response(JSON.stringify({ success: true, booking: newBooking }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// Email configuration check. Sends nothing — reports whether this function is
// capable of sending at all, and to where. This is the first thing to look at
// when booking notifications are not arriving, because it separates "not
// configured" from "configured but refused" from "sent but not delivered".
registerRoute('get', '/email-health', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;

  const config = getEmailConfig();
  const problems: string[] = [];

  if (!config.resendConfigured) {
    problems.push(
      'RESEND_API_KEY is not set on this function, so no email can be sent at all. ' +
      'Add it under Edge Functions → Secrets, then redeploy.',
    );
  }
  if (config.ownerIsSelfAddressed) {
    problems.push(
      `Owner notifications are sent from ${config.sender} to the same address. That only ` +
      `arrives if ${config.sendingDomain} has a real mailbox behind it, and a self-addressed ` +
      'message is more likely to be filtered. Set OWNER_NOTIFICATION_EMAIL to an inbox you ' +
      'know works to test the sending half on its own.',
    );
  }

  return new Response(JSON.stringify({
    canSend: config.resendConfigured,
    config,
    problems,
    // Deliberately not a pass/fail verdict: whether the sending domain is
    // verified is only knowable by attempting a send, which /test-emails does.
    nextStep: config.resendConfigured
      ? 'Call /test-emails?email=<an inbox you can read> to see what Resend says about an actual send.'
      : 'Set RESEND_API_KEY first — nothing else can be diagnosed until it is present.',
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
});

// NEW: Test all email templates endpoint
registerRoute('get', '/test-emails', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  const testEmail = c.req.query('email') || 'grantashl1@gmail.com';

  try {
    console.log(`🧪 Testing all email templates, sending to: ${testEmail}`);

    // sendTestEmails reports the outcome of each send. This route used to
    // await the six senders and then return `success: true` with every email
    // marked ✅ — but the senders never throw, so that was reported whether or
    // not a single message left the building. Report what Resend actually said.
    const outcomes = await sendTestEmails(testEmail);
    const failed = outcomes.filter((o) => !o.ok);
    const config = getEmailConfig();

    return new Response(JSON.stringify({
      success: failed.length === 0,
      message: failed.length === 0
        ? `All ${outcomes.length} test emails were accepted by Resend for ${testEmail}. Check that inbox.`
        : `${failed.length} of ${outcomes.length} test emails were NOT sent. See "emails" for the reason Resend gave.`,
      sentTo: testEmail,
      config,
      emails: outcomes,
    }), {
      status: failed.length === 0 ? 200 : 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Test email error:', err);
    return new Response(JSON.stringify({ 
      error: err.message,
      stack: err.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// ─── Scheduled guest emails ──────────────────────────────────────────────────
// Call this every hour (Supabase pg_cron, see RESEND_EMAILS.md). Each email
// goes out on the first run after its New Zealand send time, through its Resend
// Template. Working from today's New Zealand date means bookings that are
// moved or deleted are always handled correctly, and a run that fails is
// simply picked up by the next one.
//
// Resend can hold a scheduled email for at most 30 days, and its Automations
// only wait a fixed time after an event, so neither can do "3 days before
// check-in" for a booking made months ahead. This job is what does it.
const NZ_TIME_ZONE = 'Pacific/Auckland';

/** Today's date ("2026-03-20") and hour (0–23) in New Zealand. */
function nowInNewZealand(): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: NZ_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) };
}

/** Whole calendar days from `from` to `to` (both "YYYY-MM-DD…"). */
function calendarDaysBetween(from: string, to: string): number {
  const a = Date.parse(`${String(from).slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${String(to).slice(0, 10)}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

// New Zealand hour each email waits for when the cron job runs it.
const SEND_HOUR = { preArrival: 9, checkInDay: 9, checkOutDay: 7, reviewRequest: 10 };

// Guests who booked through these platforms get the platform's own messages.
const OTA_CHANNEL = /airbnb|booking\.com|bookabach|vrbo|expedia/i;

registerRoute('get', '/process-scheduled-emails', async (c: any) => {
  const auth = await requireOwnerOrCron(c);
  if (!auth.ok) return auth.response;
  try {
    // The cron job waits for each email's send hour. Pressing the dashboard
    // button (no secret) sends anything due today straight away.
    const fromCron = Boolean((c.req.query('secret') || '').trim());
    const now = nowInNewZealand();
    const due = (hour: number) => !fromCron || now.hour >= hour;
    console.log(`⏰ Processing scheduled emails for ${now.date} (${now.hour}:00 NZ)…`);

    const bookings = await kv.get('bookings') || [];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let emailsSent = 0;
    let changed = false;
    const results: any[] = [];

    for (const booking of bookings) {
      const email = booking.email || booking.guestEmail;
      const status = String(booking.status || '').toLowerCase();
      if (!email || !booking.checkIn || !booking.checkOut) continue;
      if (status === 'cancelled' || status === 'canceled' || status === 'pending_payment') continue;
      if (OTA_CHANNEL.test(String(booking.channel || ''))) continue;

      const daysUntilCheckIn = calendarDaysBetween(now.date, booking.checkIn);
      const daysSinceCheckOut = calendarDaysBetween(booking.checkOut, now.date);

      const jobs: { type: string; flag: string; when: boolean; send: (b: any) => Promise<any> }[] = [
        // 3 days before check-in. Late bookings (inside 3 days) still get it.
        { type: 'Pre-Arrival', flag: 'preArrivalSent', send: sendPreArrivalEmail,
          when: daysUntilCheckIn >= 0 && daysUntilCheckIn <= 3 && due(SEND_HOUR.preArrival) },
        { type: 'Check-In Day', flag: 'checkInDaySent', send: sendCheckInDayEmail,
          when: daysUntilCheckIn === 0 && due(SEND_HOUR.checkInDay) },
        { type: 'Check-Out Day', flag: 'checkOutDaySent', send: sendCheckOutDayEmail,
          when: daysSinceCheckOut === 0 && due(SEND_HOUR.checkOutDay) },
        // 2 days after check-out, with a short catch-up window if a run was missed.
        { type: 'Review Request', flag: 'reviewRequestSent', send: sendReviewRequestEmail,
          when: daysSinceCheckOut >= 2 && daysSinceCheckOut <= 4 && due(SEND_HOUR.reviewRequest) },
      ];

      for (const job of jobs) {
        if (!job.when || booking[job.flag]) continue;
        console.log(`📧 Sending ${job.type} to ${email}…`);
        const outcome = await job.send(booking);
        results.push({ type: job.type, guest: booking.guest, email, ok: outcome?.ok === true, error: outcome?.error });
        if (outcome?.ok) {
          // Only a delivered email is marked sent, so a failure is retried next run.
          booking[job.flag] = true;
          booking[`${job.flag}At`] = new Date().toISOString();
          emailsSent++;
          changed = true;
        }
        await sleep(600); // Resend allows 2 requests a second
      }
    }

    if (changed) await kv.set('bookings', bookings);

    const failed = results.filter((r) => !r.ok);
    console.log(`✅ Scheduled emails: ${emailsSent} sent${failed.length ? `, ${failed.length} failed` : ''}.`);

    return new Response(JSON.stringify({
      success: failed.length === 0,
      emailsSent,
      failed: failed.length,
      results,
      message: `Checked ${bookings.length} bookings for ${now.date}: ${emailsSent} emails sent` +
        (failed.length ? `, ${failed.length} failed (they will be retried on the next run)` : ''),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Scheduled email processing error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// NEW: Fix booking statuses based on dates
registerRoute('post', '/fix-booking-statuses', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const bookings = await kv.get('bookings') || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updatedCount = 0;

    bookings.forEach((booking: any) => {
      const checkOutDate = new Date(booking.checkOut);
      const checkInDate = new Date(booking.checkIn);

      let newStatus = booking.status;

      if (checkOutDate < today) {
        newStatus = 'completed';
      } else if (checkInDate >= today) {
        newStatus = 'upcoming';
      } else if (checkInDate < today && checkOutDate >= today) {
        newStatus = 'current';
      }

      if (newStatus !== booking.status) {
        console.log(`Updating ${booking.guest}: ${booking.status} → ${newStatus}`);
        booking.status = newStatus;
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await kv.set('bookings', bookings);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${updatedCount} booking statuses`,
      totalBookings: bookings.length,
      updatedCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Fix booking statuses error:', err);
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// NEW: Manually resend booking confirmation to a specific customer
registerRoute('post', '/resend-confirmation', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const { bookingId } = await c.req.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: 'Booking ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const bookings = await kv.get('bookings') || [];
    const booking = bookings.find((b: any) => b.id === bookingId);

    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    console.log(`📧 Manually resending confirmation to ${booking.email}...`);
    const outcomes = [
      await sendBookingConfirmation(booking),
      await sendOwnerNotification(booking),
    ];

    // Report what actually happened. These senders do not throw when Resend
    // refuses a message, so a 200 here used to claim success unconditionally.
    const failed = outcomes.filter((o) => !o.ok);
    const config = getEmailConfig();

    return new Response(JSON.stringify({
      success: failed.length === 0,
      message: failed.length === 0
        ? `Confirmation emails accepted by Resend for ${booking.email} and ${config.ownerNotificationTo}`
        : `${failed.length} of ${outcomes.length} emails were not sent`,
      emails: outcomes,
      booking: {
        guest: booking.guest,
        email: booking.email,
        total: booking.total
      }
    }), {
      status: failed.length === 0 ? 200 : 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Resend confirmation error:', err);
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// NEW: Test individual email types
registerRoute('get', '/test-single-email', async (c: any) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  const emailType = c.req.query('type') || 'booking-confirmation';
  const testEmail = c.req.query('email') || 'grantashl1@gmail.com';

  const testBooking = {
    id: 'test-' + crypto.randomUUID(),
    guest: 'Grant Ashleigh',
    email: testEmail,
    phone: '0276977961',
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    guests: 4,
    total: 6375,
    notes: 'Test booking for email verification'
  };
  
  try {
    console.log(`🧪 Testing ${emailType} email to ${testEmail}...`);
    
    switch (emailType) {
      case 'booking-confirmation':
        await sendBookingConfirmation(testBooking);
        break;
      case 'owner-notification':
        await sendOwnerNotification(testBooking);
        break;
      case 'pre-arrival':
        await sendPreArrivalEmail(testBooking);
        break;
      case 'check-in':
        await sendCheckInDayEmail(testBooking);
        break;
      case 'check-out':
        await sendCheckOutDayEmail(testBooking);
        break;
      case 'review':
        await sendReviewRequestEmail(testBooking);
        break;
      default:
        throw new Error(`Unknown email type: ${emailType}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `${emailType} email sent to ${testEmail}`,
      emailType,
      recipient: testEmail
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Single email test error:', err);
    return new Response(JSON.stringify({ 
      error: err.message,
      stack: err.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// Helper route to list all files in property-images bucket
app.get('/make-server-edef7798/list-storage-images', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: files, error } = await supabase.storage
      .from('Website Media')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Storage list error:', error);
      return c.json({ error: error.message, files: [] }, 500);
    }

    const projectId = Deno.env.get('SUPABASE_URL')?.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || '';
    
    const fileUrls = files?.map(file => ({
      name: file.name,
      url: `https://${projectId}.supabase.co/storage/v1/object/public/Website%20Media/${encodeURIComponent(file.name)}`,
      size: file.metadata?.size,
      created: file.created_at
    })) || [];

    return c.json({ files: fileUrls, count: fileUrls.length });
  } catch (err) {
    console.error('Error listing storage:', err);
    return c.json({ error: String(err), files: [] }, 500);
  }
});

// NEW: List all available buckets to find the correct name
app.get('/make-server-edef7798/list-buckets', async (c) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Bucket list error:', error);
      return c.json({ error: error.message, buckets: [] }, 500);
    }

    return c.json({ 
      buckets: buckets?.map(b => ({ 
        id: b.id, 
        name: b.name, 
        public: b.public,
        created_at: b.created_at 
      })) || [],
      count: buckets?.length || 0
    });
  } catch (err) {
    console.error('Error listing buckets:', err);
    return c.json({ error: String(err), buckets: [] }, 500);
  }
});

// NEW: Manual fix for storage bucket permissions
app.get('/make-server-edef7798/fix-storage-bucket', async (c) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    console.log('🔧 Manual storage bucket fix triggered...');
    await ensureStorageBucketIsPublic();

    // Verify the fix worked
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const websiteMediaBucket = buckets?.find(b => b.name === 'Website Media');

    return c.json({
      success: true,
      message: 'Storage bucket permissions updated',
      bucketStatus: {
        name: 'Website Media',
        isPublic: websiteMediaBucket?.public || false,
        exists: !!websiteMediaBucket
      },
      testUrl: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg'
    });
  } catch (err: any) {
    console.error('Error fixing storage bucket:', err);
    return c.json({
      error: err.message,
      stack: err.stack
    }, 500);
  }
});

// NEW: Check Stripe account details
app.get('/make-server-edef7798/stripe-account-info', async (c) => {
  const auth = await requireOwner(c);
  if (!auth.ok) return auth.response;
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      return c.json({
        error: 'Stripe API key not configured',
        configured: false
      }, 500);
    }

    const stripe = new Stripe(stripeKey.trim(), {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient()
    });

    // Retrieve account information
    const account = await stripe.accounts.retrieve();

    return c.json({
      configured: true,
      accountId: account.id,
      email: account.email || 'Not set',
      businessName: account.business_profile?.name || account.settings?.dashboard?.display_name || 'Not set',
      country: account.country,
      currency: account.default_currency,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      type: account.type,
      keyPrefix: stripeKey.substring(0, 7) + '...' // Show only prefix for security
    });
  } catch (err: any) {
    console.error('Error retrieving Stripe account:', err);
    return c.json({
      error: err.message,
      stack: err.stack
    }, 500);
  }
});

// Fallback for debugging
app.notFound((c) => {
  console.log(`404: ${c.req.method} ${c.req.path}`)
  return new Response(JSON.stringify({
    error: 'Route not found',
    message: `The endpoint ${c.req.method} ${c.req.path} does not exist on this server.`,
    debug: {
      path: c.req.path,
      method: c.req.method,
      suggestion: 'Ensure the URL follows the pattern: /functions/v1/make-server-edef7798/[route]'
    }
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
})

Deno.serve(app.fetch)