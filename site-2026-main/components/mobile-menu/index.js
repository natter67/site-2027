import { useEffect, useRef } from "react";
import MenuItem from "./MenuItem";

export default function MobileMenu({ menuOpen, items, kill }) {
  // The closed menu stays in the DOM for the slide animation; inert keeps its links out of the keyboard tab order.
  const navRef = useRef(null);
  useEffect(() => {
    if (navRef.current) navRef.current.inert = !menuOpen;
  }, [menuOpen]);

  return (
    <nav
      ref={navRef}
      id="mobile-menu"
      aria-label="Mobile menu"
      className={`block fixed top-24 z-20 lg:hidden bg-white mb-10 transition-all ${menuOpen ? "h-full opacity-100 pointer-events-auto" : "h-0 opacity-0 pointer-events-none"
        }`}
    >
      {items.map(({ type, text, href, target, onClick }) => (
        <MenuItem
          type={type}
          href={href}
          target={target}
          onClick={onClick}
          kill={kill}
          key={`${text}-${href || "action"}`}
        >
          {text}
        </MenuItem>
      ))}
    </nav>
  );
}
