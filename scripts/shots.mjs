/**
 * Design review screenshots.
 *
 *   node scripts/shots.mjs                     # every section, both widths
 *   node scripts/shots.mjs hero children       # only those anchors
 *   node scripts/shots.mjs --url /programme/children --full
 *
 * Drives the Chrome already installed on the machine (no browser download).
 * Files land in scripts/.shots/, which is git-ignored.
 */
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const OUT = "scripts/.shots";
const BASE = process.env.SHOT_BASE ?? "http://localhost:3000";

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const DEFAULT_ANCHORS = [
  "hero",
  "welcome",
  "journey",
  "programme",
  "children",
  "committee",
  "donations",
  "contact",
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const anchors = args.filter((a) => !a.startsWith("--") && a !== value("url"));

const path = value("url") ?? "/";
const full = flag("full");
const slug =
  path === "/" ? "full" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-");
const targets = anchors.length ? anchors : DEFAULT_ANCHORS;

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome or Edge found. Set one of:", CHROME_CANDIDATES);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  const problems = [];
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(m.text());
  });
  page.on("pageerror", (e) => problems.push(String(e)));

  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  // Let the loading experience finish and the hero settle.
  await page.waitForTimeout(2800);

  if (full || path !== "/") {
    await autoScroll(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${OUT}/${vp.name}-${slug}.png`,
      fullPage: true,
    });
    console.log(`${OUT}/${vp.name}-${slug}.png`);
  } else {
    for (const id of targets) {
      const found = await page.evaluate((anchor) => {
        const el = document.getElementById(anchor);
        if (!el) return false;
        window.scrollTo({ top: el.offsetTop, behavior: "instant" });
        return true;
      }, id);

      if (!found) {
        continue;
      }

      // Reveals need a beat to play once they enter the viewport.
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
      console.log(`${OUT}/${vp.name}-${id}.png`);
    }
  }

  if (problems.length) {
    console.log(`\n  ${vp.name} console errors:`);
    for (const p of [...new Set(problems)]) console.log(`   ! ${p}`);
  }

  await context.close();
}

await browser.close();

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 320));
    }
  });
}
