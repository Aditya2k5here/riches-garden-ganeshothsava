# Riches Garden Ganeshothsava

The website for the Riches Garden Ganeshothsava Committee — Ramamurthy Nagar,
Bengaluru. 2026 is the twenty-first year.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion. No database, no
backend, no authentication. Registration runs on Google Forms, which is a
deliberate choice: a residents' committee should not have to operate a server
to collect thirty children's names, and the form already feeds the sheet the
running order is decided in.

---

## Running it

```bash
npm install
npm run dev
```

Then <http://localhost:3000>.

| Command                  | What it does                                              |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Development server                                          |
| `npm run build`          | Production build                                            |
| `npm start`              | Serve the production build                                  |
| `npm run typecheck`      | TypeScript, no emit                                         |
| `npm run lint`           | ESLint                                                      |
| `npm run shots`          | Screenshots every section, desktop + mobile                 |
| `npm run audit:a11y`     | axe-core, heading order, landmarks, tap targets             |
| `npm run audit:contrast` | Measures contrast from rendered pixels                      |
| `npm run logo`           | Regenerates the logo variants from `References/`            |

The audit and screenshot scripts drive the Chrome already installed on the
machine — no browser download. Point them at a production build for real
numbers:

```bash
npm run build && npx next start -p 3100
SHOT_BASE=http://localhost:3100 npm run audit:a11y
```

---

## Changing the content

**Nothing about the festival is written inside a component.** Everything lives
in `content/`, and the design does not need to change when the content does.

| File                    | Holds                                                      |
| ----------------------- | ---------------------------------------------------------- |
| `content/site.ts`       | Year, edition, name, navigation, logo paths, hero artwork    |
| `content/welcome.ts`    | The opening statement and introduction                       |
| `content/journey.ts`    | The 21-year timeline                                         |
| `content/programme.ts`  | Day One / Day Two running order                              |
| `content/children.ts`   | Children's events, registration rules, final running order   |
| `content/committee.ts`  | Committee members, portfolios, volunteers                    |
| `content/donations.ts`  | Contribution amounts and what they pay for                   |
| `content/contact.ts`    | Address and committee contacts                               |

### Rolling over to next year

In `content/site.ts`:

```ts
year: 2027,
edition: "22nd",
editionOrdinal: 22,
```

Then add a chapter to `content/journey.ts`, move `current: true` onto it, and
replace the programme. That is the whole job.

### Publishing the 2026 programme

`content/programme.ts` currently has real event names but no times, so both
days carry `pending: true` and the section says the programme is being
finalised. To publish:

1. Fill in `date` for each day.
2. Replace each `time: null` with a string, e.g. `"6:30 PM"`.
3. Delete `pending: true`.

Please also check the **day allocation** — which events fall on Day One versus
Day Two was assumed, not supplied, and is flagged in the file.

### Publishing the children's running order

`/programme/children` is a standalone, shareable page — the link that goes into
the WhatsApp group once registrations close. It renders exactly the list in
`childrensSchedule` (`content/children.ts`) and computes nothing:

```ts
export const childrensSchedule: ChildrenPerformance[] = [
  { sequence: "01", name: "…", category: "Bharatanatyam", approxTime: "6:30 PM" },
  { sequence: "02", name: "…", category: "Group Dance", approxTime: "6:35 PM", group: true },
];
```

The order is the committee's decision, made in the sheet. While the array is
empty the page shows an honest "not published yet" state. Every timing is
labelled **approximate**, because on the day it always is.

The page is excluded from search engines in `app/robots.ts` — it carries
children's names, and the committee shares the link directly rather than
having it indexed.

### Photographs

Drop files into `public/images/` and add an `image` to the relevant content
entry:

```ts
{ year: 2025, label: "The twentieth year",
  image: { src: "/images/journey/2025.jpg", alt: "…", width: 1600, height: 1200 } }
```

Until a photograph exists, `Figure` renders an ornamental plate instead — a
framed panel with the mandala. That is a deliberate choice, not a placeholder:
the site should not be padded out with stock or AI-generated photographs of
other people's celebrations, and an empty grey box would look broken. The
committee section behaves the same way — with no portraits it renders a
typographic roster, and the moment any member has an `image` it becomes a
portrait grid.

---

## Environment

Copy `.env.example` to `.env.local`, and set the same keys in the host.
Everything is `NEXT_PUBLIC_*` and therefore public by definition — **never put
a secret, key or password in any of them.**

| Variable                            | Effect when unset                                     |
| ----------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | Metadata and sitemap fall back to localhost            |
| `NEXT_PUBLIC_REGISTRATION_FORM_URL` | Register button becomes "Registration opens soon"      |
| `NEXT_PUBLIC_UPI_ID`                | Payment panel says to speak to a committee member      |
| `NEXT_PUBLIC_UPI_PAYEE`             | Defaults to the committee's name                       |

Drop the payment QR at `public/donate/upi-qr.png` and the donations panel
picks it up automatically; without it the panel shows a "QR code to be added"
frame rather than a broken image.

---

## Brand assets

`References/Committee logo.png` is the supplied mark. It arrived on a solid
white background, which would show as a white box on the cream and maroon
surfaces, so `npm run logo` produces four web variants:

- `riches-garden-logo.png` — white knocked out to transparency, artwork untouched
- `riches-garden-logo-reversed.png` — the same shapes tinted cream, for maroon surfaces
- `riches-garden-emblem.png` / `-reversed.png` — the circular device alone, for the
  navigation bar and favicon, where the full lockup's wordmark would be
  illegible

Only the background removal and a single-colour tint are applied; the artwork
itself is never redrawn.

---

## Notes on how it is built

**Design tokens.** Every colour, type step and spacing value is a CSS custom
property in `app/globals.css`. Change a token and the whole site follows.
Nothing hard-codes a colour.

**The opening is CSS, not JavaScript.** The loading animation and the hero
reveal are keyframes on one shared clock (`--loader-hold`). If the hero waited
for React to hydrate, the largest text on the page could not paint until the
bundle had downloaded and run — that measured a 6.4 s LCP on a throttled
phone. As CSS it plays off the server-rendered HTML, identically on a fast
laptop and a slow Android, and it still works with scripting disabled.

**Motion.** One easing curve, defined once in `lib/motion.ts`. Scroll reveals
fire once and are then left alone. `prefers-reduced-motion` is honoured twice
over: a CSS media query for transitions, and `MotionConfig reducedMotion="user"`
for the JavaScript-driven ones.

**Two layouts, not one squeezed.** The journey is a horizontal timeline driven
by vertical scroll on desktop, and a vertical chronology on phones — the same
data, laid out for the gesture that suits each.

**Without JavaScript** the page still reads: a `noscript` stylesheet in the
root layout releases every scroll-reveal from its hidden starting state and
removes the loading overlay.

**Security.** Headers are set in `next.config.ts` — CSP, HSTS, frame denial,
nosniff, a restrictive permissions policy. Fonts are self-hosted by
`next/font`, so no request leaves for a font CDN, and there are no
third-party scripts at all. The one compromise is `'unsafe-inline'` in
`script-src`: Next injects an inline bootstrap, and a nonce would force every
page to render dynamically and give up static CDN delivery. With no user
input anywhere in the app and no `dangerouslySetInnerHTML`, that trade is
worth it — **but if a form, comment field or third-party embed is ever added,
move to a nonce in middleware at the same time.**

**Fonts** are subsetted where it pays. The committee's Kannada name is the only
Kannada on the site — about thirty characters — and the full Noto Sans Kannada
face is 89 kB plus a 28 kB Latin slice. `scripts/subset-kannada.py` cuts it to
9 kB. Re-run it if that string changes:

```bash
python scripts/subset-kannada.py
```

The subset keeps every Kannada combining mark, not just the characters in the
string: the shaper decomposes vowel signs before applying substitutions, and
subsetting on the literal text alone silently breaks the conjunct clusters.

---

## Measured

Production build, Chrome, throttled "Slow 4G / 4× CPU" mobile profile:

- **420 kB** total transfer → **386 kB** after font trimming
- **LCP** under 1.6 s · **CLS** 0
- axe-core: no violations on either page, at both widths
- All text measured from rendered pixels clears WCAG AA contrast

---

## Deploying

Vercel, zero configuration. Set the environment variables above, point the
domain, done. `next build` output is fully static.
