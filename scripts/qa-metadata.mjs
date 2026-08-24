/**
 * Metadata checks, kept in their own module so the template literals here
 * never have to survive a trip through a shell heredoc.
 *
 * The repeated-word rule exists because of a real bug: `edition` was changed
 * from "21st" to "21st Year" while the title template still appended
 * " Year", and the site shipped as "21st Year Year". Nothing in the page body
 * showed it — only the browser tab.
 */
export async function checkMetadata(page, { pass, fail, staleTerms }) {
  const meta = await page.evaluate(() => ({
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.content ?? "",
    ogTitle:
      document.querySelector('meta[property="og:title"]')?.content ?? "",
  }));

  for (const [field, value] of Object.entries(meta)) {
    if (!value) {
      fail(`${field} is empty`);
      continue;
    }

    const repeated = value.toLowerCase().match(/\b(\w+)\s+\1\b/);
    if (repeated) {
      fail(`${field} repeats "${repeated[1]}": ${value}`);
      continue;
    }

    const stale = staleTerms.find((term) => value.includes(term));
    if (stale) {
      fail(`${field} has stale wording "${stale}": ${value}`);
      continue;
    }

    pass(`${field}: ${value.slice(0, 76)}`);
  }
}
