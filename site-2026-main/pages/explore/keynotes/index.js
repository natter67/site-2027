import Content from "@/content";
import Section from "@/section";
import { KeynoteSpeaker } from "@layouts/Keynote";
import { KEYNOTES, KEYNOTES_YEAR, REVEAL_COMING_SOON } from "@utilities/keynotes";

// Moved from the home page (old link /#keynote redirects here). Speaker details and the "reveal coming soon"
// switch: utilities/keynotes.js.
export default function KeynotesPage() {
  return (
    <Content
      title="Keynotes"
      wide
      onThisPage={[
        ...(REVEAL_COMING_SOON ? [{ id: "keynotes-2027", label: "2027 keynotes" }] : []),
        ...KEYNOTES.map((k, i) => ({ id: i === 0 ? "keynote" : `keynote-${i + 1}`, label: k.name })),
      ]}
    >
      {REVEAL_COMING_SOON && (
        <section id="keynotes-2027" aria-labelledby="keynotes-2027-heading" className="da-card mx-auto mb-10 w-full max-w-3xl scroll-mt-24 p-6 text-center md:p-8 lg:scroll-mt-32">
          <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">EOH 2027</p>
          <h2 id="keynotes-2027-heading" className="mt-2 font-display text-3xl uppercase leading-none md:text-4xl">2027 keynote reveal coming soon</h2>
          <p className="mt-3 text-lg">The EOH 2027 keynote speakers will be announced here.</p>
        </section>
      )}
      <p className="mx-auto mb-2 max-w-3xl text-lg font-semibold">These were the keynote speakers at EOH {KEYNOTES_YEAR}.</p>
      {KEYNOTES.map((k, i) => (
        <Section key={k.name} title={`Keynote from ${k.name}`} id={i === 0 ? "keynote" : `keynote-${i + 1}`}>
          <KeynoteSpeaker timeString={k.timeString} description={k.description} imagePath={k.imagePath} name={k.name} />
        </Section>
      ))}
    </Content>
  );
}
