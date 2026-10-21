# Event-day troubleshooting

Use this when something on eohillinois.org breaks. Every path below is inside `site-2026-main/`.

## 1. Triage in 2 minutes

1. **Is the whole site down, or just one feature?** If the whole site is down, check the Vercel dashboard (project `site-2027` → Deployments) before touching code.
2. **Open the browser console:** Chrome/Edge `Cmd+Option+J` (Mac) or `Ctrl+Shift+J` (Windows). Errors start with:
   - `[Strapi] …`: the CMS (schedule, Visitor View exhibits and events). See §3.
   - `FirebaseError …`: login, volunteer, judging, leaderboard. See §3.
   - `404` on an image or PDF: a file is missing from `public/`.
3. **Find the feature in the table in §2.** It tells you the file to open.
4. **Did a deploy just break it?** In Vercel: Deployments → the last good production deployment → **Promote to Production** (an instant rollback, no code needed). Fix the code afterwards.

Make sure whoever is on duty can log in to all of these: **Vercel**, **Strapi Cloud**, Firebase project **`eoh-2026-backend`**, and Firebase project **`eoh-volunteer`**.

## 2. Symptom → where to look

| Symptom | Open this | Notes |
|---|---|---|
| Schedule says **"An error has occurred."** | `utilities/strapi.js` | Strapi is unreachable. The console shows `[Strapi] Could not reach …`. Check that the Strapi Cloud project is running. |
| Schedule shows the time grid but **no events** | `utilities/strapi.js` | Strapi answered with an error. The console shows `[Strapi] 401 …` or `403 …`, which means the key is missing or wrong. |
| Schedule events on the **wrong day, or missing for one day** | `components/schedule/schedule.js` | The event days are hard-coded near the top (`DAY_ONE`, `DAY_TWO`, `dayOneMs`, `dayTwoMs`) and in `start.date() === 10`. |
| Schedule or Visitor View times **shifted by hours** | `components/schedule/schedule.js`, `components/vv/special-events.js` | Both convert times with a `Europe/Vienna` → `America/Chicago` step because the data was entered in a European timezone. |
| Visitor View **"failed to load, retry"** (exhibits) or **"Failed to load. Please try again."** (special events) | `utilities/strapi.js` | Same Strapi checks as the schedule |
| Judging pages can't find an exhibit | `utilities/strapiExhibits.js` | Looks up the exhibit in Strapi by its number, then by Strapi id |
| **Login / Account** (header), leaderboard points, QR scan points | `providers/Auth.js`, `utilities/firebaseApp.js` | Firebase project **`eoh-2026-backend`**, email and password sign-in |
| **Volunteer** sign-up, **admin**, **judging** | `utilities/firebase.js` | Firebase project **`eoh-volunteer`**, Google sign-in popup. Admin access is the email list in `utilities/admin.js`. |
| `FirebaseError: permission-denied` | Firebase console → Firestore → Rules | Usually means the visitor isn't signed in or isn't on the allowed list |
| Countdown dates wrong | `layouts/Title/index.js` | The `town_hall_dates` array at the top. Times use the visitor's own time zone. |
| Hero text, date, interest-form link, or countdown layout | `layouts/Title/index.js` | Styles are in the "Hero" section of `styles/direction-a.css` |
| Hero logo missing | `public/assets/logo/eoh2027-official-logo.jpg` | Served through Next.js image optimization (`/_next/image?url=…`). If only this image fails, check the image request in the browser's Network tab. |
| Road animation, signposts, or "Hit the gas" | `components/hero-road/index.js` | Styles are in the "HeroRoad" section of `styles/direction-a.css`. The road path appears in **both** files and must match. The car drives right to left, like the official logo: `reverse` on its animation in the CSS. The car is drawn facing left with its headlight at the front; only its π/Σ trail is mirrored, so it trails behind. The signpost delays are timed to that direction. |
| Scrolling topics band | `components/ticker/index.js` | No longer on the home page (removed in the 2027 restructure); the component is kept but unused. |
| Animations don't play at all | none | Expected if the visitor's device has "reduce motion" turned on: everything is shown still on purpose. |
| Header, mega menu, mobile menu, footer or landing-page links | `utilities/navigation.js` | One list feeds the header (`components/header`, `components/mega-menu`, `components/mobile-nav`), the footer, the landing pages, breadcrumbs and "More in …" links. The `summary` lines there are the one-line page summaries. |
| New colors, fonts, buttons, or cards look wrong | `styles/direction-a.css` | The colors are named variables at the top of the file. Their Tailwind names (`bg-da-navy` etc.) are in `tailwind.config.js`; the fonts are set up in `pages/_app.js`. Run `npm run dev` and open `/direction-a-preview` to see every piece on one page. |
| Footer layout | `components/footer/index.js` | Links come from `utilities/navigation.js`; the "Stay in touch" column (mailing list, socials, Linktree) is in this file. |
| **Launch intro** stuck, shows every time, or needs to go | `components/LaunchIntro/config.js` | `INTRO_ENABLED = false` turns it off (rebuild/deploy). It plays once per browser session (`sessionStorage` key `eoh-intro-seen`); `?intro=1` replays it. It lasts about 4 s, and a 6.5 s cap always hands off to the page. All timings are in `TIMING` in the same file. |
| Order of the home-page sections | `pages/index.js` | One block per section; delete a block to hide that section |
| Event dates, hours, place or cost (hero, facts strip, `/visit`) | `utilities/eventConfig.js` | `EVENT_FACTS` |
| Home shows the **event-day or post-event layout at the wrong time** (or not when it should) | `utilities/eventConfig.js` | `EVENT_START` / `EVENT_END`. Force a mode for everyone with `NEXT_PUBLIC_EVENT_MODE=pre`, `event` or `post` in Vercel and redeploy; preview one with `?mode=event` on any URL. |
| Event-day bottom tab bar (phones) | `components/event-tab-bar/index.js` | Only shows in event mode, never on `/vv` |
| "Happening now / Up next" or the home schedule preview is empty | `utilities/strapi.js` | Same Strapi data as the schedule. Code: `layouts/HappeningNow`, `layouts/SchedulePreview`, `utilities/scheduleItems.js` |
| Old links like `/#awards` don't land on the right page | `pages/index.js` | The `MOVED_ANCHORS` list (in-browser redirects for content that moved off the home page) |
| Page title, summary, breadcrumb or "On this page" wrong | `utilities/navigation.js` (summary) and `components/page-header` | Pages pass `title` (and sometimes `onThisPage`) to `components/content` |
| Directors' card quote on the home page | `layouts/DirectorsCard/index.js` | Copied word for word from `layouts/Directors` (full letter, `/about/directors`); keep them in sync |
| Home section heading or "MILE 0X" sign | `pages/index.js` (the `mile` text) and `components/section/Section.js` (`variant="road"` styling) | Other pages use `Section` without a variant and are unaffected |
| Keynote time, bio, or photo | `utilities/keynotes.js` (text) and `layouts/Keynote/index.js` (layout) | Shown on `/explore/keynotes` and in the home Highlights. `KEYNOTES_YEAR` and `REVEAL_COMING_SOON` control the "2027 keynote reveal coming soon" card and the "These were the keynote speakers at EOH 2026" note. |
| Awards | `layouts/Awards/index.js` | The `awards` list |
| Featured event cards (MSDC, HSDC, Mom's Weekend, Startup Showcase, Tesla Coil) | `layouts/EventList/index.js` | The `FEATURED_EVENTS` list. Shown on `/explore/special-events`; the home Highlights reuse it. |
| Donate or sponsor buttons | `layouts/Sponsors/index.js` | `STRIPE_DONATE_LINK`, `UIF_SPONSOR_LINK` |
| Sponsor logos | `components/corporateSponsor/index.js` | Image files live in `public/assets/sponsors/`. If a logo looks too small or overflows its tile (e.g. a square file with white margins), add it to `FIT_OVERRIDES` in the same file. |
| FAQ answers | `layouts/FAQs/faqs.json` | |
| `/students` event list | `public/assets/data/events.json` | |
| Visitor guide or other PDFs | `public/guide.pdf`, `public/EOHxmoms.pdf`, `public/showcase.pdf` | Replace the file and keep the same name. The web versions (`/visit/guide`, `/schools/moms-weekend`) read `utilities/visitorGuide.js` and `utilities/momsWeekend.js`, so update those too. |
| `/live` or `/guide` redirect | `next.config.js` | |
| Google Maps links for buildings | `utilities/links.js` | The `LOCATIONS` list |
| Icons missing but the page otherwise fine | none | Icons load from api.iconify.design at runtime. If that site is blocked or down, icons disappear but everything else works. |
| An image works on one page but not another | the component's `src` | Look for a path with no leading slash, e.g. `assets/images/x.jpg` instead of `/assets/images/x.jpg`. Those only work on top-level pages. |

## 3. Outside services

| Service | Used for | Settings |
|---|---|---|
| **Strapi Cloud** (CMS) | Schedule (`/schedule`, home preview, Happening now), Visitor View exhibits and special events, judging exhibit lookups | `utilities/strapi.js` is the only place with the host. To point at a different Strapi, set `NEXT_PUBLIC_STRAPI_URL`. The key is `NEXT_PUBLIC_STRAPI_KEY`.. **Paid only from second semester** (when exhibit registration starts). Outside that window it's off, and the schedule, Visitor View and Happening now show fallback messages. That's expected. |
| **Firebase `eoh-2026-backend`** | Header login and account, leaderboard, QR scan points | Written directly into `utilities/firebaseApp.js` (not in `.env`) |
| **Firebase `eoh-volunteer`** | Volunteer, admin, judging | Written directly into `utilities/firebase.js` (not in `.env`) |
| **Vercel** | Hosting and deploys | Project `site-2027`. Pushes to `main` can trigger a production deploy. |
| **Stripe** | Donate button | The link in `layouts/Sponsors/index.js` |

**Environment variables.** These live in `.env` locally and in Vercel → Settings → Environment Variables in production:
- `NEXT_PUBLIC_STRAPI_KEY` (required)
- `NEXT_PUBLIC_STRAPI_URL` (optional; overrides the Strapi host)

`NEXT_PUBLIC_…` values are **baked in when the site builds**. After changing one in Vercel, **redeploy** or the change won't take effect. The Clerk keys in `.env` aren't used by any code.

## 4. Where code lives

| Folder | What's in it |
|---|---|
| `pages/` | One file per URL (`pages/faq/index.js` → `/faq`). `pages/index.js` is the home page. |
| `layouts/` | **One folder per home-page section** (Awards, Keynote, Schedule …). The exception is `layouts/BasicApp.js`, which wraps every page with the header, skip link and footer. |
| `components/` | Reusable pieces, one folder each with an `index.js` |
| `utilities/` | Data connections (Strapi, Firebase) and helper lists (links, awards, admin emails) |
| `providers/` | Login state shared across pages (`Auth.js`) |
| `styles/` | Global CSS. `direction-a.css` holds the 2027 redesign's colors, buttons, cards and animations, in sections named after the component that uses them. |
| `public/` | Images, PDFs and JSON served as-is (`public/guide.pdf` → `/guide.pdf`) |
