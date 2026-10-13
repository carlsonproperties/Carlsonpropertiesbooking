import { defineConfig } from 'vite'
import path from 'path'
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
 * running JavaScript — which is how most AI crawlers read a page. It used to
 * be hand-maintained and had drifted badly from the reviews the site actually
 * renders (three reviewers who appear nowhere on it, and a review count that
 * disagreed with the page). This fills it from src/app/lib/reviews.ts at build
 * time, so the static markup and the rendered page cannot disagree again.
 */
function reviewSchemaInjector() {
  return {
    name: 'review-schema-injector',
    async transformIndexHtml(html: string) {
      const { REVIEWS, REVIEW_AGGREGATE } = await import('./src/app/lib/reviews')
      const review = REVIEWS.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.date,
        reviewBody: r.text,
        reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
        publisher: { '@type': 'Organization', name: r.source },
      }))
      const aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: REVIEW_AGGREGATE.ratingValue,
        reviewCount: String(REVIEW_AGGREGATE.reviewCount),
        bestRating: '5',
        worstRating: '1',
      }
      return html
        .replace('__OE_REVIEWS__', JSON.stringify(review))
        .replace('__OE_AGGREGATE__', JSON.stringify(aggregateRating))
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    reviewSchemaInjector(),
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