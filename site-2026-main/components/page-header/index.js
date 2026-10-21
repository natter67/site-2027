import Link from "next/link";
import { useRouter } from "next/router";
import MileSign from "@/mile-sign";
import { findNavEntry } from "@utilities/navigation";

// Inner-page header: breadcrumbs, the section as a mile-sign eyebrow, the page title, a one-line
// summary and an optional "On this page" list. Section and summary come from utilities/navigation.js
// (pass `summary` to override).
export default function PageHeader({ title, summary, onThisPage }) {
  const { pathname } = useRouter();
  const entry = findNavEntry(pathname);
  const crumbs = [{ label: "Home", href: "/" }];
  if (entry && !entry.isOverview) crumbs.push({ label: entry.section.label, href: entry.section.overview.href });
  const text = summary ?? entry?.link.summary;

  return (
    <header className="mx-auto mb-8 w-full max-w-4xl text-center font-body text-da-navy md:mb-12">
      <nav aria-label="Breadcrumb">
        <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-x-2 gap-y-1 p-0 text-sm">
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <Link href={crumb.href} className="underline decoration-da-orange decoration-2 underline-offset-4 hover:text-da-orange-text">
                {crumb.label}
              </Link>
              <span aria-hidden="true">›</span>
            </li>
          ))}
          <li aria-current="page" className="font-semibold">
            {title}
          </li>
        </ol>
      </nav>
      {entry && (
        <MileSign className="mx-auto mt-6">{entry.section.label}</MileSign>
      )}
      <h1 className="mt-3 p-2 font-display text-4xl uppercase leading-none md:text-5xl lg:text-6xl">{title}</h1>
      {text && <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-da-road">{text}</p>}
      {onThisPage?.length > 0 && (
        <nav aria-label="On this page" className="mt-6">
          <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">On this page</p>
          <ul className="m-0 mt-2 flex list-none flex-wrap justify-center gap-2 p-0">
            {onThisPage.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="da-pill da-pill--sm da-pill--secondary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
