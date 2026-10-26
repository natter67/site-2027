import Link from "next/link";
import { EVENT_FACTS } from "@utilities/eventConfig";

// Top of the home page on event days (utilities/eventConfig.js decides the mode). Copy is DRAFT.
// Happening now / Up next sits below, in the hero's countdown spot (layouts/Title).
export default function EventDayLead() {
  return (
    <section aria-labelledby="event-day-heading" className="bg-da-navy pb-12 pt-24 font-body text-white lg:pt-[120px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-light">
          EOH is on now · {EVENT_FACTS.dates} · {EVENT_FACTS.hours}
        </p>
        <h2 id="event-day-heading" className="mt-2 font-display text-5xl uppercase leading-none md:text-6xl">
          Today at EOH
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/vv" className="da-pill da-pill--primary text-lg">Open the Visitor Hub</Link>
          <Link href="/visit/map" className="da-pill da-pill--secondary">Map</Link>
          <Link href="/visit#getting-here" className="da-pill da-pill--secondary">Shuttles & parking</Link>
        </div>
      </div>
    </section>
  );
}
