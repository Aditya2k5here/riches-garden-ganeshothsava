/** Captures the states the section shots miss: Kannada, and the open menu. */
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const OUT = "scripts/.shots";
const BASE = process.env.SHOT_BASE ?? "http://localhost:3000";
const SECTIONS = ["hero", "about", "journey", "stage", "contribute", "contact"];

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });

for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);

  // Switch to Kannada the way a visitor would.
  await page.getByRole("button", { name: "ಕನ್ನಡ" }).first().click();
  await page.waitForTimeout(600);

  for (const id of SECTIONS) {
    const ok = await page.evaluate((anchor) => {
      const el = document.getElementById(anchor);
      if (!el) return false;
      window.scrollTo({ top: el.offsetTop, behavior: "instant" });
      return true;
    }, id);
    if (!ok) continue;
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${vp.name}-kn-${id}.png` });
    console.log(`${vp.name}-kn-${id}.png`);
  }

  await ctx.close();
}

// Mobile menu, in Kannada.
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "ಕನ್ನಡ" }).first().click();
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-kn-menu.png` });
  console.log("mobile-kn-menu.png");
  await ctx.close();
}

await browser.close();
