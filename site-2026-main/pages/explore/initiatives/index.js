import Content from "@/content";
import Section from "@/section";
import QuantumDay from "@layouts/QuantumDay";
import SCC from "@layouts/SCC";

// Moved from the home page (old links /#world-quantum-day and /#scc redirect here).
export default function InitiativesPage() {
  return (
    <Content
      title="Initiatives"
      wide
      onThisPage={[{ id: "world-quantum-day", label: "World Quantum Day" }, { id: "scc", label: "EOH x Sustainability" }]}
    >
      <Section title="World Quantum Day" id="world-quantum-day">
        <QuantumDay />
      </Section>
      <Section title="EOH x Sustainability" id="scc">
        <SCC />
      </Section>
    </Content>
  );
}
