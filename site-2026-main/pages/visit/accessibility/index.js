import Link from "next/link";
import Content from "@/content";

// Accessibility & sensory guide. The accommodations content stays on /accessibility (one place);
// the sensory guide is a PLACEHOLDER until the committee provides it (see REDESIGN_NOTES.md).
export default function VisitAccessibilityPage() {
  return (
    <Content title="Accessibility & sensory guide">
      <section aria-labelledby="accommodations" className="da-card mx-auto mb-8 w-full max-w-3xl p-6 text-left md:p-8">
        <h2 id="accommodations" className="font-display text-2xl uppercase">Accommodations</h2>
        {/* DRAFT copy */}
        <p className="mt-3 text-lg leading-relaxed">
          To request disability-related accommodations, alternative formats, CART or sign language interpreters, or
          help with dietary needs, see the EOH accessibility statement.
        </p>
        <Link href="/accessibility" className="da-pill da-pill--navy mt-5">
          Read the accessibility statement <span aria-hidden="true">→</span>
        </Link>
      </section>
      <section aria-labelledby="sensory" className="mx-auto mb-16 w-full max-w-3xl rounded-2xl border-2 border-dashed border-da-navy p-6 text-left md:p-8">
        <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">Placeholder: committee to provide</p>
        <h2 id="sensory" className="mt-2 font-display text-2xl uppercase">Sensory guide</h2>
        <p className="mt-3 text-lg leading-relaxed">
          Information for visitors who are sensitive to noise, crowds or lights (quieter times and places, loud
          demonstrations, where to take a break) will be added here.
        </p>
      </section>
    </Content>
  );
}
