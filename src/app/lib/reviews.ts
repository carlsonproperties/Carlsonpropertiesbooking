/**
 * Guest reviews — the single source for both the on-page review wall and the
 * schema.org Review markup in SEO.tsx.
 *
 * They share one list on purpose. Google's structured-data policy requires
 * review markup to reflect reviews that are actually visible on the page, and
 * the two had drifted: the markup carried three reviews that appeared nowhere
 * on the site (one of them attributed to "Guest") and a review count that
 * disagreed with the figure shown to visitors.
 *
 * Selection favours the terms someone actually searches — and that an AI
 * summarising Taupō accommodation will look for — spread so that no two cards
 * make the same point: group size and sleeping arrangements, the heated pool
 * in winter, sauna and spa, lake and mountain views, the distance to town,
 * families with young children, and the hosts by name.
 *
 * Each `text` is a verbatim contiguous span of the guest's review, trimmed
 * only at the ends so a card stays a readable height. Nothing is stitched
 * together or reworded. `date` is month precision (YYYY-MM), which is all the
 * source states and is valid ISO 8601 for schema.org.
 */

export interface GuestReview {
  id: string;
  author: string;
  rating: number;
  /** Verbatim excerpt, used identically on the page and in the markup. */
  text: string;
  /** ISO 8601, month precision. */
  date: string;
  /** Where the review was left — shown under the name. */
  source: "Airbnb" | "Google";
  /** Short keyword chip on the card. */
  highlight: string;
}

export const REVIEWS: GuestReview[] = [
  {
    id: "sam",
    author: "Sam",
    rating: 5,
    text: "Seven of us stayed for the weekend and honestly couldn't have asked for more. The house was immaculate and every amenity we could think of was already there. The view from the backyard is breathtaking, and the pool, sauna and spa area made it really hard to leave.",
    date: "2026-10",
    source: "Airbnb",
    highlight: "Seven guests, hard to leave",
  },
  {
    id: "krissy",
    author: "Krissy",
    rating: 5,
    text: "This place is absolute perfection. Immaculately clean, absolutely modern, gorgeous decor, every single appliance you can think of. The views are breathtaking, neighbourhood is quiet, town is a 5 minute drive away. Seriously if you are going to Taupo then stay here.",
    date: "2025-09",
    source: "Airbnb",
    highlight: "Five minutes to Taupō",
  },
  {
    id: "samantha",
    author: "Samantha",
    rating: 5,
    text: "Absolutely stunning place to stay. The view was breathtaking, and the pool was the perfect temperature, even for night swims on a cold evening. The spa was an added bonus and the perfect place to relax and unwind. The home was exceptionally clean, warm, and spacious, with a great layout for families.",
    date: "2026-06",
    source: "Airbnb",
    highlight: "Night swims in winter",
  },
  {
    id: "dave",
    author: "Dave",
    rating: 5,
    text: "My family needed a large comfortable home for a family reunion (10 of us). We were delighted with Matt and Ashleigh's home — it's comfortable, well-appointed, packed with classy touches, and very easy to settle into. Many of the family are retired, so it was great to find such a roomy home that could comfortably accommodate everybody, all on one level.",
    date: "2026-03",
    source: "Airbnb",
    highlight: "Family reunion for ten",
  },
  {
    id: "abby",
    author: "Abby",
    rating: 5,
    text: "This spot was beautiful, everything is so thought out with amenities. Everyone having their own bathrooms was such a luxury — the pool, sauna and spa were part of that luxury. This spot was perfect for our group of 9, we all felt so comfortable in this space.",
    date: "2026-08",
    source: "Airbnb",
    highlight: "Group of nine, own bathrooms",
  },
  {
    id: "kristen",
    author: "Kristen",
    rating: 5,
    text: "This was such a great place for our two families to meet and spend time together. We really enjoyed everything the house had to offer. Fantastic views to the lake and the mountains. We enjoyed the walk down to the tennis court which was a bonus. A very easy drive to Taupo township was excellent.",
    date: "2026-09",
    source: "Airbnb",
    highlight: "Lake and mountain views",
  },
  {
    id: "james",
    author: "James",
    rating: 5,
    text: "One of the best AirBnbs I've ever stayed at. Amazing house with a great view over the lake. The outdoor pool/sauna/spa area was awesome and great for the kids who spent hours in the heated pool! All the beds were very comfy and there was plenty of space in the house for a big group.",
    date: "2026-05",
    source: "Airbnb",
    highlight: "Kids in the heated pool",
  },
  {
    id: "shelly",
    author: "Shelly",
    rating: 5,
    text: "The house was remarkably clean and thoughtfully prepared, with everything we needed for a comfortable and enjoyable stay. The kitchen had all the utensils and cutlery we needed, making it easy for us to enjoy family cooking and even a BBQ dinner together. The heated pool was a highlight of our stay — our kids absolutely loved it.",
    date: "2026-03",
    source: "Airbnb",
    highlight: "Full kitchen and BBQ",
  },
  {
    id: "feeny",
    author: "Feeny",
    rating: 5,
    text: "100% would recommend. Enough rooms for each of us in the group. Each pretty much had our own bathroom which we all loved. Stunning views. The gym even got used from one of our girls. The heated pool, spa & sauna were definitely a highlight for us all especially during winter season.",
    date: "2025-07",
    source: "Airbnb",
    highlight: "Gym, pool, spa and sauna",
  },
  {
    id: "lesley",
    author: "Lesley",
    rating: 5,
    text: "Our family group of 8 stayed for 6 nights over the Christmas period and could not have been happier. The kitchen is extremely well equipped, the living areas are spacious and the view is wonderful. The indoor outdoor flow is beautifully designed and there was plenty of room for people to have their private time when they wanted to.",
    date: "2025-12",
    source: "Airbnb",
    highlight: "Six nights at Christmas",
  },
  {
    id: "nina",
    author: "Nina",
    rating: 5,
    text: "This home was absolutely breathtaking. It was the perfect place to celebrate my 40th birthday with my whānau. We loved our stay and wish we could've stayed longer. Had everything and more. Heated pool, sauna, spa, lake view, huge space for large group.",
    date: "2025-09",
    source: "Google",
    highlight: "A 40th with the whānau",
  },
  {
    id: "viv",
    author: "Viv",
    rating: 5,
    text: "Stunning views and a beautifully designed home that made the most of the site. The home is very luxurious and our group loved the indoor outdoor flow, the heated pool and all the modern conveniences. It was sited on a very quiet street — a great place to stay when visiting Taupo.",
    date: "2025-11",
    source: "Google",
    highlight: "Quiet street, indoor-outdoor",
  },
];

/**
 * Headline rating. The count is every review across Airbnb and Google, not
 * only the twelve quoted above — which is what AggregateRating is for.
 */
export const REVIEW_AGGREGATE = {
  ratingValue: "5.0",
  reviewCount: 56,
} as const;
