import Link from "next/link";
import { isExternal, linkProps } from "@utilities/navigation";

// A grid of link cards ({ label, href, summary }). Used by the landing pages and the
// "Related" block at the bottom of inner pages.
export default function LinkCards({ links, compact }) {
  return (
    <ul className={`m-0 grid w-full list-none gap-4 p-0 text-left sm:grid-cols-2 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-3 lg:gap-6"}`}>
      {links.map((link) => (
        <li key={link.href} className="flex">
          <Link
            href={link.href}
            {...linkProps(link.href)}
            className={`da-card da-card--lift flex w-full flex-col gap-2 font-body ${compact ? "p-4" : "p-6"} focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange`}
          >
            <span className={`font-bold leading-snug ${compact ? "text-base" : "text-xl"}`}>
              {link.label} <span aria-hidden="true">{isExternal(link.href) ? "↗" : "→"}</span>
              {isExternal(link.href) && <span className="sr-only"> (opens in a new tab)</span>}
            </span>
            {link.summary && !compact && <span className="text-base leading-relaxed text-da-road">{link.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
