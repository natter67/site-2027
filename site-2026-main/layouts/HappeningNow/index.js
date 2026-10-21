import useSWR from "swr";
import { strapiSwrFetcher } from "@utilities/strapi";
import { SCHEDULE_EVENTS_URL } from "@/schedule/schedule";
import { toScheduleItems } from "@utilities/scheduleItems";

// "Happening now" and "Up next" (event days), from the same Strapi data as the schedule widget.
// If Strapi is down, it says so and the page's links to the Event Day Hub still work.
const UP_NEXT = 4;

function List({ title, items, empty }) {
  return (
    <div className="da-card p-4 text-left sm:p-5">
      <h3 className="font-display text-2xl uppercase">{title}</h3>
      {items.length > 0 ? (
        <ul className="m-0 mt-2 list-none divide-y divide-[rgba(19,41,75,0.15)] p-0">
          {items.map((item) => (
            <li key={`${item.title}-${item.start.valueOf()}`} className="flex gap-4 py-3">
              <span className="w-20 shrink-0 font-label text-sm font-bold text-da-orange-text">{item.start.format("h:mm A")}</span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                {item.location && <span className="block text-sm text-da-road">{item.location}</span>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">{empty}</p>
      )}
    </div>
  );
}

export default function HappeningNow() {
  const { data, error, isLoading } = useSWR(SCHEDULE_EVENTS_URL, strapiSwrFetcher);
  const now = Date.now();
  const items = toScheduleItems(data);
  const current = items.filter((i) => i.start.valueOf() <= now && i.end && i.end.valueOf() > now);
  const next = items.filter((i) => i.start.valueOf() > now).slice(0, UP_NEXT);
  // DRAFT copy
  const fallback = isLoading && !error ? "Loading the schedule…" : "Live times aren't available right now. The Event Day Hub lists every exhibit and special event.";

  return (
    <div aria-live="polite" className="grid w-full gap-4 md:grid-cols-2">
      <List title="Happening now" items={current} empty={items.length ? "Nothing is scheduled at this moment." : fallback} />
      <List title="Up next" items={next} empty={items.length ? "That's everything for today." : fallback} />
    </div>
  );
}
