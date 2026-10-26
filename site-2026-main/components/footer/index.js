import Link from "next/link";
import {
  PRIMARY_NAV,
  HISTORY_URL,
  ENGINEERING_COUNCIL_URL,
  MAILING_LIST_URL,
  SOCIAL_LINKS,
  LINKTREE_URL,
  linkProps,
  menuLinks,
} from "@utilities/navigation";

// Footer columns mirror the main menu (utilities/navigation.js); History of EOH and Engineering Council
// (other sites) are only here, under About Us.
const byKey = Object.fromEntries(PRIMARY_NAV.map((s) => [s.key, s]));
const column = (section, extra = []) => ({
  key: section.key,
  label: section.label,
  links: [...menuLinks(section), ...extra],
});
const COLUMNS = [
  column(byKey.visit),
  column(byKey.explore),
  column(byKey.schools),
  column(byKey["get-involved"]),
  column(byKey.about, [
    { label: "History of EOH", href: HISTORY_URL },
    { label: "Engineering Council", href: ENGINEERING_COUNCIL_URL },
  ]),
];

const LINK =
  "rounded text-sm font-medium text-white hover:underline hover:decoration-da-orange-light hover:decoration-2 hover:underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange-light";

export default function Footer() {
  return (
    <footer className="w-full bg-da-navy font-body text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <h2 className="font-display text-xl uppercase tracking-wide text-da-orange-light">{col.label}</h2>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} {...linkProps(link.href)} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-xl uppercase tracking-wide text-da-orange-light">Stay in touch</h2>
            <a href={MAILING_LIST_URL} {...linkProps(MAILING_LIST_URL)} className="da-pill da-pill--sm da-pill--primary mt-3">
              Join the mailing list
            </a>
            <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
              {[...SOCIAL_LINKS, { label: "Linktree", href: LINKTREE_URL }].map((link) => (
                <li key={link.href}>
                  <a href={link.href} {...linkProps(link.href)} className={LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 text-center font-label text-xs uppercase tracking-[0.1em] text-white">Copyright EOH 2026</p>
      </div>
    </footer>
  );
}
