import * as React from "react";

/**
 * The One Eleven letterbox.
 *
 * Drawn from the real box at the end of the drive: a slim monolith with a
 * mono-pitch top echoing the house's roofline, the 111 in the upper third, and
 * a mail slot below it.
 *
 * Two deliberate departures from a literal trace:
 *   · The slot is horizontal. On the real box the recess is vertical, but a
 *     single vertical bar reads as a stray mark at logo size, and three read as
 *     a second "111". A horizontal slot is what makes the silhouette legible as
 *     a letterbox rather than a plaque — tested down to 22px.
 *   · The numerals are redrawn rather than traced, so they hold their counters
 *     when the mark is small.
 *
 * The body takes `currentColor`, so it inherits whatever colour its context
 * sets and needs no per-theme asset. The cutouts are the surface colour, which
 * defaults to the brand ivory and is overridable for dark grounds.
 */
export interface LetterboxMarkProps extends React.SVGProps<SVGSVGElement> {
  /** Rendered height in px. Width follows the aspect ratio. */
  size?: number;
  /** Colour of the 111 and the slot — i.e. whatever sits behind the mark. */
  cutout?: string;
  /** Omit to render decoratively (aria-hidden). */
  title?: string;
}

export function LetterboxMark({
  size = 64,
  cutout = "#F4F1EA",
  title,
  ...props
}: LetterboxMarkProps) {
  const width = Math.round((size * 140) / 250);

  return (
    <svg
      viewBox="0 0 140 250"
      width={width}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {/* Body — mono-pitch top, tall on the left */}
      <path fill="currentColor" d="M32 36 L108 60 L108 216 L32 216 Z" />
      <g fill={cutout}>
        {/* 111, level baseline, each numeral a stem with an angled flag */}
        <path d="M49 94 h7 v42 h-7 Z" />
        <path d="M49 94 L42.5 100 L49 105 Z" />
        <path d="M67 94 h7 v42 h-7 Z" />
        <path d="M67 94 L60.5 100 L67 105 Z" />
        <path d="M85 94 h7 v42 h-7 Z" />
        <path d="M85 94 L78.5 100 L85 105 Z" />
        {/* Mail slot */}
        <rect x="49" y="162" width="43" height="7" rx="3.5" />
      </g>
    </svg>
  );
}

/**
 * Circular lockup: the letterbox over the wordmark, for avatars and anywhere
 * the brand needs to sit in a single round container (Airbnb, Google, social).
 *
 * Replaces the previous roundel, whose mark was an abstract tapered shape
 * rather than the letterbox itself.
 */
export interface LetterboxRoundelProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  /** Disc colour. Defaults to the brand green; pass charcoal for Japandi. */
  ground?: string;
  /** Ink colour for the mark and type. */
  ink?: string;
  title?: string;
}

export function LetterboxRoundel({
  size = 256,
  ground = "#203F3A",
  ink = "#F4F1EA",
  title = "One Eleven on the Mile",
  ...props
}: LetterboxRoundelProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      focusable="false"
      {...props}
    >
      <title>{title}</title>
      <circle cx="256" cy="256" r="256" fill={ground} />
      {/* Letterbox, scaled and centred in the upper half */}
      <g transform="translate(186 74) scale(0.5)" color={ink}>
        <path fill="currentColor" d="M32 36 L108 60 L108 216 L32 216 Z" />
        <g fill={ground}>
          <path d="M49 94 h7 v42 h-7 Z" />
          <path d="M49 94 L42.5 100 L49 105 Z" />
          <path d="M67 94 h7 v42 h-7 Z" />
          <path d="M67 94 L60.5 100 L67 105 Z" />
          <path d="M85 94 h7 v42 h-7 Z" />
          <path d="M85 94 L78.5 100 L85 105 Z" />
          <rect x="49" y="162" width="43" height="7" rx="3.5" />
        </g>
      </g>
      <g fill={ink} textAnchor="middle" fontFamily="var(--brand-font-display), Georgia, serif">
        <text x="256" y="296" fontSize="92" fontWeight="700" letterSpacing="-1">one</text>
        <text x="256" y="378" fontSize="92" fontWeight="700" letterSpacing="-1">eleven</text>
      </g>
      <text
        x="256"
        y="430"
        fill={ink}
        textAnchor="middle"
        fontFamily="var(--brand-font-body), Helvetica, Arial, sans-serif"
        fontSize="38"
        letterSpacing="0.5"
      >
        on the mile
      </text>
    </svg>
  );
}
