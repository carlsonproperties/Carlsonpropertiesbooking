Update the blog post data file (src/app/lib/blog-posts.ts) with hero and secondary image
  URLs hosted in our Supabase Website Media bucket. Do not modify any other files except
  where specifically noted.

  STEP 1 — Extend the BlogPost interface

  Add one new optional field to the BlogPost interface:

    secondaryImage?: string;   // optional in-body image, used as the social card override
  and as a featured visual partway through the post

  Keep the existing heroImage field unchanged.

  STEP 2 — Set heroImage and secondaryImage for each post

  Use these exact Supabase URLs (the bucket name has a space which is URL-encoded as %20):

  | slug                              | heroImage
                                                                                       |
  secondaryImage
                                                        |
  |-----------------------------------|-----------------------------------------------------
  -------------------------------------------------------------------------------------|----
  ------------------------------------------------------------------------------------------
  ---------------------------------------------------|
  | best-things-to-do-in-taupo        | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-thingstodo-hero.jpg                               |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-thi
  ngstodo-alternative.jpg                               |
  | best-restaurants-cafes-taupo      | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-restaurant-hero.jpg                               |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-res
  taurants-alternative.jpg                              |
  | taupo-winter-festival-guide       | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-winterfest-hero.jpg                               |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-win
  terfest-alternative.jpg                               |
  | taupo-summer-concert-guide        | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-summerconcert-hero.jpg                            |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-sum
  merconcert-alternative.jpg                            |
  | ironman-new-zealand-race-hq       | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-ironman-hero.jpg                                  |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-iro
  nman-alternative.jpg                                  |
  | itm-taupo-super-440-fan-guide     | https://hxprmevheigajzqehjgf.supabase.co/storage/v1/
  object/public/Website%20Media/blog-supercars-hero.jpg                                |
  https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-sup
  ercars-alternative.jpg                                |

  Update the heroImageAlt field on each post to be specific to the hero image:
  - best-things-to-do-in-taupo: "Sunrise over Lake Taupō with mountains in the distance"
  - best-restaurants-cafes-taupo: "A refined plated dish at a Taupō restaurant table at
  twilight"
  - taupo-winter-festival-guide: "Misty Lake Taupō at dusk with warm winter light
  installations along the foreshore"
  - taupo-summer-concert-guide: "A grass amphitheatre at golden hour with soft stage lights
  and picnic blankets"
  - ironman-new-zealand-race-hq: "Lake Taupō at dawn with mist drifting across the still
  water — Ironman swim start"
  - itm-taupo-super-440-fan-guide: "An empty racetrack at golden-hour dawn with mist over
  the asphalt and pit garages glowing"

  STEP 3 — Render secondaryImage in the post body

  In src/app/pages/BlogPost.tsx (the individual post page), insert the secondary image
  between the intro paragraph and the first H2 heading of the markdown body. Style it the
  same width as the body text (max 720px), 16:9 aspect ratio, rounded-2xl, full margin top +
   bottom. If post.secondaryImage is undefined, do not render anything.

  Suggested implementation: pre-process the markdown so the secondary image is inserted
  after the first paragraph, OR render it as a separate <img> element above the markdown but
   after the title meta block. Either approach is fine — pick whichever is cleaner with your
   markdown renderer.

  STEP 4 — Use secondaryImage as the social card image where present

  In the SEO call for the post page, pass post.secondaryImage as the `image` prop if it
  exists, otherwise fall back to post.heroImage. Rationale: the alternative shots tend to be
   tighter compositions that crop better as 1200×630 OG cards than the wide hero shots.

  STEP 5 — Verify

  - Run npm run build before finishing and confirm no errors.
  - Show me the full git diff at the end of your response. Only src/app/lib/blog-posts.ts
  and src/app/pages/BlogPost.tsx should be modified.
  - Do NOT touch supabase/functions/, the dashboard, the email templates, or any unrelated
  page.

  ACCEPTANCE CRITERIA
  1. Each blog post on /blog/* renders the correct hero photo at the top
  2. Each post body shows the corresponding alternative photo partway through
  3. View source on a blog post shows the alternative photo URL in og:image when present
  4. /best-restaurants-cafes-taupo specifically uses blog-restaurant-hero.jpg (singular) and
   blog-restaurants-alternative.jpg (plural) — these filenames are intentionally
  inconsistent in our bucket