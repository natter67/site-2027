import Content from "@/content";
import Section from "@/section";
import Faqs from "@layouts/FAQs";
import { ShuttleInformation } from "@/shuttle";

// Getting here: the shuttle info (moved from the home Visitors section) and the parking FAQs
// (from layouts/FAQs/faqs.json, so the answers live in one place).
export default function GettingHerePage() {
  return (
    <Content
      title="Getting here, parking & shuttles"
      onThisPage={[{ id: "shuttles", label: "Shuttles" }, { id: "parking-faqs", label: "Parking FAQs" }]}
    >
      <Section title="Shuttles" id="shuttles">
        <div className="mx-auto w-full max-w-sm px-4">
          <ShuttleInformation />
        </div>
      </Section>
      <div className="px-4 text-left">
        <Faqs only={["Parking FAQs"]} />
      </div>
    </Content>
  );
}
