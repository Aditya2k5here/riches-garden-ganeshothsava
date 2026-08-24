# Stage Events registration — Google Form spec

**I could not create this form for you.** Creating a Google Form requires an
authenticated Google account, and this session has no authorised Google
connector. That is the right outcome anyway: the form and its responses must
live in the **committee's** Google account, not in a tool's. Everything needed
to build it in about fifteen minutes is below.

Once it exists, the only thing the website needs is the URL — see
[Wiring it into the site](#wiring-it-into-the-site).

---

## Before you start

Sign in as the **committee's** Google account (not a personal one). Whoever
owns this form owns the responses, the uploaded audio and the sheet.

Create the form at <https://forms.new>.

**Settings → Responses**
- Collect email addresses: **Do not collect**
- Limit to 1 response: **off** (a family may register two children)
- Allow response editing: **on** (parents fix their own typos instead of
  phoning the convenor)

**Settings → Presentation**
- Confirmation message: see [After submission](#after-submission)

---

## A decision to make first: the audio upload

Google Forms **requires the person to be signed in to a Google account** to
upload a file. There is no way around this. A parent who is not signed in
cannot submit the form at all if the upload question is required.

Recommended: make the upload **optional**, and offer WhatsApp as the fallback
in the question's help text. Nobody gets blocked, and most people will still
upload.

If you would rather not deal with it at all, delete the upload question and
collect tracks over WhatsApp only.

---

## Form structure

### Title and description

> **Riches Garden Ganeshothsava 2026 — Stage Events Registration**
>
> 18 · 19 · 20 September 2026
> Preferred performance duration: 2–5 minutes. Maximum: 7 minutes.
> Registration closes two days before the event.

---

### Question 1 — the branch

| | |
|---|---|
| Type | Multiple choice |
| Question | Registering as |
| Required | Yes |

Options, both with **Go to section based on answer**:

| Option | Goes to |
|---|---|
| Individual performance | Section 2 |
| Group performance | Section 3 |

---

### Section 2 — Individual performance

After this section: **Submit form**.

| # | Question | Type | Required | Notes |
|---|---|---|---|---|
| 1 | Child's name | Short answer | Yes | |
| 2 | Father's or guardian's name | Short answer | Yes | |
| 3 | Contact number | Short answer | Yes | Response validation → Regular expression → *Matches* → `^[6-9][0-9]{9}$`, error text "Enter a 10-digit mobile number" |
| 4 | Age | Short answer | Yes | Validation → Number → *Between* 2 and 18 |
| 5 | Age category | Dropdown | Yes | **See note below — the committee must set these bands** |
| 6 | Event category | Dropdown | Yes | Singing · Dance · Bharatanatyam · Drama · Other Cultural Event |
| 7 | Performance or song name | Short answer | Yes | |
| 8 | Song or audio track | File upload | **No** | Allow audio only, 1 file, max 100 MB. Help text: "Optional. If you cannot upload here, send the track on WhatsApp to the cultural activities contact." |
| 9 | Preferred duration | Dropdown | Yes | 2–3 minutes · 3–4 minutes · 4–5 minutes |
| 10 | Confirmation | Checkboxes | Yes | Single option: "I have read the instructions and will keep the performance under 7 minutes." |

> **Age categories are not defined yet.** The committee has never written
> these down, and I am not going to invent bands that decide which children
> compete against each other. Common groupings are 3–6 / 7–10 / 11–14 /
> 15–18, but please confirm what you actually use before publishing. If you
> do not group by age at all, delete question 5.

---

### Section 3 — Group performance

After this section: **Submit form**.

| # | Question | Type | Required | Notes |
|---|---|---|---|---|
| 1 | Group name | Short answer | Yes | |
| 2 | Group leader's name | Short answer | Yes | |
| 3 | Group leader's father's or guardian's name | Short answer | Yes | |
| 4 | Contact number | Short answer | Yes | Same validation as individual |
| 5 | Number of participants | Short answer | Yes | Validation → Number → *Greater than* 1 |
| 6 | Participant names | Paragraph | Yes | Help text: "One name per line." |
| 7 | Participant ages | Paragraph | Yes | Help text: "Same order as the names above." |
| 8 | Event category | Dropdown | Yes | Group Dance · Group Singing · Drama · Other Cultural Event |
| 9 | Performance or song name | Short answer | Yes | |
| 10 | Song or audio track | File upload | **No** | As above |
| 11 | Preferred duration | Dropdown | Yes | 2–3 minutes · 3–4 minutes · 4–5 minutes |
| 12 | Confirmation | Checkboxes | Yes | Same wording as individual |

**One registration number per group, not per child.** That falls out of the
structure automatically — a group submits once.

---

## After submission

**Settings → Presentation → Confirmation message:**

> Thank you. Your registration has been received.
>
> The committee will confirm your slot and share the performance order two
> days before the event. Please keep the performance under 7 minutes.
>
> For any change, contact the cultural activities desk.

Do not promise a reference number in this message — the number is assigned by
the script below and sent separately, and a parent who does not see one
immediately will otherwise think something went wrong.

---

## Reference numbers (RG-3344)

Google Forms cannot generate these on its own. This Apps Script adds a
reference number to every response as it arrives.

**Responses tab → link to a Google Sheet → in the Sheet: Extensions → Apps
Script → paste → Save → Run once → grant permissions → then Triggers → Add
Trigger → `onFormSubmit` → From spreadsheet → On form submit.**

```javascript
/**
 * Assigns a reference number to each Stage Events registration.
 *
 * Numbers are sequential from 3300 and prefixed RG- (individual) or GR-
 * (group), so RG-3344 and GR-3345 never collide and the committee can see at
 * a glance which is which. The counter lives in script properties rather than
 * being derived from the row count, so deleting a row does not cause a reuse.
 */
const START_AT = 3300;
const REF_COLUMN_HEADER = 'Reference';

function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  let refCol = headers.indexOf(REF_COLUMN_HEADER) + 1;
  if (refCol === 0) {
    refCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, refCol).setValue(REF_COLUMN_HEADER).setFontWeight('bold');
  }

  // Don't overwrite if the trigger fires twice for the same row.
  if (sheet.getRange(row, refCol).getValue()) return;

  const props = PropertiesService.getScriptProperties();
  const next = Number(props.getProperty('counter') || START_AT) + 1;
  props.setProperty('counter', String(next));

  // Column B is the branch question ("Registering as").
  const kind = String(e.namedValues['Registering as'] || '').toLowerCase();
  const prefix = kind.indexOf('group') !== -1 ? 'GR' : 'RG';

  sheet.getRange(row, refCol).setValue(prefix + '-' + next);
}
```

### Telling the parent their number

Optional, and worth it — it saves the convenor a lot of phone calls. Add this
alongside the function above and call it at the end of `onFormSubmit`. It
needs a phone number, not an email, so it only makes sense if you also collect
one — which you do.

The simplest version is no code at all: the committee sorts the sheet by
`Reference` and pastes the list into the WhatsApp group once registrations
close. For a festival of this size that is genuinely the better answer.

---

## Duplicate registrations

Do not try to block these in the form. A second entry for the same child is
sometimes legitimate (one solo, one group) and sometimes a mistake, and only a
person can tell the difference.

Instead, in the Sheet: **Format → Conditional formatting** on the child-name
column with the custom formula
`=COUNTIF($C$2:$C, $C2) > 1`. Duplicates highlight; the committee decides.

---

## Wiring it into the site

Copy the form's **published link** (Send → link icon → Copy; shorten if you
like) and set it as an environment variable. On Vercel:

**Project → Settings → Environment Variables**

| Name | Value |
|---|---|
| `NEXT_PUBLIC_REGISTRATION_FORM_URL` | `https://forms.gle/your-real-id` |

Redeploy. That single variable drives:

- the **Register** button on the Stage Events section,
- the **QR code** beside it, which is generated from the same URL at build
  time so the two can never point at different places,
- and it removes the "placeholder link" notice.

There is nothing else to change, and no QR image to upload or keep in sync.

### Test before announcing it

- Open the link on **desktop**, **iPhone Safari** and **Android Chrome**.
- Scan the QR from a second phone, in the light you will actually print it in.
- Submit one test registration end to end, check it lands in the Sheet, and
  check the reference number appears.
- Delete the test row afterwards — and note the counter will not reuse that
  number, which is intentional.
