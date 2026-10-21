import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { strapiSwrFetcher } from "@utilities/strapi";
import { SCHEDULE_EVENTS_URL } from "@/schedule/schedule";
import { toScheduleItems } from "@utilities/scheduleItems";

// Home page schedule preview: the first few events of each day from the same Strapi data as the
// full schedule widget (same SWR key, so it is fetched once). If Strapi is down it shows a link only.
const DAYS = ["Friday", "Saturday"];
const SHOW = 4;

export default function SchedulePreview() {
  const [day, setDay] = useState(DAYS[0]);
  const { data, error, isLoading } = useSWR(SCHEDULE_EVENTS_URL, strapiSwrFetcher);

  const items = toScheduleItems(data)
    .filter((item) => item.start.format("dddd") === day)
    .slice(0, SHOW);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 text-left">
      <div role="group" aria-label="Day" className="flex justify-center gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={day === d}
            onClick={() => setDay(d)}
            className={`da-pill da-pill--sm ${day === d ? "da-pill--navy" : "da-pill--secondary"}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="da-card mt-6 p-2 sm:p-4">
        {items.length > 0 ? (
          <ul className="m-0 list-none divide-y divide-[rgba(19,41,75,0.15)] p-0">
            {items.map((item) => (
              <li key={`${item.title}-${item.start.valueOf()}`} className="flex gap-4 px-3 py-3">
                <span className="w-20 shrink-0 font-label text-sm font-bold text-da-orange-text">{item.start.format("h:mm A")}</span>
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  {item.location && <span className="block text-sm text-da-road">{item.location}</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-4 text-center">
            {isLoading && !error ? "Loading the schedule…" : "Schedule details for this day are coming soon."}
          </p>
        )}
      </div>
      <p className="mt-6 text-center">
        <Link href="/schedule" className="da-pill da-pill--primary">
          See full schedule <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}
