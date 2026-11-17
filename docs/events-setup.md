# Events: setup guide

The events page is built. Until the steps below are done, it shows **sample events** so you can preview it at `/events`. Nothing is saved and no emails are sent in sample mode.

You need three accounts (all free to start), plus your domain settings and Vercel.

---

## 1. Sanity (where events are created)

1. Sign up at **https://www.sanity.io** (Google or GitHub login works).
2. Create a new project (name it "Hello Creatives") with a dataset called `production`.
3. **Make the dataset private.** This is important: registrations contain people's emails, and events contain the private call links.
   - Go to **https://www.sanity.io/manage**, open the project, then **Datasets** → `production` → set visibility to **Private**.
4. Copy the **Project ID** (shown on the project's page). This is `NEXT_PUBLIC_SANITY_PROJECT_ID`.
5. Create a token: **API** → **Tokens** → **Add API token**, name it "Website", permission **Editor**. Copy it. This is `SANITY_API_TOKEN`. It's a secret, so don't share it.
6. Allow the Studio to run on your site: **API** → **CORS origins** → **Add CORS origin**:
   - `https://hellocreatives.io` (tick **Allow credentials**)
   - `http://localhost:3000` (tick **Allow credentials**), for local development

**Where the team creates events:** `https://hellocreatives.io/studio`. Log in with the Sanity account, then:
- **Events** → **+** to create one. The form explains each field.
- **Registrations by event** → pick an event to see who signed up.

Invite teammates from sanity.io/manage → **Members**.

---

## 2. Resend (confirmation emails)

1. Sign up at **https://resend.com**.
2. **Domains** → **Add Domain** → `hellocreatives.io`. Resend shows a few DNS records.
3. Add those records where your domain is managed (the company you bought the domain from, or Vercel if it manages your DNS). Wait until Resend shows **Verified** (minutes to a few hours).
4. **API Keys** → **Create API Key** (permission "Sending access"). Copy it. This is `RESEND_API_KEY`. It's a secret.
5. `RESEND_FROM_EMAIL` is the sender, e.g. `Hello Creatives <events@hellocreatives.io>`. It must use the verified domain.

Free plan limits (check Resend's pricing page; they can change): about 3,000 emails a month and 100 a day.

---

## 3. Vercel (hosting)

1. **Settings** → **Environment Variables**: add every value from `.env.example` (Production and Preview).
2. **Settings** → **Domains** → **Add** → `events.hellocreatives.io`. Follow Vercel's instructions to add the DNS record (usually a CNAME to `cname.vercel-dns.com`).
3. Redeploy.

On preview links (`*.vercel.app`), the events page is at `/events` instead of the subdomain.

---

## How it works (for reference)

| What | Where |
|---|---|
| Events list | `events.hellocreatives.io` (or `/events`) |
| Shared link | `events.hellocreatives.io/?event=<link-name>` opens that event's registration form |
| Share image | `/api/events/<link-name>/share-image` (also used as the link preview) |
| Registration | `/api/events/register`: saves to Sanity, emails the person with a calendar invite |
| Studio | `/studio` |

- Events move from **Upcoming** to **Past Sessions** automatically after their end time (or 2 hours after the start if there's no end time). The page refreshes its data about once a minute.
- The call link is never in the public page. It's only returned after someone registers, and it's included in their email.
- Registering twice with the same email doesn't create a duplicate or send a second email.
- All times are shown in Lagos time (WAT).
