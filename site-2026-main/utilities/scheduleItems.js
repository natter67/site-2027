import { toChampaignTime } from "@/schedule/schedule";

// Flattens the Strapi events response (same data as the schedule widget) into one item per
// occurrence: { title, location, start, end } with Champaign times, sorted by start time.
export function toScheduleItems(data) {
  return (Array.isArray(data?.data) ? data.data : [])
    .flatMap((event) =>
      (Array.isArray(event?.occurences) ? event.occurences : [])
        .filter((occ) => occ?.startTime)
        .map((occ) => ({
          title: event.title,
          location: event.location,
          start: toChampaignTime(occ.startTime),
          end: occ.endTime ? toChampaignTime(occ.endTime) : null,
        }))
    )
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());
}
