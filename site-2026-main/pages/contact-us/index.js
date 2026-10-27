import { useEffect, useState } from "react";
import Link from "next/link";
import Content from "@/content";
import { EVENT_FACTS } from "@utilities/eventConfig";
import faqs from "@layouts/FAQs/faqs.json";

// Contact Us, grouped by topic. Each entry leads with what the inbox is for, then the director's
// role, then the address written in full. Labels, group headings and the 2-business-day reply line
// are DRAFT copy (see REDESIGN_NOTES.md); the addresses are unchanged. The committee headshots that
// used to sit below this list are on /about-us/meet-the-committee ("Committee" under More in About Us).
const GENERAL_EMAIL = "eoh@ec.illinois.edu";

const GROUPS = [
  {
    id: "visiting",
    heading: "Visiting EOH",
    contacts: [
      { label: "Visitor questions", role: "Visitor's Information", email: "eoh-visitors@ec.illinois.edu" },
      { label: "Parking, shuttles and safety", role: "Director of Traffic & Safety", email: "eoh-safety@ec.illinois.edu" },
      { label: "Special events and shows", role: "Director of Special Events", email: "eoh-events@ec.illinois.edu" },
      { label: "Accessibility and accommodations", role: "EOH Committee", email: GENERAL_EMAIL, link: { label: "Accessibility statement", href: "/accessibility" } },
    ],
  },
  {
    id: "schools",
    heading: "Schools and competitions",
    contacts: [
      { label: "Field trips and school groups", role: "Director of Outreach", email: "eoh-outreach@ec.illinois.edu" },
      { label: "Middle School Design Competition", role: "Director of Middle School Design", email: "eoh-msdc@ec.illinois.edu" },
      { label: "High School Design Competition", role: "Director of High School Design", email: "eoh-hsdc@ec.illinois.edu" },
    ],
  },
  {
    id: "exhibits",
    heading: "Exhibits and judging",
    contacts: [
      { label: "Exhibiting at EOH", role: "Director of Exhibits", email: "eoh-exhibits@ec.illinois.edu" },
      { label: "Exhibit space and equipment", role: "Director of Facilities", email: "eoh-facilities@ec.illinois.edu" },
      { label: "Judging and awards", role: "Director of Judging & Awards", email: "eoh-judging@ec.illinois.edu" },
      { label: "Startup Showcase", role: "Director of Startup Showcase", email: "eoh-startup@ec.illinois.edu" },
    ],
  },
  {
    id: "support",
    heading: "Volunteering, sponsorship and giving",
    contacts: [
      { label: "Volunteering", role: "Director of Hospitality", email: "eoh-hospitality@ec.illinois.edu" },
      { label: "Sponsorship and companies", role: "Director of Corporate", email: "eoh-corporate@ec.illinois.edu" },
      { label: "Donations and fundraising", role: "Director of Advancement", email: "eoh-advancement@ec.illinois.edu" },
      { label: "Payments and reimbursements", role: "Secretary/Treasurer", email: "eoh-treasurer@ec.illinois.edu" },
    ],
  },
  {
    id: "media",
    heading: "Media and website",
    contacts: [
      { label: "Media, press and promotion", role: "Director of Marketing", email: "eoh-marketing@ec.illinois.edu" },
      { label: "Website and Visitor Hub", role: "Director of Technology", email: "eoh-tech@ec.illinois.edu" },
    ],
  },
];

// Event-day help. Apart from the 911 line (DRAFT), these are the FAQ's own questions and answers, so
// the two pages can't drift apart: edit layouts/FAQs/faqs.json to change them.
const AT_EOH = ["event-help", "emergency-medical", "emergency-lost-child", "emergency-other", "misc-lost-found"].map((id) =>
  faqs.find((f) => f.id === id)
);

const QUICK_ANSWERS = [
  { label: "FAQ", href: "/faq" },
  { label: "Plan your visit", href: "/visit" },
  { label: "Campus map", href: "/visit/map" },
];

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange";
const LINK = `underline decoration-da-orange decoration-2 underline-offset-4 hover:text-da-orange-text ${FOCUS}`;

// The full address is the link text. <wbr> lets a narrow screen break it before the "@".
function EmailLink({ email, className = "" }) {
  const [user, domain] = email.split("@");
  return (
    <a href={`mailto:${email}`} className={`inline-block py-1 font-semibold [overflow-wrap:anywhere] ${LINK} ${className}`}>
      {user}<wbr />@{domain}
    </a>
  );
}

// For people whose mailto links open nothing (webmail). The result is announced through the page's
// one status region; the hidden text names which address the button copies.
function CopyButton({ email, label, onStatus }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      onStatus(`Copied ${email}`);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      onStatus(`Couldn't copy. Select ${email} and copy it yourself.`);
    }
  };
  return (
    <button type="button" onClick={copy} className="da-pill da-pill--sm da-pill--secondary">
      {copied ? "Copied" : "Copy"}
      <span className="sr-only"> {label} email address</span>
    </button>
  );
}

export default function ContactUsPage() {
  // The Clipboard API only exists on HTTPS and localhost, so the Copy buttons appear once the browser confirms it.
  const [canCopy, setCanCopy] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => setCanCopy(Boolean(navigator.clipboard)), []);

  const copyButton = (email, label) => canCopy && <CopyButton email={email} label={label} onStatus={setStatus} />;

  return (
    <Content
      title="Contact Us"
      onThisPage={[...GROUPS.map(({ id, heading }) => ({ id, label: heading })), { id: "during-eoh", label: "During EOH" }]}
    >
      <div className="mx-auto mb-12 w-full max-w-5xl text-left font-body text-da-navy">
        <p role="status" className="sr-only">{status}</p>

        <section aria-labelledby="general-heading" className="da-card grid gap-6 p-6 md:grid-cols-[3fr_2fr] md:p-8">
          <div>
            <h2 id="general-heading" className="font-display text-2xl uppercase leading-none md:text-3xl">Not sure who to contact?</h2>
            <p className="mt-3 text-lg">Email the EOH Committee:</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <EmailLink email={GENERAL_EMAIL} className="text-xl md:text-2xl" />
              {copyButton(GENERAL_EMAIL, "EOH Committee")}
            </p>
            <p className="mt-3">We aim to reply to every email within 2 business days.</p>
          </div>
          <nav aria-labelledby="quick-heading" className="border-t-2 border-da-navy pt-5 md:border-l-2 md:border-t-0 md:pl-8 md:pt-0">
            <h2 id="quick-heading" className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">Quick answers</h2>
            <ul role="list" className="m-0 mt-2 list-none p-0">
              {QUICK_ANSWERS.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className={`inline-block py-1.5 text-lg font-semibold ${LINK}`}>
                    {q.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {GROUPS.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="da-card mt-6 scroll-mt-24 p-6 md:p-8 lg:scroll-mt-32">
            <h2 id={`${group.id}-heading`} className="font-display text-2xl uppercase leading-none md:text-3xl">{group.heading}</h2>
            <ul role="list" className="m-0 mt-4 grid list-none p-0 sm:grid-cols-2 sm:gap-x-10">
              {group.contacts.map((c) => (
                <li key={c.label} className="border-t border-[rgba(19,41,75,0.2)] py-4">
                  <h3 className="text-lg font-bold leading-snug">{c.label}</h3>
                  <p className="text-sm text-da-road">{c.role}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <EmailLink email={c.email} />
                    {copyButton(c.email, c.label)}
                  </p>
                  {c.link && (
                    <Link href={c.link.href} className={`mt-1 inline-block py-1 text-sm ${LINK}`}>
                      {c.link.label} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section id="during-eoh" aria-labelledby="during-eoh-heading" className="da-card mt-6 scroll-mt-24 p-6 md:p-8 lg:scroll-mt-32">
          <h2 id="during-eoh-heading" className="font-display text-2xl uppercase leading-none md:text-3xl">During EOH</h2>
          <p className="mt-1 font-label text-sm font-bold uppercase tracking-[0.1em] text-da-orange-text">{EVENT_FACTS.dates}</p>
          <p className="mt-4 text-lg font-bold">In a life-threatening emergency, call 911.</p>
          <ul role="list" className="m-0 mt-2 grid list-none p-0 sm:grid-cols-2 sm:gap-x-10">
            {AT_EOH.map((faq) => (
              <li key={faq.id} className="border-t border-[rgba(19,41,75,0.2)] py-4">
                <h3 className="font-bold leading-snug">{faq.Question}</h3>
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: faq.Answer }} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Content>
  );
}
