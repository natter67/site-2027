import Link from "next/link";
import { Mic, Swords } from "lucide-react";
import { FEATURED_EVENTS } from "@layouts/EventList";
import { KEYNOTES } from "@utilities/keynotes";
import { GUIDE } from "@utilities/visitorGuide";
import { slug } from "@utilities/slug";

// Home page highlights: short teasers that link to the full pages. Text comes from the
// featured events list (layouts/EventList), utilities/keynotes.js and the Visitor Guide data, so it is never copied.
const byTitle = (title) => FEATURED_EVENTS.find((e) => e.title === title);
const event = (title, href) => ({ ...byTitle(title), href });
const robobrawl = GUIDE.specialEvents.find((e) => e.name === "Robobrawl");

const HIGHLIGHTS = [
  event("Tesla Coil Concert", "/explore/special-events"),
  {
    title: "Keynotes",
    subtitle: KEYNOTES.map((k) => k.name).join(" · "),
    blurb: KEYNOTES.map((k) => k.timeString).join(" · "),
    href: "/explore/keynotes",
    icon: Mic,
  },
  event("Middle School Design Competition", "/msdc"),
  event("High School Design Competition", "/hsdc"),
  event("Startup Showcase", "/startup-showcase"),
  { title: robobrawl.name, blurb: robobrawl.details, href: `/visit/guide#${slug(robobrawl.name)}`, icon: Swords },
];

export default function Highlights() {
  return (
    <ul className="m-0 mx-auto flex w-full max-w-6xl list-none flex-wrap justify-center gap-6 px-4 text-left">
      {HIGHLIGHTS.map(({ title, subtitle, blurb, href, icon: Icon }) => (
        <li key={title} className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
          <Link
            href={href}
            className="da-card da-card--lift flex w-full flex-col gap-3 p-6 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange"
          >
            {Icon && <Icon aria-hidden="true" className="h-8 w-8 text-da-orange-text" />}
            <h3 className="font-display text-2xl uppercase leading-tight">{title}</h3>
            {subtitle && <p className="font-label text-xs font-bold uppercase tracking-[0.1em] text-da-orange-text">{subtitle}</p>}
            {blurb && <p className="text-base leading-relaxed">{blurb}</p>}
            <span className="mt-auto font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
              Learn more <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
