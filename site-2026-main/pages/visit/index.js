import Link from "next/link";
import Landing from "@layouts/Landing";
import { ShuttleDetails } from "@/shuttle";
import { PARKING, mapsUrl } from "@utilities/parking";
import { EVENT_FACTS } from "@utilities/eventConfig";
import { PRIMARY_NAV } from "@utilities/navigation";

// Plan your visit: the Visit landing page. Event facts come from utilities/eventConfig.js.
const section = PRIMARY_NAV.find((s) => s.key === "visit");
const FACTS = [
  { id: "when", label: "When", value: EVENT_FACTS.dates },
  { id: "hours", label: "Hours", value: EVENT_FACTS.hours },
  { id: "where", label: "Where", value: EVENT_FACTS.location, link: { label: "Campus map", href: "/visit/map" } },
  { id: "cost", label: "Cost", value: EVENT_FACTS.cost },
];

const LINK = "font-semibold underline decoration-da-orange decoration-2 underline-offset-4";

export default function VisitPage() {
  return (
    <Landing section={section} title="Plan your visit">
      <section aria-labelledby="essentials" className="mx-auto mb-12 w-full max-w-6xl">
        <h2 id="essentials" className="sr-only">Event essentials</h2>
        <dl className="m-0 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.id} id={fact.id} className="da-card scroll-mt-24 p-5 lg:scroll-mt-32">
              <dt className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">{fact.label}</dt>
              <dd className="m-0 mt-1 text-xl font-bold">{fact.value}</dd>
              {fact.link && (
                <dd className="m-0 mt-2">
                  <Link href={fact.link.href} className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
                    {fact.link.label} <span aria-hidden="true">→</span>
                  </Link>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      <section id="getting-here" aria-labelledby="getting-here-heading" className="mx-auto mb-12 w-full max-w-6xl scroll-mt-24 text-left lg:scroll-mt-32">
        <h2 id="getting-here-heading" className="mb-5 font-display text-2xl uppercase text-da-navy md:text-3xl">Shuttles & parking</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="da-card p-5 md:p-6">
            <h3 className="font-display text-xl uppercase">Shuttles</h3>
            <ShuttleDetails />
          </div>
          <div className="da-card p-5 md:p-6">
            <h3 className="font-display text-xl uppercase">Parking</h3>
            {PARKING.map((group) => (
              <div key={group.label} className="mt-4">
                <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">{group.label}</p>
                <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
                  {group.lots.map((lot) => (
                    <li key={lot.name}>
                      <a href={mapsUrl(lot)} target="_blank" rel="noopener noreferrer" className={LINK}>
                        Lot {lot.name}
                        <span className="sr-only"> on Google Maps (opens in a new tab)</span>
                      </a>
                      <span> · {lot.note || lot.where}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* DRAFT copy */}
            <p className="mt-5">
              Street closures and more parking answers are in the{" "}
              <Link href="/faq#parking-faqs" className={LINK}>FAQ</Link>.
            </p>
          </div>
        </div>
      </section>
    </Landing>
  );
}
