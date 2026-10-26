import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PRIMARY_NAV, findNavEntry, linkProps } from "@utilities/navigation";

// Desktop main menu (lg and up). Click a section to open its panel; click again, press Esc,
// click outside or tab away to close. Links come from utilities/navigation.js.

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange";

export default function MegaMenu() {
  const [open, setOpen] = useState(null);
  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const router = useRouter();
  const current = findNavEntry(router.pathname)?.section.key;

  useEffect(() => {
    const close = () => setOpen(null);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        buttonRefs.current[open]?.focus();
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onBlur = (e) => {
    if (open && navRef.current && !navRef.current.contains(e.relatedTarget)) setOpen(null);
  };

  return (
    <nav ref={navRef} aria-label="Main" onBlur={onBlur} className="flex h-full flex-1 items-stretch">
      <ul className="m-0 flex h-full list-none items-stretch p-0">
        {PRIMARY_NAV.map((section) => {
          const isOpen = open === section.key;
          return (
            <li key={section.key} className="flex items-stretch">
              <button
                ref={(el) => (buttonRefs.current[section.key] = el)}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mega-${section.key}`}
                onClick={() => setOpen(isOpen ? null : section.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-4 px-2.5 pt-1 font-body text-[15px] font-semibold text-da-navy xl:px-4 ${isOpen || current === section.key ? "border-da-orange" : "border-transparent hover:border-da-peach"} ${FOCUS}`}
              >
                {section.label}
                <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
              <div
                id={`mega-${section.key}`}
                hidden={!isOpen}
                className="absolute left-0 right-0 top-[calc(100%+2px)] border-b-2 border-da-navy bg-white shadow-[0_12px_24px_rgba(19,41,75,0.12)]"
              >
                <div className="mx-auto grid max-w-[1280px] grid-cols-4 gap-8 px-6 py-8">
                  <div>
                    <p className="font-display text-3xl uppercase leading-none text-da-navy">{section.label}</p>
                    <p className="mt-3 text-sm leading-relaxed text-da-road">{section.summary}</p>
                    {section.overview.inMenus !== false && (
                      <Link href={section.overview.href} className={`da-pill da-pill--sm da-pill--navy mt-5 ${FOCUS}`}>
                        {section.overview.label} <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                  {section.groups.map((group, i) => (
                    <div key={group.heading || i} className={section.groups.length === 1 ? "col-span-3" : ""}>
                      {group.heading && <p className="mb-3 font-label text-xs font-bold uppercase tracking-[0.12em] text-da-orange-text">{group.heading}</p>}
                      <ul className={`m-0 list-none p-0 ${section.groups.length === 1 ? "grid grid-cols-2 gap-x-8" : ""}`}>
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              {...linkProps(link.href)}
                              className={`block rounded py-2 font-body text-base font-semibold text-da-navy hover:underline hover:decoration-da-orange hover:decoration-2 hover:underline-offset-4 ${FOCUS}`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
