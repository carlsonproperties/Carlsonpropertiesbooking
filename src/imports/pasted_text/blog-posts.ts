Build a blog system for the One Eleven Taupō website at carlsonproperties.co.nz. Match the
   existing brand and routing conventions exactly. Do not modify existing pages or break
  existing routes.

  BRAND (already established in the site)
  - Sage primary: #9DA07E
  - Cream background: #FDFCF8
  - Ink: #1A1A1A · Body grey: #666 · Muted: #AFAFAF · Hairline: #F1F1EE
  - Serif: Cormorant Garamond (for h1, h2, eyebrows over hero)
  - Sans: Inter (for body, buttons, meta)
  - Eyebrow style: 10px, font-weight 900, letter-spacing 0.4em, uppercase, sage colour
  - Buttons: rounded-full, sage background, white uppercase Inter text, 11px, letter-spacing
   0.2em
  - Match the existing aesthetic — quiet luxury, generous whitespace, editorial type. See
  pages/Home.tsx, About.tsx, MeetHosts.tsx for reference.

  FILES TO CREATE
  1. src/app/lib/blog-posts.ts — exports BLOG_POSTS: BlogPost[] (the data structure I'm
  pasting below)
  2. src/app/pages/Blog.tsx — index page (lists all posts)
  3. src/app/pages/BlogPost.tsx — individual post page (reads slug from URL)
  4. src/app/components/BlogCard.tsx — reusable card used on the index + related-posts strip

  FILES TO MODIFY
  1. src/app/routes.ts — add { path: "blog", Component: Blog } and { path: "blog/:slug",
  Component: BlogPost }
  2. src/app/components/Footer.tsx and the main nav — add "Journal" or "Blog" link
  3. public/sitemap.xml — add an entry per post with the correct publishDate as lastmod,
  priority 0.6, changefreq monthly

  ROUTES
  - /blog — index, lists all posts in BLOG_POSTS sorted by publishDate DESC. Filter by
  category (Events / Local Guide / Food & Drink) via tab bar at top.
  - /blog/:slug — individual post. 404 if slug not found in BLOG_POSTS.

  INDEX PAGE (/blog)
  - Hero band: serif "Journal" + small italic "Stories from Taupō" subtitle on cream
  background
  - Category tab bar (All / Events / Local Guide / Food & Drink) — sticky, sage underline on
   active
  - Featured post (most recent): full-width card with hero image left, title + excerpt +
  meta right
  - Remaining posts: 3-column grid on desktop, 1-column on mobile. BlogCard component.
  - Footer CTA: "Want to be the first to hear about new stays and Taupō events? Join our
  newsletter" with a stub email input (just UI for now, no backend wired)

  INDIVIDUAL POST PAGE (/blog/:slug)
  - Top: small back-link "← All Stories"
  - Eyebrow: post.category in sage all-caps
  - H1: post.title in Cormorant Garamond, max 800px width, centered
  - Meta line under title: publishDate (formatted "8 May 2026"), · readingTime min read
  - Hero image: full-width, max-height 60vh, object-cover
  - Body: max 720px width, centered. Render bodyMarkdown using react-markdown. Style:
    - h2 in serif, 32px, sage colour
    - h3 in serif italic, 24px
    - body in Inter 17px, line-height 1.7, colour #2D2D2D
    - blockquotes with 4px sage left border
    - links sage, underlined on hover
  - After body: CTA button (post.ctaLabel → post.ctaUrl)
  - Tags row: small pill buttons listing post.tags
  - Related posts strip: 3 most recent posts excluding the current one, using BlogCard

  BLOGCARD COMPONENT
  Props: { post: BlogPost, featured?: boolean }
  - Card has hover lift (-translate-y-1)
  - Image at top, 16:9 aspect ratio, rounded-3xl
  - Below image: category eyebrow, title (serif, 24px), excerpt (Inter 14px, 2 lines max
  with ellipsis), meta line (publish date · X min read)
  - Whole card is a Link to /blog/{slug}

  SEO PER POST PAGE
  Use the existing <SEO /> component. For each post:
  - title={post.metaTitle}
  - description={post.metaDescription}
  - image={post.heroImage}
  - url={`/blog/${post.slug}`}
  - type="article"
  - schemaData prop should contain a BlogPosting JSON-LD:
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.heroImage,
      "datePublished": post.publishDate,
      "dateModified": post.publishDate,
      "author": { "@type": "Person", "name": "Matt & Ashleigh Carlson" },
      "publisher": { "@type": "Organization", "name": "Carlson Properties", "logo": {
  "@type": "ImageObject", "url": "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object
  /public/Website%20Media/Logo.png" } },
      "mainEntityOfPage": { "@type": "WebPage", "@id":
  `https://www.carlsonproperties.co.nz/blog/${post.slug}` },
      "description": post.metaDescription,
      "keywords": post.tags.join(", "),
      "articleSection": post.category
    }

  DEPENDENCIES
  - Add `react-markdown` to package.json. No other new dependencies.

  DATA TO LOAD INTO src/app/lib/blog-posts.ts
  [I will paste the full BLOG_POSTS array as a separate message — use the data exactly as
  provided, do not invent or modify post content.]

  DELIVERY
  - Show me the full git diff at the end of your response so I can verify nothing else
  changed.
  - Run npm run build before finishing and confirm no errors.
  - DO NOT touch supabase/functions/, the existing dashboard, or the email templates.

  ACCEPTANCE CRITERIA
  1. /blog renders the post list with category filtering
  2. /blog/best-things-to-do-in-taupo renders the full Things to Do post correctly with
  markdown formatting
  3. View source on a post page shows BlogPosting JSON-LD in the head
  4. Sitemap.xml includes all 6 post URLs
  5. Existing pages (/, /about, /meet-hosts, /book, /guest-info, /dashboard) all still work
  — no regressions
  6. Mobile layout works on a 375px viewport