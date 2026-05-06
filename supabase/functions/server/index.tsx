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
  sendTestEmails 
} from './email_templates.tsx'

const app = new Hono()

// Simple logger
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${c.req.method} ${c.req.path} - ${ms}ms`)
})

app.use('*', cors({
  origin: '*',
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
    await sendBookingConfirmation(booking);
    
    // 2. Send owner notification
    console.log(`📧 Sending owner notification...`);
    await sendOwnerNotification(booking);
    
    // 3. Schedule pre-arrival email (4 days before check-in)
    const checkInDate = new Date(booking.checkIn);
    const fourDaysBefore = new Date(checkInDate);
    fourDaysBefore.setDate(fourDaysBefore.getDate() - 4);
    fourDaysBefore.setHours(10, 0, 0, 0);
    
    if (fourDaysBefore > new Date()) {
      console.log(`⏰ Pre-arrival email will be sent on ${fourDaysBefore.toISOString()}`);
      // Note: This will need to be triggered by a cron job or scheduled task
      // For now, we'll just log it. The email template is ready in email_templates.tsx
    }
    
    console.log(`✅ Booking emails sent successfully for ${booking.guest}`);
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
    
    const localBookings = (await kv.get('bookings') || []).filter((b: any) => !(b.checkIn === '2026-03-16' && b.checkOut === '2026-03-18'));
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
    const { bookingData } = body;

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
    const amountInCents = Math.round(parseFloat(String(bookingData.amount)) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: bookingData.guestEmail,
      line_items: [{
        price_data: {
          currency: 'nzd',
          product_data: {
            name: `Stay at One Eleven | On the Mile`,
            description: `${bookingData.checkIn} to ${bookingData.checkOut} (${bookingData.guests} guests)`,
            images: ['https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/032_Open2view_ID584542-111_Jarden_Mile.jpg'],
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: { ...bookingData, bookingId, guests: String(bookingData.guests), amount: String(bookingData.amount) },
    });

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

const handleResetPassword = async (c: any) => {
  try {
    const { email, newPassword } = await c.req.json();
    const cleanEmail = email.toLowerCase().trim();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    
    // Get the user by email first
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    if (getUserError) {
      return new Response(JSON.stringify({ error: getUserError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    const user = users.users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // Update the password
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, message: 'Password updated successfully' }), {
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

const handleDashboardStats = async (c: any) => {
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
  try {
    const { bookingData } = await c.req.json();
    const newBooking = { id: crypto.randomUUID(), ...bookingData, total: parseFloat(bookingData.amount), status: 'pending_payment', createdAt: new Date().toISOString() };
    const bookings = await kv.get('bookings') || [];
    await kv.set('bookings', [...bookings, newBooking]);
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
    bookings[idx] = { ...bookings[idx], ...updates };
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
registerRoute('get', '/verify-checkout', handleVerifyCheckout);
registerRoute('get', '/dashboard-stats', handleDashboardStats);
registerRoute('post', '/signup', handleSignup);
registerRoute('post', '/reset-password', handleResetPassword);
registerRoute('post', '/manual-booking', handleManualBooking);
registerRoute('post', '/create-checkout-session', handleCreateCheckout);
registerRoute('post', '/update-booking', handleUpdateBooking);
registerRoute('post', '/delete-booking', handleDeleteBooking);

// NEW: Test all email templates endpoint
registerRoute('get', '/test-emails', async (c: any) => {
  const testEmail = c.req.query('email') || 'grantashl1@gmail.com';
  
  try {
    console.log(`🧪 Testing all email templates, sending to: ${testEmail}`);
    
    // Send all test emails
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
    
    await sendBookingConfirmation(testBooking);
    await sendOwnerNotification(testBooking);
    await sendPreArrivalEmail(testBooking);
    await sendCheckInDayEmail(testBooking);
    await sendCheckOutDayEmail(testBooking);
    await sendReviewRequestEmail(testBooking);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `All 6 test emails sent to ${testEmail}. Check your inbox!`,
      emails: [
        '1. Booking Confirmation ✅',
        '2. Owner Notification ✅',
        '3. Pre-Arrival Email ✅',
        '4. Check-In Day Welcome ✅',
        '5. Check-Out Day Instructions ✅',
        '6. Review Request ✅'
      ]
    }), {
      status: 200,
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

// NEW: Process scheduled emails (for cron job)
registerRoute('get', '/process-scheduled-emails', async (c: any) => {
  try {
    console.log('⏰ Processing scheduled emails...');
    
    const bookings = await kv.get('bookings') || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let emailsSent = 0;
    const results: any[] = [];
    
    for (const booking of bookings) {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      
      // Calculate days until/since check-in
      const daysUntilCheckIn = Math.floor((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceCheckOut = Math.floor((today.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Email 3: Pre-Arrival (4 days before check-in)
      if (daysUntilCheckIn === 4 && !booking.preArrivalSent) {
        console.log(`📧 Sending pre-arrival email to ${booking.email}...`);
        await sendPreArrivalEmail(booking);
        booking.preArrivalSent = true;
        emailsSent++;
        results.push({ type: 'Pre-Arrival', guest: booking.guest, email: booking.email });
      }
      
      // Email 4: Check-In Day (on check-in date at 9am)
      if (daysUntilCheckIn === 0 && !booking.checkInDaySent) {
        console.log(`📧 Sending check-in day email to ${booking.email}...`);
        await sendCheckInDayEmail(booking);
        booking.checkInDaySent = true;
        emailsSent++;
        results.push({ type: 'Check-In Day', guest: booking.guest, email: booking.email });
      }
      
      // Email 5: Check-Out Day (on check-out date at 9am)
      if (checkOutDate.toDateString() === today.toDateString() && !booking.checkOutDaySent) {
        console.log(`📧 Sending check-out day email to ${booking.email}...`);
        await sendCheckOutDayEmail(booking);
        booking.checkOutDaySent = true;
        emailsSent++;
        results.push({ type: 'Check-Out Day', guest: booking.guest, email: booking.email });
      }
      
      // Email 6: Review Request (2 days after check-out)
      if (daysSinceCheckOut === 2 && !booking.reviewRequestSent) {
        console.log(`📧 Sending review request to ${booking.email}...`);
        await sendReviewRequestEmail(booking);
        booking.reviewRequestSent = true;
        emailsSent++;
        results.push({ type: 'Review Request', guest: booking.guest, email: booking.email });
      }
    }
    
    // Save updated bookings with email tracking flags
    if (emailsSent > 0) {
      await kv.set('bookings', bookings);
    }
    
    console.log(`✅ Scheduled email processing complete. Sent ${emailsSent} emails.`);
    
    return new Response(JSON.stringify({ 
      success: true,
      emailsSent,
      results,
      message: `Processed ${bookings.length} bookings, sent ${emailsSent} scheduled emails`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('❌ Scheduled email processing error:', err);
    return new Response(JSON.stringify({ 
      error: err.message,
      stack: err.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});

// NEW: Fix booking statuses based on dates
registerRoute('post', '/fix-booking-statuses', async (c: any) => {
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
    await sendBookingConfirmation(booking);
    await sendOwnerNotification(booking);

    return new Response(JSON.stringify({
      success: true,
      message: `Confirmation emails sent to ${booking.email} and bookings@carlsonproperties.co.nz`,
      booking: {
        guest: booking.guest,
        email: booking.email,
        total: booking.total
      }
    }), {
      status: 200,
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