import Link from "next/link";
import { Briefcase, GraduationCap, Presentation, School, Users } from "lucide-react";

// Home page "Start here": audience shortcuts to the canonical pages (labels are DRAFT copy).
const AUDIENCES = [
  { label: "For families", to: "Plan your visit", href: "/visit", icon: Users },
  { label: "For schools & field trips", to: "Schools & Competitions", href: "/schools", icon: School },
  { label: "For future students", to: "Future students", href: "/students", icon: GraduationCap },
  { label: "For exhibitors", to: "Exhibit at EOH", href: "/get-involved#exhibit", icon: Presentation },
  { label: "For sponsors & industry", to: "Sponsor EOH", href: "/sponsor-us", icon: Briefcase },
];

export default function StartHere() {
  return (
    <ul className="m-0 mx-auto grid w-full max-w-6xl list-none grid-cols-1 gap-4 px-4 text-left sm:grid-cols-2 lg:grid-cols-5">
      {AUDIENCES.map(({ label, to, href, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="da-card da-card--lift flex h-full flex-col gap-3 p-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-da-orange"
          >
            <Icon aria-hidden="true" className="h-7 w-7 text-da-orange-text" />
            <span className="text-lg font-bold leading-snug">{label}</span>
            <span className="mt-auto font-label text-xs font-bold uppercase tracking-[0.08em] text-da-orange-text">
              {to} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
