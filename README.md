# Riches Garden Ganeshothsava

The website for the Riches Garden Ganeshothsava Committee — Ramamurthy Nagar,
Bengaluru. 2026 is the twenty-first year: **18 · 19 · 20 September 2026**.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion. No database, no
backend, no accounts, no API routes. Registration runs on Google Forms, which
is deliberate: a residents' committee should not have to operate a server to
collect thirty names, and the form already feeds the sheet the running order
is decided in.

**Going live:** [docs/launch.md](docs/launch.md)
**Building the registration form:** [docs/registration-form.md](docs/registration-form.md)

---

## Running it

```bash
npm install
npm run dev
```

Then <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run qa` | Links, anchors, assets, routes, dates, console errors |
| `npm run audit:responsive` | Overflow, tap targets and QR size at 7 widths |
| `npm run audit:a11y` | axe-core, heading order, landmarks |
| `npm run audit:contrast` | Contrast measured from rendered pixels |
| `npm run audit:perf` | Transfer weight and Core Web Vitals |
| `npm run shots` | Screenshots of every section, desktop + mobile |
| `npm run images` | Re-crops the journey photographs |
| `npm run logo` | Regenerates the logo variants |
| `npm run kannada` | Re-subsets the Kannada fonts |
| `npm run backup` | Writes a restorable backup into `backups/` |

The audit scripts drive the Chrome already on the machine — no browser
download. Point them at a production build for real numbers:

```bash
npm run build && npx next start -p 3100
SHOT_BASE=http://localhost:3100 npm run qa
```

---

## Changing the content

**Nothing about the festival is written inside a component.** It all lives in
`content/`, and the design does not change when the content does.

| File | Holds |
| --- | --- |
| `content/site.ts` | Year, edition, dates, navigation, logo paths |
| `content/journey.ts` | The years and their photographs |
| `content/programme.ts` | The three-day running order |
| `content/stage.ts` | Categories, rules, registration, final running order |
| `content/committee.ts` | Members and portfolios |
| `content/contribute.ts` | UPI details |
| `content/contact.ts` | Address and committee contacts |
| `content/i18n.ts` | Every Kannada string on the site |

### Rolling over to next year

In `content/site.ts`: bump `year`, `edition`, `editionOrdinal` and `dates`.
Add last year's photograph to `content/journey.ts` and move `current: true`
onto the new year. Update `content/programme.ts` with the new dates. Done.

### Kannada

There is one site, not two, and no language toggle. Kannada appears in five
specific places — the committee's name, the opening statement, and one line
each in Contribute, Contact and the footer — and every one of those strings is
in `content/i18n.ts`.

The fonts are subsetted to exactly the characters in use: 33 of them, which
takes Noto Sans Kannada from 89 kB to 14 kB and Noto Serif Kannada from 119 kB
to 17 kB. **Run `npm run kannada` after editing any Kannada string**, or the
new characters will render as boxes.

That script keeps every Kannada combining mark, not just the characters in the
strings: the shaper decomposes vowel signs before applying substitutions, and
subsetting on the visible text alone silently breaks conjunct clusters — it
looks fine until you compare it against the original.

### Photographs

Journey photographs are cropped to one consistent 4:3 by `npm run images`.
Where automatic cropping picks the wrong subject, name the centre by hand:

```js
2020: { src: "References/2020.jpeg", focusX: 0.46 },
```

2020 needed this — the brightest thing in that frame is a lens flare, so the
attention crop centred on it and pushed the Ganesha off to the side.

Committee portraits go in `public/images/committee/` as squares, added to the
member's entry in `content/committee.ts`. Until one exists, the cell renders
an ornamental plate at the same 1:1 — a composed panel rather than a grey box,
so the grid looks finished whether one portrait exists or all twenty-one do.

### Publishing the stage running order

`/programme/children` is a standalone page — the link that goes into the
WhatsApp group once registrations close. It renders exactly the list in
`childrensSchedule` (`content/stage.ts`) and computes nothing. While the array
is empty it shows an honest "not published yet" state. Every timing is
labelled **approximate**, because on the day it always is. The page is
excluded from search indexing in `app/robots.ts` — it carries children's
names.

---

## Notes on how it is built

**Design tokens.** Every colour, type step and spacing value is a CSS custom
property in `app/globals.css`. Nothing hard-codes a colour.

**The opening is CSS, not JavaScript.** The Ganesha-and-football loader and
the hero reveal are keyframes on one shared clock (`--loader-hold`). If the
hero waited for React to hydrate, the largest text on the page could not paint
until the bundle had downloaded and run — that measured a 6.4 s LCP on a
throttled phone. As CSS it plays off the server-rendered HTML, identically on
a fast laptop and a slow Android, and it still works with scripting disabled.

**Figures.** Cormorant ships old-style figures by default — the 1 sits at
x-height, the 2 drops below the baseline. Right in running prose, wrong for a
year or a start time: "21 years" read as a typo and "9:00 am" as a footnote.
Headings and the `.figure-display` class use lining, tabular figures; body
prose keeps the old-style ones.

**No dashes as separators.** Sections are announced by a stacked index
numeral, not by a rule. The old eyebrow drew a short line before its label and
across six sections that line had become the most repeated element on the
page.

**Two layouts, not one squeezed.** The journey is a horizontal track driven by
vertical scroll on desktop and a vertical chronology on phones — same data,
laid out for the gesture that suits each.

**Missing content degrades to something composed.** No stock photography, no
grey boxes, no invented history. Nothing on this site claims a fact the
committee did not supply.

**Without JavaScript** the page still reads: a `noscript` stylesheet releases
every scroll-reveal from its hidden starting state and removes the loader.

---

## Measured

Production build, throttled "Slow 4G / 4× CPU" mobile profile:

- **506 kB** total transfer · **LCP 1.5 s** · **CLS 0**
- `npm run qa` — all checks pass
- `npm run audit:responsive` — clean at 320, 375, 393, 412, 768, 1280, 1440 px
- `npm run audit:a11y` — axe-core: zero violations, both pages, both widths
- `npm run audit:contrast` — all text clears WCAG AA, measured from pixels
- `npm audit` — 0 vulnerabilities
