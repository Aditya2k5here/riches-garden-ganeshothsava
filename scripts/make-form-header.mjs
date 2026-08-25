/**
 * Builds the Google Forms header banner.
 *
 *   node scripts/make-form-header.mjs      (needs the site running on :3100)
 *
 * Google Forms crops its header to 1600x400. The committee's logo is
 * effectively square, so dropping it in directly cropped the emblem off the
 * top and sliced the flourish off the bottom. This composes a banner at the
 * right ratio instead, so nothing is cut.
 *
 * Rendered in a real browser against the running site rather than drawn with
 * an image library: that way the type is genuinely Cormorant Garamond as
 * served, and the maroon, the gold and the grain are the same values the
 * website uses. The form and the site then look like one thing.
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const OUT = "public/brand/form-header.png";

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const html = `
<!doctype html><meta charset="utf-8">
<style>
  @import url("${BASE}/_next/static/css/app.css");
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1600px; height: 400px; }
  body {
    display: flex; align-items: center; gap: 64px;
    padding: 0 96px;
    background:
      radial-gradient(70% 130% at 88% 50%, rgba(200,155,60,.20) 0%, rgba(200,155,60,0) 62%),
      radial-gradient(90% 160% at 10% 120%, rgba(168,23,53,.55) 0%, rgba(168,23,53,0) 60%),
      #4a0a18;
    font-family: "Cormorant Garamond", Georgia, serif;
    color: #f1e6d0;
    position: relative;
    overflow: hidden;
  }
  body::after {
    content: ""; position: absolute; inset: 0; opacity: .30;
    mix-blend-mode: soft-light; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  }
  img { height: 250px; width: auto; flex: none; }
  .rule { width: 1px; height: 168px; background: rgba(241,230,208,.22); flex: none; }
  .name { font-size: 62px; line-height: .96; font-weight: 300; letter-spacing: -.01em; }
  .name em { display: block; font-style: italic; color: #c89b3c; font-weight: 400; }
  .meta { margin-top: 26px; display: flex; align-items: baseline; gap: 20px; }
  .year { font-size: 30px; color: #c89b3c; line-height: 1;
          font-variant-numeric: lining-nums; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(241,230,208,.4); }
  .dates { font-size: 30px; color: #f7f0e2; line-height: 1;
           font-variant-numeric: lining-nums; }
</style>
<img src="${BASE}/brand/riches-garden-logo-reversed.png" alt="">
<div class="rule"></div>
<div>
  <div class="name">Riches Garden<em>Ganeshothsava</em></div>
  <div class="meta">
    <span class="year">21st Year</span>
    <span class="dot"></span>
    <span class="dates">18 · 19 · 20 September 2026</span>
  </div>
</div>
`;

const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await browser.newPage({
  viewport: { width: 1600, height: 400 },
  deviceScaleFactor: 1,
});

// Loaded from the site's origin so the relative font and logo URLs resolve.
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

await page.screenshot({ path: OUT });
await browser.close();

console.log(`${OUT}  1600x400`);
