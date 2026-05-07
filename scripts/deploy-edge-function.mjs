// Stages supabase/functions/server/* into supabase/functions/make-server-edef7798/
// (renaming the entrypoint index.tsx -> index.ts), then deploys via the Supabase CLI.
//
// Usage: npm run deploy:fn
// Requires SUPABASE_ACCESS_TOKEN in the environment (or `npx supabase login` already done).

import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const PROJECT_REF = 'hxprmevheigajzqehjgf';
const FUNCTION_NAME = 'make-server-edef7798';

const root = dirname(fileURLToPath(import.meta.url)) + '/..';
const src = join(root, 'supabase', 'functions', 'server');
const dst = join(root, 'supabase', 'functions', FUNCTION_NAME);

console.log(`📦 Staging ${src} → ${dst}`);
rmSync(dst, { recursive: true, force: true });
mkdirSync(dst, { recursive: true });

for (const file of readdirSync(src)) {
  const target = file === 'index.tsx' ? 'index.ts' : file;
  writeFileSync(join(dst, target), readFileSync(join(src, file)));
  console.log(`   ${file} → ${target}`);
}

console.log(`🚀 Deploying ${FUNCTION_NAME} to ${PROJECT_REF}...`);
const result = spawnSync(
  'npx',
  ['supabase', 'functions', 'deploy', FUNCTION_NAME, '--project-ref', PROJECT_REF, '--use-api'],
  { stdio: 'inherit', shell: true }
);

process.exit(result.status ?? 1);
