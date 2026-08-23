/**
 * Accessibility audit with axe-core, plus a few checks axe cannot make:
 * heading order, landmark presence, and touch-target size on mobile.
 *
 *   node scripts/a11y.mjs            # against SHOT_BASE, default :3000
 */
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

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

const browser = await chromium.launch({ executablePath: exe, headless: true });
let failures = 0;
let unverified = 0;

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: Boolean(vp.mobile),
      hasTouch: Boolean(vp.mobile),
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);

    // Reveals start hidden; run the audit against the settled page.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);

    await page.addScriptTag({ path: axePath });
    const results = await page.evaluate(async () =>
      // @ts-expect-error injected
      window.axe.run(document, {
        // "incomplete" matters here: axe reports contrast it could not
        // compute — text over a gradient, for instance — as incomplete
        // rather than a violation, which is exactly where this design is
        // most likely to fail.
        resultTypes: ["violations", "incomplete"],
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      }),
    );

    const extra = await page.evaluate(() => {
      const out = [];

      // Heading order
      const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
        .filter((h) => h.offsetParent !== null || h.closest("[hidden]") === null)
        .map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 40) }));
      let prev = 0;
      for (const h of levels) {
        if (prev && h.level > prev + 1) {
          out.push(`heading jump h${prev} -> h${h.level} at "${h.text}"`);
        }
        prev = h.level;
      }
      const h1s = levels.filter((h) => h.level === 1).length;
      if (h1s !== 1) out.push(`expected exactly one h1, found ${h1s}`);

      // Landmarks
      if (!document.querySelector("main")) out.push("no <main> landmark");

      // Touch targets, only where the pointer is coarse
      if (window.matchMedia("(pointer: coarse)").matches) {
        for (const el of document.querySelectorAll("a[href], button")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          // Visually-hidden until focused (the skip link) is not a target.
          if (el.classList.contains("sr-only")) continue;
          if (r.height < 24 || r.width < 24) {
            out.push(
              `small tap target ${Math.round(r.width)}x${Math.round(r.height)}: "${(el.textContent || el.ariaLabel || "").trim().slice(0, 32)}"`,
            );
          }
        }
      }
      return out;
    });

    const unsure = results.incomplete.filter((v) => v.id === "color-contrast");

    const unsureNodes = unsure.reduce((n, v) => n + v.nodes.length, 0);
    unverified += unsureNodes;

    const label = `${vp.name} ${path}`;
    const problems = results.violations.length + extra.length;

    if (problems === 0) {
      console.log(
        `PASS  ${label}${unsureNodes ? `  (${unsureNodes} contrast checks axe could not measure — see scripts/contrast.mjs)` : ""}`,
      );
    } else {
      failures += problems;
      console.log(`FAIL  ${label}`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length})`);
        for (const n of v.nodes.slice(0, 3)) {
          console.log(`      ${n.target.join(" ")}`);
          const msg = (n.failureSummary || "").split("\n").filter(Boolean)[1];
          if (msg) console.log(`      ${msg.trim()}`);
        }
      }
      for (const e of extra) console.log(`  [custom] ${e}`);
    }

    await ctx.close();
  }
}

await browser.close();

console.log(failures ? `\n${failures} issue(s)` : "\nNo issues.");

if (unverified) {
  console.log(
    `${unverified} contrast check(s) sit on gradients or under the grain overlay, ` +
      "which axe cannot measure from CSS. " +
      "Run `npm run audit:contrast` — it measures those from rendered pixels.",
  );
}

process.exitCode = failures ? 1 : 0;
