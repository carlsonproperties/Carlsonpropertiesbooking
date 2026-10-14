import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}


/**
 * The crawler-facing JSON-LD lives in index.html so it is present without
 * running JavaScript — which is how most AI crawlers read a page. The
 * VacationRental entity is filled from src/app/lib/accommodation-schema.ts at
 * build time, so the static markup and the React-rendered page (SEO.tsx) share
 * one definition and cannot drift apart again.
 */
function accommodationSchemaInjector() {
  return {
    name: 'accommodation-schema-injector',
    async transformIndexHtml(html: string) {
      const { buildAccommodationNode } = await import('./src/app/lib/accommodation-schema')
      return html.replace('__OE_ACCOMMODATION__', JSON.stringify(buildAccommodationNode()))
    },
  }
}

/**
 * "Last Updated" stamp on the Guest Info page. Tied to the guide file's own
 * modified time so it moves automatically whenever the guide is edited and
 * redeployed, instead of relying on someone remembering to bump a hard-coded
 * string. On a fresh CI clone the mtime is the checkout time, so in practice
 * this reads as the deploy date.
 */
const guestInfoUpdated = (() => {
  try {
    return fs.statSync(path.resolve(__dirname, 'src/app/pages/GuestInfo.tsx')).mtime.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
})()

export default defineConfig({
  define: {
    __GUEST_INFO_UPDATED__: JSON.stringify(guestInfoUpdated),
  },
  plugins: [
    figmaAssetResolver(),
    accommodationSchemaInjector(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // REMOVED figmaAssetPlugin - no longer needed, was causing green placeholder boxes
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Add alias for utils directory
      '/utils': path.resolve(__dirname, './utils'),
    },
  },

  // Explicitly set the public directory
  publicDir: 'public',

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})