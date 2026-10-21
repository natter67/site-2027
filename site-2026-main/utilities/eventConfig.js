// EOH 2027 event facts in one place: the hero, quick facts strip and Visit pages read these.
// DRAFT: hours and location come from the 2027 redesign brief; confirm with the committee.
export const EVENT_FACTS = {
  dates: "April 9–10, 2027",
  hours: "9 AM–4 PM",
  location: "Bardeen & North Quad, Urbana",
  cost: "Free",
};

// Event lifecycle. The home page, the schedule's "Happening now" and the mobile tab bar change with it.
//   pre   = before EOH (default)    event = April 9–10, 2027 (Champaign time)    post = after EOH
// To force a mode:
//   - for everyone: set NEXT_PUBLIC_EVENT_MODE=pre|event|post and redeploy (also avoids a brief
//     flash of pre-event content on event days, since pages are built ahead of time), or
//   - just for you: add ?mode=pre, ?mode=event or ?mode=post to any page URL.
export const EVENT_START = "2027-04-09T00:00:00-05:00";
export const EVENT_END = "2027-04-11T00:00:00-05:00"; // midnight after April 10
export const MODES = ["pre", "event", "post"];
export const FORCED_MODE = MODES.includes(process.env.NEXT_PUBLIC_EVENT_MODE) ? process.env.NEXT_PUBLIC_EVENT_MODE : null;

export function getEventMode(now = new Date()) {
  if (FORCED_MODE) return FORCED_MODE;
  if (now < new Date(EVENT_START)) return "pre";
  if (now < new Date(EVENT_END)) return "event";
  return "post";
}
