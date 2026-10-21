import Link from "next/link";
import { FUTURE_DATES, UPCOMING_YEAR } from "@utilities/futureDates";

// Top of the home page after EOH (utilities/eventConfig.js decides the mode).
// Copy is DRAFT; the photo highlights and feedback form are PLACEHOLDERS (no content or URL yet).
const next = FUTURE_DATES.find((d) => d.year > UPCOMING_YEAR);

export default function PostEventLead() {
  return (
    <section aria-labelledby="post-event-heading" className="bg-da-navy pb-12 pt-24 font-body text-white lg:pt-[120px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="post-event-heading" className="font-display text-5xl uppercase leading-none md:text-6xl">
          Thanks for coming to EOH {UPCOMING_YEAR}
        </h2>
        <ul className="m-0 mt-8 grid list-none gap-4 p-0 text-left text-da-navy sm:grid-cols-2 lg:grid-cols-4">
          <li className="da-card p-5">
            <h3 className="text-xl font-bold">Award winners</h3>
            <p className="mt-2">Winners will be posted with the awards.</p>
            <Link href="/explore/awards" className="mt-3 inline-block font-semibold underline decoration-da-orange decoration-2 underline-offset-4">See the awards</Link>
          </li>
          <li className="rounded-2xl border-2 border-dashed border-white p-5 text-white">
            <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-light">Placeholder</p>
            <h3 className="mt-1 text-xl font-bold">Photo highlights</h3>
            <p className="mt-2">Photos from the weekend will appear here.</p>
          </li>
          <li className="rounded-2xl border-2 border-dashed border-white p-5 text-white">
            <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-light">Placeholder</p>
            <h3 className="mt-1 text-xl font-bold">Share your feedback</h3>
            <p className="mt-2">A feedback form link will go here.</p>
          </li>
          {next && (
            <li className="da-card p-5">
              <h3 className="text-xl font-bold">Save the date</h3>
              <p className="mt-2 text-lg font-semibold">EOH {next.year}: {next.month} {next.days}</p>
              <Link href="/future-dates" className="mt-3 inline-block font-semibold underline decoration-da-orange decoration-2 underline-offset-4">Future dates</Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
