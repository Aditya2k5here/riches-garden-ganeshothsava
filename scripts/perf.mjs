/**
 * Field-shaped performance check against a production build.
 *
 *   npm run build && npx next start -p 3100
 *   SHOT_BASE=http://localhost:3100 node scripts/perf.mjs
 *
 * Reports transferred bytes by type and the paint metrics that matter, on a
 * throttled mobile profile — closer to the phone this site will actually be
 * opened on than an unthrottled desktop run.
 */
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const PROFILES = [
  { name: "desktop", width: 1440, height: 900, cpu: 1, net: null },
  {
    name: "mobile 4G / 4x CPU",
    width: 390,
    height: 844,
    mobile: true,
    cpu: 4,
    // Lighthouse's "Slow 4G" preset.
    net: { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 },
  },
];

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const browser = await chromium.launch({ executablePath: exe, headless: true });

for (const profile of PROFILES) {
  const ctx = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: Boolean(profile.mobile),
    hasTouch: Boolean(profile.mobile),
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);

  await cdp.send("Network.enable");
  if (profile.net) {
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...profile.net });
  }
  if (profile.cpu > 1) {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
  }

  // Encoded bytes, straight from the protocol. Reading response bodies would
  // report the *decoded* size and overstate the download by roughly 3x, since
  // everything here is served compressed.
  const bytes = { document: 0, script: 0, stylesheet: 0, font: 0, image: 0, other: 0 };
  const files = [];
  const inflight = new Map();

  cdp.on("Network.requestWillBeSent", (e) => {
    inflight.set(e.requestId, { url: e.request.url, type: e.type });
  });
  cdp.on("Network.responseReceived", (e) => {
    const r = inflight.get(e.requestId);
    if (r) r.type = e.type;
  });
  cdp.on("Network.loadingFinished", (e) => {
    const r = inflight.get(e.requestId);
    if (!r) return;
    const kind = String(r.type ?? "").toLowerCase();
    const key =
      kind === "document" || kind === "script" || kind === "stylesheet" ||
      kind === "font" || kind === "image"
        ? kind
        : "other";
    bytes[key] += e.encodedDataLength;
    files.push({ key, url: r.url, size: e.encodedDataLength });
  });

  await page.goto(BASE, { waitUntil: "load" });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = { lcp: 0, cls: 0, candidates: [] };
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            out.lcp = e.startTime;
            out.candidates.push({
              at: Math.round(e.startTime),
              size: e.size,
              el: e.element
                ? `${e.element.tagName.toLowerCase()}.${String(e.element.className).split(" ")[0]}`
                : "?",
            });
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });

        setTimeout(() => {
          const nav = performance.getEntriesByType("navigation")[0];
          const fcp = performance
            .getEntriesByType("paint")
            .find((p) => p.name === "first-contentful-paint");
          resolve({
            ...out,
            fcp: fcp?.startTime ?? 0,
            ttfb: nav?.responseStart ?? 0,
            domInteractive: nav?.domInteractive ?? 0,
          });
        }, 5000);
      }),
  );

  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const fonts = files
    .filter((f) => f.key === "font")
    .sort((a, b) => b.size - a.size);

  console.log(`\n=== ${profile.name} ===`);
  for (const [k, v] of Object.entries(bytes)) {
    if (v) console.log(`  ${k.padEnd(12)} ${kb(v).padStart(10)}`);
  }
  console.log(`  ${"TOTAL".padEnd(12)} ${kb(total).padStart(10)}`);
  console.log(
    `  TTFB ${vitals.ttfb.toFixed(0)}ms · FCP ${vitals.fcp.toFixed(0)}ms · LCP ${vitals.lcp.toFixed(0)}ms · CLS ${vitals.cls.toFixed(4)}`,
  );
  if (process.env.PERF_FONTS && fonts.length) {
    console.log(`  fonts (${fonts.length}):`);
    for (const f of fonts) {
      console.log(`    ${kb(f.size).padStart(9)}  ${f.url.split("/").pop()}`);
    }
  }
  for (const c of vitals.candidates) {
    console.log(`    lcp candidate  ${String(c.at).padStart(5)}ms  ${String(c.size).padStart(7)}px²  ${c.el}`);
  }

  await ctx.close();
}

await browser.close();
