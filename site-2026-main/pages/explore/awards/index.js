import Content from "@/content";
import Section from "@/section";
import Awards from "@layouts/Awards";

// Moved from the home page (old link /#awards redirects here; see pages/index.js).
export default function AwardsPage() {
  return (
    <Content title="Awards" wide>
      <Section title="EOH 2026 Awards" id="awards">
        <Awards />
      </Section>
    </Content>
  );
}
