import MenuItem from "./MenuItem";

export default function MobileMenu({ menuOpen, items, kill }) {
  return (
    <nav
      id="mobile-menu"
      aria-label="Mobile menu"
      className={`block fixed top-24 z-20 lg:hidden bg-gray-100 mb-10 transition-all ${menuOpen ? "h-full opacity-100 pointer-events-auto" : "h-0 opacity-0 pointer-events-none"
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
