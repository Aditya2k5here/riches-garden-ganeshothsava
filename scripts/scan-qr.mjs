/**
 * Decodes the QR codes as a phone camera would see them: rendered in the
 * page, at the size they actually appear, then read back from pixels.
 *
 *   SHOT_BASE=https://... node scripts/scan-qr.mjs
 *
 * Checking the source file is not the same test — the code is scaled,
 * re-encoded and composited before anybody points a camera at it.
 */
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import sharp from "sharp";
import jsQR from "jsqr";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const TARGETS = [
  { section: "contribute", selector: 'img[alt*="UPI"]', label: "UPI / contribution" },
  { section: "stage", selector: 'svg[aria-label*="QR"]', label: "Stage registration" },
];

const browser = await chromium.launch({ executablePath: exe, headless: true });
let failures = 0;

for (const vp of [
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

  for (const target of TARGETS) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), target.section);
    await page.waitForTimeout(1200);

    const el = page.locator(target.selector).first();
    if ((await el.count()) === 0) {
      console.log(`  --    ${vp.name}  ${target.label}: not found`);
      continue;
    }

    const shot = await el.screenshot();
    const { data, info } = await sharp(shot)
      .ensureAlpha()
      // Flatten onto white: a transparent SVG decodes as noise otherwise.
      .flatten({ background: "#ffffff" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const result = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    if (result) {
      console.log(
        `  ok    ${vp.name}  ${target.label} (${info.width}px) -> ${result.data}`,
      );
    } else {
      failures++;
      console.log(`  FAIL  ${vp.name}  ${target.label} (${info.width}px) did not decode`);
    }
  }

  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} QR code(s) failed to decode` : "\nBoth QR codes decode.");
process.exitCode = failures ? 1 : 0;
