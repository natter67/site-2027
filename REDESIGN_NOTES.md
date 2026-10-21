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
