import Content from "@/content";
import ScheduleSection from "@layouts/Schedule";

// Full schedule (moved from the home page, which keeps a preview in layouts/SchedulePreview).
export default function SchedulePage() {
  return (
    <Content title="Schedule" wide>
      <div id="happening-now" />
      <ScheduleSection />
    </Content>
  );
}
