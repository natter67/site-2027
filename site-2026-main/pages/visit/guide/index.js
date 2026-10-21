import Link from "next/link";
import Content from "@/content";
import { GUIDE } from "@utilities/visitorGuide";
import { slug } from "@utilities/slug";

// Web version of the Visitor Guide PDF. The text lives in utilities/visitorGuide.js; the PDF stays downloadable.
const SECTIONS = [
  { id: "visitor-information", label: "Visitor information" },
  { id: "emergencies", label: "Emergencies" },
  { id: "event-map", label: "Event map" },
  { id: "parking-and-shuttles", label: "Parking & shuttles" },
  { id: "special-events", label: "Special events" },
  { id: "more-in-the-pdf", label: "More in the PDF" },
];
const LINK = "font-semibold underline decoration-da-orange decoration-2 underline-offset-4";
const H2 = "mb-4 mt-12 font-display text-3xl uppercase leading-none";

function Block({ block }) {
  return (
    <div id={block.id} className="mt-6 scroll-mt-24 lg:scroll-mt-32">
      <h3 className="text-xl font-bold">{block.heading}</h3>
      {block.paragraphs?.map((p) => (
        <p key={p} className="mt-2">
          {p.includes("https://eohillinois.org") ? (
            <>
              {p.replace("https://eohillinois.org", "")}
              <a href="https://eohillinois.org" className={LINK}>https://eohillinois.org</a>
            </>
          ) : (
            p
          )}
        </p>
      ))}
      {block.list?.length > 0 && (
        <ul className="mt-2 list-disc pl-6">
          {block.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {block.after?.map((p) => (
        <p key={p} className="mt-2">{p}</p>
      ))}
    </div>
  );
}

export default function VisitorGuidePage() {
  return (
    <Content title="Visitor Guide" onThisPage={SECTIONS}>
      <p>
        <a href="/guide.pdf" className="da-pill da-pill--primary">
          Download the Visitor Guide (PDF, 44 pages)
        </a>
      </p>
      {/* DRAFT copy */}
      <p className="mx-auto mt-6 max-w-2xl text-base text-da-road">
        This page matches the current PDF, the EOH 2026 edition. It will be updated with the EOH 2027 guide.
      </p>
      <div className="mx-auto w-full max-w-3xl text-left text-lg leading-relaxed">
        <section id="visitor-information" aria-labelledby="h-visitor-information" className="scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-visitor-information" className={H2}>Visitor’s Information</h2>
          {GUIDE.visitorInfo.map((block) => (
            <Block key={block.heading} block={block} />
          ))}
        </section>
        <section id="emergencies" aria-labelledby="h-emergencies" className="scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-emergencies" className={H2}>In Case of an Emergency</h2>
          {GUIDE.emergency.map((block) => (
            <Block key={block.heading} block={block} />
          ))}
          <p className="mt-6 font-bold">{GUIDE.minors}</p>
        </section>
        <section id="event-map" aria-labelledby="h-event-map" className="scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-event-map" className={H2}>Event Map</h2>
          <p>
            Buildings on the EOH map. See them on the <Link href="/visit/map" className={LINK}>campus map</Link>.
          </p>
          <ul className="mt-2 list-none columns-1 pl-0 sm:columns-2">
            {GUIDE.buildings.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
        <section id="parking-and-shuttles" aria-labelledby="h-parking" className="scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-parking" className={H2}>Parking and Shuttle Information</h2>
          {GUIDE.parking.map((block) => (
            <Block key={block.heading} block={block} />
          ))}
        </section>
        <section id="special-events" aria-labelledby="h-special-events" className="scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-special-events" className={H2}>Special Events</h2>
          <ul className="m-0 list-none p-0">
            {GUIDE.specialEvents.map((e) => (
              <li key={e.name} id={slug(e.name)} className="mt-6 scroll-mt-24 border-t border-[rgba(19,41,75,0.2)] pt-4 lg:scroll-mt-32">
                <h3 className="text-xl font-bold">{e.name}</h3>
                <p className="mt-1">{e.details}</p>
              </li>
            ))}
          </ul>
        </section>
        <section id="more-in-the-pdf" aria-labelledby="h-more" className="mb-8 scroll-mt-24 lg:scroll-mt-32">
          <h2 id="h-more" className={H2}>More in the PDF</h2>
          {/* DRAFT copy */}
          <ul className="list-disc pl-6">
            <li>Schedule of special events (page 8): see the <Link href="/schedule" className={LINK}>full schedule</Link>.</li>
            <li>Directors’ Note (page 11): read the <Link href="/about/directors" className={LINK}>Note from the Directors</Link>.</li>
            <li>Exhibits index and exhibits (pages 12–38): browse exhibits in the <Link href="/vv" className={LINK}>Event Day Hub</Link>.</li>
            <li>EOH Central Committee (pages 40–42): <Link href="/about-us/meet-the-committee" className={LINK}>meet the committee</Link>.</li>
          </ul>
        </section>
      </div>
    </Content>
  );
}
