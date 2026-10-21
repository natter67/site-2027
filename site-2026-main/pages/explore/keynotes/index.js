import Content from "@/content";
import Section from "@/section";
import { KeynoteSpeaker } from "@layouts/Keynote";
import { KEYNOTES } from "@utilities/keynotes";

// Moved from the home page (old link /#keynote redirects here). Speaker details: utilities/keynotes.js.
export default function KeynotesPage() {
  return (
    <Content title="Keynotes" wide>
      {KEYNOTES.map((k, i) => (
        <Section key={k.name} title={`Keynote from ${k.name}`} id={i === 0 ? "keynote" : undefined}>
          <KeynoteSpeaker timeString={k.timeString} description={k.description} imagePath={k.imagePath} name={k.name} />
        </Section>
      ))}
    </Content>
  );
}
