import Link from "next/link";
import Content from "@/content";
import Section from "@/section";
import EventList from "@layouts/EventList";

// Featured events moved from the home page (the home page keeps teasers in layouts/Highlights).
export default function SpecialEventsPage() {
  return (
    <Content title="Special events" wide>
      <Section title="Featured Events">
        <EventList />
      </Section>
      {/* DRAFT copy */}
      <p className="mb-12 text-center text-lg">
        More special events, with times and places, are in the{" "}
        <Link href="/visit/guide#special-events" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          Visitor Guide
        </Link>{" "}
        and the{" "}
        <Link href="/vv" className="font-semibold underline decoration-da-orange decoration-2 underline-offset-4">
          Event Day Hub
        </Link>
        .
      </p>
    </Content>
  );
}
