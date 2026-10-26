import Link from "next/link";
import { EVENT_FACTS } from "@utilities/eventConfig";

// Home page quick facts strip (under the hero). Each fact links to its Visit page.
// "Parking & shuttles" is DRAFT copy.
const FACTS = [
  { label: "When", value: `${EVENT_FACTS.dates} · ${EVENT_FACTS.hours}`, href: "/visit#when" },
  { label: "Where", value: EVENT_FACTS.location, href: "/visit/map" },
  { label: "Cost", value: EVENT_FACTS.cost, href: "/visit#cost" },
  { label: "Getting here", value: "Parking & shuttles", href: "/visit#getting-here" },
];

export default function QuickFacts() {
  return (
    <section aria-label="Quick facts" className="bg-da-navy font-body text-white">
      <ul className="m-0 mx-auto grid max-w-7xl list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <li key={fact.label} className="border-b border-[rgba(255,255,255,0.15)] lg:border-b-0 lg:border-r lg:last:border-r-0">
            <Link
              href={fact.href}
              className="block h-full px-6 py-5 hover:bg-[#1c3660] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-4 focus-visible:outline-da-orange"
            >
              <span className="block font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-light">{fact.label}</span>
              <span className="mt-1 block text-lg font-semibold">
                {fact.value} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
