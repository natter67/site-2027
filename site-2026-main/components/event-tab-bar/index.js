import Link from "next/link";
import { useRouter } from "next/router";
import { CalendarDays, Clock, LayoutGrid, Map, Menu } from "lucide-react";

// Event-day bottom tab bar (mobile only; shown by components/header in "event" mode, never on /vv,
// which has its own). Menu opens the regular mobile menu.
const TABS = [
  { label: "Now", href: "/schedule#happening-now", icon: Clock },
  { label: "Map", href: "/visit/map", icon: Map },
  { label: "Schedule", href: "/schedule", icon: CalendarDays },
  { label: "Exhibits", href: "/vv", icon: LayoutGrid },
];
const ITEM = "flex flex-col items-center justify-center gap-0.5 text-xs font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-4 focus-visible:outline-da-orange";

export default function EventTabBar({ onMenu, menuOpen }) {
  const { asPath } = useRouter();
  return (
    <nav aria-label="Event day" className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t-2 border-da-navy bg-white font-body text-da-navy lg:hidden">
      {TABS.map(({ label, href, icon: Icon }) => {
        const current = asPath === href;
        return (
          <Link key={label} href={href} aria-current={current ? "page" : undefined} className={`${ITEM} ${current ? "text-da-orange-text" : ""}`}>
            <Icon aria-hidden="true" className="h-6 w-6" />
            {label}
          </Link>
        );
      })}
      <button type="button" onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-nav" className={ITEM}>
        <Menu aria-hidden="true" className="h-6 w-6" />
        Menu
      </button>
    </nav>
  );
}
