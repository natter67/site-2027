import RoadDivider from "@/road-divider";

// "Discovered here" timeline of Illinois engineering milestones (home page).
// Draft content: every date and fact must be checked by the team before launch.
// Styles: "Timeline" in styles/direction-a.css. On small screens it scrolls sideways inside its own box.

const MILESTONES = [
  { year: "1952", tag: "Computing", title: "ILLIAC I", text: "One of the first computers built and owned by a U.S. university. It filled a room." },
  { year: "1957", tag: "Physics", title: "Superconductivity explained", text: "Bardeen, Cooper and Schrieffer’s BCS theory, developed at Illinois, won Bardeen his second Nobel Prize." },
  { year: "1960", tag: "Education tech", title: "PLATO", text: "A pioneering computer-learning system that gave the world early online forums, chat and multiplayer games." },
  { year: "1964", tag: "Electrical", title: "Plasma display", text: "Illinois researchers invented the plasma display panel, an ancestor of today’s flat screens." },
  { year: "1993", tag: "The web", title: "Mosaic browser", text: "Built at NCSA on campus, Mosaic helped bring the World Wide Web to everyone." },
  { year: "2027", tag: "Next exit", title: "Your discovery?", text: "Hundreds of student projects, April 9–10. One of them might be the next entry on this road.", next: true },
];

export default function Timeline() {
  return (
    <div className="w-full text-left">
      <p className="mx-auto max-w-3xl px-4 text-center text-lg leading-relaxed">
        Illinois engineers have been making breakthroughs for generations. Drive the timeline, then come see what today’s students are discovering.
      </p>
      <div
        tabIndex={0}
        role="region"
        aria-label="Timeline of Illinois engineering discoveries (scrolls sideways)"
        className="mt-8 overflow-x-auto pb-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange"
      >
        <div className="relative mx-auto w-max px-4 sm:px-6">
          <div className="da-tl-road">
            <RoadDivider />
          </div>
          <ol className="relative m-0 flex list-none gap-5 p-0">
            {MILESTONES.map((m) => (
              <li key={m.year} className="flex w-[250px] flex-col">
                <div className={`h-24 font-display text-6xl leading-[96px] ${m.next ? "text-da-navy" : "da-tl-year"}`}>{m.year}</div>
                <div aria-hidden="true" className="flex h-[72px] items-center pl-5">
                  <span className={`relative h-[18px] w-[18px] rounded-full border-[3px] border-da-navy ${m.next ? "bg-da-orange" : "bg-white"}`}>
                    {m.next && <span className="da-tl-ping" />}
                  </span>
                </div>
                <article className={`da-card da-card--lift flex-1 p-5 ${m.next ? "da-tl-next" : ""}`}>
                  <p className={`font-label text-xs font-bold uppercase tracking-[0.1em] ${m.next ? "text-da-navy" : "text-da-orange-text"}`}>{m.tag}</p>
                  <h3 className="mt-1.5 font-display text-2xl uppercase leading-tight">{m.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-normal">{m.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
