/**
 * Measures real contrast for text that axe reports as "incomplete" — anything
 * on a gradient or under the grain overlay, where the background colour
 * cannot be read from CSS at all.
 *
 * Method: scroll the page a viewport at a time. At each stop, screenshot the
 * viewport and, for every text element fully inside it, take the modal pixel
 * colour in its box as the background (text covers a minority of the box).
 *
 * Two things that are easy to get wrong and are handled here:
 *   • Tailwind v4 emits `oklab(... / a)`, so the computed colour is resolved
 *     to sRGB through a canvas rather than parsed with a regex.
 *   • Coordinates come from the viewport at each stop, not from a full-page
 *     screenshot — the sticky timeline makes full-page coordinates drift.
 *
 *   node scripts/contrast.mjs
 */
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3000";
const PAGES = ["/", "/programme/children"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const la = lum(a);
  const lb = lum(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (c) => `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

/** Runs in the page: text elements fully inside the viewport right now. */
const COLLECT = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  /** Resolve any CSS colour — oklab, color-mix, whatever — to sRGB + alpha. */
  const toRgba = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };

  // Anything painted over the page — the fixed navigation bar — hides the
  // real backdrop. Text under it must not be sampled, or the ring picks up
  // the bar's own background instead of the section behind the text.
  const occluders = [...document.querySelectorAll("body *")]
    .filter((e) => {
      const s = getComputedStyle(e);
      return s.position === "fixed" && s.visibility !== "hidden";
    })
    .map((e) => e.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);

  const PAD = 4;
  const occluded = (r) =>
    occluders.some(
      (o) =>
        o.left < r.right + PAD &&
        o.right > r.left - PAD &&
        o.top < r.bottom + PAD &&
        o.bottom > r.top - PAD,
    );

  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let n;

  while ((n = walk.nextNode())) {
    const text = n.textContent.trim();
    if (!text) continue;

    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    if (el.classList.contains("sr-only")) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;

    // A scroll-reveal that has not fired yet is transparent in the
    // screenshot but still reports its own opacity as 1 — the fade lives on
    // an ancestor. Walk up and skip anything not fully painted.
    let faded = false;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (Number(s.opacity) < 0.99) {
        faded = true;
        break;
      }
    }
    if (faded) continue;

    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    // Only measure what is fully painted in this screenshot.
    if (r.top < 0 || r.left < 0) continue;
    if (r.bottom > window.innerHeight || r.right > window.innerWidth) continue;
    if (occluded(r)) continue;

    seen.add(el);
    out.push({
      text: text.slice(0, 36),
      rgba: toRgba(cs.color),
      // An element painting its own opaque background (a button) is its own
      // backdrop — sampling around it would measure the page behind instead.
      ownBg: (() => {
        const [, , , a] = toRgba(cs.backgroundColor);
        return a > 0.95 ? toRgba(cs.backgroundColor).slice(0, 3) : null;
      })(),
      size: parseFloat(cs.fontSize),
      weight: Number(cs.fontWeight) || 400,
      box: {
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      },
    });
  }
  return out;
};

const browser = await chromium.launch({ executablePath: exe, headless: true });
const failures = [];

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: Boolean(vp.mobile),
      hasTouch: Boolean(vp.mobile),
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);

    // The site scrolls smoothly, which means a scrollTo is still in flight
    // when the measurement runs — the rects and the screenshot would then
    // describe different scroll offsets. Jump instantly instead.
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

    const measured = new Set();
    const height = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.round(vp.height * 0.85);

    for (let y = 0; y < height; y += step) {
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: "instant" }),
        y,
      );
      // Reveals need to finish before their text is on screen to sample.
      await page.waitForTimeout(950);

      // Sequential, not concurrent: the capture and the measurement have to
      // describe the same painted frame.
      const nodes = await page.evaluate(COLLECT);
      const shot = await page.screenshot();

      const { data, info } = await sharp(shot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      for (const node of nodes) {
        const key = `${node.text}|${node.size}`;
        if (measured.has(key)) continue;
        measured.add(key);

        const { x, y: by, w, h } = node.box;
        if (x + w > info.width || by + h > info.height) continue;

        // Sample a ring just outside the text box rather than the box
        // itself: at display sizes the glyphs cover most of their own box,
        // and the modal colour would come back as the text colour.
        const PAD = 4;
        const x0 = Math.max(0, x - PAD);
        const y0 = Math.max(0, by - PAD);
        const x1 = Math.min(info.width, x + w + PAD);
        const y1 = Math.min(info.height, by + h + PAD);

        const counts = new Map();
        for (let py = y0; py < y1; py++) {
          for (let px = x0; px < x1; px++) {
            const inside = px >= x && px < x + w && py >= by && py < by + h;
            if (inside) continue;
            const i = (py * info.width + px) * info.channels;
            const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
            counts.set(k, (counts.get(k) ?? 0) + 1);
          }
        }
        if (!counts.size) continue;

        let bestKey = 0;
        let bestN = -1;
        for (const [k, c] of counts) {
          if (c > bestN) {
            bestN = c;
            bestKey = k;
          }
        }
        const bg =
          node.ownBg ??
          [(bestKey >> 16) & 255, (bestKey >> 8) & 255, bestKey & 255];

        const [r, g, b, a] = node.rgba;
        const fg = [r, g, b].map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

        const value = ratio(fg, bg);
        const large =
          node.size >= 24 || (node.size >= 18.66 && node.weight >= 700);
        const need = large ? 3 : 4.5;

        if (value < need) {
          failures.push({
            where: `${vp.name} ${path}`,
            text: node.text,
            px: Math.round(node.size),
            need,
            got: Number(value.toFixed(2)),
            fg: hex(fg),
            bg: hex(bg),
          });
        }
      }
    }

    await ctx.close();
  }
}

await browser.close();

if (!failures.length) {
  console.log("All measured text clears its WCAG AA threshold.");
} else {
  failures.sort((a, b) => a.got - b.got);
  console.log(`${failures.length} below threshold:\n`);
  for (const f of failures) {
    console.log(
      `${String(f.got).padStart(5)} (need ${f.need})  ${String(f.px).padStart(2)}px  ${f.fg} on ${f.bg}  ${f.where}  "${f.text}"`,
    );
  }
  process.exitCode = 1;
}
