import Content from "@/content";
import Section from "@/section";
import Awards from "@layouts/Awards";
import QuantumDay from "@layouts/QuantumDay";
import SCC from "@layouts/SCC";

// Awards and initiatives on one page. Moved from the home page (old links /#awards, /#world-quantum-day
// and /#scc redirect here; see pages/index.js). /explore/initiatives redirects here too (next.config.js).
export default function AwardsPage() {
  return (
    <Content
      title="Awards & Initiatives"
      wide
      onThisPage={[
        { id: "awards", label: "EOH 2026 Awards" },
        { id: "world-quantum-day", label: "World Quantum Day" },
        { id: "scc", label: "EOH x Sustainability" },
      ]}
    >
      <Section title="EOH 2026 Awards" id="awards">
        <Awards />
      </Section>
      <Section title="World Quantum Day" id="world-quantum-day">
        <QuantumDay />
      </Section>
      <Section title="EOH x Sustainability" id="scc">
        <SCC />
      </Section>
    </Content>
  );
}
