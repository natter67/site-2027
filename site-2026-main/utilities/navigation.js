// Site navigation in one place. The header mega menu, mobile menu, footer, landing pages and page
// breadcrumbs all read this file, so a link edited here changes everywhere.
// `summary` lines are DRAFT copy (committee to review; see REDESIGN_NOTES.md).

export const DONATE_URL = "https://buy.stripe.com/7sIg2U042455aT6000";
export const EXHIBIT_INTEREST_FORM_URL = "https://forms.gle/7kQJ5RA95zQcVbNf8";
export const MAILING_LIST_URL = "https://forms.gle/A7QqftMGGXKgbBmv5";
export const LINKTREE_URL = "https://linktr.ee/EOHuiuc";
export const HISTORY_URL = "https://grainger.illinois.edu/news/features/EOH-100";
export const ENGINEERING_COUNCIL_URL = "https://www.ecillinois.org/";
export const EVENT_DAY_HUB_URL = "/vv";

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/EngineeringOpenHouse/" },
  { label: "Instagram", href: "https://www.instagram.com/eoh_illinois/" },
  { label: "X (formerly Twitter)", href: "https://twitter.com/IllinoisEOH" },
];

// The five primary menu items. `overview` is the section's landing page; `groups` fill the mega menu.
export const PRIMARY_NAV = [
  {
    key: "visit",
    label: "Visit",
    summary: "Dates, hours, getting here and what to know before you go.",
    overview: { label: "Plan your visit", href: "/visit", summary: "April 9–10, 2027 · 9 AM–4 PM · Bardeen & North Quad, Urbana · Free." },
    groups: [
      {
        heading: "Before you go",
        links: [
          { label: "Getting here, parking & shuttles", href: "/visit/getting-here", summary: "Parking, shuttle stops and directions to the engineering campus." },
          { label: "Visitor Guide", href: "/visit/guide", summary: "The official visitor guide as a web page, with the PDF to download." },
          { label: "Accessibility & sensory guide", href: "/visit/accessibility", summary: "How to request accommodations, plus tips for a comfortable visit." },
          { label: "FAQ", href: "/faq", summary: "Answers about the event, parking, food and safety." },
        ],
      },
      {
        heading: "On the day",
        links: [
          { label: "Map", href: "/visit/map", summary: "Find buildings, exhibits and shuttle stops on the campus map." },
          { label: "Food", href: "/visit/food", summary: "Where to eat during EOH." },
        ],
      },
    ],
  },
  {
    key: "explore",
    label: "Explore",
    summary: "Exhibits, special events, keynotes and more across the engineering campus.",
    overview: { label: "Explore overview", href: "/explore", summary: "Everything to see and do at EOH, in one list." },
    groups: [
      {
        heading: "See and do",
        links: [
          { label: "Exhibits", href: EVENT_DAY_HUB_URL, summary: "Browse student exhibits in the Event Day Hub." },
          { label: "Special events", href: "/explore/special-events", summary: "Shows, competitions and featured events." },
          { label: "Keynotes", href: "/explore/keynotes", summary: "Keynote talks at EOH." },
          { label: "Startup Showcase", href: "/startup-showcase", summary: "Student startups at EOH, and how to apply." },
        ],
      },
      {
        heading: "Honors and initiatives",
        links: [
          { label: "Awards", href: "/explore/awards", summary: "Awards presented at EOH." },
          { label: "Initiatives: Sustainability & World Quantum Day", href: "/explore/initiatives", summary: "EOH x Sustainability and World Quantum Day." },
        ],
      },
    ],
  },
  {
    key: "schedule",
    label: "Schedule",
    summary: "Every event and show, by day.",
    overview: { label: "Full schedule", href: "/schedule", summary: "Every event and show, by day." },
    groups: [
      {
        heading: null,
        links: [
          { label: "Happening now", href: "/schedule#happening-now", summary: "What's on right now, during the event days." },
        ],
      },
    ],
  },
  {
    key: "schools",
    label: "Schools & Competitions",
    summary: "Field trips, design competitions and programs for future students.",
    overview: { label: "Schools & Competitions overview", href: "/schools", summary: "Field trips, design competitions and programs for future students." },
    groups: [
      {
        heading: "Schools and students",
        links: [
          { label: "Field trips", href: "/field-trips", summary: "Bring your class to EOH." },
          { label: "Future students", href: "/students", summary: "Events for prospective and admitted Illinois students." },
          { label: "EOH x Mom's Weekend", href: "/schools/moms-weekend", summary: "EOH events during Mom's Weekend." },
        ],
      },
      {
        heading: "Design competitions",
        links: [
          { label: "Middle School Design Competition", href: "/msdc", summary: "The design competition for middle school teams." },
          { label: "High School Design Competition", href: "/hsdc", summary: "The design competition for high school teams." },
        ],
      },
    ],
  },
  {
    key: "get-involved",
    label: "Get Involved",
    summary: "Exhibit, volunteer, judge, sponsor or donate.",
    overview: { label: "Get Involved overview", href: "/get-involved", summary: "Exhibit, volunteer, judge, sponsor or donate." },
    groups: [
      {
        heading: null,
        links: [
          { label: "Exhibit at EOH", href: "/get-involved#exhibit", summary: "Show your project at EOH: start with the exhibits interest form." },
          { label: "Volunteer", href: "/volunteer", summary: "Help run EOH on the event days." },
          { label: "Judge", href: "/judging", summary: "Judge student exhibits." },
          { label: "Sponsor", href: "/sponsor-us", summary: "Sponsorship packages for companies." },
          { label: "Donate", href: DONATE_URL, summary: "Support the student-run event with a gift." },
        ],
      },
    ],
  },
];

// "About EOH" lives in the utility bar, not the primary menu.
export const ABOUT_NAV = {
  key: "about",
  label: "About EOH",
  summary: "Who runs EOH, its history and how to reach us.",
  overview: { label: "About EOH", href: "/about", summary: "Who runs EOH, its history and how to reach us." },
  groups: [
    {
      heading: null,
      links: [
        { label: "Note from the Directors", href: "/about/directors", summary: "A welcome from the EOH co-directors." },
        { label: "Committee", href: "/about-us/meet-the-committee", summary: "Meet the students who run EOH." },
        { label: "History of EOH", href: HISTORY_URL, summary: "100+ years of EOH (Grainger Engineering article)." },
        { label: "Future dates", href: "/future-dates", summary: "EOH dates for the years ahead." },
        { label: "Accessibility statement", href: "/accessibility", summary: "How to request accommodations and alternative formats." },
        { label: "Contact", href: "/contact-us", summary: "Email the right director for your question." },
        { label: "Engineering Council", href: ENGINEERING_COUNCIL_URL, summary: "Engineering Council at Illinois." },
      ],
    },
  ],
};

export const UTILITY_NAV = [
  { label: "About EOH", href: "/about" },
  { label: "Contact", href: "/contact-us" },
  { label: "Event Day Hub", href: EVENT_DAY_HUB_URL },
];

export const isExternal = (href) => /^https?:\/\//.test(href);
export const linkProps = (href) => (isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

export const sectionLinks = (section) => section.groups.flatMap((g) => g.links);

// Finds the section and link for a page path (breadcrumbs, page eyebrows, summaries, related links).
export function findNavEntry(pathname) {
  for (const section of [...PRIMARY_NAV, ABOUT_NAV]) {
    if (section.overview.href === pathname) return { section, link: section.overview, isOverview: true };
    const link = sectionLinks(section).find((l) => l.href === pathname);
    if (link) return { section, link, isOverview: false };
  }
  return null;
}
