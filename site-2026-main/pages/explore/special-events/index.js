import Link from "next/link";
import Content from "@/content";
import Section from "@/section";
import EventList from "@layouts/EventList";
import { GUIDE } from "@utilities/visitorGuide";
import { slug } from "@utilities/slug";

// Featured events moved from the home page (the home page keeps teasers in layouts/Highlights), then
// last year's full list from the 2026 Visitor Guide (utilities/visitorGuide.js) until the 2027 guide is out.
export default function SpecialEventsPage() {
  return (
    <Content title="Special events" wide>
      <Section title="Featured Events">
        <EventList />
      </Section>
      {/* DRAFT copy */}
      <p className="mb-12 text-center text-lg">
        During EOH, the{" "}
        <Link href="/vv" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          Visitor Hub
        </Link>{" "}
        lists every special event with times and places.
      </p>
      <section id="eoh-2026" aria-labelledby="h-eoh-2026" className="mx-auto mb-12 w-full max-w-3xl scroll-mt-24 text-left text-lg leading-relaxed lg:scroll-mt-32">
        <h2 id="h-eoh-2026" className="font-display text-3xl uppercase leading-none">Special events at EOH 2026</h2>
        <p className="mt-2 text-da-road">From last year's Visitor Guide. The 2027 list comes out in spring.</p>
        <ul className="m-0 list-none p-0">
          {GUIDE.specialEvents.map((e) => (
            <li key={e.name} id={slug(e.name)} className="mt-6 scroll-mt-24 border-t border-[rgba(19,41,75,0.2)] pt-4 lg:scroll-mt-32">
              <h3 className="text-xl font-bold">{e.name}</h3>
              <p className="mt-1">{e.details}</p>
            </li>
          ))}
        </ul>
      </section>
    </Content>
  );
}
