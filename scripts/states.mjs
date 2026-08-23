/** One-off captures: the mobile menu open, and the page with reduced motion. */
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const OUT = "scripts/.shots";
const BASE = "http://localhost:3000";
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });

// --- mobile menu open ---
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-menu.png` });
  console.log("mobile-menu.png");
  await ctx.close();
}

// --- reduced motion, desktop ---
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/desktop-reduced-hero.png` });

  await page.evaluate(() => {
    document.getElementById("committee")?.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/desktop-reduced-committee.png` });
  console.log("desktop-reduced-*.png");
  await ctx.close();
}

await browser.close();
