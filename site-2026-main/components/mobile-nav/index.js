import { useState } from "react";
import Link from "next/link";
import { PRIMARY_NAV, UTILITY_NAV, DONATE_URL, linkProps, sectionLinks } from "@utilities/navigation";

// Mobile menu (below lg): one accordion per primary section, then the utility links.
// Opened and closed by components/header (which also handles Esc and route changes).

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-2 focus-visible:outline-da-orange";

export default function MobileNav({ open, accountLink }) {
  const [expanded, setExpanded] = useState(null);
  if (!open) return null;

  return (
    <nav id="mobile-nav" aria-label="Main" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto pb-20 border-t-2 border-da-navy bg-white font-body text-da-navy lg:hidden">
      <ul className="m-0 list-none p-0">
        {PRIMARY_NAV.map((section) => {
          const isOpen = expanded === section.key;
          return (
            <li key={section.key} className="border-b border-[rgba(19,41,75,0.2)]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mobile-nav-${section.key}`}
                onClick={() => setExpanded(isOpen ? null : section.key)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left text-lg font-semibold ${FOCUS}`}
              >
                {section.label}
                <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
              <ul id={`mobile-nav-${section.key}`} hidden={!isOpen} className="m-0 list-none bg-[#F5F5F5] px-5 pb-3 pt-1">
                {[section.overview, ...sectionLinks(section)].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} {...linkProps(link.href)} className={`block rounded py-2.5 pl-3 text-base ${link === section.overview ? "font-bold" : ""} ${FOCUS}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <ul className="m-0 flex list-none flex-col gap-1 p-5">
        {[...UTILITY_NAV, accountLink].filter(Boolean).map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`block rounded py-2 text-base underline decoration-da-orange decoration-2 underline-offset-4 ${FOCUS}`}>
              {link.label}
            </Link>
          </li>
        ))}
        <li className="mt-3">
          <a href={DONATE_URL} {...linkProps(DONATE_URL)} className="da-pill da-pill--primary w-full">
            Donate
          </a>
        </li>
      </ul>
    </nav>
  );
}
