import Content from "@/content";
import LinkCards from "@/link-cards";

// Landing page for one menu section (utilities/navigation.js): the inner-page header, optional
// extra blocks (children), then every page in the section as link cards.
export default function Landing({ section, title, children }) {
  return (
    <Content title={title} related={false} wide>
      {children}
      {section.groups.map((group, i) => (
        <section key={group.heading || i} aria-label={group.heading || `${section.label} pages`} className="mx-auto mb-12 w-full max-w-6xl">
          {group.heading && <h2 className="mb-5 font-display text-2xl uppercase text-da-navy md:text-3xl">{group.heading}</h2>}
          <LinkCards links={group.links} />
        </section>
      ))}
    </Content>
  );
}
