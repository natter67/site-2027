import Content from "@/content";
import LinkCards from "@/link-cards";

// Visitor Guide. Every topic in the guide lives on its own page, so this page points there instead of
// repeating it (the web copy of the 2026 PDF was retired; its special events list moved to
// /explore/special-events). When the 2027 guide is ready: replace public/guide.pdf, swap the notice
// for a "Download the Visitor Guide (PDF)" button and keep the topic links.
const TOPICS = [
  { label: "Shuttles & parking", href: "/visit#getting-here", summary: "Shuttle hours and stops, and every parking lot with a Google Maps link." },
  { label: "Map", href: "/visit/map", summary: "Buildings, exhibits and shuttle stops on the campus map." },
  { label: "Schedule", href: "/schedule", summary: "Every event and show, by day." },
  { label: "Special events", href: "/explore/special-events", summary: "Shows, competitions and featured events." },
  { label: "Exhibits", href: "/vv", summary: "Browse every exhibit in the Visitor Hub." },
  { label: "FAQ", href: "/faq", summary: "Food, emergencies, lost and found, shirt colors and more." },
];
const LINK = "font-semibold underline decoration-da-orange decoration-2 underline-offset-4";

export default function VisitorGuidePage() {
  return (
    <Content title="Visitor Guide" summary="The EOH 2027 Visitor Guide comes out in spring.">
      {/* DRAFT copy */}
      <p className="text-lg">Until then, everything in it is on these pages, kept up to date:</p>
      <div className="mt-6">
        <LinkCards links={TOPICS} />
      </div>
      <p className="mb-12 mt-8 text-base text-da-road">
        Looking for last year's guide?{" "}
        <a href="/guide.pdf" className={LINK}>
          EOH 2026 Visitor Guide (PDF, 44 pages)
        </a>
      </p>
    </Content>
  );
}
