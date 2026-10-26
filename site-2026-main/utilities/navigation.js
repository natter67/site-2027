// Site navigation in one place. The header mega menu, mobile menu, footer, landing pages and page
// breadcrumbs all read this file, so a link edited here changes everywhere.
// `summary` lines are DRAFT copy (committee to review; see REDESIGN_NOTES.md).

export const DONATE_URL = "https://buy.stripe.com/7sIg2U042455aT6000";
export const EXHIBIT_INTEREST_FORM_URL = "https://forms.gle/7kQJ5RA95zQcVbNf8";
export const EXHIBIT_APPLICATION_FORM_URL = "https://forms.gle/J4QRhXQs3SNjkswH9";
export const MAILING_LIST_URL = "https://forms.gle/A7QqftMGGXKgbBmv5";
export const LINKTREE_URL = "https://linktr.ee/EOHuiuc";
export const HISTORY_URL = "https://grainger.illinois.edu/news/features/EOH-100";
export const ENGINEERING_COUNCIL_URL = "https://www.ecillinois.org/";
export const VISITOR_HUB_URL = "/vv";

// Header button beside Log in, and a link in the mobile menu.
export const VISITOR_HUB = { label: "Visitor Hub", href: VISITOR_HUB_URL };

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/EngineeringOpenHouse/" },
  { label: "Instagram", href: "https://www.instagram.com/eoh_illinois/" },
  { label: "X (formerly Twitter)", href: "https://twitter.com/IllinoisEOH" },
];

// The primary menu items. `overview` is the section's landing page; `groups` fill the mega menu.
// `inMenus: false` keeps a landing page that only repeats the menu out of the menus, footer and
// "More in…" links (it still shows in breadcrumbs).
export const PRIMARY_NAV = [
  {
    key: "visit",
    label: "Visit",
    summary: "Dates, hours, getting here and what to know before you go.",
    overview: { label: "Plan your visit", href: "/visit", summary: "April 9–10, 2027 · 9 AM–4 PM · Bardeen & North Quad, Urbana · Free." },
    groups: [
      {
        heading: null,
        links: [
          { label: "Shuttles & parking", href: "/visit#getting-here", summary: "Shuttle stops and hours, and parking lots with map links." },
          { label: "FAQ", href: "/faq", summary: "Answers about the event, parking, food, field trips and safety." },
        ],
      },
    ],
  },
  {
    key: "explore",
    label: "Explore",
    summary: "Exhibits, the schedule, the campus map, special events and keynotes.",
    overview: { label: "Explore overview", href: "/explore", summary: "Everything to see and do at EOH, in one list.", inMenus: false },
    groups: [
      {
        heading: null,
        links: [
          { label: "Exhibits", href: VISITOR_HUB_URL, summary: "Browse student exhibits in the Visitor Hub." },
          { label: "Schedule", href: "/schedule", summary: "Every event and show, by day." },
          { label: "Map", href: "/visit/map", summary: "Find buildings, exhibits and shuttle stops on the campus map." },
          { label: "Special events", href: "/explore/special-events", summary: "Shows, competitions and featured events." },
          { label: "Keynotes", href: "/explore/keynotes", summary: "Keynote talks at EOH." },
          { label: "Startup Showcase", href: "/startup-showcase", summary: "Student startups at EOH, and how to apply." },
          { label: "Awards & initiatives", href: "/explore/awards", summary: "EOH awards, World Quantum Day and EOH x Sustainability." },
        ],
      },
    ],
  },
  {
    key: "schools",
    label: "Schools & Competitions",
    summary: "Field trips, design competitions and programs for future students.",
    overview: { label: "Schools & Competitions overview", href: "/schools", summary: "Field trips, design competitions and programs for future students.", inMenus: false },
    groups: [
      {
        heading: null,
        links: [
          { label: "Field trips", href: "/field-trips", summary: "Bring your class to EOH." },
          { label: "Design competitions", href: "/schools/design-competitions", summary: "The middle school (MSDC) and high school (HSDC) design competitions." },
          { label: "Future students", href: "/students", summary: "Events for prospective and admitted Illinois students." },
          { label: "EOH x Mom's Weekend", href: "/schools/moms-weekend", summary: "EOH events during Mom's Weekend." },
        ],
      },
    ],
  },
  {
    key: "get-involved",
    label: "Get Involved",
    summary: "Exhibit, volunteer, judge, sponsor or donate.",
    overview: { label: "Get Involved overview", href: "/get-involved", summary: "Exhibit, volunteer, judge, sponsor or donate.", inMenus: false },
    groups: [
      {
        heading: null,
        links: [
          { label: "Exhibit at EOH", href: "/get-involved#exhibit", summary: "Show your project at EOH: fill out the exhibits interest form, then submit the exhibit application." },
          { label: "Volunteer", href: "/volunteer", summary: "Help run EOH on the event days." },
          { label: "Judge", href: "/judging", summary: "Judge student exhibits." },
          { label: "Sponsor", href: "/sponsor-us", summary: "Sponsorship packages for companies." },
          { label: "Donate", href: DONATE_URL, summary: "Support the student-run event with a gift." },
          { label: "Merch", href: "/merch", summary: "Preorder EOH 2027 merch." },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About Us",
    summary: "Who runs EOH, future dates and how to reach us.",
    overview: { label: "About EOH", href: "/about", summary: "Who runs EOH, future dates and how to reach us." },
    groups: [
      {
        heading: null,
        links: [
          { label: "Note from the Directors", href: "/about/directors", summary: "A welcome from the EOH co-directors." },
          { label: "Committee", href: "/about-us/meet-the-committee", summary: "Meet the students who run EOH." },
          { label: "Accessibility statement", href: "/accessibility", summary: "How to request accommodations and alternative formats." },
          { label: "Contact", href: "/contact-us", summary: "Email the right director for your question." },
        ],
      },
    ],
  },
];

export const isExternal = (href) => /^https?:\/\//.test(href);
export const linkProps = (href) => (isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

export const sectionLinks = (section) => section.groups.flatMap((g) => g.links);
// What menus, the footer and "More in…" list for a section: its landing page (unless `inMenus: false`), then its links.
export const menuLinks = (section) => [...(section.overview.inMenus === false ? [] : [section.overview]), ...sectionLinks(section)];

// Finds the section and link for a page path (breadcrumbs, page eyebrows, summaries, related links).
export function findNavEntry(pathname) {
  for (const section of PRIMARY_NAV) {
    if (section.overview.href === pathname) return { section, link: section.overview, isOverview: true };
    const link = sectionLinks(section).find((l) => l.href === pathname);
    if (link) return { section, link, isOverview: false };
  }
  return null;
}
