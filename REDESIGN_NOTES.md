# EOH 2027 redesign notes

Branch: `nathan` (never pushed or deployed by Claude). Site code: `site-2026-main/`.
Event-day troubleshooting: see `TROUBLESHOOTING.md` in this folder.

Anything marked **DRAFT** below is new wording that needs committee review before launch.

---

## 1. What Phases 0–4 built (the "Direction A: The Road Trip" re-skin)

| Phase | What it covers | Main files |
|---|---|---|
| 0 | Audit, baselines, decisions D0–D13. Kept outside the repo. | `~/EOH-2027/direction-a/PHASE0-AUDIT.md` |
| — | Strapi connection in one file, with readable error logs | `utilities/strapi.js` |
| 1 | Design tokens, fonts and primitives (dev-only style guide at `/direction-a-preview`) | `styles/direction-a.css` (navy #13294B, orange #FF5F05, orange text #B23A00, peach, road, ground); Anton / Archivo / JetBrains Mono in `pages/_app.js`; Tailwind `da-*` colors and `font-display` / `font-body` / `font-label`; `components/mile-sign`, `components/road-divider` |
| 2 | Header and mobile menu restyle; hero rebuilt around the official logo; road and car animation | `layouts/Title`, `components/hero-road`, `components/ticker`, `components/header`, `components/mobile-menu` |
| 3 | Every home section and the footer in Direction A style, with images moved to `next/image` | `layouts/*`, `components/footer` |
| 4 | Info pages: halftone background, Archivo text, Anton page titles and AA contrast fixes (FAQ, Sponsor Us, Future Dates, committee, Visitor View tab bar) | `layouts/BasicApp.js`, `components/content`, `components/section`, page files |
| 5 | Discovery Lab, Passport and history timeline. Built, then **removed at the owner's request** in `8c8796e` (revert that commit to restore them). | — |

---

## 2. Content → information architecture (IA) mapping

Actions:
- **keep**: stays where it is.
- **move**: same content, new canonical page.
- **condense+link**: an exact excerpt that links to the full version.
- **new**: page or block that didn't exist before.

### Home page (before → after)

| Content block | Current location | New location | Action |
|---|---|---|---|
| Hero: official logo, "Driven by Discovery", date, Town Hall countdown, road and car | `/` (`layouts/Title`) | `/` section 1 | keep. Adds the facts line plus "Plan your visit" and "Explore exhibits" buttons. |
| Exhibits interest form button ("EOH Exhibits Interest Form 2026-2027") | `/` hero | Get Involved › Exhibit at EOH, plus the pre-event block on `/` | move |
| Scrolling ticker of topics (draft, Phase 2) | `/` | removed from home (`components/ticker` is kept, unused) | removed |
| Quick facts: when / where / cost / getting here | — | `/` section 2 | new |
| Start here: audience shortcut cards | — | `/` section 3 | new |
| EOH 2026 Awards (full list and modal) | `/#awards` | `/explore/awards` | move |
| Visitors Information: Visitor Guide / FAQs / New Students, shuttle stops, shuttle map | `/#visitors` | `/visit` (actions) and `/visit/getting-here` (shuttle) | move |
| Keynotes: Christina Ernst, Dr. Aadeel Akhtar | `/#keynote` (×2) | `/explore/keynotes` (full) and a Highlights teaser on `/` | move + condense+link |
| Featured Events: MSDC, HSDC, EOH x Mom's Weekend, Startup Showcase, Tesla Coil Concert | `/#featured-events` | `/explore/special-events` (full cards) and Highlights on `/` (teasers; keeps the `featured-events` id) | move + condense+link |
| World Quantum Day | `/#world-quantum-day` | `/explore/initiatives#world-quantum-day` | move |
| EOH x Sustainability | `/#scc` | `/explore/initiatives#scc` | move |
| Schedule widget (Strapi) | `/#schedule` | `/schedule` (full) and a Friday/Saturday preview on `/` (keeps `schedule`) | move + condense+link |
| Note from the Directors (letter and committee photo) | `/#directors` | `/about/directors` (full) and a card on `/` (keeps `directors`) | condense+link |
| Support Our Mission (Donate via Stripe, Sponsor) | `/#sponsors` | `/` section 7 (same id) | keep |
| Corporate Sponsors logos | `/#corporate-sponsors` | `/` section 7 (same id) | keep |

### Header, footer and pages

| Content | Current location | New location | Action |
|---|---|---|---|
| Header links: Volunteer, Judging | header | Get Involved › Volunteer / Judge | move |
| Header link: Sponsors (`/#sponsors`) | header | Get Involved › Sponsor (`/sponsor-us`); Donate button in the utility bar | move |
| Header links: Field Trips, Students | header | Schools & Competitions | move |
| Header link: FAQs | header | Visit › FAQ | move |
| Header link: Contact Us | header | utility bar › Contact | move |
| Header link: Visitor View (`/vv`) | header | utility bar › Event Day Hub; Explore › Exhibits | move (renamed label) |
| Header link: Visitor Guide (`/guide.pdf`) | header | Visit › Visitor Guide (web page and PDF) | move |
| Header link: Linktree (`linktr.ee/eoh2025`) | header | footer only (`linktr.ee/EOHuiuc`, the URL the footer already used) | move |
| Header: Log in / Account (Firebase) | header | utility bar | move |
| Footer: MSDC, HSDC, Students | footer "Special Events" | footer › Schools & Competitions | move |
| Footer: Contact, Accessibility, Future Dates, History of EOH (external), Engineering Council (external) | footer | footer › About | move |
| Footer: Support EOH (`/#sponsors`) | footer | footer › Get Involved › Donate | move |
| Footer: Mailing List (Google Form), Facebook, Instagram, X, Linktree | footer | footer › Stay in touch | move |
| `/faq`, `/field-trips`, `/msdc`, `/hsdc`, `/students`, `/judging`, `/volunteer`, `/sponsor-us`, `/contact-us`, `/accessibility`, `/future-dates`, `/privacy-policy`, `/about-us/meet-the-committee`, `/vv`, `/startup-showcase` | same URLs | linked from the menus | keep |
| `/events-list`, `/exhibitors`, `/independent-attend` (old 2023 content, linked from nowhere) | same URLs | still reachable, not linked from menus | keep (see open questions) |
| `/live`, `/login`, `/account`, `/admin`, `/judging/*` (tools and redirects) | same URLs | unchanged | keep |
| Visitor Guide PDF (44 pages) | `/guide.pdf` | `/visit/guide` (web) plus the PDF link | new web page |
| EOH x Mom's Weekend PDF | `/EOHxmoms.pdf` | `/schools/moms-weekend` (web) plus the PDF link | new web page |
| Startup Showcase PDF | `/showcase.pdf` | web version on the Startup Showcase page plus the PDF link | new web page |
| Sponsorship Packet PDF | `/sponsor-us` | unchanged (its content is already on the page) | keep |

### New pages

| URL | Purpose |
|---|---|
| `/visit` | Plan your visit: dates, hours, location, cost, plus links to every Visit page |
| `/visit/getting-here`, `/visit/map`, `/visit/accessibility`, `/visit/food`, `/visit/guide` | Visit sub-pages |
| `/explore` | Landing page linking exhibits, special events, keynotes, Startup Showcase, awards and initiatives |
| `/explore/special-events`, `/explore/keynotes`, `/explore/awards`, `/explore/initiatives` | Explore sub-pages |
| `/schedule` | Full schedule; "Happening now" during the event |
| `/schools`, `/schools/moms-weekend` | Schools & Competitions landing; Mom's Weekend web page |
| `/get-involved` | Exhibit, volunteer, judge, sponsor, donate |
| `/about`, `/about/directors` | About landing; full Note from the Directors |

---

## 3. Work log

### Step 2: header and footer (done)
- All menu links live in `site-2026-main/utilities/navigation.js`. The header, mobile menu, footer, landing pages and breadcrumbs all read it.
- Desktop header is still 88 px tall: a 28 px navy utility bar (About EOH · Contact · Event Day Hub · Log in/Account · Donate) plus the main row (logo, five menus, "Plan your visit"). The mobile header went from 96 px to 64 px (logo, "Plan your visit", menu button).
- Mega menus (`components/mega-menu`): click to open. They close on a second click, Esc (focus goes back to the button), a click outside, a route change, or tabbing away. They use `aria-expanded` and `aria-controls`, and each panel starts with a link to its landing page.
- Mobile menu (`components/mobile-nav`): an accordion per section, then the utility links and Donate. Esc closes it and puts focus back on the menu button.
- Footer: Visit, Explore (with the Schedule links), Schools & Competitions, Get Involved, About, and Stay in touch (mailing list, socials, Linktree).
- **Judgment calls:**
  - "Visitor View" is labelled "Event Day Hub" in menus; the `/vv` page itself is unchanged.
  - Log in/Account moved to the utility bar on desktop and the bottom of the mobile menu.
  - The footer has 5 IA columns instead of the brief's 4, because Schools & Competitions links (MSDC, HSDC, Students) were already in the old footer.
  - Two Linktree URLs existed: `linktr.ee/eoh2025` in the header and `linktr.ee/EOHuiuc` in the footer. Only the footer one is kept, since the brief puts Linktree in the footer only.
  - The footer copyright stays "Copyright EOH 2026" (existing copy).
- Left in place but no longer used: `components/mobile-menu` (old mobile menu). `components/flyout-menu` is still used by `components/button`.
- **DRAFT copy:** every `summary` in `utilities/navigation.js`, group headings ("Before you go", "On the day", "See and do", "Honors and initiatives", "Schools and students", "Design competitions"), the "Join the mailing list" label and "Stay in touch".

### Step 3: home page restructure (done)
Home page order:
1. Hero
2. Quick facts strip
3. Start here (MILE 01)
4. Highlights (MILE 02, keeps the `featured-events` id)
5. Schedule preview (MILE 03, keeps `schedule`)
6. Note from the Directors card (MILE 04, keeps `directors`)
7. Corporate Sponsors (MILE 05, keeps `corporate-sponsors`) and Support Our Mission (MILE 06, keeps `sponsors`; same Stripe and UIF links)

Then the footer. The home page is about 46% shorter at 1440 px.

Content moved off the home page to new pages:
- `/explore/awards`
- `/explore/keynotes`
- `/explore/initiatives` (`#world-quantum-day`, `#scc`)
- `/explore/special-events` (the featured events cards)
- `/schedule` (the full widget)
- `/about/directors` (the full letter)
- `/visit/getting-here` (the shuttle info and the Parking FAQs from `layouts/FAQs/faqs.json`)

**Redirects added (in the browser, in `pages/index.js` `MOVED_ANCHORS`).** The `#` part of a URL never reaches the server, so these can't be server redirects:
- `/#awards` → `/explore/awards`
- `/#keynote` → `/explore/keynotes`
- `/#visitors` → `/visit`
- `/#world-quantum-day` → `/explore/initiatives#world-quantum-day`
- `/#scc` → `/explore/initiatives#scc`
- `/#special-events` → `/explore/special-events` (that anchor was already broken before the redesign)

**Single sources (so text isn't copied):**
- Event facts: `utilities/eventConfig.js` (hero, quick facts, Visit pages)
- Keynote speakers: `utilities/keynotes.js` (moved verbatim out of `pages/index.js`)
- Featured events: `FEATURED_EVENTS` exported from `layouts/EventList` (also used by Highlights)
- Schedule: the Strapi URL and the European-to-Champaign time fix are exported from `components/schedule/schedule.js` (`SCHEDULE_EVENTS_URL`, `toChampaignTime`). The widget's behaviour is unchanged; the home preview reuses them.

**Judgment calls:**
- The hero keeps the official theme's capitalization, "Driven by Discovery", to match the logo; the brief wrote "Driven by discovery."
- The hero's date line "April 9th & April 10th, 2027" became the brief's facts line: "April 9–10, 2027 · 9 AM–4 PM · Bardeen & North Quad, Urbana · Free".
- The hero's interest-form button became a small "Exhibitors: EOH Exhibits Interest Form 2026-2027" link under the two new buttons (same URL and label). The decorative magnifier cursor and pulse animation that belonged to that button were removed.
- The "Exhibit Countdown" (Town Hall dates) is unchanged; it counts to exhibitor town halls, not the event.
- Highlights shows 5 teasers: Tesla Coil Concert, Keynotes, MSDC, HSDC and Startup Showcase. **Robobrawl was left out because no Robobrawl content exists anywhere on the site.** Add it to `FEATURED_EVENTS` and `layouts/Highlights` once the committee has text.
- The directors card quotes the letter's first paragraph word for word. Photos come from `public/assets/headshots/{aparna,maddie}.jpg`; the initials "AK · MC" stand in for signatures.
- The full letter is reformatted only: left-aligned instead of justified, 18 px text, about 70 characters per line. **The letter is still the 2026 letter ("Forging the Future", 104th EOH); the committee needs to supply the 2027 letter.**
- Startup Showcase teaser and menu link go to the existing `/startup-showcase` page.

**Left in place but no longer used:**
- `layouts/Visitors` (its four buttons are covered by the Visit menu and pages)
- `components/ticker` (draft scrolling ticker)
- `layouts/Awards`, `layouts/Keynote`, `layouts/QuantumDay`, `layouts/SCC`, `layouts/Schedule`, `layouts/Directors` are still used, now on the new pages

**DRAFT copy:**
- Section titles "Start here" and "Highlights"
- Start here card labels ("For families", "For schools & field trips", "For future students", "For exhibitors", "For sponsors & industry")
- "Parking & shuttles" in the facts strip
- "Exhibitors:" label
- Schedule preview fallback "Schedule details for this day are coming soon."
- "More special events, with times and places, are in the Event Day Hub."

### Step 4: landing pages and inner-page template (done)
**Template.** `components/content` (used by almost every info page) now renders:
- `components/page-header`: breadcrumbs, the menu section as a mile-sign eyebrow, the title (h1), a one-line summary from `utilities/navigation.js`, and an optional "On this page" jump list.
- The page content.
- `components/related-links`: "More in <section>" cards linking the section's other pages.

`components/link-cards` draws the cards; `layouts/Landing` builds a landing page from a menu section.

**Landing pages:**
- `/visit` (Plan your visit): When / Hours / Where / Cost cards with ids `when`, `hours`, `where`, `cost`, the PDF download, then all Visit pages
- `/explore`
- `/schools`
- `/get-involved`: `#exhibit` block with the exhibits interest form
- `/about`
- `/schedule` is the Schedule landing page (the full schedule)

**New Visit pages:**
- `/visit/map`: the Event Day Hub map component, reused unchanged
- `/visit/food`: Food FAQs from `faqs.json`
- `/visit/accessibility`: links to the accommodations on `/accessibility`, plus a **placeholder** for the sensory guide

**Template applied to:** every page that uses `components/content`. That includes FAQ and Future Dates (titles moved into the template), plus Sponsor Us and the committee page by hand.

**Pages that keep their own layout (event-day tools):** `/vv`, `/volunteer`, `/login`, `/account`, `/admin`, `/judging/*`, `/live`, and the home page.

**Accessibility fixes made along the way:**
- FAQ categories are now h2 (with ids for the jump list) and questions h3. The FAQ page had no h1 before.
- Field Trips' second h1 ("MSDC and HSDC") is now an h2.
- The map's location names went from h4 to h3, and its zoom buttons and icon links got `aria-label`s. This also fixes them inside `/vv`.
- Committee photos used a relative path, so they were broken on `/about-us/meet-the-committee` (they only worked on Contact Us). This was broken before the redesign and is now fixed.
- Sponsor Us has a document title now.
- Lighthouse accessibility scores 100 on `/visit`, `/explore`, `/get-involved`, `/visit/getting-here`, `/faq`, `/about-us/meet-the-committee`, `/sponsor-us`, `/future-dates`, `/field-trips` and `/about/directors`.

**Judgment calls:**
- The committee page's default export is now the page (template plus "Committee Members" section). Contact Us imports the same grid as the named export `CommitteeGrid`.
- The directors' letter page relies on the "More in About EOH" links to reach the committee and history pages, instead of separate buttons.
- Pages that aren't in the menus (`/privacy-policy`, `/events-list`, `/exhibitors`, `/independent-attend`) get breadcrumbs (Home › page) but no eyebrow or related links.
- Sponsor Us keeps its pre-existing React hydration warning (#418); it was there before the redesign.
- The map's floor-plan icon is an `<a>` without an `href`, so it isn't reachable by keyboard. It was left as is, since fixing it would change `/vv` behaviour.

**DRAFT copy:**
- All landing and page summaries (`utilities/navigation.js`)
- "Event essentials" (screen-reader heading)
- "Download the Visitor Guide (PDF)"
- The Get Involved exhibit sentence
- The sentences on `/visit/map`, `/visit/food` and `/visit/accessibility`
- "More in …" and "On this page"

**PLACEHOLDER:** the sensory guide on `/visit/accessibility` (committee to provide).

### Step 5: PDFs as web pages (done)
- **`/visit/guide`**, the Visitor Guide web version, with the 44-page PDF still downloadable. It covers:
  - visitor's information (visitor booth, food trucks, shirt colours)
  - emergencies (severe weather, missing child, medical, hospitals, lost and found)
  - the 27 buildings on the event map
  - parking, pick-up/drop-off, street closures and shuttles
  - all 33 special events (each has its own id, e.g. `#robobrawl`)
  - "More in the PDF" links: the schedule, the directors' note, exhibits in the Event Day Hub, and the committee
- The text is extracted word for word from `public/guide.pdf` (pages 3, 5, 6, 9, 10) into `utilities/visitorGuide.js`. Only PDF line breaks were joined; event names were split from their details.
- **`/schools/moms-weekend`**: the EOH x Mom's Weekend web version (`utilities/momsWeekend.js`, from `public/EOHxmoms.pdf`), with the PDF download. The featured-events card now opens this page instead of the PDF.
- Lighthouse accessibility: 100 on both pages.

**Judgment calls:**
- **The Visitor Guide PDF is the 2026 edition** (Friday April 10 / Saturday April 11, 2026). The web page says so ("This page matches the current PDF, the EOH 2026 edition…", DRAFT) until the 2027 guide replaces `public/guide.pdf` and `utilities/visitorGuide.js`.
- The guide's exhibit list (pages 12–38), directors' note and committee pages are linked rather than repeated, because they already have canonical places (Event Day Hub, `/about/directors`, the committee page).
- `public/showcase.pdf` is the **2025** Startup Showcase program. It was not turned into a page; it stays a PDF and `/startup-showcase` stays the menu target. Worth replacing when the 2027 program exists.
- The Mom's Weekend PDF's "for moms with younger students" list has no extractable text (it's probably an image), so the page links to the PDF for it.
- **Robobrawl added to Highlights** (6 teasers now). Its text comes from the guide's special events and it links to `/visit/guide#robobrawl`. This resolves the Step 3 gap.
- The Sponsorship Packet PDF is unchanged; `/sponsor-us` already carries its content.

**DRAFT copy:**
- The guide's edition note
- "Download the … (PDF)" labels
- The "More in the PDF" sentences
- "Featured events for everyone"
- "Events for moms with younger students are listed in the PDF."
- The extra "Visitor Guide and the Event Day Hub" sentence on `/explore/special-events`

### Step 6: event lifecycle modes, event-day tab bar, Event Day Hub (done)
**Mode** comes from `utilities/eventConfig.js` (`getEventMode`) through `utilities/useEventMode.js`:
- `pre` until April 9, 2027
- `event` on April 9–10, 2027 (Champaign time)
- `post` afterwards

**Overrides:**
- Add `?mode=pre|event|post` to any URL (just that tab).
- Set `NEXT_PUBLIC_EVENT_MODE=pre|event|post` and redeploy (everyone). **Recommended for the event days**: pages are pre-built, so without it visitors may see the pre-event layout for a moment before the browser switches.

**What each mode shows:**

| | Pre-event | Event days | Post-event |
|---|---|---|---|
| Top of home | Hero with Town Hall countdown and the exhibitor interest form link | "Today at EOH" block (`layouts/EventDayLead`): Event Day Hub, Map and Shuttles & parking buttons, plus Happening now / Up next | "Thanks for coming" block (`layouts/PostEventLead`): award winners, photo highlights (**placeholder**), feedback form (**placeholder**), save the date (EOH 2028 from `utilities/futureDates.js`) |
| Header button | Plan your visit | Event Day Hub | Plan your visit |
| Phones | — | Bottom tab bar (`components/event-tab-bar`): Now · Map · Schedule · Exhibits · Menu. Not on `/vv`, which has its own. | — |
| `/schedule#happening-now` | Explains what will appear | Live Happening now / Up next (`layouts/HappeningNow`) | Explains what will appear |

- Happening now / Up next use the same Strapi data as the schedule widget (`utilities/scheduleItems.js`). If Strapi is down they say so and point to the Event Day Hub.
- Tested at 360 and 1440 px in every mode (`direction-a/scripts/modetest.js`): no horizontal scroll and no page errors. The tab bar's Menu opens the normal menu.

**Event Day Hub prominence:** it's in the utility bar, in Explore › Exhibits, and is the header's main button, the home page's lead button and a tab bar item on event days.

**Judgment calls:**
- The Town Hall countdown is shown only before the event; its logic is unchanged.
- The future dates list moved to `utilities/futureDates.js` so the post-event "save the date" reads the same data as `/future-dates`.

**DRAFT copy:**
- "EOH is on now · …"
- "Today at EOH"
- "Open the Event Day Hub"
- "Shuttles & parking"
- The Happening now fallback lines
- The post-event card texts
- The `/schedule` Happening now explainer

**PLACEHOLDERS:** photo highlights, and the feedback form (no URL yet).
