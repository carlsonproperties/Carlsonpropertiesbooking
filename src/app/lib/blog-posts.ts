export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  secondaryImage?: string;
  category: 'Events' | 'Local Guide' | 'Food & Drink';
  tags: string[];
  publishDate: string; // ISO format YYYY-MM-DD
  readingTime: number; // in minutes
  bodyMarkdown: string;
  ctaLabel: string;
  ctaUrl: string;
  metaTitle: string;
  metaDescription: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'supercars-taupo-fan-guide-2026',
    title: 'ITM Taupō Super 440 (April 10–12): Your Ultimate Fan Guide',
    excerpt: 'For one weekend each year, Taupō trades alpine quiet for V8 thunder. Your complete guide to the ITM Taupō Super 440 at Taupō International Motorsport Park.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-supercars-hero.jpg',
    heroImageAlt: 'An empty racetrack at golden-hour dawn with mist over the asphalt and pit garages glowing',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-supercars-alternative.jpg',
    category: 'Events',
    tags: ['Supercars', 'Motorsport', 'April Events', 'Taupō Events'],
    publishDate: '2027-04-03',
    readingTime: 5,
    bodyMarkdown: `
For one weekend each year, Taupō trades alpine quiet for V8 thunder. The ITM Taupō Super 440 brings the Supercars Championship to Taupō International Motorsport Park for three days of racing that have quickly become one of the most anticipated events on the New Zealand motorsport calendar. Whether it's your first race or your fifteenth, this guide covers what to expect, what to pack, and how to make a proper weekend of it.

## What's on the schedule

The Super 440 format gives you serious value across three days:

- **Friday** — Practice and qualifying. The cheapest day to attend and the best for getting close to the cars in the pit walk.
- **Saturday** — Two 120 km sprint races. Fast, decisive, and where championship pressure shows.
- **Sunday** — The 200 km main event. This is the day champions are made and the crowd peaks.

Support categories typically include the Toyota 86 Championship and Porsche Carrera Cup — close racing in their own right, and well worth getting to your seat early for.

For the latest schedule and ticket prices, check the official Supercars site closer to race weekend.

👉 [supercars.com](https://www.supercars.com/)

## Fan tips from a local

Get there early. Traffic into the circuit thickens fast — leave your accommodation by 9am for a 10am session and you will thank yourself.

**Pack the basics:**
- Sunblock and a hat — Taupō autumn sun is sharper than it looks
- Ear protection (especially for kids — V8s in person are louder than TV)
- A light rain jacket — the weather can turn quickly this time of year
- A refillable water bottle — stations are available

Use the General Admission hill if you do not have a grandstand seat — there is a lot of free movement around the track, and some of the best overtaking views are not from the main stand.

Ride-share or shuttle home Saturday night if you are heading into town for dinner. Drink-driving is patrolled hard during race weekend.

## What else to do during race weekend

If you are travelling with non-fans (or the family wants a break from the noise), Taupō has plenty to fill the gaps between sessions:

- Hot pools at Wairakei Terraces for a quiet recovery soak
- Huka Falls — 15 minutes from the track, free to visit, takes 30 minutes
- The Taupō Farmers' Market on Saturday morning at Tongariro Domain

For a full list of recommendations, see our [Top 6 Things to Do in Taupō](/blog/best-things-to-do-in-taupo).

## Where to stay

Forget battling traffic before and after each session. One Eleven on the Mile is minutes from Taupō International Motorsport Park, with everything you need to recover between race days:

- Heated pool, year-round — perfect after a long day in the sun
- Private spa pool — ideal for two glasses of red and the Sunday-night race recap
- Five bedrooms — sleeps up to ten, so you can split the rate across the whole crew
- Chef's kitchen + BBQ — cook in or eat out, your call
- Sound-dampened bedrooms — proper sleep before Sunday's main event

Race weekend books out fast. If you are planning ahead, lock your accommodation in early — Supercars weekend is one of the busiest of the Taupō calendar.
    `,
    ctaLabel: 'Check Availability for Supercars Weekend',
    ctaUrl: '/book',
    metaTitle: 'ITM Taupō Super 440 2027 Guide & Accommodation | Carlson Properties',
    metaDescription: 'Schedule, fan tips and the best place to stay for the ITM Taupō Super 440. Your complete guide to Supercars at Taupō International Motorsport Park.'
  },
  {
    slug: 'ironman-new-zealand-taupo-2026',
    title: 'Ironman New Zealand: Why One Eleven on the Mile Is Your Ultimate Race HQ (March 7)',
    excerpt: 'Few events transform a town the way Ironman New Zealand transforms Taupō. Your complete guide to race day, recovery, and the ideal Taupō accommodation for athletes and support crews.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-ironman-hero.jpg',
    heroImageAlt: 'Lake Taupō at dawn with mist drifting across the still water — Ironman swim start',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-ironman-alternative.jpg',
    category: 'Events',
    tags: ['Ironman', 'Triathlon', 'March Events', 'Athlete Accommodation'],
    publishDate: '2027-02-28',
    readingTime: 6,
    bodyMarkdown: `
Few events transform a town the way Ironman New Zealand transforms Taupō. For one electric weekend in early March, the lakeside town becomes the focal point of the country's endurance racing calendar — 1,500+ athletes from 40+ nations swimming, biking, and running their way through one of the most beautiful courses on the global Ironman circuit. Whether you are racing, supporting, or just here to watch, this is your guide.

## Race-day breakdown

**The Swim — 7:15 am, Lake Taupō**

The day kicks off with a 3.8 km mass swim start in the crystal-clear waters of the lake. The water temperature in March hovers around 18–19°C — wetsuit-legal in all but the warmest years. Spectators line the foreshore from 6:30 am; bring a coffee, layers, and a clear view from the lake terrace.

**The Bike — 180 km loop**

The bike course sweeps north out of Taupō through rolling farmland, past Reid Farm, and back through Broadlands. It is not the flattest Ironman course in the world, but the views — Mt Tauhara, the lake, and on a clear day Mts Ruapehu and Tongariro — make up for the climbing. Cut-off is 5:30 pm.

**The Run — 42.2 km along the lakefront**

The marathon weaves along the Taupō lakefront path with three loops past the spectator zone — perfect for catching your athlete multiple times. The crowd energy along the foreshore is the X-factor that gets athletes through the inevitable hurt-locker around km 30.

For full schedule and registration: 👉 [ironman.com/im-new-zealand](https://www.ironman.com/im-new-zealand)

## For athletes — the recovery angle

The race itself is what people train for. The 24 hours either side of it is where preparation either holds up or falls apart.

**The night before** — quiet, calm, and a 9 pm bedtime. Avoid hotels with thin walls or noisy neighbours. Most pros arrive by Wednesday so they are properly adjusted to the bedroom by race morning.

**Race-morning fuel** — keep it boring, keep it tested. A chef's kitchen lets you prepare your own breakfast on your own schedule rather than queuing at a hotel buffet.

**Race-night recovery** — protein within 30 minutes, salt and electrolytes within an hour, and stop trying to "celebrate" with a full restaurant outing. A heated spa for the legs and a real bed beats a pub dinner every time.

## For support crews

Ironman is a family event. The athletes get the medal; the support crew gets the photos and the war stories. Practical tips:

- Parking is hectic near transition — plan to walk 10–15 minutes if you want a guaranteed spot
- Cheer points — Tongariro Domain (T1 finish), the run loops at the lakefront, and the finish chute on Lake Terrace
- Carry warm layers — the early-morning wait is colder than you would expect
- Pre-position drinks and snacks for the long bike leg — your athlete is gone for ~5 hours

## Where to stay

For both athletes and supporters, the right accommodation is part of race strategy. One Eleven on the Mile delivers what an Ironman weekend actually needs:

- Quiet location for proper sleep — five bedrooms, sound-dampened, blackout curtains
- Year-round heated pool + spa for legs that have just done a marathon
- Chef's kitchen for race-day meal prep on your terms
- Sleeps up to 10 — perfect for the athlete plus extended support crew
- Quick access to transition zones at Tongariro Domain
- Private gym for the morning shake-out routine before race day

The food side of race weekend matters too. Our [Best Restaurants & Cafés in Taupō](/blog/best-restaurants-cafes-taupo) post covers where to eat for pre-race carb-loading and post-race burger therapy.

Ironman weekend is the single busiest weekend on the Taupō accommodation calendar. Athletes book a year in advance for a reason — book early or miss out.
    `,
    ctaLabel: 'Reserve Your Stay for Ironman',
    ctaUrl: '/book',
    metaTitle: 'Ironman NZ 2027 Accommodation & Race Guide | One Eleven Taupō',
    metaDescription: 'Race-day breakdown, recovery essentials, and the ideal Taupō accommodation for Ironman New Zealand athletes and support crews.'
  },
  {
    slug: 'taupo-summer-concert-guide-2026',
    title: 'Taupō Summer Concert: Your Day-of Survival Guide',
    excerpt: 'Each January Taupō hosts one of New Zealand\'s biggest outdoor music festivals. Your guide to the day, plus the best place to stay nearby.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-summerconcert-hero.jpg',
    heroImageAlt: 'A grass amphitheatre at golden hour with soft stage lights and picnic blankets',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-summerconcert-alternative.jpg',
    category: 'Events',
    tags: ['Summer Concert', 'Music', 'January Events', 'Festival'],
    publishDate: '2027-01-17',
    readingTime: 5,
    bodyMarkdown: `
Each January, Taupō transforms into a live-music mecca as international rock legends descend on the town for one of New Zealand's longest-running outdoor concerts. With 20,000+ fans, picnic blankets stretching across the grass, and golden-hour sunsets behind the stage, the Taupō Summer Concert is a Kiwi summer institution. Here is how to do it right.

## What to expect

The Summer Concert is an all-day, single-stage festival running from early afternoon into the evening. Lineups have historically featured huge international rock and pop headliners — past concerts have brought acts like Eagles, Fleetwood Mac, Rod Stewart, REO Speedwagon, and Kings of Leon to a small Kiwi town for one extraordinary day.

For the current year's lineup and ticket prices: 👉 [greenstoneentertainment.co.nz](https://greenstoneentertainment.co.nz/)

## Your festival checklist

**Bring:**
- A blanket or low-back chair (high-back chairs are usually banned — check the venue rules)
- Sunscreen — generous reapplication every 90 minutes. The Taupō sun in January is no joke.
- A wide-brim hat
- A reusable water bottle (free refill stations on site)
- Cash for food vendors — most accept card but the queues at card-only stands are longer
- A light layer for after sunset

**Do not bring:**
- Glass anything (will be confiscated at the gate)
- Outside alcohol (licensed bars on site)
- Pets
- Drones

## Getting there and getting home

Park-and-walk from town is usually the fastest option — Taupō shuts down arterials around the venue late afternoon. Many guests walk in from accommodation within a 1–2 km radius. After the show, do not drive — police breath-test heavily on concert nights. Pre-book a taxi or use the festival shuttles.

## Make a weekend of it

A summer concert is a great anchor for a longer Taupō trip. Add:

- Lake swims — Acacia Bay and Reid Farm are local favourites
- Hot water beach at Otumuheke Stream
- Huka Prawn Park for kids
- Hot pool soaks at AC Baths or DeBretts

For more recommendations, see our [Top 6 Things to Do in Taupō](/blog/best-things-to-do-in-taupo).

## Where to stay

Concert weekend turns Taupō hotels into chaos — lobbies overflow, staff are rushed, and rooms book out months ahead. One Eleven on the Mile offers a different experience:

- Walking distance from the venue and town nightlife
- Far enough from the main strip for a peaceful sleep when the party winds down
- Heated pool, year-round — perfect for the morning after
- BBQ + outdoor dining — relive the day's setlist with a glass of red under the stars
- Five bedrooms — split the rate across friends and make it a proper getaway

Summer Concert weekend is one of the earliest-booking weekends of the Taupō calendar. If you want a luxury home for your group, lock it in.
    `,
    ctaLabel: 'Book Your Summer Concert Escape',
    ctaUrl: '/book',
    metaTitle: 'Taupō Summer Concert Accommodation | Where to Stay & What to Bring',
    metaDescription: 'Each January Taupō hosts one of New Zealand\'s biggest outdoor music festivals. Your guide to the day, plus the best place to stay nearby.'
  },
  {
    slug: 'taupo-winter-festival-guide-2026',
    title: 'Experience the Magic: Your Guide to the Taupō Winter Festival (July 3–19)',
    excerpt: 'While the rest of New Zealand hibernates through July, Taupō does the opposite. Three weeks of art, food, and family fun in Taupō during winter.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-winterfest-hero.jpg',
    heroImageAlt: 'Misty Lake Taupō at dusk with warm winter light installations along the foreshore',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-winterfest-alternative.jpg',
    category: 'Events',
    tags: ['Winter Festival', 'July Events', 'Family Activities', 'School Holidays'],
    publishDate: '2026-06-26',
    readingTime: 6,
    bodyMarkdown: `
While the rest of New Zealand hibernates through July, Taupō does the opposite — the town stages a three-week Winter Festival that lights up the cold months with art, music, food, and family events. Timed to align with the school holidays, it has become one of the best winter weekends in the North Island. Here is how to make the most of it.

## What's on

The Festival is a programme rather than a single event — different things happening across town for almost three weeks. Recent festivals have featured:

- **Light Up Taupō** — the lakefront and Tongariro Domain lit with art installations after dark
- **Winter Festival Family Fun Zone** — Tongariro Domain hosts inflatables, bumper balls, carnival games, and kids' entertainment, usually presented by local sponsors
- **Tongariro Domain Markets** — winter food vendors, hot mulled wine, and live music on weekends
- **Special chef's-table dinners** at top Taupō restaurants — fixed-menu winter-warming long-table experiences
- **Free cultural events** — kapa haka performances, art trails through Taupō galleries, and ticketed evening shows in Great Lake Centre

For the current year's full programme: 👉 [winterfestivaltaupo.co.nz](https://winterfestivaltaupo.co.nz/)

## Top picks by visitor type

**For families with kids:**
- The Fun Zone in Tongariro Domain
- Light Up Taupō (best with hot chocolate from a market stall)
- Day trip to Whakapapa for snow play (1.5 hr drive)

**For couples:**
- Long-table chef's dinner at one of the local restaurants
- Sunset spa soak at Wairakei Terraces
- Live music nights at Lakehouse or Vine Eatery

**For groups:**
- Booking out a private room at Plateau or Lionels for a Winter Festival dinner
- Late-night drinks at one of the lakeside bars
- A cold-plunge-and-spa session at One Eleven (heated pool open year-round)

## What to wear

Taupō winter is genuinely cold (overnight lows around 0°C) but rarely snows in town. Pack:

- A proper warm jacket (puffer or wool coat, not just a windbreaker)
- Layers — afternoons can hit 14°C, evenings drop to 4°C
- Closed shoes — the lakefront path can get frosty
- Beanie and gloves for the evening light displays
- Togs and a robe for spa visits

## Eating during the Festival

Many of Taupō's best restaurants run special winter menus during the Festival weeks. Book ahead — these are often the busiest weeks of the year for the dining room. See our [Best Restaurants & Cafés in Taupō](/blog/best-restaurants-cafes-taupo) post for our local picks.

## Where to stay

Winter by the lake is genuinely magical — but only if you have somewhere warm to come home to. One Eleven on the Mile is built for winter:

- Heated pool, year-round — yes, even in July at 6°C outside
- Heat pump + underfloor heating — wake up to a warm house
- Spa pool — soak under the stars while the storms roll across the lake
- Chef's kitchen for slow-cooked winter dinners
- Sleeps 10 — split the rate, share the warmth, fill the place with family

The Winter Festival overlaps with school holidays, so accommodation goes fast. Book before mid-June to lock in the best weekend.
    `,
    ctaLabel: 'Plan Your Winter Festival Getaway',
    ctaUrl: '/book',
    metaTitle: 'Taupō Winter Festival 2026 Guide & Accommodation | One Eleven on the Mile',
    metaDescription: 'Three weeks of art, food, and family fun in Taupō during winter. Your local guide to the best of the Winter Festival, plus where to stay.'
  },
  {
    slug: 'best-things-to-do-in-taupo',
    title: 'Top 6 Unmissable Things to Do in Taupō (Locals\' Guide)',
    excerpt: 'From hot-water streams to alpine crossings and indoor golf simulators, here are the six Taupō activities your hosts at One Eleven recommend year-round.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-thingstodo-hero.jpg',
    heroImageAlt: 'Sunrise over Lake Taupō with mountains in the distance',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-thingstodo-alternative.jpg',
    category: 'Local Guide',
    tags: ['Things to Do', 'Activities', 'Taupō Guide', 'Local Tips'],
    publishDate: '2026-05-14',
    readingTime: 6,
    bodyMarkdown: `
Taupō is one of those towns where you can barely scratch the surface in a long weekend. We have hosted hundreds of guests at One Eleven on the Mile and these six experiences are the ones that come up again and again in our reviews. Whether the weather is on your side or not, there is something here for every visitor.

## 1. 12th Tee Golf Simulator

Indoor golf, year-round, rain or shine. The 12th Tee runs high-end TrackMan simulators where you can play 200+ world courses including Pebble Beach and St Andrews. Perfect for an afternoon when the Taupō weather turns, or as a competitive group activity for stag-dos and family weekends. Book ahead — bays fill fast on weekends and rainy days.

👉 [12thteegolf.com](https://www.12thteegolf.com/)

## 2. Taupō Hole in One Golf

A genuine Taupō icon — float a golf ball off the platform on Lake Taupō and try to land it on the floating pontoon for a $10,000 hole-in-one prize. Cheap, casual, and great fun for kids and adults alike. Pair it with a coffee on the lakefront afterwards.

👉 [holein1.co.nz](https://www.holein1.co.nz/)

## 3. The Squeeze – Hot Water Stream

A short jet boat ride from Reids Farm boat ramp followed by a 20-minute walk through native bush takes you to a natural geothermal hot stream you can soak in. Bring togs, water shoes, and a towel. Best in the morning before the tour groups arrive. This is one of the most photographed and least known spots in Taupō.

👉 [Read the full guide](https://www.lauratheexplorer.co.nz/blog/how-to-find-the-squeeze-waikato-river)

## 4. Flat Rocks Walk (Rangatira Point Track)

A 20-minute lakefront track ending at smooth volcanic rock platforms — locals jump straight off the rocks into Lake Taupō in summer. Free, kid-friendly, and one of the best low-effort views in the area. Bring jandals and a towel from December through March.

👉 [lovetaupo.com – Rangatira Point Track](https://www.lovetaupo.com/en/scenic-attractions/rangatira-point-track/)

## 5. Tongariro Alpine Crossing

Regularly ranked one of the world's best one-day hikes — 19.4km across volcanic terrain, emerald lakes, and the slopes of Mt Ngauruhoe. Allow 6–8 hours, book a shuttle (you cannot park at the start and finish), and pack layers even in summer. Not for unfit walkers — but if you have got one good day in your trip, this is the one.

👉 [lovetaupo.com – Tongariro Alpine Crossing](https://www.lovetaupo.com/en/scenic-attractions/tongariro-alpine-crossing/)

## 6. Running Events: Pillar to Pou & Taupō Marathon

Taupō has become a running hub. The Pillar to Pou trail run is the local cult favourite — a course that links lakeside trails and bush tracks. The Taupō Marathon is the bigger, road-based event held every August around Lake Taupō. Both have shorter distance options for casual runners.

👉 [pillartopou.com](https://www.pillartopou.com/) · [taupomarathon.co.nz](https://www.taupomarathon.co.nz/)

## Ready for Your Taupō Adventure?

Whether you are here for adventure or recovery, One Eleven on the Mile is the perfect base — minutes from the lake, with a heated pool, sauna and gym for tired muscles after a big day.
    `,
    ctaLabel: 'Check Availability at One Eleven on the Mile',
    ctaUrl: '/book',
    metaTitle: 'Top 6 Things to Do in Taupō - Locals\' Guide | One Eleven on the Mile',
    metaDescription: 'From hot-water streams to alpine crossings and indoor golf simulators, here are the six Taupō activities your hosts at One Eleven recommend year-round.'
  },
  {
    slug: 'best-restaurants-cafes-taupo',
    title: 'Where Locals Eat in Taupō: 8 Restaurants & Cafés Worth Your Time',
    excerpt: 'Fine dining, lakefront bistros, and the best brunch spots — a Taupō local\'s guide to where to actually eat in town.',
    heroImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-restaurant-hero.jpg',
    heroImageAlt: 'A refined plated dish at a Taupō restaurant table at twilight',
    secondaryImage: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/blog-restaurants-alternative.jpg',
    category: 'Food & Drink',
    tags: ['Restaurants', 'Cafés', 'Dining Guide', 'Local Food'],
    publishDate: '2026-05-21',
    readingTime: 5,
    bodyMarkdown: `
Taupō's food scene has come a long way in the last five years. What used to be a "fish and chips by the lake" town now has serious fine-dining destinations, world-class cafés, and proper craft beer bars. Here is where we send our One Eleven guests when they ask "where should we eat tonight?"

## For a Special Night Out — Embra

Modern Kiwi cooking with French and British technique. Embra's tasting menus ($90 for three courses, $105 for five) showcase seasonal local produce — think Lake Taupō trout, Hawke's Bay lamb, and foraged native ingredients. Book at least two weeks ahead on weekends. The room is small, the wine list is excellent, and it's the closest Taupō has to a destination restaurant.

## Best All-Round Bistro — The Bistro

A Taupō institution that consistently lands a 9.5+ rating on every review platform. Modern Kiwi sharing plates with a great cocktail list — works equally well for a date night or a group dinner. Book ahead for Friday and Saturday.

## Lakefront Atmosphere — 2 Mile Bay Sailing Club

Taupō's only bar literally on the lake. Bar menu is limited (mostly pizzas) but the position is unbeatable — sun setting over the lake, kids playing on the beach, and a relaxed crowd. Licensed until 10pm. Best in summer.

👉 [2miletaupo.com](https://www.2miletaupo.com/)

## Modern Comfort Food — Plateau Bar & Eatery

Established 2004 and still locally owned. Plateau is the reliable mid-range pick — generous mains, great burgers, classic pub atmosphere with elevated execution. Good for groups and families. Sky Sport on the screens for race weekends.

👉 [plateautaupo.co.nz](https://plateautaupo.co.nz/)

## Newest Hilton Pick — Lionels

The newest restaurant in town and the reviews are speaking for themselves. Located inside the Hilton, Lionels does a refined a la carte lunch and dinner, plus a high tea ($45–$65) that has become a popular reason to dress up on a Sunday. Great atmosphere, exceptional plating.

👉 [lionels.co.nz](https://www.lionels.co.nz/)

## Healthy & Vegetarian-Friendly — The Cozy Corner

On Tamamutu Street. The go-to for vegan, vegetarian, and gluten-free guests, but the menu is broad enough that nobody feels they have drawn the short straw. Fresh, beautifully presented, generous portions. Lunch is the standout.

👉 [thecozycorner.co.nz](https://www.thecozycorner.co.nz/)

## Best Coffee & Brunch — Kefi at Wharewaka

Local favourite for breakfast and weekend brunch. Sits on Horomatangi Street next to the new Kokomea supermarket. Strong dairy-free, gluten-free, and vegan options. Excellent coffee. Get there before 10am on Saturdays or expect a queue.

## Cook at Home

Sometimes the best meal is the one you cook yourself. One Eleven on the Mile has a chef's kitchen with full appliances, six-seater dining table, and an outdoor BBQ. Pick up local produce from the Taupō Farmers' Market (Saturdays at the Tongariro Domain) and host your own dinner with the lake as the backdrop.
    `,
    ctaLabel: 'Check Availability at One Eleven on the Mile',
    ctaUrl: '/book',
    metaTitle: 'Best Restaurants & Cafés in Taupō - Local\'s Guide | One Eleven on the Mile',
    metaDescription: 'Fine dining, lakefront bistros, and the best brunch spots — a Taupō local\'s guide to where to actually eat in town.'
  }
];
