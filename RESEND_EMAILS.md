# Guest emails in Resend

The six booking emails are Resend Templates. Their wording and design live in Resend, so you can edit them there without a deploy. The booking system picks the right template, fills in the guest's details and sends it at the right time.

| Template (alias) | Goes to | When it sends |
| --- | --- | --- |
| `booking-confirmation` | Guest | Straight after they pay |
| `owner-notification` | You | Straight after they pay |
| `pre-arrival` | Guest | 3 days before check-in, 9am. A booking made inside 3 days gets it on the next hourly run |
| `check-in-day` | Guest | Check-in day, 9am |
| `check-out-day` | Guest | Check-out day, 7am |
| `review-request` | Guest | 2 days after check-out, 10am |

All times are New Zealand time. Bookings marked as Airbnb (or another booking site) are skipped, because the platform sends its own messages.

## 1. Put the templates in Resend

Every image loads from Supabase Storage: `Website Media/email/` for the header logo, icons, letterbox and wordmark, and the root of `Website Media` for the three photos. The files the emails need are also kept in `public/brand/email/`, so a missing one can be re-uploaded from there with the same name: `header-logo.png`, `icon-clock.png`, `icon-pin.png`, `icon-wifi.png`, `icon-coffee.png`, `letterbox-mark-sand.png` and `one-eleven-wordmark-footer.png` (plus `letterbox-mark-lake.png` and `one-eleven-wordmark-lake.png` for the signature).

**Option A, quickest.** From the repo folder, run:

```
RESEND_API_KEY=re_xxx node scripts/create-resend-templates.mjs
```

It creates all six from `emails/resend/templates.json`, with subjects, senders and variables, then publishes them. Run it again after editing that file and it updates them.

**Option B, by hand.** For each file in `emails/resend/`: in Resend go to Templates, create a template, then paste or drag in the HTML. Use the alias, subject and variables listed in `templates.json`, then publish.

Until a template is published, the booking system falls back to the old built-in design for that email, so nothing goes missing in between.

## 2. Add two secrets to the edge function

In Supabase, go to Edge Functions → Secrets:

- `CRON_SECRET`: any long random string. The hourly job uses it to prove it's allowed in.
- `WIFI_PASSWORD` (optional): set this when the Wi-Fi password changes. It overrides the password saved in the `pre-arrival` template. You can also just edit the fallback value in Resend.

## 3. Turn on the hourly job

In Supabase, open the SQL Editor and run this once. Replace the two placeholders first: use your `CRON_SECRET`, and the **anon public** key from Project Settings → API Keys.

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'one-eleven-guest-emails',
  '5 * * * *',
  $$
  select net.http_get(
    url := 'https://hxprmevheigajzqehjgf.supabase.co/functions/v1/make-server-edef7798/process-scheduled-emails?secret=PASTE_CRON_SECRET',
    headers := jsonb_build_object('Authorization', 'Bearer PASTE_ANON_KEY'),
    timeout_milliseconds := 60000
  );
  $$
);
```

It runs at five past every hour. Each email goes out on the first run after its send time. An email is only marked as sent once Resend accepts it, so a failed send is retried on the next run.

Check it's running under Integrations → Cron in Supabase, and in Resend under Emails.

To stop it:

```sql
select cron.unschedule('one-eleven-guest-emails');
```

## Why not Resend scheduling on its own?

Resend can hold a scheduled email for 30 days at most, and its Automations can only wait a fixed time after an event. Neither can do "3 days before check-in" for a booking made months ahead, so the hourly job decides when each email is due and Resend sends it.

## Variables

The booking system fills these in. Values are HTML-escaped before they're sent.

| Variable | Example |
| --- | --- |
| `GUEST_NAME` | Grant |
| `GUEST_FULL_NAME` | Grant Ashleigh |
| `GUEST_EMAIL` / `GUEST_PHONE` | as booked |
| `CHECK_IN_DATE` / `CHECK_OUT_DATE` | Friday 20 March 2026 |
| `NIGHTS` | 5 nights |
| `GUESTS` | 4 guests |
| `TOTAL` | $6,375 NZD |
| `DOOR_CODE` | 7961# (last 4 digits of their mobile, then #) |
| `BOOKING_REF` | first 8 characters of the booking id |
| `CHANNEL` | Direct website |
| `NOTES` | the guest's notes, or "None" |
| `WIFI_PASSWORD` | from the `WIFI_PASSWORD` secret, otherwise the template's fallback |

## Email signature

`emails/resend/signature-ashleigh.html` is the signature for the bookings@ mailbox: the letterbox and the One Eleven wordmark from the website footer, then Ashleigh Carlson, Owner/Operator, phone, email and website. Open it in Chrome, select all, copy, and paste it into Gmail under Settings → General → Signature. It isn't part of the guest emails.
