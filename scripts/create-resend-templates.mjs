// Creates (or updates) the six One Eleven guest emails as Resend Templates and
// publishes them, with their subjects, senders and variables filled in.
//
//   RESEND_API_KEY=re_xxx node scripts/create-resend-templates.mjs
//
// Safe to run again: a template that already exists (matched by its alias) is
// updated and republished rather than duplicated. Needs Node 18 or newer.

import { readFile } from 'node:fs/promises';

const KEY = process.env.RESEND_API_KEY;
const BASE = process.env.RESEND_API_BASE || 'https://api.resend.com';
if (!KEY) {
  console.error('Set RESEND_API_KEY first, e.g. RESEND_API_KEY=re_xxx node scripts/create-resend-templates.mjs');
  process.exit(1);
}

const file = new URL('../emails/resend/templates.json', import.meta.url);
const templates = JSON.parse(await readFile(file, 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  await sleep(600); // Resend allows 2 requests a second
  return { ok: res.ok, status: res.status, data };
}

let failures = 0;
for (const t of templates) {
  const fields = {
    name: t.name,
    alias: t.alias,
    from: t.from,
    subject: t.subject,
    reply_to: t.reply_to,
    html: t.html,
    text: t.text,
    variables: t.variables,
  };

  let saved = await api('PATCH', `/templates/${t.alias}`, fields);
  let verb = 'Updated';
  if (saved.status === 404) {
    saved = await api('POST', '/templates', fields);
    verb = 'Created';
  }
  if (!saved.ok) {
    failures++;
    console.error(`✗ ${t.name}: could not save (${saved.status}) ${saved.data?.message ?? ''}`);
    continue;
  }

  const published = await api('POST', `/templates/${t.alias}/publish`);
  if (!published.ok) {
    failures++;
    console.error(`✗ ${t.name}: saved, but could not publish (${published.status}) ${published.data?.message ?? ''}`);
    continue;
  }
  console.log(`✓ ${verb} and published "${t.name}" (alias: ${t.alias})`);
}

if (failures) {
  console.error(`\n${failures} of ${templates.length} templates need attention.`);
  process.exit(1);
}
console.log(`\nAll ${templates.length} templates are live in Resend.`);
