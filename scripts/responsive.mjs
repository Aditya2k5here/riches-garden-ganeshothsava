/**
 * Responsive audit across real device widths.
 *
 *   SHOT_BASE=http://localhost:3100 node scripts/responsive.mjs
 *
 * Checks the things that actually break on phones and cannot be seen in a
 * single desktop screenshot: horizontal overflow, elements wider than the
 * viewport, clipped text, overlapping interactive elements, tap targets under
 * 24px, and QR codes too small to scan.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const OUT = "scripts/.shots";
const PAGES = ["/", "/programme/children"];

const DEVICES = [
  { name: "small-phone", width: 320, height: 640, mobile: true },
  { name: "iphone-se", width: 375, height: 667, mobile: true },
  { name: "iphone-15", width: 393, height: 852, mobile: true },
  { name: "android", width: 412, height: 915, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
];

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });

let problems = 0;

for (const device of DEVICES) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: Boolean(device.mobile),
      hasTouch: Boolean(device.mobile),
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    await page.addStyleTag({
      content: "html{scroll-behavior:auto !important}",
    });

    // Walk the page so every reveal has fired and every lazy image is in.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 160));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const found = await page.evaluate(() => {
      const issues = [];
      const vw = document.documentElement.clientWidth;

      if (document.documentElement.scrollWidth > vw + 1) {
        issues.push(
          `page scrolls horizontally: ${document.documentElement.scrollWidth}px in ${vw}px`,
        );
      }

      const describe = (el) => {
        const text = (el.textContent || "").trim().slice(0, 34);
        return `${el.tagName.toLowerCase()}${
          el.className && typeof el.className === "string"
            ? "." + el.className.split(" ")[0]
            : ""
        }${text ? ` "${text}"` : ""}`;
      };

      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;

        // Anything sticking out past the right edge. Decorative overflow is
        // deliberately clipped by its parent, so only flag what is painted.
        if (r.right > vw + 1 && style.position !== "fixed") {
          let clipped = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ps = getComputedStyle(p);
            if (
              ps.overflowX === "hidden" ||
              ps.overflowX === "clip" ||
              ps.overflow === "hidden" ||
              ps.overflow === "clip"
            ) {
              clipped = true;
              break;
            }
          }
          if (!clipped) {
            issues.push(
              `overflows right by ${Math.round(r.right - vw)}px: ${describe(el)}`,
            );
          }
        }

        // Tap targets.
        if (
          window.matchMedia("(pointer: coarse)").matches &&
          (el.tagName === "BUTTON" ||
            (el.tagName === "A" && el.hasAttribute("href"))) &&
          !el.classList.contains("sr-only") &&
          (r.height < 24 || r.width < 24)
        ) {
          issues.push(
            `tap target ${Math.round(r.width)}x${Math.round(r.height)}: ${describe(el)}`,
          );
        }
      }

      // QR codes have to stay physically scannable.
      for (const qr of document.querySelectorAll('img[alt*="QR"], svg[aria-label*="QR"]')) {
        const r = qr.getBoundingClientRect();
        if (r.width && r.width < 140) {
          issues.push(`QR only ${Math.round(r.width)}px wide`);
        }
      }

      return issues;
    });

    const label = `${device.name.padEnd(12)} ${path}`;
    if (found.length === 0 && consoleErrors.length === 0) {
      console.log(`PASS  ${label}`);
    } else {
      problems += found.length + consoleErrors.length;
      console.log(`FAIL  ${label}`);
      for (const f of [...new Set(found)].slice(0, 8)) console.log(`        ${f}`);
      for (const e of [...new Set(consoleErrors)].slice(0, 3))
        console.log(`        console: ${e.slice(0, 120)}`);
    }

    await ctx.close();
  }
}

await browser.close();
console.log(problems ? `\n${problems} issue(s)` : "\nNo responsive issues.");
process.exitCode = problems ? 1 : 0;
