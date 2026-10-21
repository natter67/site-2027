import { useRouter } from "next/router";
import LinkCards from "@/link-cards";
import { findNavEntry, sectionLinks } from "@utilities/navigation";

// "More in <section>" links at the bottom of inner pages: the other pages in the same menu section.
export default function RelatedLinks() {
  const { pathname } = useRouter();
  const entry = findNavEntry(pathname);
  if (!entry) return null;
  const links = [entry.section.overview, ...sectionLinks(entry.section)].filter((link) => link.href !== pathname);
  return (
    <aside aria-labelledby="related-links" className="mx-auto mb-16 mt-12 w-full max-w-5xl border-t-2 border-da-navy pt-8 text-center">
      <h2 id="related-links" className="mb-5 font-display text-2xl uppercase text-da-navy">
        More in {entry.section.label}
      </h2>
      <LinkCards links={links} compact />
    </aside>
  );
}
