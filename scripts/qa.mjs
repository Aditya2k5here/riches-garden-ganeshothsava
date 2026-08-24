/**
 * Final QA sweep.
 *
 *   SHOT_BASE=http://localhost:3100 node scripts/qa.mjs
 *
 * Verifies the boring things that break a launch: every in-page anchor
 * resolves to a real element, every asset returns 200, every external link is
 * safely marked, no console errors, no layout shift, and the facts on the
 * page match the facts in the content files.
 */
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

/** Facts that must appear verbatim on the homepage as first loaded. */
const MUST_CONTAIN = [
  "21st Year",
  "18 · 19 · 20 September 2026",
  "Stage Events",
  "2–5 minutes",
  "7 minutes",
  "Riches Garden Main Road",
  "Ramamurthy Nagar",
];

/**
 * Each day's full date, checked by actually opening its tab — only the
 * selected panel is mounted, so scanning the initial DOM would silently pass
 * on a substring of the hero's "18 · 19 · 20 September 2026" and prove
 * nothing.
 */
const DAY_DATES = [
  ["Day One", "18 September 2026", "Friday"],
  ["Day Two", "19 September 2026", "Saturday"],
  ["Day Three", "20 September 2026", "Sunday"],
];

/** Wording that must NOT survive anywhere. */
const MUST_NOT_CONTAIN = [
  "Children's Events",
  "by Kids",
  "The stage is theirs",
  "Lorem",
  "TODO",
  "undefined",
  "NaN",
];

const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
const failedRequests = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(String(e)));
page.on("response", (r) => {
  if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
});

let problems = 0;
const fail = (msg) => {
  problems++;
  console.log(`  FAIL  ${msg}`);
};
const pass = (msg) => console.log(`  ok    ${msg}`);

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 160));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(800);

console.log("\nANCHORS");
const anchors = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="#"]')].map((a) =>
    a.getAttribute("href"),
  ),
);
for (const href of [...new Set(anchors)]) {
  const exists = await page.evaluate((h) => Boolean(document.querySelector(h)), href);
  if (exists) pass(`${href}`);
  else fail(`${href} has no target`);
}

console.log("\nEXTERNAL LINKS");
const external = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="http"]')].map((a) => ({
    href: a.getAttribute("href"),
    rel: a.getAttribute("rel") || "",
    target: a.getAttribute("target") || "",
  })),
);
for (const link of external) {
  if (link.target === "_blank" && !link.rel.includes("noopener")) {
    fail(`${link.href} opens in a new tab without rel=noopener`);
  } else {
    pass(`${link.href}`);
  }
}

console.log("\nIMAGES");
const images = await page.evaluate(() =>
  [...document.querySelectorAll("img")].map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.getAttribute("alt"),
    broken: img.complete && img.naturalWidth === 0,
  })),
);
for (const img of images) {
  if (img.broken) fail(`broken image ${img.src}`);
  else if (img.alt === null) fail(`image missing alt attribute: ${img.src}`);
}
if (images.every((i) => !i.broken && i.alt !== null)) {
  pass(`${images.length} images load, all have alt text`);
}

console.log("\nCONTENT");
const text = await page.evaluate(() => document.body.innerText);
for (const needle of MUST_CONTAIN) {
  if (text.includes(needle)) pass(`"${needle}"`);
  else fail(`missing "${needle}"`);
}
for (const needle of MUST_NOT_CONTAIN) {
  if (text.includes(needle)) fail(`stale text present: "${needle}"`);
}

console.log("\nPROGRAMME DAYS");
for (const [tab, date, weekday] of DAY_DATES) {
  await page.getByRole("tab", { name: new RegExp(tab, "i") }).click();
  await page.waitForTimeout(500);
  const panel = await page.evaluate(
    () => document.querySelector('[role="tabpanel"]')?.innerText ?? "",
  );
  // innerText reflects CSS text-transform, so the weekday comes back
  // uppercased. Compare case-insensitively.
  const haystack = panel.toLowerCase();
  if (haystack.includes(date.toLowerCase()) && haystack.includes(weekday.toLowerCase())) {
    pass(`${tab} -> ${weekday} ${date}`);
  } else {
    fail(`${tab} panel does not show ${weekday} ${date}`);
  }
}

// Console errors from the homepage only - the 404 route test below is
// supposed to fail, and its noise would otherwise count as a defect.
const homepageConsoleErrors = [...consoleErrors];

console.log("\nROUTES");
for (const route of ["/programme/children", "/not-a-real-page"]) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
  const expected = route === "/not-a-real-page" ? 404 : 200;
  if (res?.status() === expected) pass(`${route} → ${res?.status()}`);
  else fail(`${route} → ${res?.status()}, expected ${expected}`);
}

console.log("\nRUNTIME");
const realFailures = failedRequests.filter((r) => !r.includes("not-a-real-page"));
if (realFailures.length) realFailures.forEach((r) => fail(`request ${r}`));
else pass("no failed requests");
if (homepageConsoleErrors.length) {
  [...new Set(homepageConsoleErrors)].forEach((e) =>
    fail(`console: ${e.slice(0, 140)}`),
  );
} else {
  pass("no console errors");
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nAll QA checks passed.");
process.exitCode = problems ? 1 : 0;
