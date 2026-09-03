# Going live

Everything below is something a person has to do. None of it is code.

---

## 1. Before you deploy

The Google Form and the committee portraits are both real now. Two things are
still outstanding, and the site is honest about both — it says so on the page.

| What | Where it comes from | What happens until then |
|---|---|---|
| 2022 journey photo | If one exists | 2022 is simply absent from the timeline |
| Sponsor logos | The sponsors | The Sponsors section is not mounted at all |

Settled by the 2026 invitation, for the record:

- **Evening performance time is 6:00 pm.** The 2025 card disagreed with
  itself — 6:30 in the English column, 6:00 in the Kannada — and the site
  carried 6:30 until the final invitation printed 6:00 in both.
- **Sunday's Maha Annadanam is not in the 2026 programme.** The 10:00 am slot
  is the Lalitha School of Music recital instead.

One liberty the site still takes: **"Stage Performance by Kids"** on the
printed invitation is listed here as **Stage Events**, to match what the rest
of the site calls it.

---

## 2. Environment variables

Set these in your host. All of them are `NEXT_PUBLIC_*`, which means they are
**visible to anyone who views the page** — that is fine for these values, and
it is exactly why no password, key or token may ever go in one.

| Variable | Value | If unset |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain` | Metadata and sitemap point at localhost |
| `NEXT_PUBLIC_REGISTRATION_FORM_URL` | Your Google Form link | Placeholder link + notice |
| `NEXT_PUBLIC_UPI_ID` | Overrides the built-in UPI ID | Falls back to the one printed on your QR |
| `NEXT_PUBLIC_UPI_PAYEE` | Display name | Falls back to the name on the QR |

---

## 3. Deploy

```bash
git remote add origin https://github.com/<your-account>/riches-garden.git
git push -u origin main
```

Then at [vercel.com](https://vercel.com): **Add New → Project → import the
repository**. Framework is detected automatically; no build settings need
changing. Add the environment variables above under **Settings → Environment
Variables**, then deploy.

Vercel serves HTTPS by default and redirects HTTP. The whole site is static,
so it is served from the CDN edge with no server to keep running.

### Custom domain

**Settings → Domains → Add.** Vercel gives you either a CNAME or two A
records to enter at your registrar. Certificates are issued automatically once
DNS resolves — usually minutes, occasionally a few hours.

### Deploying afterwards

Every push to `main` deploys. Pull requests get their own preview URL. To
change the schedule next year you edit `content/programme.ts`, push, and it is
live — no rebuild instructions to remember.

---

## 4. Security notes

What is already done, in `next.config.ts` and the architecture:

- **Content Security Policy**, frame denial, `nosniff`, `Referrer-Policy`,
  HSTS, a restrictive `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- **No third-party scripts.** No analytics, no tag manager, no font CDN —
  fonts are self-hosted by `next/font`, so no request leaves your domain.
- **No backend, no database, no accounts, no API routes.** There is nothing
  to authenticate to and nothing to breach. The one dynamic thing on the site
  is a link to a Google Form.
- **No secrets in the repository.** `.env*` is git-ignored; only
  `.env.example` is committed, and it holds no values.
- **`npm audit`: 0 vulnerabilities** at time of writing. Re-run it before each
  deploy — it takes two seconds.

One deliberate compromise, documented in `next.config.ts`: `script-src`
allows `'unsafe-inline'`, because Next injects an inline bootstrap script and
the alternative — a per-request nonce — forces every page to render
dynamically and gives up static CDN delivery. With no user input anywhere in
the app and no `dangerouslySetInnerHTML`, there is no meaningful XSS surface
to defend. **If a form, comment box or third-party embed is ever added, move
to a nonce in middleware at the same time.**

Two things to think about that are not code:

- **The published phone number.** `+91 7259816679` is on the Contact section,
  taken from your brochure. A number printed in a local brochure is far more
  exposed once it is on the open web — scrapers will find it. It is one line
  in `content/contact.ts` if you would rather remove it.
- **The UPI ID.** `adityasrinivashere2k5@okicici` is a personal Google Pay
  identifier, and both the QR and the text on the page carry it. Publishing it
  invites unsolicited payment requests and ties a personal account to a public
  page. If the committee can open a shared or business VPA, use that instead —
  it also makes handing the festival over to next year's convenor much
  cleaner.

Do not treat any of this as "unhackable". It is a static site with a small
attack surface, kept small on purpose.

---

## 5. Ownership checklist

The point of this list is that **nothing here depends on me, or on any tool.**

| # | Thing | Owner should be | Check |
|---|---|---|---|
| 1 | GitHub repository | You | ☐ |
| 2 | Vercel (or other host) account | You | ☐ |
| 3 | Domain registrar account | You | ☐ |
| 4 | Google Form | Committee Google account | ☐ |
| 5 | Google Sheet of responses | Same account as the form | ☐ |
| 6 | Google Drive folder holding uploaded audio | Same account | ☐ |
| 7 | Registration QR | Generated by the site from the form URL — nothing to own or store | ☑ |
| 8 | Contribution / UPI QR | `public/donate/upi-qr.png`, in the repository | ☑ |
| 9 | Website source code | The repository, plus your local clone | ☐ |
| 10 | Backup of the production version | See below | ☐ |

**Turn on two-factor authentication** on GitHub, Vercel, the Google account
and the domain registrar. The Google account matters most: it holds the
children's names and the uploaded audio.

**Add a second committee member** as owner/admin on the GitHub repo, the
Vercel project and the Google Form. One person holding all of it is the single
biggest risk to this site outliving one year — far bigger than anything in the
security section above.

---

## 6. Backups

`npm run backup` writes two files into `backups/` (git-ignored):

- **`riches-garden-<date>.bundle`** — the entire git repository, history and
  all, in one file. Restore with:
  ```bash
  git clone riches-garden-<date>.bundle riches-garden
  ```
- **`riches-garden-<date>.zip`** — plain source and assets, openable by anyone
  with no tools at all.

Neither is a backup while it sits on the same machine as the original. Copy
both to Google Drive and to one other place — a second laptop, or a USB stick
in someone else's house.

Take one after any significant change, and always right before the festival.
