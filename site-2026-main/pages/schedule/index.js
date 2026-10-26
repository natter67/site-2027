import Content from "@/content";
import ScheduleSection from "@layouts/Schedule";
import HappeningNow from "@layouts/HappeningNow";
import { useEventMode } from "@utilities/useEventMode";

// Full schedule (moved from the home page, which keeps a preview in layouts/SchedulePreview).
// During EOH, Happening now / Up next sits on top (the event tab bar's "Now" links here).
export default function SchedulePage() {
  const mode = useEventMode();
  return (
    <Content title="Schedule" wide>
      {mode === "event" && (
        <section id="happening-now" aria-labelledby="happening-now-heading" className="mx-auto mb-12 w-full max-w-5xl scroll-mt-24 lg:scroll-mt-32">
          <h2 id="happening-now-heading" className="mb-4 font-display text-3xl uppercase">Happening now</h2>
          <HappeningNow />
        </section>
      )}
      <ScheduleSection />
    </Content>
  );
}
